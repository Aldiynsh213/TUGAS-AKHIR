"""
Complexity Analyzer untuk memberikan informasi kompleksitas algoritma.

Menyediakan deskripsi, kompleksitas waktu/ruang, dan pseudocode
untuk semua algoritma pencarian dan pengurutan yang tersedia.
"""

from typing import Any, Optional


class ComplexityAnalyzer:
    """
    Analyzer yang menyediakan informasi kompleksitas algoritma.

    Data disimpan dalam dictionary yang dapat diakses secara statis
    maupun melalui method helper.
    """

    # Data kompleksitas untuk algoritma pencarian
    SEARCH_ALGORITHMS = {
        "linear_search": {
            "name": "Linear Search",
            "category": "search",
            "time_complexity": {
                "best": "O(1)",
                "average": "O(n)",
                "worst": "O(n)",
            },
            "space_complexity": "O(1)",
            "description": (
                "Algoritma pencarian linear yang memeriksa setiap elemen "
                "secara berurutan dari awal hingga akhir list. "
                "Cocok untuk data yang tidak terurut."
            ),
            "pseudocode": """
function linear_search(list, keyword, field):
    results = []
    comparisons = 0
    for each item in list:
        comparisons += 1
        if item[field] contains keyword:
            append item to results
    return (results, comparisons)
""",
        },
        "sequential_search": {
            "name": "Sequential Search",
            "category": "search",
            "time_complexity": {
                "best": "O(1)",
                "average": "O(n)",
                "worst": "O(n)",
            },
            "space_complexity": "O(1)",
            "description": (
                "Algoritma pencarian sequential dengan pattern loop yang berbeda, "
                "menggunakan index-based iteration. "
                "Secara fungsional mirip linear search tetapi dengan implementasi loop berbeda."
            ),
            "pseudocode": """
function sequential_search(list, keyword, field):
    results = []
    comparisons = 0
    i = 0
    while i < length(list):
        comparisons += 1
        if list[i][field] contains keyword:
            append list[i] to results
        i += 1
    return (results, comparisons)
""",
        },
        "binary_search": {
            "name": "Binary Search",
            "category": "search",
            "time_complexity": {
                "best": "O(1)",
                "average": "O(log n)",
                "worst": "O(log n)",
            },
            "space_complexity": "O(1)",
            "description": (
                "Algoritma pencarian biner yang membagi data menjadi dua bagian "
                "secara berulang. MEMERLUKAN data yang sudah terurut terlebih dahulu. "
                "Sangat efisien untuk dataset besar."
            ),
            "pseudocode": """
function binary_search(list, keyword, field):
    sort list by field first
    results = []
    comparisons = 0
    left = 0
    right = length(list) - 1
    found_index = -1

    while left <= right:
        mid = (left + right) // 2
        comparisons += 1
        if list[mid][field] == keyword:
            found_index = mid
            break
        elif list[mid][field] < keyword:
            left = mid + 1
        else:
            right = mid - 1

    if found_index >= 0:
        # Cari semua kemunculan yang sama (handle duplicates)
        append list[found_index] to results
        expand_search_for_duplicates(list, found_index, keyword, field)
    return (results, comparisons)
""",
        },
    }

    # Data kompleksitas untuk algoritma pengurutan
    SORT_ALGORITHMS = {
        "insertion_sort": {
            "name": "Insertion Sort",
            "category": "sort",
            "time_complexity": {
                "best": "O(n)",
                "average": "O(n\u00b2)",
                "worst": "O(n\u00b2)",
            },
            "space_complexity": "O(1)",
            "description": (
                "Algoritma pengurutan insertion yang membangun sorted array "
                "satu elemen pada satu waktu. Mengambil elemen berikutnya dan "
                "menyisipkannya ke posisi yang benar di bagian yang sudah terurut. "
                "Efisien untuk data yang hampir terurut."
            ),
            "pseudocode": """
function insertion_sort(list, field, ascending):
    comparisons = 0
    swaps = 0
    for i from 1 to length(list) - 1:
        key = list[i]
        j = i - 1
        while j >= 0 and compare(list[j], key, field):
            comparisons += 1
            list[j + 1] = list[j]
            swaps += 1
            j -= 1
        list[j + 1] = key
        if j >= 0:
            comparisons += 1
    return (list, comparisons, swaps)
""",
        },
        "selection_sort": {
            "name": "Selection Sort",
            "category": "sort",
            "time_complexity": {
                "best": "O(n\u00b2)",
                "average": "O(n\u00b2)",
                "worst": "O(n\u00b2)",
            },
            "space_complexity": "O(1)",
            "description": (
                "Algoritma pengurutan selection yang membagi list menjadi "
                "bagian terurut dan belum terurut. Secara berulang mencari "
                "elemen minimum dari bagian belum terurut dan menempatkannya "
                "di akhir bagian terurut."
            ),
            "pseudocode": """
function selection_sort(list, field, ascending):
    comparisons = 0
    swaps = 0
    n = length(list)
    for i from 0 to n - 1:
        min_idx = i
        for j from i + 1 to n - 1:
            comparisons += 1
            if list[j][field] < list[min_idx][field]:
                min_idx = j
        if min_idx != i:
            swap(list[i], list[min_idx])
            swaps += 1
    return (list, comparisons, swaps)
""",
        },
        "bubble_sort": {
            "name": "Bubble Sort",
            "category": "sort",
            "time_complexity": {
                "best": "O(n)",
                "average": "O(n\u00b2)",
                "worst": "O(n\u00b2)",
            },
            "space_complexity": "O(1)",
            "description": (
                "Algoritma pengurutan bubble yang secara berulang melangkah "
                "melalui list, membandingkan elemen bersebelahan dan menukarnya "
                "jika urutannya salah. Proses ini berulang hingga tidak ada "
                "lagi pertukaran yang dilakukan."
            ),
            "pseudocode": """
function bubble_sort(list, field, ascending):
    comparisons = 0
    swaps = 0
    n = length(list)
    for i from 0 to n - 1:
        swapped = false
        for j from 0 to n - i - 2:
            comparisons += 1
            if list[j][field] > list[j + 1][field]:
                swap(list[j], list[j + 1])
                swaps += 1
                swapped = true
        if not swapped:
            break  // Early termination jika sudah terurut
    return (list, comparisons, swaps)
""",
        },
        "shell_sort": {
            "name": "Shell Sort",
            "category": "sort",
            "time_complexity": {
                "best": "O(n log n)",
                "average": "O(n(log n)\u00b2)",
                "worst": "O(n\u00b2)",
            },
            "space_complexity": "O(1)",
            "description": (
                "Algoritma pengurutan shell yang merupakan generalisasi dari "
                "insertion sort. Memulai dengan gap besar antara elemen yang "
                "dibandingkan, kemudian secara bertahap mengurangi gap hingga 1. "
                "Lebih efisien dari insertion sort untuk dataset besar."
            ),
            "pseudocode": """
function shell_sort(list, field, ascending):
    comparisons = 0
    swaps = 0
    n = length(list)
    gap = n // 2
    while gap > 0:
        for i from gap to n - 1:
            temp = list[i]
            j = i
            while j >= gap and list[j - gap][field] > temp[field]:
                comparisons += 1
                list[j] = list[j - gap]
                swaps += 1
                j -= gap
            list[j] = temp
            if j >= gap:
                comparisons += 1
        gap = gap // 2
    return (list, comparisons, swaps)
""",
        },
        "merge_sort": {
            "name": "Merge Sort",
            "category": "sort",
            "time_complexity": {
                "best": "O(n log n)",
                "average": "O(n log n)",
                "worst": "O(n log n)",
            },
            "space_complexity": "O(n)",
            "description": (
                "Algoritma pengurutan merge menggunakan pendekatan divide-and-conquer. "
                "Membagi array menjadi dua bagian, mengurutkan masing-masing bagian "
                "secara rekursif, kemudian menggabungkan hasilnya. "
                "Kompleksitas waktu selalu O(n log n) untuk semua kasus."
            ),
            "pseudocode": """
function merge_sort(list, field, ascending):
    comparisons = 0
    swaps = 0

    function merge(left, right):
        result = []
        while left and right:
            comparisons += 1
            if left[0][field] <= right[0][field]:
                append left.pop(0) to result
            else:
                append right.pop(0) to result
                swaps += 1
        append remaining left elements to result
        append remaining right elements to result
        return result

    if length(list) <= 1:
        return (list, comparisons, swaps)
    mid = length(list) // 2
    left_half = list[0:mid]
    right_half = list[mid:]
    left_sorted = merge_sort(left_half, field, ascending)
    right_sorted = merge_sort(right_half, field, ascending)
    merged = merge(left_sorted[0], right_sorted[0])
    return (merged, comparisons, swaps)
""",
        },
    }

    @classmethod
    def get_all(cls) -> dict[str, dict]:
        """
        Dapatkan informasi kompleksitas semua algoritma.

        Returns:
            Dictionary dengan key nama algoritma dan value info kompleksitas
        """
        all_algorithms = {}
        all_algorithms.update(cls.SEARCH_ALGORITHMS)
        all_algorithms.update(cls.SORT_ALGORITHMS)
        return all_algorithms

    @classmethod
    def get_search_algorithms(cls) -> dict[str, dict]:
        """
        Dapatkan informasi kompleksitas algoritma pencarian.

        Returns:
            Dictionary algoritma pencarian
        """
        return cls.SEARCH_ALGORITHMS.copy()

    @classmethod
    def get_sort_algorithms(cls) -> dict[str, dict]:
        """
        Dapatkan informasi kompleksitas algoritma pengurutan.

        Returns:
            Dictionary algoritma pengurutan
        """
        return cls.SORT_ALGORITHMS.copy()

    @classmethod
    def get_algorithm(cls, name: str) -> Optional[dict]:
        """
        Dapatkan informasi kompleksitas algoritma tertentu.

        Args:
            name: Nama algoritma (misal: 'binary_search', 'merge_sort')

        Returns:
            Dictionary info kompleksitas atau None jika tidak ditemukan
        """
        all_algorithms = cls.get_all()
        return all_algorithms.get(name)

    @classmethod
    def get_multiple(cls, names: list[str]) -> dict[str, dict]:
        """
        Dapatkan informasi kompleksitas untuk beberapa algoritma.

        Args:
            names: List nama algoritma

        Returns:
            Dictionary dengan algoritma yang ditemukan
        """
        all_algorithms = cls.get_all()
        result = {}
        for name in names:
            if name in all_algorithms:
                result[name] = all_algorithms[name]
        return result

    @classmethod
    def compare(cls, names: list[str]) -> list[dict]:
        """
        Bandingkan kompleksitas beberapa algoritma secara berdampingan.

        Args:
            names: List nama algoritma yang akan dibandingkan

        Returns:
            List dictionary perbandingan kompleksitas
        """
        all_algorithms = cls.get_all()
        comparison = []

        for name in names:
            if name in all_algorithms:
                algo = all_algorithms[name]
                comparison.append(
                    {
                        "algorithm": name,
                        "name": algo["name"],
                        "time_best": algo["time_complexity"]["best"],
                        "time_average": algo["time_complexity"]["average"],
                        "time_worst": algo["time_complexity"]["worst"],
                        "space": algo["space_complexity"],
                        "category": algo["category"],
                    }
                )

        return comparison

    @classmethod
    def validate_algorithm(cls, name: str, category: str = None) -> bool:
        """
        Validasi apakah nama algoritma tersedia.

        Args:
            name: Nama algoritma
            category: Kategori opsional ('search' atau 'sort')

        Returns:
            True jika algoritma valid
        """
        if category == "search":
            return name in cls.SEARCH_ALGORITHMS
        elif category == "sort":
            return name in cls.SORT_ALGORITHMS
        else:
            return name in cls.get_all()
