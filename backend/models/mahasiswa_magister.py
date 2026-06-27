"""
Model Mahasiswa Magister (S2).

Mewarisi dari abstract base class Mahasiswa dan mengimplementasikan
method abstract untuk mahasiswa program Magister (S2).

Konsep OOP:
- INHERITANCE: Mewarisi semua atribut dan method dari Mahasiswa
- POLYMORPHISM: Override method abstract dengan implementasi S2-specific
- ENCAPSULATION: Menambah atribut private baru untuk data S2
"""

from typing import Optional

from models.mahasiswa import Mahasiswa
from utils.validator import Validator
from utils.exceptions import ValidationError


class MahasiswaMagister(Mahasiswa):
    """
    Class untuk mahasiswa program Magister (S2).

    Extends Mahasiswa dengan atribut tambahan:
    - judul_tesis: Judul tesis mahasiswa
    - dosen_promotor: Nama dosen promotor tesis
    - beasiswa: Status beasiswa yang diterima
    - publikasi_jurnal: List publikasi jurnal ilmiah

    Attributes:
        _judul_tesis: Judul tesis (private)
        _dosen_promotor: Nama dosen promotor (private)
        _beasiswa: Status/jenis beasiswa (private)
        _publikasi_jurnal: List publikasi jurnal (private)
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
        judul_tesis: str = "",
        dosen_promotor: str = "",
        beasiswa: str = "",
        publikasi_jurnal: list[dict] = None,
    ) -> None:
        """
        Inisialisasi objek MahasiswaMagister.

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
            judul_tesis: Judul tesis (kosong jika belum mengajukan)
            dosen_promotor: Nama dosen promotor tesis
            beasiswa: Jenis beasiswa (kosong jika tidak ada)
            publikasi_jurnal: List publikasi jurnal ilmiah
        """
        # Panggil constructor parent class (super())
        super().__init__(
            nim=nim,
            nama=nama,
            email=email,
            phone=phone,
            jurusan=jurusan,
            ipk=ipk,
            semester=semester,
            tahun_angkatan=tahun_angkatan,
            alamat=alamat,
            tanggal_lahir=tanggal_lahir,
            jenis_kelamin=jenis_kelamin,
            status=status,
        )

        # Inisialisasi atribut private spesifik S2
        self._judul_tesis = judul_tesis or ""
        self._dosen_promotor = dosen_promotor or ""
        self._beasiswa = beasiswa or ""
        self._publikasi_jurnal = publikasi_jurnal or []

    # ============ ENCAPSULATION: Property Getters & Setters S2 ============

    @property
    def judul_tesis(self) -> str:
        """Getter untuk judul tesis."""
        return self._judul_tesis

    @judul_tesis.setter
    def judul_tesis(self, value: str) -> None:
        """Setter untuk judul tesis dengan validasi."""
        if value and not Validator.validate_judul(value):
            raise ValidationError("Judul tesis harus 5-200 karakter", field="judul_tesis")
        self._judul_tesis = value

    @property
    def dosen_promotor(self) -> str:
        """Getter untuk nama dosen promotor."""
        return self._dosen_promotor

    @dosen_promotor.setter
    def dosen_promotor(self, value: str) -> None:
        """Setter untuk nama dosen promotor dengan validasi."""
        if value and not Validator.validate_dosen(value):
            raise ValidationError("Nama dosen promotor tidak valid", field="dosen_promotor")
        self._dosen_promotor = value

    @property
    def beasiswa(self) -> str:
        """Getter untuk status beasiswa."""
        return self._beasiswa

    @beasiswa.setter
    def beasiswa(self, value: str) -> None:
        """Setter untuk status beasiswa."""
        self._beasiswa = value

    @property
    def publikasi_jurnal(self) -> list[dict]:
        """Getter untuk daftar publikasi jurnal."""
        return self._publikasi_jurnal

    @publikasi_jurnal.setter
    def publikasi_jurnal(self, value: list[dict]) -> None:
        """Setter untuk daftar publikasi jurnal."""
        self._publikasi_jurnal = value if value else []

    # ============ POLYMORPHISM: Implementasi Abstract Methods ============

    def get_info_tambahan(self) -> dict:
        """
        [POLYMORPHISM] Implementasi info tambahan untuk S2.

        Returns:
            Dictionary berisi informasi spesifik mahasiswa S2
        """
        return {
            "judul_tesis": self._judul_tesis,
            "dosen_promotor": self._dosen_promotor,
            "beasiswa": self._beasiswa,
            "publikasi_jurnal": self._publikasi_jurnal,
            "jumlah_publikasi": len(self._publikasi_jurnal),
            "sks_lulus": self._hitung_sks_lulus(),
            "tahun_lulus_estimasi": self._estimasi_tahun_lulus(),
        }

    def get_tipe(self) -> str:
        """
        [POLYMORPHISM] Tipe mahasiswa S2.

        Returns:
            String 'S2' untuk Magister
        """
        return "S2"

    # ============ Helper Methods Private ============

    def _hitung_sks_lulus(self) -> int:
        """
        Estimasi SKS lulus berdasarkan semester (private method).

        Returns:
            Estimasi jumlah SKS yang sudah lulus
        """
        # Asumsi S2: rata-rata 12-15 SKS per semester, total 36-42 SKS
        return min(self._semester * 14, 42)

    def _estimasi_tahun_lulus(self) -> int:
        """
        Estimasi tahun lulus berdasarkan semester saat ini (private method).

        Returns:
            Estimasi tahun kelulusan
        """
        semester_remaining = max(0, 4 - self._semester)
        tahun_tambahan = semester_remaining // 2 + (1 if semester_remaining % 2 else 0)
        return self._tahun_angkatan + tahun_tambahan

    # ============ Serialization Override ============

    def to_dict(self) -> dict:
        """
        Override: Konversi objek S2 ke dictionary.

        Menambahkan field spesifik S2 ke dictionary dasar.

        Returns:
            Dictionary lengkap representasi mahasiswa S2
        """
        # Panggil method parent kemudian tambahkan field S2
        data = super().to_dict()
        data.update(
            {
                "judul_tesis": self._judul_tesis,
                "dosen_promotor": self._dosen_promotor,
                "beasiswa": self._beasiswa,
                "publikasi_jurnal": self._publikasi_jurnal,
            }
        )
        return data

    @classmethod
    def from_dict(cls, data: dict) -> "MahasiswaMagister":
        """
        [POLYMORPHISM] Buat objek MahasiswaMagister dari dictionary.

        Args:
            data: Dictionary berisi data mahasiswa S2

        Returns:
            Instance MahasiswaMagister
        """
        return cls(
            nim=data.get("nim", ""),
            nama=data.get("nama", ""),
            email=data.get("email", ""),
            phone=data.get("phone", ""),
            jurusan=data.get("jurusan", ""),
            ipk=float(data.get("ipk", 0)) if data.get("ipk") else 0.0,
            semester=int(data.get("semester", 1)) if data.get("semester") else 1,
            tahun_angkatan=int(data.get("tahun_angkatan", 2024))
            if data.get("tahun_angkatan")
            else 2024,
            alamat=data.get("alamat", ""),
            tanggal_lahir=data.get("tanggal_lahir", ""),
            jenis_kelamin=data.get("jenis_kelamin", "L"),
            status=data.get("status", "Aktif"),
            judul_tesis=data.get("judul_tesis", ""),
            dosen_promotor=data.get("dosen_promotor", ""),
            beasiswa=data.get("beasiswa", ""),
            publikasi_jurnal=data.get("publikasi_jurnal", []) or [],
        )

    # ============ String Representations ============

    def __str__(self) -> str:
        """String representation user-friendly untuk S2."""
        tesis_info = f" | Tesis: {self._judul_tesis[:30]}..." if self._judul_tesis else ""
        beasiswa_info = f" | Beasiswa: {self._beasiswa}" if self._beasiswa else ""
        return f"[S2] {self._nama} ({self._nim}) - {self._jurusan} - IPK: {self._ipk}{tesis_info}{beasiswa_info}"

    def __repr__(self) -> str:
        """String representation untuk debugging S2."""
        return (
            f"MahasiswaMagister("
            f"nim='{self._nim}', nama='{self._nama}', "
            f"jurusan='{self._jurusan}', ipk={self._ipk}, "
            f"dosen_promotor='{self._dosen_promotor}', "
            f"beasiswa='{self._beasiswa}')"
        )
