"""
Abstract Base Class Mahasiswa.

Menyediakan blueprint untuk semua jenis mahasiswa dengan menerapkan
konsep OOP: Abstraction, Encapsulation, dan Polymorphism.

- Abstraction: Class ini abstract, tidak bisa diinstansiasi langsung
- Encapsulation: Atribut private dengan getter/setter melalui @property
- Polymorphism: Method abstract yang di-override oleh subclass
"""

from abc import ABC, abstractmethod
from typing import Any, Optional

from utils.validator import Validator
from utils.exceptions import ValidationError


class Mahasiswa(ABC):
    """
    Abstract Base Class untuk semua jenis mahasiswa.

    Mengimplementasikan konsep OOP:
    - ENCAPSULATION: atribut diawali underscore (private convention)
      dengan akses melalui @property getter dan setter
    - ABSTRACTION: class ini tidak dapat diinstansiasi langsung,
      subclass wajib mengimplementasikan method abstract
    - POLYMORPHISM: method abstract `get_info_tambahan` dan `get_tipe`
      akan memiliki implementasi berbeda di setiap subclass

    Attributes:
        _nim: Nomor Induk Mahasiswa (private)
        _nama: Nama lengkap mahasiswa (private)
        _email: Alamat email (private)
        _phone: Nomor telepon (private)
        _jurusan: Program studi/jurusan (private)
        _ipk: Indeks Prestasi Kumulatif (private)
        _semester: Semester saat ini (private)
        _tahun_angkatan: Tahun masuk (private)
        _alamat: Alamat tinggal (private)
        _tanggal_lahir: Tanggal lahir (private)
        _jenis_kelamin: L/P (private)
        _status: Aktif/Cuti/Lulus (private)
    """

    def __init__(
        self,
        nim: str = "",
        nama: str = "",
        email: str = "",
        phone: str = "",
        jurusan: str = "",
        ipk: float = 0.0,
        semester: int = 1,
        tahun_angkatan: int = 2024,
        alamat: str = "",
        tanggal_lahir: str = "",
        jenis_kelamin: str = "L",
        status: str = "Aktif",
    ) -> None:
        """
        Inisialisasi objek Mahasiswa.

        Args:
            nim: Nomor Induk Mahasiswa
            nama: Nama lengkap mahasiswa
            email: Alamat email aktif
            phone: Nomor telepon aktif
            jurusan: Program studi/jurusan
            ipk: Indeks Prestasi Kumulatif (0.00 - 4.00)
            semester: Semester saat ini
            tahun_angkatan: Tahun masuk kuliah
            alamat: Alamat lengkap
            tanggal_lahir: Format YYYY-MM-DD
            jenis_kelamin: Laki-laki (L) atau Perempuan (P)
            status: Status akademik (Aktif/Cuti/Lulus)
        """
        # Inisialisasi atribut private dengan underscore prefix
        self._nim = nim
        self._nama = nama
        self._email = email
        self._phone = phone
        self._jurusan = jurusan
        self._ipk = float(ipk) if ipk else 0.0
        self._semester = int(semester) if semester else 1
        self._tahun_angkatan = int(tahun_angkatan) if tahun_angkatan else 2024
        self._alamat = alamat
        self._tanggal_lahir = tanggal_lahir
        self._jenis_kelamin = jenis_kelamin
        self._status = status

    # ============ ENCAPSULATION: Property Getters & Setters ============

    @property
    def nim(self) -> str:
        """Getter untuk NIM (encapsulation: akses terkontrol)."""
        return self._nim

    @nim.setter
    def nim(self, value: str) -> None:
        """Setter untuk NIM dengan validasi."""
        if not Validator.validate_nim(value):
            raise ValidationError("NIM harus 8-12 digit angka", field="nim")
        self._nim = value

    @property
    def nama(self) -> str:
        """Getter untuk nama mahasiswa."""
        return self._nama

    @nama.setter
    def nama(self, value: str) -> None:
        """Setter untuk nama dengan validasi."""
        if not Validator.validate_nama(value):
            raise ValidationError("Nama harus 2-100 karakter alphabet", field="nama")
        self._nama = value

    @property
    def email(self) -> str:
        """Getter untuk email."""
        return self._email

    @email.setter
    def email(self, value: str) -> None:
        """Setter untuk email dengan validasi format."""
        if not Validator.validate_email(value):
            raise ValidationError("Format email tidak valid", field="email")
        self._email = value

    @property
    def phone(self) -> str:
        """Getter untuk nomor telepon."""
        return self._phone

    @phone.setter
    def phone(self, value: str) -> None:
        """Setter untuk telepon dengan validasi format Indonesia."""
        if not Validator.validate_phone(value):
            raise ValidationError(
                "Format telepon tidak valid (+62/62/0 + 9-13 digit)", field="phone"
            )
        self._phone = value

    @property
    def jurusan(self) -> str:
        """Getter untuk jurusan/program studi."""
        return self._jurusan

    @jurusan.setter
    def jurusan(self, value: str) -> None:
        """Setter untuk jurusan dengan validasi."""
        if not Validator.validate_jurusan(value):
            raise ValidationError("Nama jurusan tidak valid", field="jurusan")
        self._jurusan = value

    @property
    def ipk(self) -> float:
        """Getter untuk IPK."""
        return self._ipk

    @ipk.setter
    def ipk(self, value: float) -> None:
        """Setter untuk IPK dengan validasi range 0.00 - 4.00."""
        if not Validator.validate_ipk(value):
            raise ValidationError("IPK harus antara 0.00 - 4.00", field="ipk")
        self._ipk = float(value)

    @property
    def semester(self) -> int:
        """Getter untuk semester."""
        return self._semester

    @semester.setter
    def semester(self, value: int) -> None:
        """Setter untuk semester dengan validasi."""
        if not Validator.validate_semester(value):
            raise ValidationError("Semester harus antara 1-99", field="semester")
        self._semester = int(value)

    @property
    def tahun_angkatan(self) -> int:
        """Getter untuk tahun angkatan."""
        return self._tahun_angkatan

    @tahun_angkatan.setter
    def tahun_angkatan(self, value: int) -> None:
        """Setter untuk tahun angkatan dengan validasi."""
        if not Validator.validate_tahun(value):
            raise ValidationError("Tahun angkatan harus antara 1900-2099", field="tahun_angkatan")
        self._tahun_angkatan = int(value)

    @property
    def alamat(self) -> str:
        """Getter untuk alamat."""
        return self._alamat

    @alamat.setter
    def alamat(self, value: str) -> None:
        """Setter untuk alamat."""
        self._alamat = value

    @property
    def tanggal_lahir(self) -> str:
        """Getter untuk tanggal lahir."""
        return self._tanggal_lahir

    @tanggal_lahir.setter
    def tanggal_lahir(self, value: str) -> None:
        """Setter untuk tanggal lahir."""
        self._tanggal_lahir = value

    @property
    def jenis_kelamin(self) -> str:
        """Getter untuk jenis kelamin."""
        return self._jenis_kelamin

    @jenis_kelamin.setter
    def jenis_kelamin(self, value: str) -> None:
        """Setter untuk jenis kelamin."""
        if value not in ("L", "P"):
            raise ValidationError("Jenis kelamin harus L atau P", field="jenis_kelamin")
        self._jenis_kelamin = value

    @property
    def status(self) -> str:
        """Getter untuk status akademik."""
        return self._status

    @status.setter
    def status(self, value: str) -> None:
        """Setter untuk status akademik."""
        if value not in ("Aktif", "Cuti", "Lulus"):
            raise ValidationError("Status harus Aktif, Cuti, atau Lulus", field="status")
        self._status = value

    # ============ POLYMORPHISM: Abstract Methods ============

    @abstractmethod
    def get_info_tambahan(self) -> dict:
        """
        [ABSTRACT] Dapatkan informasi tambahan spesifik tipe mahasiswa.

        Method ini wajib di-override oleh subclass.
        Implementasi akan berbeda antara MahasiswaSarjana dan MahasiswaMagister.

        Returns:
            Dictionary berisi informasi tambahan
        """
        pass

    @abstractmethod
    def get_tipe(self) -> str:
        """
        [ABSTRACT] Dapatkan tipe mahasiswa.

        Method ini wajib di-override oleh subclass.

        Returns:
            String tipe mahasiswa (misal: 'S1', 'S2')
        """
        pass

    # ============ Serialization ============

    def to_dict(self) -> dict:
        """
        Konversi objek ke dictionary untuk serialisasi JSON.

        Returns:
            Dictionary representasi mahasiswa
        """
        return {
            "nim": self._nim,
            "nama": self._nama,
            "email": self._email,
            "phone": self._phone,
            "jurusan": self._jurusan,
            "ipk": self._ipk,
            "semester": self._semester,
            "tahun_angkatan": self._tahun_angkatan,
            "alamat": self._alamat,
            "tanggal_lahir": self._tanggal_lahir,
            "jenis_kelamin": self._jenis_kelamin,
            "status": self._status,
            "tipe": self.get_tipe(),
            "info_tambahan": self.get_info_tambahan(),
        }

    @classmethod
    @abstractmethod
    def from_dict(cls, data: dict) -> "Mahasiswa":
        """
        [ABSTRACT] Buat objek dari dictionary.

        Method ini wajib di-override oleh subclass
        karena setiap tipe mahasiswa memiliki field berbeda.

        Args:
            data: Dictionary data mahasiswa

        Returns:
            Instance objek Mahasiswa
        """
        pass

    # ============ Validation ============

    def validate(self) -> dict[str, str]:
        """
        Validasi semua field mahasiswa menggunakan regex validator.

        Returns:
            Dictionary field error -> pesan error (kosong jika valid)
        """
        return Validator.validate_all(self.to_dict())

    # ============ String Representations ============

    def __str__(self) -> str:
        """String representation user-friendly."""
        return f"{self._nama} ({self._nim}) - {self.get_tipe()} - {self._jurusan} - IPK: {self._ipk}"

    def __repr__(self) -> str:
        """String representation untuk debugging."""
        return (
            f"{self.__class__.__name__}("
            f"nim='{self._nim}', nama='{self._nama}', "
            f"jurusan='{self._jurusan}', ipk={self._ipk}, "
            f"tipe='{self.get_tipe()}')"
        )

    def __eq__(self, other: object) -> bool:
        """Equality comparison berdasarkan NIM."""
        if not isinstance(other, Mahasiswa):
            return NotImplemented
        return self._nim == other._nim

    def __hash__(self) -> int:
        """Hash berdasarkan NIM untuk penggunaan dalam set/dict."""
        return hash(self._nim)
