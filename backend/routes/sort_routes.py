"""
Flask Blueprint untuk endpoint pengurutan data mahasiswa.

Menyediakan endpoint untuk melakukan pengurutan menggunakan
berbagai algoritma: insertion, selection, bubble, shell, dan merge sort.
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
from algorithms.sort import (
    insertion_sort,
    selection_sort,
    bubble_sort,
    shell_sort,
    merge_sort,
)

# Inisialisasi config dan file handler
config = get_config()
file_handler = FileHandler(config.DATA_FILE)

# Buat Blueprint
sort_bp = Blueprint("sort", __name__, url_prefix="/api/sort")

# Mapping nama algoritma ke fungsi
SORT_FUNCTIONS = {
    "insertion_sort": insertion_sort,
    "selection_sort": selection_sort,
    "bubble_sort": bubble_sort,
    "shell_sort": shell_sort,
    "merge_sort": merge_sort,
}

# Supported fields untuk pengurutan
SUPPORTED_FIELDS = [
    "nim",
    "nama",
    "email",
    "jurusan",
    "ipk",
    "semester",
    "tahun_angkatan",
    "status",
    "jenis_kelamin",
]


@sort_bp.route("/", methods=["POST"])
def sort_mahasiswa():
    """
    [POST] /api/sort/

    Melakukan pengurutan data mahasiswa dengan algoritma yang dipilih.

    Request Body (JSON):
        algorithm: Nama algoritma - insertion_sort, selection_sort, bubble_sort, shell_sort, merge_sort (default: merge_sort)
        field: Field yang diurutkan (default: nama)
        ascending: True untuk ascending, False untuk descending (default: true)

    Returns:
        JSON response dengan hasil pengurutan dan metrik performa
    """
    try:
        data = request.get_json(silent=True) or {}

        # Parameter
        algorithm = data.get("algorithm", "merge_sort").strip().lower()
        field = data.get("field", "nama").strip().lower()
        ascending = data.get("ascending", True)

        # Validasi algoritma
        if algorithm not in SORT_FUNCTIONS:
            raise InvalidAlgorithmError(
                algorithm=algorithm,
                supported=list(SORT_FUNCTIONS.keys()),
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
                        "comparisons": 0,
                        "swaps": 0,
                        "time_ms": 0.0,
                        "algorithm": algorithm,
                        "complexity": ComplexityAnalyzer.get_algorithm(algorithm),
                        "field": field,
                        "ascending": ascending,
                    },
                    "message": "Tidak ada data mahasiswa",
                }
            )

        # Panggil fungsi pengurutan yang sesuai
        sort_func = SORT_FUNCTIONS[algorithm]
        results, comparisons, swaps, time_ms = sort_func(records, field, ascending)

        # Ambil info kompleksitas
        complexity_info = ComplexityAnalyzer.get_algorithm(algorithm)

        return jsonify(
            {
                "success": True,
                "data": {
                    "results": results,
                    "total_results": len(results),
                    "comparisons": comparisons,
                    "swaps": swaps,
                    "time_ms": round(time_ms, 4),
                    "algorithm": algorithm,
                    "complexity": complexity_info,
                    "field": field,
                    "ascending": ascending,
                    "total_data": len(records),
                },
                "message": f"Pengurutan selesai: {len(results)} data "
                f"dalam {comparisons} perbandingan, {swaps} swaps ({time_ms:.4f} ms)",
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


@sort_bp.route("/algorithms", methods=["GET"])
def list_sort_algorithms():
    """
    [GET] /api/sort/algorithms

    List semua algoritma pengurutan yang tersedia.

    Returns:
        JSON response dengan daftar algoritma dan info kompleksitasnya
    """
    try:
        algorithms = ComplexityAnalyzer.get_sort_algorithms()

        return jsonify(
            {
                "success": True,
                "data": {
                    "algorithms": algorithms,
                    "supported_fields": SUPPORTED_FIELDS,
                },
                "message": "Daftar algoritma pengurutan berhasil diambil",
            }
        )

    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500
