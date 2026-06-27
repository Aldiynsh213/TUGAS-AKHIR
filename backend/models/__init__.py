"""
Package models untuk Manajemen Data Mahasiswa.

Menyediakan class-class model untuk mahasiswa sarjana (S1) dan magister (S2)
dengan menerapkan konsep OOP: abstraction, encapsulation, inheritance, dan polymorphism.
"""

from models.mahasiswa import Mahasiswa
from models.mahasiswa_sarjana import MahasiswaSarjana
from models.mahasiswa_magister import MahasiswaMagister

__all__ = ["Mahasiswa", "MahasiswaSarjana", "MahasiswaMagister"]
