import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  GitBranch,
  BarChart3,
  Zap,
  BookOpen,
  XCircle,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useSearch } from '@/hooks/useSearch';
import type { Mahasiswa } from '@/types';

const searchAlgorithms = [
  {
    key: 'linear',
    label: 'Linear Search',
    complexity: 'O(n)',
    desc: 'Cek setiap elemen satu per satu dari awal hingga akhir',
  },
  {
    key: 'sequential',
    label: 'Sequential Search',
    complexity: 'O(n)',
    desc: 'Cek data secara berurutan, cocok untuk data terurut',
  },
  {
    key: 'binary',
    label: 'Binary Search',
    complexity: 'O(log n)',
    desc: 'Bagi data menjadi dua secara berulang, sangat efisien',
  },
];

const searchFields = [
  { value: 'nama', label: 'Nama' },
  { value: 'nim', label: 'NIM' },
  { value: 'jurusan', label: 'Jurusan' },
  { value: 'email', label: 'Email' },
];

const comparisonData = [
  {
    kriteria: 'Time Complexity (Best)',
    linear: 'O(1)',
    sequential: 'O(1)',
    binary: 'O(1)',
    best: 'binary',
  },
  {
    kriteria: 'Time Complexity (Avg)',
    linear: 'O(n)',
    sequential: 'O(n)',
    binary: 'O(log n)',
    best: 'binary',
  },
  {
    kriteria: 'Time Complexity (Worst)',
    linear: 'O(n)',
    sequential: 'O(n)',
    binary: 'O(log n)',
    best: 'binary',
  },
  {
    kriteria: 'Space Complexity',
    linear: 'O(1)',
    sequential: 'O(1)',
    binary: 'O(1)',
    best: 'all',
  },
  {
    kriteria: 'Data Requirement',
    linear: 'Tidak terurut',
    sequential: 'Terurut lebih baik',
    binary: 'Terurut',
    best: 'linear',
  },
  {
    kriteria: 'Implementasi',
    linear: 'Sederhana',
    sequential: 'Sederhana',
    binary: 'Perlu sorting',
    best: 'linear',
  },
];

