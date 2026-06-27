"""
File handler untuk operasi JSON file I/O.

Menyediakan operasi baca/tulis data mahasiswa ke file JSON
 dengan penanganan error yang robust dan fitur backup otomatis.
"""

import json
import os
import shutil
import time
from datetime import datetime
from typing import Any, Optional

from utils.exceptions import FileOperationError


class FileHandler:
    """
    Handler untuk operasi file JSON data mahasiswa.

    Menangani pembacaan, penulisan, dan backup data
    dengan mekanisme atomic write untuk mencegah corrupt data.
    """

    def __init__(self, filepath: str) -> None:
        """
        Inisialisasi FileHandler.

        Args:
            filepath: Path lengkap ke file JSON data
        """
        self.filepath = filepath
        self.backup_dir = os.path.join(os.path.dirname(filepath), "backups")

    def read_all(self) -> list[dict]:
        """
        Baca semua data dari file JSON.

        Returns:
            List dictionary data mahasiswa (kosong jika file tidak ada atau error)

        Raises:
            FileOperationError: Jika terjadi kesalahan membaca file
        """
        try:
            if not os.path.exists(self.filepath):
                return []

            with open(self.filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
                return [data] if isinstance(data, dict) else []

        except FileNotFoundError:
            return []
        except json.JSONDecodeError as e:
            raise FileOperationError(
                message=f"Format JSON tidak valid: {str(e)}",
                filename=self.filepath,
            )
        except PermissionError:
            raise FileOperationError(
                message="Tidak memiliki izin membaca file",
                filename=self.filepath,
            )
        except Exception as e:
            raise FileOperationError(
                message=f"Gagal membaca file: {str(e)}",
                filename=self.filepath,
            )

    def write_all(self, records: list[dict]) -> None:
        """
        Tulis semua data ke file JSON secara atomik.

        Menggunakan strategi write-to-temp-then-rename
        untuk mencegah corrupt data saat proses penulisan terinterupsi.

        Args:
            records: List dictionary data mahasiswa

        Raises:
            FileOperationError: Jika terjadi kesalahan menulis file
        """
        # Pastikan direktori ada
        dir_path = os.path.dirname(self.filepath)
        if dir_path and not os.path.exists(dir_path):
            try:
                os.makedirs(dir_path, exist_ok=True)
            except OSError as e:
                raise FileOperationError(
                    message=f"Gagal membuat direktori: {str(e)}",
                    filename=self.filepath,
                )

        # Tulis ke file temporary terlebih dahulu
        temp_filepath = f"{self.filepath}.tmp"
        try:
            with open(temp_filepath, "w", encoding="utf-8") as f:
                json.dump(records, f, indent=2, ensure_ascii=False, default=str)
                f.flush()
                os.fsync(f.fileno())

            # Rename file temporary ke nama file asli (atomic operation)
            if os.path.exists(self.filepath):
                # Backup file lama sebelum overwrite
                self.backup()
            os.replace(temp_filepath, self.filepath)

        except PermissionError:
            # Bersihkan file temporary jika ada
            if os.path.exists(temp_filepath):
                os.remove(temp_filepath)
            raise FileOperationError(
                message="Tidak memiliki izin menulis file",
                filename=self.filepath,
            )
        except TypeError as e:
            if os.path.exists(temp_filepath):
                os.remove(temp_filepath)
            raise FileOperationError(
                message=f"Data tidak dapat di-serialize ke JSON: {str(e)}",
                filename=self.filepath,
            )
        except OSError as e:
            if os.path.exists(temp_filepath):
                os.remove(temp_filepath)
            raise FileOperationError(
                message=f"Gagal menulis file: {str(e)}",
                filename=self.filepath,
            )

    def backup(self) -> str:
        """
        Buat backup file data dengan timestamp.

        Returns:
            Path ke file backup yang dibuat

        Raises:
            FileOperationError: Jika terjadi kesalahan saat backup
        """
        if not os.path.exists(self.filepath):
            return ""

        try:
            # Buat direktori backup jika belum ada
            if not os.path.exists(self.backup_dir):
                os.makedirs(self.backup_dir, exist_ok=True)

            # Generate nama file backup dengan timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = os.path.basename(self.filepath)
            backup_filename = f"{filename}.{timestamp}.bak"
            backup_path = os.path.join(self.backup_dir, backup_filename)

            shutil.copy2(self.filepath, backup_path)
            return backup_path

        except PermissionError:
            raise FileOperationError(
                message="Tidak memiliki izin untuk membuat backup",
                filename=self.backup_dir,
            )
        except OSError as e:
            raise FileOperationError(
                message=f"Gagal membuat backup: {str(e)}",
                filename=self.filepath,
            )

    def list_backups(self) -> list[str]:
        """
        Daftar semua file backup yang tersedia.

        Returns:
            List path file backup (terurut dari yang terbaru)
        """
        if not os.path.exists(self.backup_dir):
            return []

        try:
            backups = [
                os.path.join(self.backup_dir, f)
                for f in os.listdir(self.backup_dir)
                if f.endswith(".bak")
            ]
            # Urutkan berdasarkan waktu modifikasi (terbaru dulu)
            backups.sort(key=os.path.getmtime, reverse=True)
            return backups
        except OSError:
            return []

    def restore_backup(self, backup_path: str) -> list[dict]:
        """
        Restore data dari file backup.

        Args:
            backup_path: Path ke file backup

        Returns:
            List dictionary data yang di-restore

        Raises:
            FileOperationError: Jika file backup tidak ada atau corrupt
        """
        if not os.path.exists(backup_path):
            raise FileOperationError(
                message=f"File backup tidak ditemukan: {backup_path}",
                filename=backup_path,
            )

        try:
            with open(backup_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                records = data if isinstance(data, list) else [data]

            # Tulis ke file utama
            self.write_all(records)
            return records

        except json.JSONDecodeError as e:
            raise FileOperationError(
                message=f"File backup corrupt: {str(e)}",
                filename=backup_path,
            )
        except Exception as e:
            raise FileOperationError(
                message=f"Gagal restore backup: {str(e)}",
                filename=backup_path,
            )
