import { useState, useCallback, useMemo } from 'react';
import type { Mahasiswa } from '@/types';

const DEMO_MAHASISWA: Mahasiswa[] = [
  { nim: "21010001", nama: "Ahmad Rizky", jurusan: "Informatika", semester: 6, ipk: 3.75, tahun_masuk: 2021, jenis_kelamin: "Laki-laki", email: "ahmad@student.ac.id", no_telepon: "081234567890", tipe: "Sarjana (S1)", judul_skripsi: "Sistem Rekomendasi Film", dosen_pembimbing: "Dr. Budi Santoso", anggota_ukm: ["Robotika", "Programming"] },
  { nim: "21010002", nama: "Siti Nurhaliza", jurusan: "Sistem Informasi", semester: 4, ipk: 3.50, tahun_masuk: 2022, jenis_kelamin: "Perempuan", email: "siti@student.ac.id", no_telepon: "082345678901", tipe: "Sarjana (S1)", judul_skripsi: "", dosen_pembimbing: "" },
  { nim: "21010003", nama: "Budi Hartono", jurusan: "Teknik Elektro", semester: 8, ipk: 3.20, tahun_masuk: 2020, jenis_kelamin: "Laki-laki", email: "budi@student.ac.id", no_telepon: "083456789012", tipe: "Sarjana (S1)", judul_skripsi: "IoT Smart Home", dosen_pembimbing: "Prof. Diana" },
  { nim: "22020001", nama: "Maya Anggraini", jurusan: "Manajemen", semester: 2, ipk: 3.85, tahun_masuk: 2023, jenis_kelamin: "Perempuan", email: "maya@student.ac.id", no_telepon: "084567890123", tipe: "Magister (S2)", judul_tesis: "Digital Marketing", dosen_promotor: "Prof. Eko", beasiswa: "LPDP", publikasi_jurnal: 2 },
  { nim: "21010004", nama: "Doni Kusuma", jurusan: "Akuntansi", semester: 5, ipk: 2.90, tahun_masuk: 2021, jenis_kelamin: "Laki-laki", email: "doni@student.ac.id", no_telepon: "085678901234", tipe: "Sarjana (S1)" },
  { nim: "21010005", nama: "Rina Wulandari", jurusan: "Psikologi", semester: 3, ipk: 3.60, tahun_masuk: 2022, jenis_kelamin: "Perempuan", email: "rina@student.ac.id", no_telepon: "086789012345", tipe: "Sarjana (S1)" },
  { nim: "22020002", nama: "Fajar Pratama", jurusan: "Hukum", semester: 4, ipk: 3.40, tahun_masuk: 2021, jenis_kelamin: "Laki-laki", email: "fajar@student.ac.id", no_telepon: "087890123456", tipe: "Magister (S2)", judul_tesis: "Hukum Digital", dosen_promotor: "Prof. Gina", beasiswa: "PPA", publikasi_jurnal: 1 },
  { nim: "21010006", nama: "Dewi Lestari", jurusan: "Kedokteran", semester: 7, ipk: 3.90, tahun_masuk: 2020, jenis_kelamin: "Perempuan", email: "dewi@student.ac.id", no_telepon: "088901234567", tipe: "Sarjana (S1)", judul_skripsi: "AI Diagnosis" },
  { nim: "21010007", nama: "Eka Putra", jurusan: "Informatika", semester: 2, ipk: 3.15, tahun_masuk: 2023, jenis_kelamin: "Laki-laki", email: "eka@student.ac.id", no_telepon: "089012345678", tipe: "Sarjana (S1)" },
  { nim: "22020003", nama: "Lina Marlina", jurusan: "Ekonomi", semester: 6, ipk: 3.70, tahun_masuk: 2020, jenis_kelamin: "Perempuan", email: "lina@student.ac.id", no_telepon: "081112223334", tipe: "Magister (S2)", judul_tesis: "FinTech", dosen_promotor: "Prof. Hadi", beasiswa: "BUMN", publikasi_jurnal: 3 },
];

