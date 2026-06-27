"""
Flask Application Entry Point untuk Manajemen Data Mahasiswa.

Aplikasi REST API yang mendemonstrasikan konsep OOP, algoritma pencarian,
algoritma pengurutan, regex validation, exception handling, dan file I/O.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

from config import get_config
from routes import mahasiswa_bp, search_bp, sort_bp, analysis_bp
from utils.exceptions import (
    MahasiswaError,
    ValidationError,
    MahasiswaNotFoundError,
    DuplicateNIMError,
    FileOperationError,
    InvalidAlgorithmError,
)


def create_app(config_name: str = None) -> Flask:
    """
    Application factory untuk membuat instance Flask.

    Menggunakan pattern application factory agar lebih fleksibel
    untuk testing dan konfigurasi berbeda.

    Args:
        config_name: Nama konfigurasi (development/production/testing)

    Returns:
        Instance Flask application
    """
    # Inisialisasi Flask app
    app = Flask(__name__)

    # Load konfigurasi
    config = get_config(config_name)
    app.config.from_object(config)

    # Enable CORS untuk semua origins
    CORS(app, origins=config.CORS_ORIGINS)

    # Register blueprints
    app.register_blueprint(mahasiswa_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(sort_bp)
    app.register_blueprint(analysis_bp)

    # ============ Error Handlers ============

    @app.errorhandler(ValidationError)
    def handle_validation_error(e: ValidationError):
        """Handler untuk ValidationError."""
        return jsonify(e.to_dict()), 400

    @app.errorhandler(MahasiswaNotFoundError)
    def handle_not_found_error(e: MahasiswaNotFoundError):
        """Handler untuk MahasiswaNotFoundError."""
        return jsonify(e.to_dict()), 404

    @app.errorhandler(DuplicateNIMError)
    def handle_duplicate_error(e: DuplicateNIMError):
        """Handler untuk DuplicateNIMError."""
        return jsonify(e.to_dict()), 409

    @app.errorhandler(FileOperationError)
    def handle_file_error(e: FileOperationError):
        """Handler untuk FileOperationError."""
        return jsonify(e.to_dict()), 500

    @app.errorhandler(InvalidAlgorithmError)
    def handle_algorithm_error(e: InvalidAlgorithmError):
        """Handler untuk InvalidAlgorithmError."""
        return jsonify(e.to_dict()), 400

    @app.errorhandler(MahasiswaError)
    def handle_mahasiswa_error(e: MahasiswaError):
        """Handler umum untuk MahasiswaError (base class)."""
        return jsonify(e.to_dict()), 500

    @app.errorhandler(404)
    def handle_404(e):
        """Handler untuk route tidak ditemukan."""
        return jsonify(
            {
                "success": False,
                "error": "NotFound",
                "message": f"Endpoint {request.path} tidak ditemukan",
            }
        ), 404

    @app.errorhandler(405)
    def handle_405(e):
        """Handler untuk method tidak diizinkan."""
        return jsonify(
            {
                "success": False,
                "error": "MethodNotAllowed",
                "message": f"Method {request.method} tidak diizinkan untuk {request.path}",
            }
        ), 405

    @app.errorhandler(500)
    def handle_500(e):
        """Handler untuk internal server error."""
        return jsonify(
            {
                "success": False,
                "error": "InternalServerError",
                "message": "Terjadi kesalahan internal server",
            }
        ), 500

    @app.errorhandler(Exception)
    def handle_generic_exception(e: Exception):
        """Handler untuk exception umum yang tidak tertangani."""
        return jsonify(
            {
                "success": False,
                "error": e.__class__.__name__,
                "message": str(e),
            }
        ), 500

    # ============ Routes ============

    @app.route("/", methods=["GET"])
    def index():
        """
        Root endpoint - informasi aplikasi.
        """
        return jsonify(
            {
                "success": True,
                "data": {
                    "name": "Manajemen Data Mahasiswa API",
                    "version": "1.0.0",
                    "description": (
                        "Flask REST API dengan OOP, algoritma pencarian, "
                        "pengurutan, regex validation, dan file I/O"
                    ),
                    "endpoints": {
                        "mahasiswa": "/api/mahasiswa",
                        "search": "/api/search",
                        "sort": "/api/sort",
                        "analysis": "/api/analysis",
                        "health": "/health",
                    },
                },
                "message": "Selamat datang di API Manajemen Data Mahasiswa",
            }
        )

    @app.route("/health", methods=["GET"])
    def health_check():
        """
        Health check endpoint.

        Returns:
            Status kesehatan aplikasi
        """
        return jsonify(
            {
                "success": True,
                "data": {
                    "status": "healthy",
                    "service": "mahasiswa-api",
                    "version": "1.0.0",
                },
                "message": "Service is running",
            }
        )

    return app


# Buat instance app untuk running
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
