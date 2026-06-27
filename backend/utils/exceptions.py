"""
Custom exception hierarchy untuk Manajemen Data Mahasiswa.

Menyediakan hierarki exception yang jelas untuk berbagai jenis kesalahan
yang dapat terjadi dalam aplikasi.
"""


class MahasiswaError(Exception):
    """
    Base exception class untuk semua error terkait mahasiswa.

    Menjadi parent class bagi semua custom exception lainnya
    sehingga penanganan error menjadi lebih terstruktur.
    """

    def __init__(self, message: str = "Terjadi kesalahan pada sistem mahasiswa") -> None:
        self.message = message
        super().__init__(self.message)

    def to_dict(self) -> dict:
        """Convert exception ke dictionary untuk JSON response."""
        return {"success": False, "error": self.__class__.__name__, "message": self.message}


class ValidationError(MahasiswaError):
    """Exception untuk error validasi data (regex, format, dll)."""

    def __init__(self, message: str = "Data tidak valid", field: str = None) -> None:
        self.field = field
        super().__init__(message)

    def to_dict(self) -> dict:
        """Convert exception ke dictionary dengan informasi field."""
        result = super().to_dict()
        if self.field:
            result["field"] = self.field
        return result


class MahasiswaNotFoundError(MahasiswaError):
    """Exception ketika mahasiswa dengan NIM tertentu tidak ditemukan."""

    def __init__(self, nim: str = "") -> None:
        self.nim = nim
        super().__init__(f"Mahasiswa dengan NIM '{nim}' tidak ditemukan")


class DuplicateNIMError(MahasiswaError):
    """Exception ketika terjadi duplikasi NIM pada create/update."""

    def __init__(self, nim: str = "") -> None:
        self.nim = nim
        super().__init__(f"Mahasiswa dengan NIM '{nim}' sudah terdaftar")


class FileOperationError(MahasiswaError):
    """Exception untuk kesalahan operasi file I/O."""

    def __init__(self, message: str = "Gagal melakukan operasi file", filename: str = "") -> None:
        self.filename = filename
        super().__init__(message)

    def to_dict(self) -> dict:
        result = super().to_dict()
        if self.filename:
            result["filename"] = self.filename
        return result


class InvalidAlgorithmError(MahasiswaError):
    """Exception ketika algorithm yang diminta tidak valid atau tidak didukung."""

    def __init__(self, algorithm: str = "", supported: list = None) -> None:
        self.algorithm = algorithm
        self.supported = supported or []
        message = f"Algoritma '{algorithm}' tidak valid"
        if self.supported:
            message += f". Algoritma yang didukung: {', '.join(self.supported)}"
        super().__init__(message)

    def to_dict(self) -> dict:
        result = super().to_dict()
        result["algorithm"] = self.algorithm
        if self.supported:
            result["supported_algorithms"] = self.supported
        return result
