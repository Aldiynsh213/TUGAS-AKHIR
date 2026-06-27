import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpDown,
  Clock,
  GitCompare,
  ArrowRightLeft,
  BarChart3,
  CheckCircle,
  BookOpen,
  ChevronRight,
  Copy,
  Check,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSort } from '@/hooks/useSort';
import type { Mahasiswa } from '@/types';

const sortAlgorithms = [
  {
    key: 'insertion' as const,
    label: 'Insertion Sort',
    complexity: 'O(n\u00B2)',
    desc: 'Cocok untuk data hampir terurut. Membandingkan dan menyisipkan elemen satu per satu.',
  },
  {
    key: 'selection' as const,
    label: 'Selection Sort',
    complexity: 'O(n\u00B2)',
    desc: 'Mencari elemen minimum dan menempatkkan di posisi yang benar secara berulang.',
  },
  {
    key: 'bubble' as const,
    label: 'Bubble Sort',
    complexity: 'O(n\u00B2)',
    desc: 'Membandingkan elemen bersebelahan dan menukar jika perlu. Sederhana namun lambat.',
  },
  {
    key: 'shell' as const,
    label: 'Shell Sort',
    complexity: 'O(n log n)',
    desc: 'Variasi Insertion Sort dengan gap yang mengecil. Lebih cepat untuk dataset medium.',
  },
  {
    key: 'merge' as const,
    label: 'Merge Sort',
    complexity: 'O(n log n)',
    desc: 'Divide and conquer. Membagi data, mengurutkan, lalu menggabungkan. Stabil dan konsisten.',
  },
];

const sortFields = [
  { value: 'nim', label: 'NIM' },
  { value: 'nama', label: 'Nama' },
  { value: 'ipk', label: 'IPK' },
  { value: 'semester', label: 'Semester' },
  { value: 'tahun_masuk', label: 'Tahun Masuk' },
];

const comparisonData = [
  {
    kriteria: 'Best Case',
    insertion: 'O(n)',
    selection: 'O(n\u00B2)',
    bubble: 'O(n)',
    shell: 'O(n log n)',
    merge: 'O(n log n)',
  },
  {
    kriteria: 'Average Case',
    insertion: 'O(n\u00B2)',
    selection: 'O(n\u00B2)',
    bubble: 'O(n\u00B2)',
    shell: 'O(n log n)',
    merge: 'O(n log n)',
  },
  {
    kriteria: 'Worst Case',
    insertion: 'O(n\u00B2)',
    selection: 'O(n\u00B2)',
    bubble: 'O(n\u00B2)',
    shell: 'O(n\u00B2)',
    merge: 'O(n log n)',
  },
  {
    kriteria: 'Space',
    insertion: 'O(1)',
    selection: 'O(1)',
    bubble: 'O(1)',
    shell: 'O(1)',
    merge: 'O(n)',
  },
  {
    kriteria: 'Stabil',
    insertion: 'Ya',
    selection: 'Tidak',
    bubble: 'Ya',
    shell: 'Tidak',
    merge: 'Ya',
  },
];

