"""
Algoritma pengurutan untuk data mahasiswa.

Menyediakan lima algoritma pengurutan:
1. Insertion Sort - O(n^2): menyisipkan elemen ke posisi yang benar
2. Selection Sort - O(n^2): mencari minimum dan menukarnya
3. Bubble Sort - O(n^2): menukar elemen bersebelahan
4. Shell Sort - O(n log n) to O(n^2): generalisasi insertion sort dengan gap
5. Merge Sort - O(n log n): divide and conquer, selalu stabil

Semua fungsi mengembalikan tuple: (sorted_list, comparisons, swaps, time_ms)
"""

import time
from typing import Any, Callable


def _get_sort_key(item: dict, field: str) -> Any:
    """
    Helper untuk mendapatkan nilai field yang akan diurutkan.
    Menangani tipe data berbeda (string, int, float).
    """
    value = item.get(field)
    if value is None:
        # Coba cari di info_tambahan
        info = item.get("info_tambahan", {})
        if isinstance(info, dict):
            value = info.get(field, "")
        else:
            value = ""

    # Konversi ke tipe yang dapat dibandingkan
    if field in ("ipk",):
        try:
            return float(value) if value is not None else 0.0
        except (ValueError, TypeError):
            return 0.0
    elif field in ("semester", "tahun_angkatan"):
        try:
            return int(value) if value is not None else 0
        except (ValueError, TypeError):
            return 0
    else:
        return str(value).lower() if value is not None else ""


def _compare(a: Any, b: Any, ascending: bool = True) -> bool:
    """
    Helper untuk membandingkan dua nilai.

    Args:
        a: Nilai pertama
        b: Nilai kedua
        ascending: True untuk ascending, False untuk descending

    Returns:
        True jika a dan b perlu ditukar
    """
    if ascending:
        return a > b
    else:
        return a < b


def insertion_sort(
    data: list[dict],
    field: str = "nama",
    ascending: bool = True,
) -> tuple[list[dict], int, int, float]:
    """
    Insertion Sort - O(n^2).

    Membangun sorted array satu elemen pada satu waktu.
    Mengambil elemen berikutnya dan menyisipkannya ke posisi yang benar
    di bagian yang sudah terurut. Efisien untuk data yang hampir terurut.

    Args:
        data: List dictionary data mahasiswa
        field: Field yang akan diurutkan (default: 'nama')
        ascending: True untuk ascending, False untuk descending

    Returns:
        Tuple (sorted_list, comparisons, swaps, time_ms)
    """
    start_time = time.perf_counter()
    arr = [item.copy() for item in data]  # Buat salinan
    comparisons = 0
    swaps = 0
    n = len(arr)

    for i in range(1, n):
        key = arr[i]
        key_value = _get_sort_key(key, field)
        j = i - 1

        while j >= 0:
            comparisons += 1
            j_value = _get_sort_key(arr[j], field)
            if _compare(j_value, key_value, ascending):
                arr[j + 1] = arr[j]
                swaps += 1
                j -= 1
            else:
                break
        arr[j + 1] = key

    elapsed_ms = (time.perf_counter() - start_time) * 1000
    return arr, comparisons, swaps, elapsed_ms


def selection_sort(
    data: list[dict],
    field: str = "nama",
    ascending: bool = True,
) -> tuple[list[dict], int, int, float]:
    """
    Selection Sort - O(n^2).

    Membagi list menjadi bagian terurut dan belum terurut.
    Secara berulang mencari elemen minimum/maksimum dari bagian belum terurut
    dan menempatkannya di akhir bagian terurut.

    Args:
        data: List dictionary data mahasiswa
        field: Field yang akan diurutkan (default: 'nama')
        ascending: True untuk ascending, False untuk descending

    Returns:
        Tuple (sorted_list, comparisons, swaps, time_ms)
    """
    start_time = time.perf_counter()
    arr = [item.copy() for item in data]
    comparisons = 0
    swaps = 0
    n = len(arr)

    for i in range(n):
        target_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            j_value = _get_sort_key(arr[j], field)
            target_value = _get_sort_key(arr[target_idx], field)

            # Untuk ascending: cari minimum; untuk descending: cari maksimum
            if ascending:
                if j_value < target_value:
                    target_idx = j
            else:
                if j_value > target_value:
                    target_idx = j

        if target_idx != i:
            arr[i], arr[target_idx] = arr[target_idx], arr[i]
            swaps += 1

    elapsed_ms = (time.perf_counter() - start_time) * 1000
    return arr, comparisons, swaps, elapsed_ms


