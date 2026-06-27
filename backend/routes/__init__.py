"""
Package routes untuk Flask Blueprints.
"""

from routes.mahasiswa_routes import mahasiswa_bp
from routes.search_routes import search_bp
from routes.sort_routes import sort_bp
from routes.analysis_routes import analysis_bp

__all__ = ["mahasiswa_bp", "search_bp", "sort_bp", "analysis_bp"]
