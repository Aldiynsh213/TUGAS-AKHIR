import { useState, useCallback } from 'react';
import type { Mahasiswa } from '@/types';

const DEMO_DATA: Mahasiswa[] = [
  { nim: "21010001", nama: "Ahmad Rizky", jurusan: "Informatika", semester: 6, ipk: 3.75, tahun_masuk: 2021, jenis_kelamin: "Laki-laki", email: "ahmad@student.ac.id", no_telepon: "081234567890", tipe: "Sarjana (S1)" },
  { nim: "21010002", nama: "Siti Nurhaliza", jurusan: "Sistem Informasi", semester: 4, ipk: 3.50, tahun_masuk: 2022, jenis_kelamin: "Perempuan", email: "siti@student.ac.id", no_telepon: "082345678901", tipe: "Sarjana (S1)" },
  { nim: "21010003", nama: "Budi Hartono", jurusan: "Teknik Elektro", semester: 8, ipk: 3.20, tahun_masuk: 2020, jenis_kelamin: "Laki-laki", email: "budi@student.ac.id", no_telepon: "083456789012", tipe: "Sarjana (S1)" },
  { nim: "22020001", nama: "Maya Anggraini", jurusan: "Manajemen", semester: 2, ipk: 3.85, tahun_masuk: 2023, jenis_kelamin: "Perempuan", email: "maya@student.ac.id", no_telepon: "084567890123", tipe: "Magister (S2)" },
  { nim: "21010004", nama: "Doni Kusuma", jurusan: "Akuntansi", semester: 5, ipk: 2.90, tahun_masuk: 2021, jenis_kelamin: "Laki-laki", email: "doni@student.ac.id", no_telepon: "085678901234", tipe: "Sarjana (S1)" },
  { nim: "21010005", nama: "Rina Wulandari", jurusan: "Psikologi", semester: 3, ipk: 3.60, tahun_masuk: 2022, jenis_kelamin: "Perempuan", email: "rina@student.ac.id", no_telepon: "086789012345", tipe: "Sarjana (S1)" },
  { nim: "22020002", nama: "Fajar Pratama", jurusan: "Hukum", semester: 4, ipk: 3.40, tahun_masuk: 2021, jenis_kelamin: "Laki-laki", email: "fajar@student.ac.id", no_telepon: "087890123456", tipe: "Magister (S2)" },
  { nim: "21010006", nama: "Dewi Lestari", jurusan: "Kedokteran", semester: 7, ipk: 3.90, tahun_masuk: 2020, jenis_kelamin: "Perempuan", email: "dewi@student.ac.id", no_telepon: "088901234567", tipe: "Sarjana (S1)" },
  { nim: "21010007", nama: "Eka Putra", jurusan: "Informatika", semester: 2, ipk: 3.15, tahun_masuk: 2023, jenis_kelamin: "Laki-laki", email: "eka@student.ac.id", no_telepon: "089012345678", tipe: "Sarjana (S1)" },
  { nim: "22020003", nama: "Lina Marlina", jurusan: "Ekonomi", semester: 6, ipk: 3.70, tahun_masuk: 2020, jenis_kelamin: "Perempuan", email: "lina@student.ac.id", no_telepon: "081112223334", tipe: "Magister (S2)" },
];

function getFieldValue(item: Mahasiswa, field: string): string {
  return String(((item as unknown as Record<string, unknown>)[field] as unknown) ?? '').toLowerCase();
}

function linearSearch(
  data: Mahasiswa[],
  keyword: string,
  field: string
): { results: Mahasiswa[]; comparisons: number } {
  const results: Mahasiswa[] = [];
  let comparisons = 0;
  const kw = keyword.toLowerCase();

  for (let i = 0; i < data.length; i++) {
    comparisons++;
    if (getFieldValue(data[i], field).includes(kw)) {
      results.push(data[i]);
    }
  }
  return { results, comparisons };
}

