"""
Flask Blueprint untuk endpoint pencarian data mahasiswa.

Menyediakan endpoint untuk melakukan pencarian menggunakan
berbagai algoritma: linear search, sequential search, dan binary search.
"""

from flask import Blueprint, request, jsonify

from config import get_config
from utils.file_handler import FileHandler
from utils.exceptions import (
    InvalidAlgorithmError,
    FileOperationError,
    ValidationError,
)
from utils.complexity_analyzer import ComplexityAnalyzer
from algorithms.search import linear_search, sequential_search, binary_search

# Inisialisasi config dan file handler
config = get_config()
file_handler = FileHandler(config.DATA_FILE)

# Buat Blueprint
search_bp = Blueprint("search", __name__, url_prefix="/api/search")

# Mapping nama algoritma ke fungsi
SEARCH_FUNCTIONS = {
    "linear_search": linear_search,
    "sequential_search": sequential_search,
    "binary_search": binary_search,
}

# Supported fields untuk pencarian
SUPPORTED_FIELDS = [
    "nim",
    "nama",
    "email",
    "phone",
    "jurusan",
    "alamat",
    "status",
    "jenis_kelamin",
    "judul_skripsi",
    "judul_tesis",
    "dosen_pembimbing",
    "dosen_promotor",
    "beasiswa",
]


@search_bp.route("/", methods=["POST"])
def search_mahasiswa():
    """
    [POST] /api/search/

    Melakukan pencarian data mahasiswa dengan algoritma yang dipilih.

    Request Body (JSON):
        keyword: Kata kunci pencarian (required)
        algorithm: Nama algoritma - linear_search, sequential_search, binary_search (default: linear_search)
        field: Field yang dicari (default: nama)
        sort_by_nim_first: Untuk binary search, urutkan dulu (default: true)

    Returns:
        JSON response dengan hasil pencarian dan metrik performa
    """
    try:
        data = request.get_json(silent=True) or {}

        # Validasi parameter
        keyword = data.get("keyword", "").strip()
        if not keyword:
            raise ValidationError("Parameter 'keyword' wajib diisi", field="keyword")

        algorithm = data.get("algorithm", "linear_search").strip().lower()
        field = data.get("field", "nama").strip().lower()
        sort_by_nim_first = data.get("sort_by_nim_first", True)

        # Validasi algoritma
        if algorithm not in SEARCH_FUNCTIONS:
            raise InvalidAlgorithmError(
                algorithm=algorithm,
                supported=list(SEARCH_FUNCTIONS.keys()),
            )

        # Validasi field
        if field not in SUPPORTED_FIELDS:
            return jsonify(
                {
                    "success": False,
                    "message": f"Field '{field}' tidak didukung",
                    "supported_fields": SUPPORTED_FIELDS,
                }
            ), 400

        # Load data
        records = file_handler.read_all()
        if not records:
            return jsonify(
                {
                    "success": True,
                    "data": {
                        "results": [],
                        "total_results": 0,
                        "comparisons": 0,
                        "time_ms": 0.0,
                        "algorithm": algorithm,
                        "complexity": ComplexityAnalyzer.get_algorithm(algorithm),
                        "keyword": keyword,
                        "field": field,
                    },
                    "message": "Tidak ada data mahasiswa",
                }
            )

        # Panggil fungsi pencarian yang sesuai
        search_func = SEARCH_FUNCTIONS[algorithm]

        if algorithm == "binary_search":
            results, comparisons, time_ms = search_func(
                records, keyword, field, sort_by_nim_first
            )
        else:
            results, comparisons, time_ms = search_func(records, keyword, field)

        # Ambil info kompleksitas
        complexity_info = ComplexityAnalyzer.get_algorithm(algorithm)

        return jsonify(
            {
                "success": True,
                "data": {
                    "results": results,
                    "total_results": len(results),
                    "comparisons": comparisons,
                    "time_ms": round(time_ms, 4),
                    "algorithm": algorithm,
                    "complexity": complexity_info,
                    "keyword": keyword,
                    "field": field,
                    "total_data": len(records),
                },
                "message": f"Pencarian selesai: {len(results)} hasil ditemukan "
                f"dalam {comparisons} perbandingan ({time_ms:.4f} ms)",
            }
        )

    except InvalidAlgorithmError as e:
        return jsonify(e.to_dict()), 400
    except ValidationError as e:
        return jsonify(e.to_dict()), 400
    except FileOperationError as e:
        return jsonify(e.to_dict()), 500
    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500


@search_bp.route("/algorithms", methods=["GET"])
def list_search_algorithms():
    """
    [GET] /api/search/algorithms

    List semua algoritma pencarian yang tersedia.

    Returns:
        JSON response dengan daftar algoritma dan info kompleksitasnya
    """
    try:
        algorithms = ComplexityAnalyzer.get_search_algorithms()

        return jsonify(
            {
                "success": True,
                "data": {
                    "algorithms": algorithms,
                    "supported_fields": SUPPORTED_FIELDS,
                },
                "message": "Daftar algoritma pencarian berhasil diambil",
            }
        )

    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500
