"""
Flask Blueprint untuk operasi CRUD data mahasiswa.

Menyediakan endpoint REST API untuk:
- List semua mahasiswa
- Create mahasiswa baru
- Get mahasiswa by NIM
- Update mahasiswa
- Delete mahasiswa
- Get statistics
"""

from flask import Blueprint, request, jsonify

from config import get_config
from utils.file_handler import FileHandler
from utils.exceptions import (
    ValidationError,
    MahasiswaNotFoundError,
    DuplicateNIMError,
    FileOperationError,
    MahasiswaError,
)
from models.mahasiswa_sarjana import MahasiswaSarjana
from models.mahasiswa_magister import MahasiswaMagister

# Inisialisasi config dan file handler
config = get_config()
file_handler = FileHandler(config.DATA_FILE)

# Buat Blueprint
mahasiswa_bp = Blueprint("mahasiswa", __name__, url_prefix="/api/mahasiswa")


def _load_all() -> list[dict]:
    """Helper: Load semua data mahasiswa dari file."""
    return file_handler.read_all()


def _save_all(records: list[dict]) -> None:
    """Helper: Simpan semua data mahasiswa ke file."""
    file_handler.write_all(records)


def _find_by_nim(records: list[dict], nim: str) -> tuple[dict, int]:
    """
    Helper: Cari mahasiswa berdasarkan NIM.

    Returns:
        Tuple (data, index) atau raise MahasiswaNotFoundError
    """
    for idx, record in enumerate(records):
        if record.get("nim") == nim:
            return record, idx
    raise MahasiswaNotFoundError(nim)


def _nim_exists(records: list[dict], nim: str) -> bool:
    """Helper: Cek apakah NIM sudah terdaftar."""
    return any(r.get("nim") == nim for r in records)


def _create_instance(data: dict):
    """
    Helper: Buat instance model dari dictionary.

    Returns:
        Instance MahasiswaSarjana atau MahasiswaMagister
    """
    tipe = data.get("tipe", "S1")
    if tipe == "S2":
        return MahasiswaMagister.from_dict(data)
    return MahasiswaSarjana.from_dict(data)


@mahasiswa_bp.route("/", methods=["GET"])
def list_mahasiswa():
    """
    [GET] /api/mahasiswa/

    List semua data mahasiswa dengan optional filtering.

    Query Parameters:
        jurusan: Filter berdasarkan jurusan
        status: Filter berdasarkan status
        tipe: Filter berdasarkan tipe (S1/S2)
        page: Nomor halaman (default: 1)
        per_page: Jumlah per halaman (default: 100)

    Returns:
        JSON response dengan list mahasiswa
    """
    try:
        records = _load_all()

        # Query parameter filtering
        jurusan_filter = request.args.get("jurusan")
        status_filter = request.args.get("status")
        tipe_filter = request.args.get("tipe")

        if jurusan_filter:
            records = [r for r in records if jurusan_filter.lower() in str(r.get("jurusan", "")).lower()]
        if status_filter:
            records = [r for r in records if status_filter.lower() in str(r.get("status", "")).lower()]
        if tipe_filter:
            records = [r for r in records if r.get("tipe", "").upper() == tipe_filter.upper()]

        # Pagination
        try:
            page = int(request.args.get("page", 1))
            per_page = int(request.args.get("per_page", 100))
            if page < 1:
                page = 1
            if per_page < 1 or per_page > 1000:
                per_page = 100
        except ValueError:
            page = 1
            per_page = 100

        total = len(records)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_records = records[start_idx:end_idx]

        return jsonify(
            {
                "success": True,
                "data": {
                    "records": paginated_records,
                    "total": total,
                    "page": page,
                    "per_page": per_page,
                    "total_pages": (total + per_page - 1) // per_page,
                },
                "message": f"Berhasil mengambil {len(paginated_records)} data mahasiswa",
            }
        )

    except FileOperationError as e:
        return jsonify(e.to_dict()), 500
    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500