function sequentialSearch(
  data: Mahasiswa[],
  keyword: string,
  field: string
): { results: Mahasiswa[]; comparisons: number } {
  const results: Mahasiswa[] = [];
  let comparisons = 0;
  const kw = keyword.toLowerCase();

  // Sequential: first sort the data, then search sequentially
  const sortedData = [...data].sort((a, b) => {
    const av = getFieldValue(a, field);
    const bv = getFieldValue(b, field);
    return av.localeCompare(bv);
  });

  for (let i = 0; i < sortedData.length; i++) {
    comparisons++;
    const val = getFieldValue(sortedData[i], field);
    if (val.includes(kw)) {
      results.push(sortedData[i]);
    }
    // Early stop only if the field is strictly greater than keyword and data is sorted
    if (val > kw && !val.includes(kw)) {
      // Continue searching in case there are matches after (since keyword could be substring)
      // Only stop if exact search and value > keyword
      if (!kw || (val > kw && field !== 'nama')) {
        // For substring search, we can't early stop safely
        // So we continue
      }
    }
  }
  return { results, comparisons };
}

function binarySearch(
  data: Mahasiswa[],
  keyword: string,
  field: string
): { results: Mahasiswa[]; comparisons: number } {
  // Binary search requires sorted data - we sort first
  const sortedData = [...data].sort((a, b) => {
    const av = getFieldValue(a, field);
    const bv = getFieldValue(b, field);
    return av.localeCompare(bv);
  });

  let comparisons = 0;
  const kw = keyword.toLowerCase();

  // Find a matching element using binary search
  let left = 0;
  let right = sortedData.length - 1;
  let foundIndex = -1;

  while (left <= right) {
    comparisons++;
    const mid = Math.floor((left + right) / 2);
    const midVal = getFieldValue(sortedData[mid], field);

    if (midVal === kw || midVal.includes(kw)) {
      foundIndex = mid;
      break;
    }
    if (midVal < kw) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Binary search is best for exact matches. For substring matching,
  // we collect all matches by scanning nearby elements
  const results: Mahasiswa[] = [];
  if (foundIndex !== -1) {
    // Add the found item
    if (getFieldValue(sortedData[foundIndex], field).includes(kw)) {
      results.push(sortedData[foundIndex]);
    }
    // Scan left and right for additional substring matches
    // (since binary search only finds one position)
    for (let i = 0; i < sortedData.length; i++) {
      if (i !== foundIndex) {
        comparisons++;
        if (getFieldValue(sortedData[i], field).includes(kw)) {
          results.push(sortedData[i]);
        }
      }
    }
  } else {
    // Binary search didn't find exact match, do linear scan for substring matches
    // (This is a practical approach - pure binary search doesn't support substring matching)
    for (let i = 0; i < sortedData.length; i++) {
      comparisons++;
      if (getFieldValue(sortedData[i], field).includes(kw)) {
        results.push(sortedData[i]);
      }
    }
  }

  return { results, comparisons };
}

const complexityMap: Record<string, string> = {
  'linear': 'O(n)',
  'sequential': 'O(n)',
  'binary': 'O(log n)',
};

export function useSearch() {
  const [results, setResults] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState('linear');
  const [comparisons, setComparisons] = useState(0);
  const [timeMs, setTimeMs] = useState(0);
  const [complexity, setComplexity] = useState('O(n)');
  const [hasSearched, setHasSearched] = useState(false);
  const [keyword, setKeyword] = useState('');

  const search = useCallback((
    searchKeyword: string,
    searchField: string,
    searchAlgorithm: string
  ) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setKeyword(searchKeyword);

    // Simulate async processing
    setTimeout(() => {
      try {
        const start = performance.now();
        let result;

        switch (searchAlgorithm) {
          case 'binary':
            result = binarySearch(DEMO_DATA, searchKeyword, searchField);
            break;
          case 'sequential':
            result = sequentialSearch(DEMO_DATA, searchKeyword, searchField);
            break;
          case 'linear':
          default:
            result = linearSearch(DEMO_DATA, searchKeyword, searchField);
            break;
        }

        const end = performance.now();

        setResults(result.results);
        setComparisons(result.comparisons);
        setTimeMs(parseFloat((end - start).toFixed(2)));
        setAlgorithm(searchAlgorithm);
        setComplexity(complexityMap[searchAlgorithm] || 'O(n)');
        setLoading(false);
      } catch {
        setError('Terjadi kesalahan saat mencari data');
        setLoading(false);
      }
    }, 300);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    algorithm,
    comparisons,
    timeMs,
    complexity,
    hasSearched,
    keyword,
  };
}