const pseudocodeMap: Record<string, { code: string; note: string }> = {
  insertion: {
    code: `function insertionSort(data):
    for i from 1 to length(data) - 1:
        key = data[i]
        j = i - 1
        while j >= 0 and data[j] > key:
            data[j + 1] = data[j]
            j = j - 1
        data[j + 1] = key
    return data`,
    note: 'Insertion Sort sangat efisien untuk data yang hampir terurut. Kompleksitas O(n) pada best case terjadi ketika data sudah terurut.',
  },
  selection: {
    code: `function selectionSort(data):
    for i from 0 to length(data) - 2:
        minIdx = i
        for j from i + 1 to length(data) - 1:
            if data[j] < data[minIdx]:
                minIdx = j
        swap(data[i], data[minIdx])
    return data`,
    note: 'Selection Sort selalu melakukan O(n\u00B2) perbandingan meskipun data sudah terurut. Tidak stabil karena pertukaran jarak jauh.',
  },
  bubble: {
    code: `function bubbleSort(data):
    n = length(data)
    for i from 0 to n - 2:
        swapped = false
        for j from 0 to n - i - 2:
            if data[j] > data[j + 1]:
                swap(data[j], data[j + 1])
                swapped = true
        if not swapped:
            break          // Data already sorted
    return data`,
    note: 'Bubble Sort sederhana tetapi lambat untuk data besar. Optimasi early termination (swapped flag) membantu pada data hampir terurut.',
  },
  shell: {
    code: `function shellSort(data):
    n = length(data)
    gap = n / 2
    while gap > 0:
        for i from gap to n - 1:
            temp = data[i]
            j = i
            while j >= gap and data[j - gap] > temp:
                data[j] = data[j - gap]
                j = j - gap
            data[j] = temp
        gap = gap / 2
    return data`,
    note: 'Shell Sort menggunakan gap sequence untuk mengurangi jumlah pergeseran. Performanya bergantung pada pilihan gap sequence.',
  },
  merge: {
    code: `function mergeSort(data):
    if length(data) <= 1:
        return data
    mid = length(data) / 2
    left = mergeSort(data[0..mid-1])
    right = mergeSort(data[mid..end])
    return merge(left, right)

function merge(left, right):
    result = []
    while left not empty and right not empty:
        if left[0] <= right[0]:
            append left[0] to result
        else:
            append right[0] to result
    append remaining elements
    return result`,
    note: 'Merge Sort memerlukan O(n) space complexity tambahan karena proses penggabungan (merging). Namun, performanya sangat konsisten \u2014 selalu O(n log n) untuk semua kasus.',
  },
};

function PseudocodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 text-slate-400 hover:text-white z-10"
        onClick={handleCopy}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
      <pre className="bg-[#1e293b] rounded-xl p-6 overflow-x-auto font-mono text-sm leading-relaxed">
        <code>
          {code.split('\n').map((line, i) => (
            <div key={i} className="flex">
              <span className="text-slate-600 select-none w-8 text-right mr-4 shrink-0">
                {i + 1}
              </span>
              <span>
                {line.split(/(\/\/.*)/).map((part, j) =>
                  part.startsWith('//') ? (
                    <span key={j} className="text-slate-500">{part}</span>
                  ) : (
                    <span key={j}>
                      {part.split(/(\b(?:function|for|if|else|while|return|to|from|and|or|not|length|swap|append|empty)\b)/g).map((tok, k) => {
                        const keywords = ['function', 'for', 'if', 'else', 'while', 'return', 'to', 'from', 'and', 'or', 'not', 'length', 'swap', 'append', 'empty'];
                        if (keywords.includes(tok)) {
                          return <span key={k} className="text-[#c7d2fe]">{tok}</span>;
                        }
                        if (tok.match(/^\d+$/)) {
                          return <span key={k} className="text-[#fbbf24]">{tok}</span>;
                        }
                        if (tok === 'true' || tok === 'false') {
                          return <span key={k} className="text-[#f472b6]">{tok}</span>;
                        }
                        return <span key={k} className="text-[#e2e8f0]">{tok}</span>;
                      })}
                    </span>
                  )
                )}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export default function SortPage() {
  const {
    results,
    loading,
    sort,
    algorithm,
    comparisons,
    swaps,
    timeMs,
    complexity,
    hasSorted,
    originalIndices,
  } = useSort();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('insertion');
  const [sortField, setSortField] = useState('nim');
  const [ascending, setAscending] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);

  const handleSort = () => {
    sort(sortField as 'nim' | 'nama' | 'ipk' | 'semester' | 'tahun_masuk', selectedAlgorithm as 'insertion' | 'selection' | 'bubble' | 'shell' | 'merge', ascending);
  };

  // Chart data: before vs after sorting
  const chartData = hasSorted && results.length > 0
    ? results.map((item, idx) => ({
        name: item.nama.split(' ')[0],
        value: sortField === 'ipk' ? item.ipk : sortField === 'semester' ? item.semester : parseInt(item.nim.slice(-3)),
        originalPos: (originalIndices.get(item.nim) ?? idx) + 1,
        newPos: idx + 1,
      }))
    : [];

  return (
    <div className="flex flex-col">
      {/* A. Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #4f46e5 70%, #0d9488 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <ArrowUpDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Pengurutan Data
                </h1>
              </div>
            </div>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed">
              Urutkan data mahasiswa menggunakan 5 algoritma sorting berbeda dengan visualisasi hasil dan analisis kompleksitas waktu nyata.
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-teal-400 blur-3xl" />
        </div>
      </section>

      {/* B. Sort Controls */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="shadow-sm">
              <CardContent className="p-5 sm:p-6 space-y-5">
                {/* Algorithm Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Pilih Algoritma Sorting
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {sortAlgorithms.map((algo) => (
                      <button
                        key={algo.key}
                        onClick={() => setSelectedAlgorithm(algo.key)}
                        className={`relative px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left border ${
                          selectedAlgorithm === algo.key
                            ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs leading-tight">{algo.label}</span>
                          <Badge
                            variant={selectedAlgorithm === algo.key ? 'secondary' : 'outline'}
                            className={`text-[10px] font-mono shrink-0 ml-1 ${
                              selectedAlgorithm === algo.key
                                ? 'bg-white/20 text-white border-transparent'
                                : 'text-slate-500'
                            }`}
                          >
                            {algo.complexity}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {sortAlgorithms.find((a) => a.key === selectedAlgorithm)?.desc}
                  </p>
                </div>

                {/* Sort Parameters Row */}
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="w-full sm:w-44">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Urutkan Berdasarkan
                    </label>
                    <Select value={sortField} onValueChange={setSortField}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Arah Urutan
                    </label>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setAscending(true)}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                          ascending
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                        Asc
                      </button>
                      <button
                        onClick={() => setAscending(false)}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border-l border-slate-200 ${
                          !ascending
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                        Desc
                      </button>
                    </div>
                  </div>

                  <div className="flex-1" />
                </div>

                {/* Sort Button */}
                <Button onClick={handleSort} className="w-full" size="lg">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Urutkan Data
                </Button>

                {/* Algorithm Info Accordion */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setInfoOpen(!infoOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary-500" />
                      Penjelasan Algoritma
                    </div>
                    <motion.span
                      animate={{ rotate: infoOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {infoOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {selectedAlgorithm === 'insertion' && (
                            <span>
                              <strong>Insertion Sort</strong> bekerja seperti mengurutkan kartu di tangan. Setiap elemen baru disisipkan ke posisi yang benar di bagian yang sudah terurut.{' '}
                              <span className="font-mono text-primary-600">Time Complexity: O(n²)</span> average/worst, <span className="font-mono text-primary-600">O(n)</span> best case.
                            </span>
                          )}
                          {selectedAlgorithm === 'selection' && (
                            <span>
                              <strong>Selection Sort</strong> mencari elemen terkecil dari sisa data dan menukarnya ke posisi yang benar.{' '}
                              <span className="font-mono text-primary-600">Time Complexity: O(n²)</span> untuk semua kasus. Tidak stabil.
                            </span>
                          )}
                          {selectedAlgorithm === 'bubble' && (
                            <span>
                              <strong>Bubble Sort</strong> membandingkan pasangan elemen bersebelahan dan menukar jika tidak terurut. Proses ini menggelembungkan elemen terbesar ke posisi akhir.{' '}
                              <span className="font-mono text-primary-600">Time Complexity: O(n²)</span> average/worst, <span className="font-mono text-primary-600">O(n)</span> best case.
                            </span>
                          )}
                          {selectedAlgorithm === 'shell' && (
                            <span>
                              <strong>Shell Sort</strong> adalah variasi Insertion Sort yang mengurutkan elemen dengan jarak (gap) tertentu, yang terus mengecil.{' '}
                              <span className="font-mono text-primary-600">Time Complexity: O(n log n)</span> average, <span className="font-mono text-primary-600">O(n²)</span> worst.
                            </span>
                          )}
                          {selectedAlgorithm === 'merge' && (
                            <span>
                              <strong>Merge Sort</strong> membagi data menjadi dua, mengurutkan masing-masing, lalu menggabungkannya. Konsisten <span className="font-mono text-primary-600">O(n log n)</span> untuk semua kasus, tetapi membutuhkan <span className="font-mono text-primary-600">O(n)</span> space tambahan.
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* C. Sort Results & Visualization */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            {!hasSorted ? (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center">
                  <BarChart3 className="w-10 h-10 text-primary-300" />
                </div>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Pilih algoritma dan klik &ldquo;Urutkan Data&rdquo; untuk melihat visualisasi.
                </p>
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-10 h-10 mx-auto mb-4 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-500 text-sm">Mengurutkan data...</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Results Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <CheckCircle className="w-7 h-7 text-emerald-500" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Pengurutan Selesai!
                      </h3>
                      <p className="text-sm text-slate-500">
                        {results.length} data diurutkan dalam {timeMs} ms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary-50 text-primary-600 border-primary-200">
                      {sortAlgorithms.find((a) => a.key === algorithm)?.label}
                    </Badge>
                    <Badge className="bg-teal-50 text-teal-700 border-teal-200 font-mono">
                      {complexity}
                    </Badge>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: Clock, label: 'Waktu Eksekusi', value: `${timeMs} ms` },
                    { icon: GitCompare, label: 'Perbandingan', value: `${comparisons} kali` },
                    { icon: ArrowRightLeft, label: 'Pertukaran', value: `${swaps} kali` },
                    { icon: BarChart3, label: 'Kompleksitas', value: complexity },
                  ].map((metric) => (
                    <Card key={metric.label} className="shadow-sm">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                          <metric.icon className="w-5 h-5 text-primary-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-500 uppercase tracking-wider">{metric.label}</p>
                          <p className="text-sm font-semibold text-slate-800 font-mono">{metric.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* F. Bar Chart Visualization */}
                {chartData.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <Card className="shadow-sm">
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="text-sm font-semibold text-slate-700 mb-4">
                          Visualisasi Hasil Pengurutan
                        </h4>
                        <div className="h-64 sm:h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                              <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                                tickLine={false}
                              />
                              <YAxis
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#1e293b',
                                  border: 'none',
                                  borderRadius: '0.5rem',
                                  fontSize: '12px',
                                  color: '#e2e8f0',
                                }}
                                formatter={(value: number) => [value, sortField.toUpperCase()]}
                              />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.originalPos !== entry.newPos ? '#6366f1' : '#a5b4fc'}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm bg-[#6366f1]" />
                            Pindah posisi
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm bg-[#a5b4fc]" />
                            Tetap
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Sorted Data Table (Desktop) */}
                <div className="hidden md:block">
                  <Card className="shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">#</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Posisi Awal</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">NIM</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jurusan</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">IPK</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Semester</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((item: Mahasiswa, idx: number) => {
                            const origPos = (originalIndices.get(item.nim) ?? idx) + 1;
                            const moved = origPos !== idx + 1;
                            return (
                              <motion.tr
                                key={item.nim}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                              >
                                <TableCell>
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
                                    {idx + 1}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${
                                    moved ? 'bg-slate-100 text-slate-500 line-through' : 'bg-emerald-50 text-emerald-600'
                                  }`}>
                                    {origPos}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm font-mono text-slate-700">{item.nim}</TableCell>
                                <TableCell className="text-sm font-medium text-slate-800">{item.nama}</TableCell>
                                <TableCell className="text-sm text-slate-600">{item.jurusan}</TableCell>
                                <TableCell className="text-sm font-mono text-slate-700">{item.ipk.toFixed(2)}</TableCell>
                                <TableCell className="text-sm text-slate-600">{item.semester}</TableCell>
                              </motion.tr>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {results.map((item: Mahasiswa, idx: number) => {
                    const origPos = (originalIndices.get(item.nim) ?? idx) + 1;
                    const moved = origPos !== idx + 1;
                    return (
                      <motion.div
                        key={item.nim}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <Card className="shadow-sm">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
                                  {idx + 1}
                                </span>
                                {moved && (
                                  <span className="text-xs text-slate-400 line-through">
                                    {origPos}
                                  </span>
                                )}
                              </div>
                              <Badge className="bg-primary-50 text-primary-600 text-[10px]">{item.tipe}</Badge>
                            </div>
                            <p className="font-semibold text-slate-800">{item.nama}</p>
                            <p className="text-sm text-slate-600">{item.jurusan}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="font-mono text-slate-700">{item.nim}</span>
                              <span>IPK: <span className="font-mono font-semibold text-slate-700">{item.ipk.toFixed(2)}</span></span>
                              <span>Sem: {item.semester}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* D. Algorithm Comparison */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-2">
                Bandingkan 5 Algoritma Sorting
              </h2>
              <p className="text-slate-500 text-sm max-w-2xl mx-auto">
                Analisis time complexity, space complexity, dan karakteristik setiap algoritma.
              </p>
            </div>

            <Card className="shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary-50">
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Kriteria</TableHead>
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider text-center">Insertion</TableHead>
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider text-center">Selection</TableHead>
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider text-center">Bubble</TableHead>
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider text-center">Shell</TableHead>
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider text-center">Merge</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonData.map((row, idx) => (
                      <TableRow
                        key={row.kriteria}
                        className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}
                      >
                        <TableCell className="text-sm font-medium text-slate-700">{row.kriteria}</TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono text-sm ${
                            row.insertion === 'O(n)' || row.insertion === 'O(n log n)' || row.insertion === 'O(1)' || row.insertion === 'Ya'
                              ? 'text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded'
                              : row.insertion === 'O(n\u00B2)' || row.insertion === 'O(n)' || row.insertion === 'Tidak'
                              ? 'text-red-500'
                              : 'text-slate-600'
                          }`}>
                            {row.insertion}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono text-sm ${
                            row.selection === 'O(n log n)' || row.selection === 'O(1)'
                              ? 'text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded'
                              : row.selection === 'Tidak'
                              ? 'text-red-500'
                              : 'text-slate-600'
                          }`}>
                            {row.selection}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono text-sm ${
                            row.bubble === 'O(n)' || row.bubble === 'O(n log n)' || row.bubble === 'O(1)' || row.bubble === 'Ya'
                              ? 'text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded'
                              : row.bubble === 'O(n\u00B2)'
                              ? 'text-red-500'
                              : 'text-slate-600'
                          }`}>
                            {row.bubble}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono text-sm ${
                            row.shell === 'O(n log n)' || row.shell === 'O(1)'
                              ? 'text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded'
                              : row.shell === 'Tidak'
                              ? 'text-red-500'
                              : 'text-slate-600'
                          }`}>
                            {row.shell}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono text-sm ${
                            row.merge === 'O(n log n)' || row.merge === 'Ya'
                              ? 'text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded'
                              : row.merge === 'O(n)' || row.merge === 'O(n)'
                              ? 'text-red-500'
                              : 'text-slate-600'
                          }`}>
                            {row.merge}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* E. Pseudocode Section */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-2">
                Implementasi dalam Kode
              </h2>
              <p className="text-slate-500 text-sm">
                Pseudocode setiap algoritma sorting yang diimplementasikan.
              </p>
            </div>

            <Tabs defaultValue="insertion" className="w-full">
              <TabsList className="w-full flex flex-wrap h-auto gap-1 mb-4">
                {sortAlgorithms.map((algo) => (
                  <TabsTrigger key={algo.key} value={algo.key} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                    {algo.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {sortAlgorithms.map((algo) => (
                <TabsContent key={algo.key} value={algo.key}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PseudocodeBlock code={pseudocodeMap[algo.key].code} />

                    {/* Educational Note Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-4"
                    >
                      <Card
                        className="shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdfa 100%)', borderColor: '#c7d2fe' }}
                      >
                        <CardContent className="p-4 flex gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 mb-0.5">Catatan Penting</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{pseudocodeMap[algo.key].note}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