const pseudocodeMap: Record<string, { code: string; lang: string }> = {
  linear: {
    lang: 'Linear Search',
    code: `function linearSearch(data, target):
    for i from 0 to length(data) - 1:
        comparisons++
        if data[i] contains target:
            return i           // Found at index i
    return -1                  // Not found`,
  },
  sequential: {
    lang: 'Sequential Search',
    code: `function sequentialSearch(data, target):
    // Data harus terurut terlebih dahulu
    sort(data)
    for i from 0 to length(data) - 1:
        comparisons++
        if data[i] contains target:
            return i           // Found at index i
        if data[i] > target:
            return -1          // Not found, stop early
    return -1                  // Not found`,
  },
  binary: {
    lang: 'Binary Search',
    code: `function binarySearch(data, target):
    // Data harus terurut terlebih dahulu
    sort(data)
    left = 0
    right = length(data) - 1
    while left <= right:
        mid = (left + right) / 2
        comparisons++
        if data[mid] equals target:
            return mid         // Found
        else if data[mid] < target:
            left = mid + 1     // Search right half
        else:
            right = mid - 1    // Search left half
    return -1                  // Not found`,
  },
};

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-slate-900 px-0.5 rounded">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

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
        className="absolute top-3 right-3 text-slate-400 hover:text-white"
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
                      {part.split(/(\b(?:function|for|if|else|while|return|to|from|and|or|not|length|sort|contains|equals)\b)/g).map((tok, k) => {
                        const keywords = ['function', 'for', 'if', 'else', 'while', 'return', 'to', 'from', 'and', 'or', 'not', 'length', 'sort', 'contains', 'equals'];
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

export default function SearchPage() {
  const {
    results,
    loading,
    search,
    algorithm,
    comparisons,
    timeMs,
    complexity,
    hasSearched,
    keyword,
  } = useSearch();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear');
  const [searchField, setSearchField] = useState('nama');
  const [searchInput, setSearchInput] = useState('');
  const [infoOpen, setInfoOpen] = useState(true);

  const handleSearch = () => {
    if (searchInput.trim()) {
      search(searchInput, searchField, selectedAlgorithm);
    }
  };

  const efficiency = hasSearched && results.length > 0
    ? Math.round(((10 - comparisons) / 10) * 100)
    : 0;

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
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Pencarian Data
                </h1>
              </div>
            </div>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed">
              Cari data mahasiswa menggunakan berbagai algoritma pencarian dengan analisis performa waktu nyata.
              Pelajari perbedaan Linear Search, Sequential Search, dan Binary Search.
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-teal-400 blur-3xl" />
        </div>
      </section>

      {/* B. Search Controls */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                    Pilih Algoritma Pencarian
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {searchAlgorithms.map((algo) => (
                      <button
                        key={algo.key}
                        onClick={() => setSelectedAlgorithm(algo.key)}
                        className={`relative px-4 py-3 rounded-lg text-sm font-medium transition-all text-left border ${
                          selectedAlgorithm === algo.key
                            ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span>{algo.label}</span>
                          <Badge
                            variant={selectedAlgorithm === algo.key ? 'secondary' : 'outline'}
                            className={`text-[10px] font-mono ${
                              selectedAlgorithm === algo.key
                                ? 'bg-white/20 text-white border-transparent'
                                : 'text-slate-500'
                            }`}
                          >
                            {algo.complexity}
                          </Badge>
                        </div>
                        <p
                          className={`text-[11px] leading-snug ${
                            selectedAlgorithm === algo.key ? 'text-white/80' : 'text-slate-500'
                          }`}
                        >
                          {algo.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field Selector + Search Input */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="w-full sm:w-48 shrink-0">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Cari Berdasarkan
                    </label>
                    <Select value={searchField} onValueChange={setSearchField}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {searchFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Kata Kunci Pencarian
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          placeholder={
                            selectedAlgorithm === 'binary'
                              ? 'Cari NIM (data akan diurutkan otomatis)'
                              : 'Cari nama, NIM, jurusan...'
                          }
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          className="pl-10"
                        />
                      </div>
                      <Button onClick={handleSearch} className="shrink-0">
                        <Search className="w-4 h-4 mr-2" />
                        Cari
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedAlgorithm === 'binary' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-sm text-teal-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    Data akan diurutkan otomatis sebelum pencarian Binary Search dilakukan.
                  </motion.div>
                )}

                {/* Algorithm Info Accordion */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setInfoOpen(!infoOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary-500" />
                      Cara Kerja Algoritma
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
                          {selectedAlgorithm === 'linear' && (
                            <span>
                              <strong>Linear Search</strong> memeriksa setiap elemen data satu per satu dari awal hingga akhir. Cocok untuk data yang belum terurut.{' '}
                              <span className="font-mono text-primary-600">Time Complexity: O(n)</span> — waktu pencarian meningkat secara linear dengan jumlah data.
                            </span>
                          )}
                          {selectedAlgorithm === 'sequential' && (
                            <span>
                              <strong>Sequential Search</strong> serupa dengan Linear Search, namun data diurutkan terlebih dahulu dan pencarian dapat dihentikan lebih awal jika nilai sudah melebihi target.{' '}
                              <span className="font-mono text-primary-600">Time Complexity: O(n)</span> worst case.
                            </span>
                          )}
                          {selectedAlgorithm === 'binary' && (
                            <span>
                              <strong>Binary Search</strong> membagi data menjadi dua bagian secara berulang. Memerlukan data yang sudah terurut.{' '}
                              <span className="font-mono text-primary-600">Time Complexity: O(log n)</span> — sangat efisien untuk dataset besar.
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

      {/* C. Search Results Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            {!hasSearched ? (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center">
                  <Search className="w-10 h-10 text-primary-300" />
                </div>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Mulai pencarian untuk melihat hasil dan analisis performa algoritma.
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
                <p className="text-slate-500 text-sm">Mencari data...</p>
              </motion.div>
            ) : results.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <XCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-1">
                  Tidak ditemukan hasil untuk &ldquo;{keyword}&rdquo;
                </h3>
                <p className="text-slate-400 text-sm">
                  Coba kata kunci lain atau ubah algoritma pencarian.
                </p>
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
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Menemukan {results.length} hasil dalam {timeMs} ms
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-primary-50 text-primary-600 border-primary-200">
                        {searchAlgorithms.find((a) => a.key === algorithm)?.label}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {comparisons} perbandingan dilakukan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: Clock, label: 'Waktu Eksekusi', value: `${timeMs} ms` },
                    { icon: GitBranch, label: 'Perbandingan', value: `${comparisons}` },
                    { icon: BarChart3, label: 'Kompleksitas', value: complexity },
                    { icon: Zap, label: 'Efisiensi', value: `${Math.max(0, efficiency)}%` },
                  ].map((metric) => (
                    <Card key={metric.label} className="shadow-sm">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                          <metric.icon className="w-5 h-5 text-primary-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-500 uppercase tracking-wider">{metric.label}</p>
                          <p className="text-base font-semibold text-slate-800 font-mono">{metric.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Results Table (Desktop) / Cards (Mobile) */}
                <div className="hidden md:block">
                  <Card className="shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">NIM</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jurusan</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">IPK</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((item: Mahasiswa, idx: number) => (
                            <motion.tr
                              key={item.nim}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <TableCell className="text-sm text-slate-700 font-mono">
                                <HighlightText text={item.nim} highlight={keyword} />
                              </TableCell>
                              <TableCell className="text-sm font-medium text-slate-800">
                                <HighlightText text={item.nama} highlight={keyword} />
                              </TableCell>
                              <TableCell className="text-sm text-slate-600">
                                <HighlightText text={item.jurusan} highlight={keyword} />
                              </TableCell>
                              <TableCell className="text-sm text-slate-700 font-mono">{item.ipk.toFixed(2)}</TableCell>
                              <TableCell className="text-sm text-slate-600">
                                <HighlightText text={item.email} highlight={keyword} />
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {results.map((item: Mahasiswa, idx: number) => (
                    <motion.div
                      key={item.nim}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="shadow-sm">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-slate-500">{item.nim}</span>
                            <Badge className="bg-primary-50 text-primary-600 text-[10px]">{item.tipe}</Badge>
                          </div>
                          <p className="font-semibold text-slate-800">
                            <HighlightText text={item.nama} highlight={keyword} />
                          </p>
                          <p className="text-sm text-slate-600">
                            <HighlightText text={item.jurusan} highlight={keyword} />
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>IPK: <span className="font-mono font-semibold text-slate-700">{item.ipk.toFixed(2)}</span></span>
                            <span>Semester: {item.semester}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            <HighlightText text={item.email} highlight={keyword} />
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* D. Algorithm Comparison Section */}
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
                Bandingkan Algoritma
              </h2>
              <p className="text-slate-500 text-sm max-w-2xl mx-auto">
                Lihat perbedaan performa ketiga algoritma pencarian pada dataset yang sama.
              </p>
            </div>

            <Card className="shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary-50">
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Kriteria</TableHead>
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider text-center">Linear Search</TableHead>
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider text-center">Sequential Search</TableHead>
                      <TableHead className="text-xs font-semibold text-primary-800 uppercase tracking-wider text-center">Binary Search</TableHead>
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
                          <span className={`font-mono text-sm ${row.best === 'linear' || row.best === 'all' ? 'text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded' : 'text-slate-600'}`}>
                            {row.linear}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono text-sm ${row.best === 'sequential' ? 'text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded' : 'text-slate-600'}`}>
                            {row.sequential}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono text-sm ${row.best === 'binary' || row.best === 'all' ? 'text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded' : 'text-slate-600'}`}>
                            {row.binary}
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
                Pseudocode dan penjelasan untuk setiap algoritma pencarian.
              </p>
            </div>

            <Tabs defaultValue="linear" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                {searchAlgorithms.map((algo) => (
                  <TabsTrigger key={algo.key} value={algo.key} className="text-sm">
                    {algo.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {searchAlgorithms.map((algo) => (
                <TabsContent key={algo.key} value={algo.key}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PseudocodeBlock code={pseudocodeMap[algo.key].code} />
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
