"""
Validator menggunakan regular expression untuk validasi field mahasiswa.

Modul ini menyediakan class Validator dengan static methods
yang menggunakan regex pattern untuk memvalidasi berbagai field data mahasiswa.
"""

import re
from typing import Optional


class Validator:
    """
    Validator class untuk validasi field data mahasiswa menggunakan regex.

    Semua method bersifat static sehingga dapat dipanggil tanpa instansiasi.
    """

    # Regex patterns untuk validasi field
    PATTERNS = {
        "nim": re.compile(r"^\d{8,12}$"),  # 8-12 digit angka
        "nama": re.compile(r"^[A-Za-z\s\.'-]{2,100}$"),  # 2-100 karakter alphabet
        "email": re.compile(
            r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        ),  # Standard email format
        "phone": re.compile(
            r"^(\+62|62|0)[0-9]{9,13}$"
        ),  # Format Indonesia: +62/62/0 + 9-13 digit
        "ipk": re.compile(
            r"^([0-3]\.\d{1,2}|4\.00)$"
        ),  # 0.00 - 4.00 (maksimal 4.00)
        "semester": re.compile(r"^[1-9][0-9]?$"),  # 1-99
        "tahun": re.compile(r"^(19|20)\d{2}$"),  # 1900-2099
        "jurusan": re.compile(r"^[A-Za-z\s\(\)]{2,100}$"),  # Nama jurusan
        "dosen": re.compile(r"^[A-Za-z\s\.'-]{2,100}$"),  # Nama dosen
        "judul": re.compile(r"^.{5,200}$"),  # Judul skripsi/tesis 5-200 karakter
    }

    @staticmethod
    def validate_nim(nim: str) -> bool:
        """
        Validasi NIM mahasiswa.

        Pattern: 8-12 digit angka.

        Args:
            nim: Nomor Induk Mahasiswa

        Returns:
            True jika valid, False jika tidak
        """
        if not nim or not isinstance(nim, str):
            return False
        return bool(Validator.PATTERNS["nim"].match(nim))

    @staticmethod
    def validate_nama(nama: str) -> bool:
        """
        Validasi nama mahasiswa.

        Pattern: 2-100 karakter alphabet, spasi, titik, apostrof, atau strip.

        Args:
            nama: Nama lengkap mahasiswa

        Returns:
            True jika valid, False jika tidak
        """
        if not nama or not isinstance(nama, str):
            return False
        return bool(Validator.PATTERNS["nama"].match(nama))

    @staticmethod
    def validate_email(email: str) -> bool:
        """
        Validasi alamat email.

        Pattern: format email standard RFC.

        Args:
            email: Alamat email mahasiswa

        Returns:
            True jika valid, False jika tidak
        """
        if not email or not isinstance(email, str):
            return False
        return bool(Validator.PATTERNS["email"].match(email))

    @staticmethod
    def validate_phone(phone: str) -> bool:
        """
        Validasi nomor telepon Indonesia.

        Pattern: diawali +62, 62, atau 0, diikuti 9-13 digit angka.

        Args:
            phone: Nomor telepon mahasiswa

        Returns:
            True jika valid, False jika tidak
        """
        if not phone or not isinstance(phone, str):
            return False
        return bool(Validator.PATTERNS["phone"].match(phone))

    @staticmethod
    def validate_ipk(ipk: str | float) -> bool:
        """
        Validasi nilai IPK.

        Pattern: 0.00 - 4.00 (format: X.XX atau 4.00).

        Args:
            ipk: Indeks Prestasi Kumulatif

        Returns:
            True jika valid, False jika tidak
        """
        if isinstance(ipk, (int, float)):
            return 0.00 <= float(ipk) <= 4.00
        if not ipk or not isinstance(ipk, str):
            return False
        if not Validator.PATTERNS["ipk"].match(ipk):
            return False
        # Validate range numerically
        try:
            val = float(ipk)
            return 0.00 <= val <= 4.00
        except ValueError:
            return False

    @staticmethod
    def validate_semester(semester: str | int) -> bool:
        """
        Validasi semester.

        Pattern: 1-99 (angka positif).

        Args:
            semester: Semester mahasiswa

        Returns:
            True jika valid, False jika tidak
        """
        if isinstance(semester, int):
            return 1 <= semester <= 99
        if not semester or not isinstance(semester, str):
            return False
        return bool(Validator.PATTERNS["semester"].match(semester))

    @staticmethod
    def validate_tahun(tahun: str | int) -> bool:
        """
        Validasi tahun angkatan atau tahun akademik.

        Pattern: 1900-2099.

        Args:
            tahun: Tahun angkatan

        Returns:
            True jika valid, False jika tidak
        """
        if isinstance(tahun, int):
            return 1900 <= tahun <= 2099
        if not tahun or not isinstance(tahun, str):
            return False
        return bool(Validator.PATTERNS["tahun"].match(tahun))

    @staticmethod
    def validate_jurusan(jurusan: str) -> bool:
        """
        Validasi nama jurusan.

        Pattern: 2-100 karakter alphabet, spasi, dan tanda kurung.

        Args:
            jurusan: Nama jurusan/program studi

        Returns:
            True jika valid, False jika tidak
        """
        if not jurusan or not isinstance(jurusan, str):
            return False
        return bool(Validator.PATTERNS["jurusan"].match(jurusan))

    @staticmethod
    def validate_dosen(dosen: str) -> bool:
        """
        Validasi nama dosen.

        Pattern: 2-100 karakter alphabet, spasi, titik, apostrof, atau strip.

        Args:
            dosen: Nama dosen pembimbing/promotor

        Returns:
            True jika valid, False jika tidak
        """
        if not dosen or not isinstance(dosen, str):
            return False
        return bool(Validator.PATTERNS["dosen"].match(dosen))

    @staticmethod
    def validate_judul(judul: str) -> bool:
        """
        Validasi judul skripsi/tesis.

        Pattern: 5-200 karakter apa saja.

        Args:
            judul: Judul skripsi atau tesis

        Returns:
            True jika valid, False jika tidak
        """
        if not judul or not isinstance(judul, str):
            return False
        return bool(Validator.PATTERNS["judul"].match(judul))

    @classmethod
    def validate_all(cls, data: dict) -> dict[str, str]:
        """
        Validasi semua field dalam dictionary data mahasiswa.

        Args:
            data: Dictionary berisi field-field mahasiswa

        Returns:
            Dictionary field yang error -> pesan error (kosong jika semua valid)
        """
        errors = {}

        if "nim" in data and not cls.validate_nim(data["nim"]):
            errors["nim"] = "NIM harus 8-12 digit angka"

        if "nama" in data and not cls.validate_nama(data["nama"]):
            errors["nama"] = "Nama harus 2-100 karakter alphabet"

        if "email" in data and not cls.validate_email(data["email"]):
            errors["email"] = "Format email tidak valid"

        if "phone" in data and not cls.validate_phone(data["phone"]):
            errors["phone"] = "Format telepon Indonesia tidak valid (+62/62/0 + 9-13 digit)"

        if "ipk" in data and not cls.validate_ipk(data["ipk"]):
            errors["ipk"] = "IPK harus antara 0.00 - 4.00"

        if "semester" in data and not cls.validate_semester(data["semester"]):
            errors["semester"] = "Semester harus antara 1-99"

        if "tahun_angkatan" in data and not cls.validate_tahun(data["tahun_angkatan"]):
            errors["tahun_angkatan"] = "Tahun angkatan harus antara 1900-2099"

        if "jurusan" in data and not cls.validate_jurusan(data["jurusan"]):
            errors["jurusan"] = "Nama jurusan tidak valid"

        if "dosen_pembimbing" in data and data["dosen_pembimbing"] and not cls.validate_dosen(data["dosen_pembimbing"]):
            errors["dosen_pembimbing"] = "Nama dosen pembimbing tidak valid"

        if "dosen_promotor" in data and data["dosen_promotor"] and not cls.validate_dosen(data["dosen_promotor"]):
            errors["dosen_promotor"] = "Nama dosen promotor tidak valid"

        if "judul_skripsi" in data and data["judul_skripsi"] and not cls.validate_judul(data["judul_skripsi"]):
            errors["judul_skripsi"] = "Judul skripsi harus 5-200 karakter"

        if "judul_tesis" in data and data["judul_tesis"] and not cls.validate_judul(data["judul_tesis"]):
            errors["judul_tesis"] = "Judul tesis harus 5-200 karakter"

        return errors