export interface FilterOptions {
  search: string;
  jurusan: string;
  semester: string;
  tipe: string;
}

export interface SortConfig {
  key: keyof Mahasiswa | null;
  direction: 'asc' | 'desc';
}

export function useMahasiswa() {
  const [data, setData] = useState<Mahasiswa[]>(DEMO_MAHASISWA);
  const [loading, setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setData([...DEMO_MAHASISWA]);
      setLoading(false);
    }, 300);
  }, []);

  const getByNim = useCallback((nim: string): Mahasiswa | undefined => {
    return data.find((m) => m.nim === nim);
  }, [data]);

  const create = useCallback((mahasiswa: Omit<Mahasiswa, 'nim'> & { nim: string }): Promise<Mahasiswa> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.some((m) => m.nim === mahasiswa.nim)) {
          reject(new Error('NIM sudah terdaftar'));
          return;
        }
        const newMhs: Mahasiswa = { ...mahasiswa };
        setData((prev) => [...prev, newMhs]);
        resolve(newMhs);
      }, 300);
    });
  }, [data]);

  const update = useCallback((nim: string, updates: Partial<Mahasiswa>): Promise<Mahasiswa> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = data.findIndex((m) => m.nim === nim);
        if (idx === -1) {
          reject(new Error('Mahasiswa tidak ditemukan'));
          return;
        }
        const updated = { ...data[idx], ...updates };
        setData((prev) => {
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        });
        resolve(updated);
      }, 300);
    });
  }, [data]);

  const remove = useCallback((nim: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = data.findIndex((m) => m.nim === nim);
        if (idx === -1) {
          reject(new Error('Mahasiswa tidak ditemukan'));
          return;
        }
        setData((prev) => prev.filter((m) => m.nim !== nim));
        resolve();
      }, 300);
    });
  }, [data]);

  const filterAndSort = useCallback(
    (filters: FilterOptions, sort: SortConfig) => {
      let result = [...data];

      // Search filter
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (m) =>
            m.nama.toLowerCase().includes(q) ||
            m.nim.toLowerCase().includes(q) ||
            m.jurusan.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q)
        );
      }

      // Jurusan filter
      if (filters.jurusan && filters.jurusan !== 'all') {
        result = result.filter((m) => m.jurusan === filters.jurusan);
      }

      // Semester filter
      if (filters.semester && filters.semester !== 'all') {
        result = result.filter((m) => m.semester === parseInt(filters.semester));
      }

      // Tipe filter
      if (filters.tipe && filters.tipe !== 'all') {
        result = result.filter((m) => m.tipe === filters.tipe);
      }

      // Sorting
      if (sort.key) {
        result.sort((a, b) => {
          const aVal = a[sort.key!];
          const bVal = b[sort.key!];
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sort.direction === 'asc'
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
          }
          return 0;
        });
      }

      return result;
    },
    [data]
  );

  const jurusanOptions = useMemo(() => {
    const jurusanSet = new Set(DEMO_MAHASISWA.map((m) => m.jurusan));
    return ['all', ...Array.from(jurusanSet)];
  }, []);

  const semesterOptions = useMemo(() => {
    const semSet = new Set(DEMO_MAHASISWA.map((m) => m.semester));
    return ['all', ...Array.from(semSet).sort((a, b) => a - b).map(String)];
  }, []);

  const tipeOptions = useMemo(() => {
    const tipeSet = new Set(DEMO_MAHASISWA.map((m) => m.tipe));
    return ['all', ...Array.from(tipeSet)];
  }, []);

  return {
    data,
    loading,
    error,
    fetchAll,
    getByNim,
    create,
    update,
    remove,
    filterAndSort,
    jurusanOptions,
    semesterOptions,
    tipeOptions,
  };
}