@mahasiswa_bp.route("/", methods=["POST"])
def create_mahasiswa():
    """
    [POST] /api/mahasiswa/

    Membuat data mahasiswa baru.

    Request Body (JSON):
        nim: Nomor Induk Mahasiswa (required)
        nama: Nama lengkap (required)
        email: Alamat email (required)
        phone: Nomor telepon (required)
        jurusan: Program studi (required)
        ipk: Indeks Prestasi Kumulatif (required)
        semester: Semester (required)
        tahun_angkatan: Tahun masuk (required)
        tipe: Tipe mahasiswa - S1 atau S2 (default: S1)
        ...dan field spesifik tipe

    Returns:
        JSON response data mahasiswa yang dibuat
    """
    try:
        data = request.get_json(silent=True) or {}

        # Validasi required fields
        required_fields = ["nim", "nama", "email", "phone", "jurusan", "ipk", "semester", "tahun_angkatan"]
        missing = [f for f in required_fields if f not in data or not str(data[f]).strip()]
        if missing:
            raise ValidationError(f"Field wajib tidak lengkap: {', '.join(missing)}")

        # Load existing data
        records = _load_all()

        # Cek duplikasi NIM
        if _nim_exists(records, data["nim"]):
            raise DuplicateNIMError(data["nim"])

        # Buat instance dan validasi
        mahasiswa = _create_instance(data)
        errors = mahasiswa.validate()
        if errors:
            return jsonify(
                {
                    "success": False,
                    "message": "Validasi gagal",
                    "errors": errors,
                }
            ), 400

        # Tambahkan ke records
        records.append(mahasiswa.to_dict())
        _save_all(records)

        return jsonify(
            {
                "success": True,
                "data": mahasiswa.to_dict(),
                "message": f"Mahasiswa {mahasiswa.nama} berhasil ditambahkan",
            }
        ), 201

    except (ValidationError, DuplicateNIMError) as e:
        return jsonify(e.to_dict()), 400
    except FileOperationError as e:
        return jsonify(e.to_dict()), 500
    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500


@mahasiswa_bp.route("/<nim>", methods=["GET"])
def get_mahasiswa(nim: str):
    """
    [GET] /api/mahasiswa/<nim>

    Ambil data mahasiswa berdasarkan NIM.

    Args:
        nim: Nomor Induk Mahasiswa

    Returns:
        JSON response data mahasiswa
    """
    try:
        records = _load_all()
        record, _ = _find_by_nim(records, nim)

        return jsonify(
            {
                "success": True,
                "data": record,
                "message": "Data mahasiswa ditemukan",
            }
        )

    except MahasiswaNotFoundError as e:
        return jsonify(e.to_dict()), 404
    except FileOperationError as e:
        return jsonify(e.to_dict()), 500
    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500


@mahasiswa_bp.route("/<nim>", methods=["PUT"])
def update_mahasiswa(nim: str):
    """
    [PUT] /api/mahasiswa/<nim>

    Update data mahasiswa berdasarkan NIM.

    Args:
        nim: Nomor Induk Mahasiswa yang akan diupdate

    Request Body (JSON):
        Field-field yang akan diupdate

    Returns:
        JSON response data mahasiswa yang diupdate
    """
    try:
        data = request.get_json(silent=True) or {}

        # Load existing data
        records = _load_all()
        record, idx = _find_by_nim(records, nim)

        # Cek jika NIM akan diubah dan sudah ada yang pakai
        new_nim = data.get("nim")
        if new_nim and new_nim != nim and _nim_exists(records, new_nim):
            raise DuplicateNIMError(new_nim)

        # Merge data lama dengan data baru
        updated_data = {**record, **data}
        updated_data["nim"] = new_nim or nim  # Pastikan NIM tetap ada

        # Buat instance baru dan validasi
        mahasiswa = _create_instance(updated_data)
        errors = mahasiswa.validate()
        if errors:
            return jsonify(
                {
                    "success": False,
                    "message": "Validasi gagal",
                    "errors": errors,
                }
            ), 400

        # Update record
        records[idx] = mahasiswa.to_dict()
        _save_all(records)

        return jsonify(
            {
                "success": True,
                "data": mahasiswa.to_dict(),
                "message": f"Mahasiswa {mahasiswa.nama} berhasil diupdate",
            }
        )

    except MahasiswaNotFoundError as e:
        return jsonify(e.to_dict()), 404
    except (ValidationError, DuplicateNIMError) as e:
        return jsonify(e.to_dict()), 400
    except FileOperationError as e:
        return jsonify(e.to_dict()), 500
    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500


