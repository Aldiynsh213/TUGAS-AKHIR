"""
Flask Blueprint untuk endpoint analisis kompleksitas algoritma.

Menyediakan endpoint untuk melihat informasi kompleksitas,
membandingkan algoritma, dan mendapatkan pseudocode.
"""

from flask import Blueprint, request, jsonify

from utils.exceptions import InvalidAlgorithmError, ValidationError
from utils.complexity_analyzer import ComplexityAnalyzer

# Buat Blueprint
analysis_bp = Blueprint("analysis", __name__, url_prefix="/api/analysis")


@analysis_bp.route("/complexity", methods=["GET"])
def get_all_complexity():
    """
    [GET] /api/analysis/complexity

    Dapatkan informasi kompleksitas semua algoritma.

    Returns:
        JSON response dengan info kompleksitas semua algoritma
    """
    try:
        algorithms = ComplexityAnalyzer.get_all()

        return jsonify(
            {
                "success": True,
                "data": {
                    "total_algorithms": len(algorithms),
                    "algorithms": algorithms,
                },
                "message": "Informasi kompleksitas semua algoritma berhasil diambil",
            }
        )

    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500


@analysis_bp.route("/complexity/<algorithm>", methods=["GET"])
def get_specific_complexity(algorithm: str):
    """
    [GET] /api/analysis/complexity/<algorithm>

    Dapatkan informasi kompleksitas algoritma tertentu.

    Args:
        algorithm: Nama algoritma (misal: merge_sort, binary_search)

    Returns:
        JSON response dengan info kompleksitas algoritma
    """
    try:
        algorithm = algorithm.strip().lower()
        info = ComplexityAnalyzer.get_algorithm(algorithm)

        if not info:
            raise InvalidAlgorithmError(
                algorithm=algorithm,
                supported=list(ComplexityAnalyzer.get_all().keys()),
            )

        return jsonify(
            {
                "success": True,
                "data": info,
                "message": f"Informasi kompleksitas {algorithm} berhasil diambil",
            }
        )

    except InvalidAlgorithmError as e:
        return jsonify(e.to_dict()), 400
    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500


@analysis_bp.route("/complexity/compare", methods=["POST"])
def compare_algorithms():
    """
    [POST] /api/analysis/complexity/compare

    Bandingkan kompleksitas beberapa algoritma.

    Request Body (JSON):
        algorithms: List nama algoritma yang akan dibandingkan (required)

    Returns:
        JSON response dengan perbandingan kompleksitas
    """
    try:
        data = request.get_json(silent=True) or {}

        algorithm_names = data.get("algorithms", [])
        if not algorithm_names or not isinstance(algorithm_names, list):
            raise ValidationError(
                "Parameter 'algorithms' wajib berupa list nama algoritma",
                field="algorithms",
            )

        # Convert ke lowercase
        algorithm_names = [a.strip().lower() for a in algorithm_names if isinstance(a, str)]

        if not algorithm_names:
            raise ValidationError("List algoritma tidak boleh kosong", field="algorithms")

        # Validasi algoritma
        all_valid = ComplexityAnalyzer.get_all()
        invalid = [a for a in algorithm_names if a not in all_valid]
        if invalid:
            raise InvalidAlgorithmError(
                algorithm=invalid[0],
                supported=list(all_valid.keys()),
            )

        # Lakukan perbandingan
        comparison = ComplexityAnalyzer.compare(algorithm_names)

        return jsonify(
            {
                "success": True,
                "data": {
                    "comparison": comparison,
                    "total_compared": len(comparison),
                },
                "message": f"Perbandingan {len(comparison)} algoritma berhasil dibuat",
            }
        )

    except InvalidAlgorithmError as e:
        return jsonify(e.to_dict()), 400
    except ValidationError as e:
        return jsonify(e.to_dict()), 400
    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500


@analysis_bp.route("/summary", methods=["GET"])
def get_summary():
    """
    [GET] /api/analysis/summary

    Dapatkan ringkasan semua algoritma yang tersedia.

    Returns:
        JSON response dengan ringkasan algoritma
    """
    try:
        search_algorithms = ComplexityAnalyzer.get_search_algorithms()
        sort_algorithms = ComplexityAnalyzer.get_sort_algorithms()

        # Buat ringkasan singkat
        search_summary = []
        for key, val in search_algorithms.items():
            search_summary.append(
                {
                    "name": key,
                    "display_name": val["name"],
                    "time_worst": val["time_complexity"]["worst"],
                    "space": val["space_complexity"],
                }
            )

        sort_summary = []
        for key, val in sort_algorithms.items():
            sort_summary.append(
                {
                    "name": key,
                    "display_name": val["name"],
                    "time_worst": val["time_complexity"]["worst"],
                    "space": val["space_complexity"],
                }
            )

        return jsonify(
            {
                "success": True,
                "data": {
                    "search_algorithms": search_summary,
                    "sort_algorithms": sort_summary,
                    "total_search": len(search_summary),
                    "total_sort": len(sort_summary),
                },
                "message": "Ringkasan algoritma berhasil diambil",
            }
        )

    except Exception as e:
        return jsonify(
            {"success": False, "message": f"Terjadi kesalahan: {str(e)}"}
        ), 500