def bubble_sort(
    data: list[dict],
    field: str = "nama",
    ascending: bool = True,
) -> tuple[list[dict], int, int, float]:
    """
    Bubble Sort - O(n^2).

    Secara berulang melangkah melalui list, membandingkan elemen bersebelahan
    dan menukarnya jika urutannya salah. Proses berulang hingga
    tidak ada lagi pertukaran yang dilakukan (early termination).

    Args:
        data: List dictionary data mahasiswa
        field: Field yang akan diurutkan (default: 'nama')
        ascending: True untuk ascending, False untuk descending

    Returns:
        Tuple (sorted_list, comparisons, swaps, time_ms)
    """
    start_time = time.perf_counter()
    arr = [item.copy() for item in data]
    comparisons = 0
    swaps = 0
    n = len(arr)

    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            comparisons += 1
            j_value = _get_sort_key(arr[j], field)
            j1_value = _get_sort_key(arr[j + 1], field)

            need_swap = _compare(j_value, j1_value, ascending)
            if need_swap:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swaps += 1
                swapped = True

        # Early termination: jika tidak ada swap, array sudah terurut
        if not swapped:
            break

    elapsed_ms = (time.perf_counter() - start_time) * 1000
    return arr, comparisons, swaps, elapsed_ms


def shell_sort(
    data: list[dict],
    field: str = "nama",
    ascending: bool = True,
) -> tuple[list[dict], int, int, float]:
    """
    Shell Sort - O(n log n) to O(n^2).

    Generalisasi dari insertion sort. Memulai dengan gap besar
    antara elemen yang dibandingkan, kemudian secara bertahap
    mengurangi gap hingga 1. Lebih efisien dari insertion sort
    untuk dataset besar.

    Args:
        data: List dictionary data mahasiswa
        field: Field yang akan diurutkan (default: 'nama')
        ascending: True untuk ascending, False untuk descending

    Returns:
        Tuple (sorted_list, comparisons, swaps, time_ms)
    """
    start_time = time.perf_counter()
    arr = [item.copy() for item in data]
    comparisons = 0
    swaps = 0
    n = len(arr)
    gap = n // 2

    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            temp_value = _get_sort_key(temp, field)
            j = i

            while j >= gap:
                comparisons += 1
                gap_j_value = _get_sort_key(arr[j - gap], field)
                if _compare(gap_j_value, temp_value, ascending):
                    arr[j] = arr[j - gap]
                    swaps += 1
                    j -= gap
                else:
                    break
            arr[j] = temp

        gap = gap // 2

    elapsed_ms = (time.perf_counter() - start_time) * 1000
    return arr, comparisons, swaps, elapsed_ms


def merge_sort(
    data: list[dict],
    field: str = "nama",
    ascending: bool = True,
) -> tuple[list[dict], int, int, float]:
    """
    Merge Sort - O(n log n).

    Algoritma pengurutan menggunakan pendekatan divide-and-conquer.
    Membagi array menjadi dua bagian, mengurutkan masing-masing bagian
    secara rekursif, kemudian menggabungkan hasilnya.
    Kompleksitas waktu selalu O(n log n) untuk semua kasus.

    Args:
        data: List dictionary data mahasiswa
        field: Field yang akan diurutkan (default: 'nama')
        ascending: True untuk ascending, False untuk descending

    Returns:
        Tuple (sorted_list, comparisons, swaps, time_ms)
    """
    start_time = time.perf_counter()
    arr = [item.copy() for item in data]
    comparisons = [0]  # Mutable counter untuk pass by reference
    swaps = [0]

    def _merge(left: list[dict], right: list[dict]) -> list[dict]:
        """Helper: Merge dua list terurut."""
        result = []
        i = j = 0

        while i < len(left) and j < len(right):
            comparisons[0] += 1
            left_value = _get_sort_key(left[i], field)
            right_value = _get_sort_key(right[j], field)

            if ascending:
                if left_value <= right_value:
                    result.append(left[i])
                    i += 1
                else:
                    result.append(right[j])
                    swaps[0] += 1
                    j += 1
            else:
                if left_value >= right_value:
                    result.append(left[i])
                    i += 1
                else:
                    result.append(right[j])
                    swaps[0] += 1
                    j += 1

        # Append remaining elements
        result.extend(left[i:])
        result.extend(right[j:])
        return result

    def _sort(sub_arr: list[dict]) -> list[dict]:
        """Helper: Recursive merge sort."""
        if len(sub_arr) <= 1:
            return sub_arr

        mid = len(sub_arr) // 2
        left_half = _sort(sub_arr[:mid])
        right_half = _sort(sub_arr[mid:])
        return _merge(left_half, right_half)

    sorted_arr = _sort(arr)
    elapsed_ms = (time.perf_counter() - start_time) * 1000
    return sorted_arr, comparisons[0], swaps[0], elapsed_ms