@mahasiswa_bp.route("/<nim>", methods=["DELETE"])
def delete_mahasiswa(nim: str):
    """
    [DELETE] /api/mahasiswa/<nim>

    Hapus data mahasiswa berdasarkan NIM.

    Args:
        nim: Nomor Induk Mahasiswa yang akan dihapus

    Returns:
        JSON response konfirmasi penghapusan
    """
    try:
        records = _load_all()
        record, idx = _find_by_nim(records, nim)

        nama = record.get("nama", "Unknown")
        records.pop(idx)
        _save_all(records)

        return jsonify(
            {
                "success": True,
                "data": {"nim": nim, "nama": nama},
                "message": f"Mahasiswa {nama} berhasil dihapus",
            }
        )

    except MahasiswaNotFoundError as e:
        return jsonify(e.to_dict()), 404
    except FileOperationError as e:
        return jsonify(e.to_dict()), 500
    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500


@mahasiswa_bp.route("/stats", methods=["GET"])
def get_statistics():
    """
    [GET] /api/mahasiswa/stats

    Dapatkan statistik data mahasiswa.

    Returns:
        JSON response berisi statistik (total, rata-rata IPK, dll)
    """
    try:
        records = _load_all()
        total = len(records)

        if total == 0:
            return jsonify(
                {
                    "success": True,
                    "data": {
                        "total": 0,
                        "rata_rata_ipk": 0.0,
                        "ipk_tertinggi": 0.0,
                        "ipk_terendah": 0.0,
                        "per_tipe": {},
                        "per_jurusan": {},
                        "per_status": {},
                        "per_jenis_kelamin": {},
                    },
                    "message": "Belum ada data mahasiswa",
                }
            )

        # Hitung statistik IPK
        ipk_values = [float(r.get("ipk", 0)) for r in records]
        rata_rata_ipk = sum(ipk_values) / total if total > 0 else 0.0

        # Hitung distribusi
        per_tipe = {}
        per_jurusan = {}
        per_status = {}
        per_jenis_kelamin = {}
        per_angkatan = {}

        for r in records:
            # Per tipe
            tipe = r.get("tipe", "S1")
            per_tipe[tipe] = per_tipe.get(tipe, 0) + 1

            # Per jurusan
            jurusan = r.get("jurusan", "Unknown")
            per_jurusan[jurusan] = per_jurusan.get(jurusan, 0) + 1

            # Per status
            status = r.get("status", "Unknown")
            per_status[status] = per_status.get(status, 0) + 1

            # Per jenis kelamin
            jk = r.get("jenis_kelamin", "L")
            jk_label = "Laki-laki" if jk == "L" else "Perempuan"
            per_jenis_kelamin[jk_label] = per_jenis_kelamin.get(jk_label, 0) + 1

            # Per angkatan
            angkatan = str(r.get("tahun_angkatan", "Unknown"))
            per_angkatan[angkatan] = per_angkatan.get(angkatan, 0) + 1

        # Mahasiswa dengan IPK terbaik
        ipk_tertinggi = max(records, key=lambda x: float(x.get("ipk", 0)))
        ipk_terendah = min(records, key=lambda x: float(x.get("ipk", 0)))

        stats = {
            "total": total,
            "rata_rata_ipk": round(rata_rata_ipk, 2),
            "ipk_tertinggi": {
                "nim": ipk_tertinggi.get("nim"),
                "nama": ipk_tertinggi.get("nama"),
                "ipk": float(ipk_tertinggi.get("ipk", 0)),
            },
            "ipk_terendah": {
                "nim": ipk_terendah.get("nim"),
                "nama": ipk_terendah.get("nama"),
                "ipk": float(ipk_terendah.get("ipk", 0)),
            },
            "per_tipe": per_tipe,
            "per_jurusan": per_jurusan,
            "per_status": per_status,
            "per_jenis_kelamin": per_jenis_kelamin,
            "per_angkatan": per_angkatan,
        }

        return jsonify(
            {
                "success": True,
                "data": stats,
                "message": "Statistik berhasil dihitung",
            }
        )

    except FileOperationError as e:
        return jsonify(e.to_dict()), 500
    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500
