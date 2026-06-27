"""
Model Mahasiswa Sarjana (S1).

Mewarisi dari abstract base class Mahasiswa dan mengimplementasikan
method abstract untuk mahasiswa program Sarjana (S1).

Konsep OOP:
- INHERITANCE: Mewarisi semua atribut dan method dari Mahasiswa
- POLYMORPHISM: Override method abstract dengan implementasi S1-specific
- ENCAPSULATION: Menambah atribut private baru untuk data S1
"""

from typing import Optional

from models.mahasiswa import Mahasiswa
from utils.validator import Validator
from utils.exceptions import ValidationError


class MahasiswaSarjana(Mahasiswa):
    """
    Class untuk mahasiswa program Sarjana (S1).

    Extends Mahasiswa dengan atribut tambahan:
    - judul_skripsi: Judul skripsi mahasiswa
    - dosen_pembimbing: Nama dosen pembimbing skripsi
    - anggota_ukm: Keanggotaan Unit Kegiatan Mahasiswa

    Attributes:
        _judul_skripsi: Judul skripsi (private)
        _dosen_pembimbing: Nama dosen pembimbing (private)
        _anggota_ukm: List nama UKM yang diikuti (private)
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
        judul_skripsi: str = "",
        dosen_pembimbing: str = "",
        anggota_ukm: list[str] = None,
    ) -> None:
        """
        Inisialisasi objek MahasiswaSarjana.

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
            judul_skripsi: Judul skripsi (kosong jika belum mengajukan)
            dosen_pembimbing: Nama dosen pembimbing skripsi
            anggota_ukm: List nama UKM yang diikuti
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

        # Inisialisasi atribut private spesifik S1
        self._judul_skripsi = judul_skripsi or ""
        self._dosen_pembimbing = dosen_pembimbing or ""
        self._anggota_ukm = anggota_ukm or []

    # ============ ENCAPSULATION: Property Getters & Setters S1 ============

    @property
    def judul_skripsi(self) -> str:
        """Getter untuk judul skripsi."""
        return self._judul_skripsi

    @judul_skripsi.setter
    def judul_skripsi(self, value: str) -> None:
        """Setter untuk judul skripsi dengan validasi."""
        if value and not Validator.validate_judul(value):
            raise ValidationError("Judul skripsi harus 5-200 karakter", field="judul_skripsi")
        self._judul_skripsi = value

    @property
    def dosen_pembimbing(self) -> str:
        """Getter untuk nama dosen pembimbing."""
        return self._dosen_pembimbing

    @dosen_pembimbing.setter
    def dosen_pembimbing(self, value: str) -> None:
        """Setter untuk nama dosen pembimbing dengan validasi."""
        if value and not Validator.validate_dosen(value):
            raise ValidationError("Nama dosen pembimbing tidak valid", field="dosen_pembimbing")
        self._dosen_pembimbing = value

    @property
    def anggota_ukm(self) -> list[str]:
        """Getter untuk daftar keanggotaan UKM."""
        return self._anggota_ukm

    @anggota_ukm.setter
    def anggota_ukm(self, value: list[str]) -> None:
        """Setter untuk daftar keanggotaan UKM."""
        self._anggota_ukm = value if value else []

    # ============ POLYMORPHISM: Implementasi Abstract Methods ============

    def get_info_tambahan(self) -> dict:
        """
        [POLYMORPHISM] Implementasi info tambahan untuk S1.

        Returns:
            Dictionary berisi informasi spesifik mahasiswa S1
        """
        return {
            "judul_skripsi": self._judul_skripsi,
            "dosen_pembimbing": self._dosen_pembimbing,
            "anggota_ukm": self._anggota_ukm,
            "sks_lulus": self._hitung_sks_lulus(),
            "tahun_lulus_estimasi": self._estimasi_tahun_lulus(),
        }

    def get_tipe(self) -> str:
        """
        [POLYMORPHISM] Tipe mahasiswa S1.

        Returns:
            String 'S1' untuk Sarjana
        """
        return "S1"

    # ============ Helper Methods Private ============

    def _hitung_sks_lulus(self) -> int:
        """
        Estimasi SKS lulus berdasarkan semester (private method).

        Returns:
            Estimasi jumlah SKS yang sudah lulus
        """
        # Asumsi: rata-rata 20 SKS per semester
        return min(self._semester * 20, 144)

    def _estimasi_tahun_lulus(self) -> int:
        """
        Estimasi tahun lulus berdasarkan semester saat ini (private method).

        Returns:
            Estimasi tahun kelulusan
        """
        semester_remaining = max(0, 8 - self._semester)
        tahun_tambahan = semester_remaining // 2 + (1 if semester_remaining % 2 else 0)
        return self._tahun_angkatan + tahun_tambahan

    # ============ Serialization Override ============

    def to_dict(self) -> dict:
        """
        Override: Konversi objek S1 ke dictionary.

        Menambahkan field spesifik S1 ke dictionary dasar.

        Returns:
            Dictionary lengkap representasi mahasiswa S1
        """
        # Panggil method parent kemudian tambahkan field S1
        data = super().to_dict()
        data.update(
            {
                "judul_skripsi": self._judul_skripsi,
                "dosen_pembimbing": self._dosen_pembimbing,
                "anggota_ukm": self._anggota_ukm,
            }
        )
        return data

    @classmethod
    def from_dict(cls, data: dict) -> "MahasiswaSarjana":
        """
        [POLYMORPHISM] Buat objek MahasiswaSarjana dari dictionary.

        Args:
            data: Dictionary berisi data mahasiswa S1

        Returns:
            Instance MahasiswaSarjana
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
            judul_skripsi=data.get("judul_skripsi", ""),
            dosen_pembimbing=data.get("dosen_pembimbing", ""),
            anggota_ukm=data.get("anggota_ukm", []) or [],
        )

    # ============ String Representations ============

    def __str__(self) -> str:
        """String representation user-friendly untuk S1."""
        skripsi_info = f" | Skripsi: {self._judul_skripsi[:30]}..." if self._judul_skripsi else ""
        return f"[S1] {self._nama} ({self._nim}) - {self._jurusan} - IPK: {self._ipk}{skripsi_info}"

    def __repr__(self) -> str:
        """String representation untuk debugging S1."""
        return (
            f"MahasiswaSarjana("
            f"nim='{self._nim}', nama='{self._nama}', "
            f"jurusan='{self._jurusan}', ipk={self._ipk}, "
            f"dosen_pembimbing='{self._dosen_pembimbing}')"
        )
