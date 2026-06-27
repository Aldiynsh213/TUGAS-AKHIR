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

function getFieldValue(item: Mahasiswa, field: string): string | number {
  return ((item as unknown as Record<string, unknown>)[field] as string | number) ?? '';
}

function compare(a: string | number, b: string | number, ascending: boolean): number {
  let result: number;
  if (typeof a === 'string' && typeof b === 'string') {
    result = a.localeCompare(b);
  } else if (typeof a === 'number' && typeof b === 'number') {
    result = a - b;
  } else {
    result = String(a).localeCompare(String(b));
  }
  return ascending ? result : -result;
}

interface SortResult {
  results: Mahasiswa[];
  comparisons: number;
  swaps: number;
}

function insertionSort(data: Mahasiswa[], field: string, ascending: boolean): SortResult {
  const arr = [...data];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0) {
      comparisons++;
      if (compare(getFieldValue(arr[j], field), getFieldValue(key, field), ascending) > 0) {
        arr[j + 1] = arr[j];
        swaps++;
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
  }
  return { results: arr, comparisons, swaps };
}

function selectionSort(data: Mahasiswa[], field: string, ascending: boolean): SortResult {
  const arr = [...data];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      comparisons++;
      if (compare(getFieldValue(arr[j], field), getFieldValue(arr[minIdx], field), ascending) < 0) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
    }
  }
  return { results: arr, comparisons, swaps };
}

function bubbleSort(data: Mahasiswa[], field: string, ascending: boolean): SortResult {
  const arr = [...data];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (compare(getFieldValue(arr[j], field), getFieldValue(arr[j + 1], field), ascending) > 0) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return { results: arr, comparisons, swaps };
}

function shellSort(data: Mahasiswa[], field: string, ascending: boolean): SortResult {
  const arr = [...data];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let gap = Math.floor(n / 2);

  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap) {
        comparisons++;
        if (compare(getFieldValue(arr[j - gap], field), getFieldValue(temp, field), ascending) > 0) {
          arr[j] = arr[j - gap];
          swaps++;
          j -= gap;
        } else {
          break;
        }
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return { results: arr, comparisons, swaps };
}

function mergeSort(data: Mahasiswa[], field: string, ascending: boolean): SortResult {
  let comparisons = 0;
  let swaps = 0;

  function merge(left: Mahasiswa[], right: Mahasiswa[]): Mahasiswa[] {
    const result: Mahasiswa[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      comparisons++;
      if (compare(getFieldValue(left[i], field), getFieldValue(right[j], field), ascending) <= 0) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
        swaps++;
      }
    }
    while (i < left.length) {
      result.push(left[i]);
      i++;
    }
    while (j < right.length) {
      result.push(right[j]);
      j++;
    }
    return result;
  }

  function sort(arr: Mahasiswa[]): Mahasiswa[] {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = sort(arr.slice(0, mid));
    const right = sort(arr.slice(mid));
    return merge(left, right);
  }

  const results = sort([...data]);
  return { results, comparisons, swaps };
}

const complexityMap: Record<string, string> = {
  'insertion': 'O(n\u00B2)',
  'selection': 'O(n\u00B2)',
  'bubble': 'O(n\u00B2)',
  'shell': 'O(n log n)',
  'merge': 'O(n log n)',
};

export type SortAlgorithm = 'insertion' | 'selection' | 'bubble' | 'shell' | 'merge';
export type SortField = 'nim' | 'nama' | 'ipk' | 'semester' | 'tahun_masuk';

export function useSort() {
  const [results, setResults] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('insertion');
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [timeMs, setTimeMs] = useState(0);
  const [complexity, setComplexity] = useState('O(n\u00B2)');
  const [hasSorted, setHasSorted] = useState(false);
  const [originalIndices, setOriginalIndices] = useState<Map<string, number>>(new Map());

  const sort = useCallback((
    sortField: SortField,
    sortAlgorithm: SortAlgorithm,
    ascending: boolean
  ) => {
    setLoading(true);
    setError(null);
    setHasSorted(true);

    setTimeout(() => {
      try {
        const start = performance.now();
        let result: SortResult;

        // Track original indices
        const origMap = new Map<string, number>();
        DEMO_DATA.forEach((item, idx) => origMap.set(item.nim, idx));
        setOriginalIndices(origMap);

        switch (sortAlgorithm) {
          case 'insertion':
            result = insertionSort(DEMO_DATA, sortField, ascending);
            break;
          case 'selection':
            result = selectionSort(DEMO_DATA, sortField, ascending);
            break;
          case 'bubble':
            result = bubbleSort(DEMO_DATA, sortField, ascending);
            break;
          case 'shell':
            result = shellSort(DEMO_DATA, sortField, ascending);
            break;
          case 'merge':
            result = mergeSort(DEMO_DATA, sortField, ascending);
            break;
          default:
            result = insertionSort(DEMO_DATA, sortField, ascending);
        }

        const end = performance.now();

        setResults(result.results);
        setComparisons(result.comparisons);
        setSwaps(result.swaps);
        setTimeMs(parseFloat((end - start).toFixed(2)));
        setAlgorithm(sortAlgorithm);
        setComplexity(complexityMap[sortAlgorithm] || 'O(n\u00B2)');
        setLoading(false);
      } catch {
        setError('Terjadi kesalahan saat mengurutkan data');
        setLoading(false);
      }
    }, 300);
  }, []);

  return {
    results,
    loading,
    error,
    sort,
    algorithm,
    comparisons,
    swaps,
    timeMs,
    complexity,
    hasSorted,
    originalIndices,
  };
}
