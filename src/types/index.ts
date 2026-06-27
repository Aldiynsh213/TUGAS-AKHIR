export interface Mahasiswa {
  nim: string;
  nama: string;
  jurusan: string;
  semester: number;
  ipk: number;
  tahun_masuk: number;
  jenis_kelamin: string;
  email: string;
  no_telepon: string;
  tipe: string;
  judul_skripsi?: string;
  dosen_pembimbing?: string;
  anggota_ukm?: string[];
  judul_tesis?: string;
  dosen_promotor?: string;
  beasiswa?: string;
  publikasi_jurnal?: number;
  info_tambahan?: string;
}

export interface SearchResult {
  results: Mahasiswa[];
  comparisons: number;
  time_ms: number;
  algorithm: string;
  complexity: string;
}

export interface SortResult {
  results: Mahasiswa[];
  comparisons: number;
  swaps: number;
  time_ms: number;
  algorithm: string;
  complexity: string;
}

export interface ComplexityInfo {
  time: string;
  space: string;
  best: string;
  worst: string;
  avg: string;
  description: string;
  pseudocode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface StatsData {
  total_mahasiswa: number;
  rata_rata_ipk: number;
  total_s1: number;
  total_s2: number;
  distribusi_jurusan: Record<string, number>;
  distribusi_ipk: { range: string; count: number }[];
}
