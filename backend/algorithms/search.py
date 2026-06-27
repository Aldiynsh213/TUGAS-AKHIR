"""
Algoritma pencarian untuk data mahasiswa.

Menyediakan tiga algoritma pencarian:
1. Linear Search - O(n): iterasi semua elemen, cocok untuk data tidak terurut
2. Sequential Search - O(n): index-based loop pattern, mirip linear
3. Binary Search - O(log n): divide and conquer, MEMERLUKAN data terurut

Semua fungsi mengembalikan tuple: (results, comparisons, time_ms)
"""

import time
from typing import Any, Optional


def _get_field_value(item: dict, field: str) -> str:
    """
    Helper untuk mendapatkan nilai field dari dictionary.
    Menangani nested dict untuk field info_tambahan.
    """
    if field in item:
        return str(item[field]).lower()
    # Coba cari di info_tambahan
    if "info_tambahan" in item and isinstance(item["info_tambahan"], dict):
        return str(item["info_tambahan"].get(field, "")).lower()
    return ""


def linear_search(
    data: list[dict],
    keyword: str,
    field: str = "nama",
) -> tuple[list[dict], int, float]:
    """
    Linear Search - O(n).

    Algoritma pencarian linear yang memeriksa setiap elemen
    secara berurutan dari awal hingga akhir list.
    Cocok untuk data yang tidak terurut.

    Args:
        data: List dictionary data mahasiswa
        keyword: Kata kunci pencarian
        field: Field yang akan dicari (default: 'nama')

    Returns:
        Tuple (results, comparisons, time_ms)
        - results: List data yang cocok
        - comparisons: Jumlah perbandingan yang dilakukan
        - time_ms: Waktu eksekusi dalam milidetik
    """
    start_time = time.perf_counter()
    results = []
    comparisons = 0
    keyword_lower = str(keyword).lower()

    for item in data:
        comparisons += 1
        field_value = _get_field_value(item, field)
        if keyword_lower in field_value:
            results.append(item)

    elapsed_ms = (time.perf_counter() - start_time) * 1000
    return results, comparisons, elapsed_ms


def sequential_search(
    data: list[dict],
    keyword: str,
    field: str = "nama",
) -> tuple[list[dict], int, float]:
    """
    Sequential Search - O(n).

    Algoritma pencarian sequential dengan index-based iteration.
    Secara fungsional mirip linear search tetapi menggunakan
    while loop dengan counter index.

    Args:
        data: List dictionary data mahasiswa
        keyword: Kata kunci pencarian
        field: Field yang akan dicari (default: 'nama')

    Returns:
        Tuple (results, comparisons, time_ms)
        - results: List data yang cocok
        - comparisons: Jumlah perbandingan yang dilakukan
        - time_ms: Waktu eksekusi dalam milidetik
    """
    start_time = time.perf_counter()
    results = []
    comparisons = 0
    keyword_lower = str(keyword).lower()
    index = 0
    n = len(data)

    while index < n:
        comparisons += 1
        field_value = _get_field_value(data[index], field)
        if keyword_lower in field_value:
            results.append(data[index])
        index += 1

    elapsed_ms = (time.perf_counter() - start_time) * 1000
    return results, comparisons, elapsed_ms


def binary_search(
    data: list[dict],
    keyword: str,
    field: str = "nim",
    sort_by_nim_first: bool = True,
) -> tuple[list[dict], int, float]:
    """
    Binary Search - O(log n).

    Algoritma pencarian biner yang membagi data menjadi dua bagian
    secara berulang. MEMERLUKAN data yang sudah terurut.
    Jika data belum terurut, akan diurutkan terlebih dahulu.

    Karena binary search pada dasarnya mencari exact match,
    fungsi ini juga melakukan pencarian sekitar untuk menangani
    substring matching (mirip linear search pada hasil).

    Args:
        data: List dictionary data mahasiswa
        keyword: Kata kunci pencarian (exact match pada binary search)
        field: Field yang akan dicari (default: 'nim')
        sort_by_nim_first: Jika True, urutkan data terlebih dahulu

    Returns:
        Tuple (results, comparisons, time_ms)
        - results: List data yang cocok
        - comparisons: Jumlah perbandingan yang dilakukan
        - time_ms: Waktu eksekusi dalam milidetik
    """
    start_time = time.perf_counter()
    results = []
    comparisons = 0
    keyword_lower = str(keyword).lower()

    if not data:
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        return results, comparisons, elapsed_ms

    # Binary search memerlukan data terurut
    # Buat salinan agar tidak memodifikasi data asli
    sorted_data = list(data)
    if sort_by_nim_first:
        # Sort menggunakan bubble sort sederhana untuk NIM
        n = len(sorted_data)
        for i in range(n):
            for j in range(0, n - i - 1):
                val_j = _get_field_value(sorted_data[j], field)
                val_j1 = _get_field_value(sorted_data[j + 1], field)
                if val_j > val_j1:
                    sorted_data[j], sorted_data[j + 1] = sorted_data[j + 1], sorted_data[j]

    # Binary search untuk exact match
    left = 0
    right = len(sorted_data) - 1
    found_index = -1

    while left <= right:
        mid = (left + right) // 2
        comparisons += 1
        mid_value = _get_field_value(sorted_data[mid], field)

        if mid_value == keyword_lower:
            found_index = mid
            break
        elif mid_value < keyword_lower:
            left = mid + 1
        else:
            right = mid - 1

    # Jika exact match ditemukan, cari juga elemen sekitarnya
    # (untuk menangani duplicate values)
    if found_index >= 0:
        results.append(sorted_data[found_index])

        # Cari ke kiri
        left_idx = found_index - 1
        while left_idx >= 0:
            comparisons += 1
            if _get_field_value(sorted_data[left_idx], field) == keyword_lower:
                results.insert(0, sorted_data[left_idx])
                left_idx -= 1
            else:
                break

        # Cari ke kanan
        right_idx = found_index + 1
        while right_idx < len(sorted_data):
            comparisons += 1
            if _get_field_value(sorted_data[right_idx], field) == keyword_lower:
                results.append(sorted_data[right_idx])
                right_idx += 1
            else:
                break

    # Jika tidak ada exact match, fallback ke linear search substring
    if not results:
        comparisons += 1  # Count the failed exact match
        for item in sorted_data:
            comparisons += 1
            field_value = _get_field_value(item, field)
            if keyword_lower in field_value:
                results.append(item)

    elapsed_ms = (time.perf_counter() - start_time) * 1000
    return results, comparisons, elapsed_ms
