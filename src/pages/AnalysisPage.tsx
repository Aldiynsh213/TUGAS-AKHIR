import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code, Search, SortAsc, BarChart3, Zap,
  ChevronDown, Clock, HardDrive, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import ComplexityBadge from '@/components/ComplexityBadge';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const COMPLEXITY_DATA = [
  { algorithm: 'Linear Search', category: 'Pencarian', timeAvg: 'O(n)', timeBest: 'O(1)', timeWorst: 'O(n)', space: 'O(1)', stable: '-', description: 'Mencari data satu per satu dari awal sampai akhir' },
  { algorithm: 'Sequential Search', category: 'Pencarian', timeAvg: 'O(n)', timeBest: 'O(1)', timeWorst: 'O(n)', space: 'O(1)', stable: '-', description: 'Mirip linear search, pola pengecekan berurutan' },
  { algorithm: 'Binary Search', category: 'Pencarian', timeAvg: 'O(log n)', timeBest: 'O(1)', timeWorst: 'O(log n)', space: 'O(1)', stable: '-', description: 'Membagi data menjadi 2 bagian, memerlukan data terurut' },
  { algorithm: 'Insertion Sort', category: 'Pengurutan', timeAvg: 'O(n\u00b2)', timeBest: 'O(n)', timeWorst: 'O(n\u00b2)', space: 'O(1)', stable: 'Ya', description: 'Menyisipkan elemen ke posisi yang benar' },
  { algorithm: 'Selection Sort', category: 'Pengurutan', timeAvg: 'O(n\u00b2)', timeBest: 'O(n\u00b2)', timeWorst: 'O(n\u00b2)', space: 'O(1)', stable: 'Tidak', description: 'Mencari minimum dan menempatkkan di awal' },
  { algorithm: 'Bubble Sort', category: 'Pengurutan', timeAvg: 'O(n\u00b2)', timeBest: 'O(n)', timeWorst: 'O(n\u00b2)', space: 'O(1)', stable: 'Ya', description: 'Menukar elemen yang bersebelahan jika salah urutan' },
  { algorithm: 'Shell Sort', category: 'Pengurutan', timeAvg: 'O(n log n)', timeBest: 'O(n log n)', timeWorst: 'O(n\u00b2)', space: 'O(1)', stable: 'Tidak', description: 'Generalisasi insertion sort dengan gap sequence' },
  { algorithm: 'Merge Sort', category: 'Pengurutan', timeAvg: 'O(n log n)', timeBest: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)', stable: 'Ya', description: 'Divide and conquer, membagi lalu menggabungkan' },
];

const GROWTH_DATA = [
  { n: 10, 'O(1)': 1, 'O(log n)': 3, 'O(n)': 10, 'O(n log n)': 23, 'O(n\u00b2)': 100 },
  { n: 50, 'O(1)': 1, 'O(log n)': 5, 'O(n)': 50, 'O(n log n)': 282, 'O(n\u00b2)': 2500 },
  { n: 100, 'O(1)': 1, 'O(log n)': 6, 'O(n)': 100, 'O(n log n)': 664, 'O(n\u00b2)': 10000 },
  { n: 500, 'O(1)': 1, 'O(log n)': 9, 'O(n)': 500, 'O(n log n)': 4482, 'O(n\u00b2)': 250000 },
  { n: 1000, 'O(1)': 1, 'O(log n)': 10, 'O(n)': 1000, 'O(n log n)': 9965, 'O(n\u00b2)': 1000000 },
];

const BAR_DATA = [
  { name: 'Insertion', Best: 50, Average: 2500, Worst: 2500 },
  { name: 'Selection', Best: 2500, Average: 2500, Worst: 2500 },
  { name: 'Bubble', Best: 50, Average: 2500, Worst: 2500 },
  { name: 'Shell', Best: 282, Average: 282, Worst: 2500 },
  { name: 'Merge', Best: 282, Average: 282, Worst: 282 },
];

const BIG_O_CARDS = [
  { notation: 'O(1)', name: 'Constant', color: '#10b981', borderColor: 'border-emerald-400', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50', desc: 'Waktu konstan, tidak dipengaruhi ukuran input.', example: 'Akses array by index' },
  { notation: 'O(log n)', name: 'Logarithmic', color: '#14b8a6', borderColor: 'border-teal-400', textColor: 'text-teal-600', bgColor: 'bg-teal-50', desc: 'Pertumbuhan sangat lambat, membagi input secara berulang.', example: 'Binary Search' },
  { notation: 'O(n)', name: 'Linear', color: '#3b82f6', borderColor: 'border-blue-400', textColor: 'text-blue-600', bgColor: 'bg-blue-50', desc: 'Waktu sebanding dengan ukuran input.', example: 'Linear Search' },
  { notation: 'O(n log n)', name: 'Linearithmic', color: '#6366f1', borderColor: 'border-indigo-400', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50', desc: 'Kombinasi linear dan logaritmik, efisien untuk sorting.', example: 'Merge Sort, Shell Sort' },
  { notation: 'O(n\u00b2)', name: 'Quadratic', color: '#f59e0b', borderColor: 'border-amber-400', textColor: 'text-amber-600', bgColor: 'bg-amber-50', desc: 'Pertumbuhan kuadrat, lambat untuk data besar.', example: 'Bubble Sort, Insertion Sort' },
];

const PSEUDO_CODE: Record<string, string> = {
  'Linear Search': `FUNCTION linear_search(arr, target):
    FOR i = 0 TO length(arr) - 1:
        IF arr[i] == target:
            RETURN i          // Found at index i
    RETURN -1                 // Not found`,

  'Sequential Search': `FUNCTION sequential_search(arr, target):
    FOR i = 0 TO length(arr) - 1:
        IF arr[i] == target:
            RETURN i          // Found at index i
    RETURN -1                 // Not found`,

  'Binary Search': `FUNCTION binary_search(arr, target):
    left = 0
    right = length(arr) - 1
    WHILE left <= right:
        mid = (left + right) / 2
        IF arr[mid] == target:
            RETURN mid        // Found
        ELSE IF arr[mid] < target:
            left = mid + 1    // Search right half
        ELSE:
            right = mid - 1   // Search left half
    RETURN -1                 // Not found`,

  'Insertion Sort': `FUNCTION insertion_sort(arr):
    FOR i = 1 TO length(arr) - 1:
        key = arr[i]
        j = i - 1
        WHILE j >= 0 AND arr[j] > key:
            arr[j + 1] = arr[j]
            j = j - 1
        arr[j + 1] = key`,

  'Selection Sort': `FUNCTION selection_sort(arr):
    FOR i = 0 TO length(arr) - 2:
        min_idx = i
        FOR j = i + 1 TO length(arr) - 1:
            IF arr[j] < arr[min_idx]:
                min_idx = j
        SWAP arr[i], arr[min_idx]`,

  'Bubble Sort': `FUNCTION bubble_sort(arr):
    n = length(arr)
    FOR i = 0 TO n - 2:
        swapped = FALSE
        FOR j = 0 TO n - i - 2:
            IF arr[j] > arr[j + 1]:
                SWAP arr[j], arr[j + 1]
                swapped = TRUE
        IF NOT swapped:
            BREAK              // Already sorted`,

  'Shell Sort': `FUNCTION shell_sort(arr):
    n = length(arr)
    gap = n / 2
    WHILE gap > 0:
        FOR i = gap TO n - 1:
            temp = arr[i]
            j = i
            WHILE j >= gap AND arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j = j - gap
            arr[j] = temp
        gap = gap / 2`,

  'Merge Sort': `FUNCTION merge_sort(arr):
    IF length(arr) <= 1:
        RETURN arr
    mid = length(arr) / 2
    left = merge_sort(arr[0:mid])
    right = merge_sort(arr[mid:end])
    RETURN merge(left, right)

FUNCTION merge(left, right):
    result = []
    WHILE left NOT EMPTY AND right NOT EMPTY:
        IF left[0] <= right[0]:
            APPEND left[0] TO result
        ELSE:
            APPEND right[0] TO result
    APPEND remaining elements to result
    RETURN result`,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

/* ------------------------------------------------------------------ */
/*  MINI SVG CHART FOR BIG-O CARDS                                     */
/* ------------------------------------------------------------------ */

function MiniChart({ color, notation }: { color: string; notation: string }) {
  const width = 140;
  const height = 60;
  const padding = 8;

  const getPoints = () => {
    const nValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const maxY = notation.includes('n\u00b2)') ? 100 : notation.includes('n log n)') ? 35 : notation.includes('O(n)') && !notation.includes('log') ? 10 : notation.includes('log') ? 3.5 : 1.5;
    return nValues.map((n, i) => {
      let y: number;
      if (notation.includes('O(1)')) y = 1;
      else if (notation.includes('log')) y = Math.log2(n + 1);
      else if (notation.includes('n\u00b2)')) y = (n * n) / 10;
      else if (notation.includes('n log n)')) y = (n * Math.log2(n)) / 10;
      else y = n;
      const x = padding + (i / (nValues.length - 1)) * (width - 2 * padding);
      const plotY = height - padding - (y / maxY) * (height - 2 * padding);
      return `${x},${Math.max(padding, Math.min(height - padding, plotY))}`;
    }).join(' ');
  };

  return (
    <svg width={width} height={height} className="mx-auto">
      <polyline
        points={getPoints()}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  SECTION WRAPPER                                                    */
/* ------------------------------------------------------------------ */

function Section({
  children,
  className = '',
  bg = 'bg-white',
}: {
  children: React.ReactNode;
  className?: string;
  bg?: string;
}) {
  return (
    <section className={`${bg} py-12 lg:py-16`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </div>
    </section>
  );
}

function SectionBadge({ text, color = 'bg-primary-50 text-primary-600' }: { text: string; color?: string }) {
  return (
    <span className={`inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function AnalysisPage() {
  const [sortConfig, setSortConfig] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    setSortConfig((prev) => (prev?.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  };

  const sortedData = [...COMPLEXITY_DATA];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const av = (a as Record<string, string>)[sortConfig.key] || '';
      const bv = (b as Record<string, string>)[sortConfig.key] || '';
      return sortConfig.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  /* ---- helpers ---- */
  const getRowAccent = (timeAvg: string) => {
    if (timeAvg === 'O(n log n)') return 'hover:bg-indigo-50/40';
    if (timeAvg === 'O(log n)') return 'hover:bg-teal-50/40';
    if (timeAvg.includes('n\u00b2')) return 'hover:bg-amber-50/40';
    return 'hover:bg-blue-50/40';
  };

  const highlightCell = (val: string) => {
    if (val === 'O(log n)') return 'bg-teal-50 text-teal-700 font-semibold';
    if (val === 'O(1)') return 'bg-emerald-50 text-emerald-700 font-semibold';
    if (val === 'O(n log n)') return 'bg-indigo-50 text-indigo-700 font-semibold';
    if (val.includes('n\u00b2')) return 'bg-amber-50 text-amber-700 font-semibold';
    if (val === 'O(n)') return 'bg-blue-50 text-blue-700 font-semibold';
    return '';
  };

  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-700 to-teal-700 opacity-95" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
            <p className="text-sm text-white/60 mb-2">Dashboard / Analisis Kompleksitas</p>
            <h1 className="text-3xl lg:text-[2.5rem] font-extrabold text-white leading-tight mb-4">
              Analisis Kompleksitas Algoritma
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed"
          >
            Pemahaman mendalam tentang time complexity dan space complexity setiap algoritma yang diimplementasikan dalam aplikasi ini. Pelajari notasi Big-O dan pilih algoritma terbaik untuk setiap situasi.
          </motion.p>
        </div>
      </section>

      {/* ====== BIG-O REFERENCE CARDS ====== */}
      <Section bg="bg-slate-50">
        <div className="mb-10">
          <SectionBadge text="Fundamental" />
          <h2 className="text-2xl lg:text-[1.75rem] font-bold text-primary-800 mt-3 mb-2">Notasi Big-O</h2>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Notasi Big-O menggambarkan kompleksitas algoritma berdasarkan pertumbuhan jumlah operasi seiring bertambahnya ukuran input (n).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {BIG_O_CARDS.map((card, i) => (
            <motion.div
              key={card.notation}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
            >
              <Card className={`border-2 ${card.borderColor} overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                <CardContent className="p-5">
                  <p className={`font-mono text-xl font-bold ${card.textColor} mb-3`}>{card.notation}</p>
                  <div className={`${card.bgColor} rounded-lg py-3 mb-4`}>
                    <MiniChart color={card.color} notation={card.notation} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">{card.name}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{card.desc}</p>
                  <p className="text-[0.7rem] text-slate-400">
                    <span className="font-medium">Contoh:</span> {card.example}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ====== COMPARISON TABLE ====== */}
      <Section bg="bg-white">
        <div className="mb-10">
          <SectionBadge text="Komparasi" color="bg-teal-50 text-teal-700" />
          <h2 className="text-2xl lg:text-[1.75rem] font-bold text-primary-800 mt-3 mb-2">Tabel Perbandingan Kompleksitas</h2>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Perbandingan time complexity dan space complexity untuk semua algoritma pencarian dan pengurutan.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {[
                  { key: 'algorithm', label: 'Algoritma' },
                  { key: 'category', label: 'Kategori' },
                  { key: 'timeAvg', label: 'Time (Avg)' },
                  { key: 'timeBest', label: 'Time (Best)' },
                  { key: 'timeWorst', label: 'Time (Worst)' },
                  { key: 'space', label: 'Space' },
                  { key: 'description', label: 'Keterangan' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-primary-600 select-none transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortConfig?.key === col.key && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortConfig.dir === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedData.map((row, idx) => (
                <motion.tr
                  key={row.algorithm}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className={`bg-white transition-colors ${getRowAccent(row.timeAvg)}`}
                >
                  <td className="px-4 py-3.5 font-medium text-slate-700">{row.algorithm}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${row.category === 'Pencarian' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                      {row.category === 'Pencarian' ? <Search className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />}
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5"><span className={`inline-block px-2 py-0.5 rounded-md font-mono text-xs ${highlightCell(row.timeAvg)}`}>{row.timeAvg}</span></td>
                  <td className="px-4 py-3.5"><span className={`inline-block px-2 py-0.5 rounded-md font-mono text-xs ${highlightCell(row.timeBest)}`}>{row.timeBest}</span></td>
                  <td className="px-4 py-3.5"><span className={`inline-block px-2 py-0.5 rounded-md font-mono text-xs ${highlightCell(row.timeWorst)}`}>{row.timeWorst}</span></td>
                  <td className="px-4 py-3.5"><span className="font-mono text-xs text-slate-600">{row.space}</span></td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs max-w-xs">{row.description}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {sortedData.map((row, idx) => (
            <motion.div
              key={row.algorithm}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-700">{row.algorithm}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${row.category === 'Pencarian' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                      {row.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{row.description}</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-50 rounded-md p-2">
                      <p className="text-[0.6rem] uppercase text-slate-400 mb-1">Avg</p>
                      <ComplexityBadge notation={row.timeAvg} size="sm" />
                    </div>
                    <div className="bg-slate-50 rounded-md p-2">
                      <p className="text-[0.6rem] uppercase text-slate-400 mb-1">Best</p>
                      <ComplexityBadge notation={row.timeBest} size="sm" />
                    </div>
                    <div className="bg-slate-50 rounded-md p-2">
                      <p className="text-[0.6rem] uppercase text-slate-400 mb-1">Worst</p>
                      <ComplexityBadge notation={row.timeWorst} size="sm" />
                    </div>
                    <div className="bg-slate-50 rounded-md p-2">
                      <p className="text-[0.6rem] uppercase text-slate-400 mb-1">Space</p>
                      <ComplexityBadge notation={row.space} size="sm" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ====== PERFORMANCE CHARTS ====== */}
      <Section bg="bg-slate-50">
        <div className="mb-10">
          <SectionBadge text="Visualisasi" color="bg-indigo-50 text-indigo-600" />
          <h2 className="text-2xl lg:text-[1.75rem] font-bold text-primary-800 mt-3 mb-2">Grafik Pertumbuhan Kompleksitas</h2>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Visualisasi pertumbuhan jumlah operasi seiring bertambahnya ukuran input untuk setiap kelas kompleksitas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary-500" />
                  Pertumbuhan Operasi vs Ukuran Input
                </h3>
                <p className="text-xs text-slate-400 mb-4">Semua kelas kompleksitas pada skala logaritmik</p>
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart data={GROWTH_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="n" tick={{ fontSize: 12, fill: '#94a3b8' }} label={{ value: 'Ukuran Input (n)', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#94a3b8' } }} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} label={{ value: 'Jumlah Operasi', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#94a3b8' } }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      formatter={(value: number) => [value.toLocaleString(), '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="O(1)" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="O(log n)" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="O(n)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="O(n log n)" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="O(n\u00b2)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-500" />
                  Komparasi Algoritma Pengurutan (n=50)
                </h3>
                <p className="text-xs text-slate-400 mb-4">Perbandingan operasi pada kasus terbaik, rata-rata, dan terburuk</p>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={BAR_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      formatter={(value: number) => [value.toLocaleString(), '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Best" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Average" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Worst" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* ====== ALGORITHM SELECTION GUIDE ====== */}
      <Section bg="bg-white">
        <div className="mb-10">
          <SectionBadge text="Best Practices" color="bg-teal-50 text-teal-700" />
          <h2 className="text-2xl lg:text-[1.75rem] font-bold text-primary-800 mt-3 mb-2">Kapan Menggunakan Algoritma Apa?</h2>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Panduan praktis memilih algoritma yang tepat berdasarkan kondisi data dan kebutuhan aplikasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Pencarian */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-slate-200 border-t-[3px] border-t-primary-500 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Memilih Algoritma Pencarian</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    { text: 'Data ', bold1: 'tidak terurut', text2: ' \u2192 Gunakan ', bold2: 'Linear Search', text3: ' (O(n))' },
                    { text: 'Data ', bold1: 'terurut', text2: ' dan ', bold2: 'besar', text3: ' \u2192 Gunakan ', bold3: 'Binary Search', text4: ' (O(log n))' },
                    { text: 'Data ', bold1: 'terurut', text2: ' dan ', bold2: 'kecil', text3: ' \u2192 Linear atau Sequential sama efisien' },
                    { text: 'Butuh ', bold1: 'implementasi sederhana', text2: ' \u2192 Linear Search tanpa sorting' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                      <span>
                        {item.text}<strong className="text-slate-800">{item.bold1}</strong>{item.text2}<strong className="text-slate-800">{item.bold2}</strong>{item.text3}{item.bold3 && <strong className="text-slate-800">{item.bold3}</strong>}{item.text4}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Data Kecil */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-slate-200 border-t-[3px] border-t-teal-500 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <SortAsc className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Data Kecil (&lt; 50 item)</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    { text: 'Data ', bold1: 'hampir terurut', text2: ' \u2192 ', bold2: 'Insertion Sort', text3: ' \u2014 O(n) best case' },
                    { text: 'Butuh ', bold1: 'stability', text2: ' \u2192 ', bold2: 'Bubble Sort', text3: ' \u2014 sederhana dan stabil' },
                    { text: 'Butuh ', bold1: 'minimal swap', text2: ' \u2192 ', bold2: 'Selection Sort', text3: ' \u2014 maksimal n swaps' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                      <span>
                        {item.text}<strong className="text-slate-800">{item.bold1}</strong>{item.text2}<strong className="text-slate-800">{item.bold2}</strong>{item.text3}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3: Data Besar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="border-slate-200 border-t-[3px] border-t-indigo-500 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Data Besar (&gt; 100 item)</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    { text: 'Butuh ', bold1: 'konsistensi', text2: ' \u2192 ', bold2: 'Merge Sort', text3: ' \u2014 selalu O(n log n)' },
                    { text: 'Butuh ', bold1: 'in-place', text2: ' \u2192 ', bold2: 'Shell Sort', text3: ' \u2014 O(1) space' },
                    { text: 'Data ', bold1: 'acak besar', text2: ' \u2192 Hindari Bubble/Insertion Sort (O(n\u00b2))' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>
                        {item.text}<strong className="text-slate-800">{item.bold1}</strong>{item.text2}<strong className="text-slate-800">{item.bold2}</strong>{item.text3}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 4: Pertimbangan Umum */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border-slate-200 border-t-[3px] border-t-amber-500 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Faktor Lain yang Perlu Dipertimbangkan</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    { bold: 'Stability', text: ' \u2014 Merge Sort dan Bubble Sort mempertahankan urutan elemen sama' },
                    { bold: 'Space', text: ' \u2014 Merge Sort butuh O(n) memory tambahan' },
                    { bold: 'Adaptive', text: ' \u2014 Insertion dan Bubble lebih cepat pada data hampir terurut' },
                    { bold: 'Code complexity', text: ' \u2014 Linear Search dan Bubble Sort paling mudah diimplementasi' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>
                        <strong className="text-slate-800">{item.bold}</strong>{item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* ====== PSEUDOCODE GALLERY ====== */}
      <Section bg="bg-slate-50">
        <div className="mb-10">
          <SectionBadge text="Implementasi" color="bg-primary-50 text-primary-600" />
          <h2 className="text-2xl lg:text-[1.75rem] font-bold text-primary-800 mt-3 mb-2">Galeri Pseudocode</h2>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Pseudocode untuk setiap algoritma yang diimplementasikan. Klik untuk melihat detail implementasi.
          </p>
        </div>

        <div className="max-w-4xl">
          <Accordion type="multiple" className="space-y-2">
            {Object.entries(PSEUDO_CODE).map(([name, code], idx) => {
              const algo = COMPLEXITY_DATA.find((a) => a.algorithm === name);
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                >
                  <AccordionItem value={name} className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50 transition-colors [&[data-state=open]]:bg-slate-50">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                          <Code className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{name}</p>
                          {algo && (
                            <p className="text-xs text-slate-400 mt-0.5">{algo.description}</p>
                          )}
                        </div>
                        <div className="hidden sm:flex items-center gap-2 ml-4">
                          <ComplexityBadge notation={algo?.timeAvg || ''} size="sm" />
                          <ComplexityBadge notation={algo?.space || ''} size="sm" />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="mt-2 bg-slate-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="font-mono text-sm leading-relaxed">
                          {code.split('\n').map((line, i) => {
                            const trimmed = line.trimStart();
                            const indent = line.length - trimmed.length;
                            const isComment = trimmed.startsWith('//');
                            const isKeyword = /^(FUNCTION|FOR|WHILE|IF|ELSE|RETURN|SWAP|APPEND|BREAK|TO|NOT|EMPTY|AND|OR)$/.test(trimmed.split(' ')[0]);
                            return (
                              <div key={i} className="table-row">
                                <span className="table-cell text-right text-slate-600 select-none pr-4 text-xs">
                                  {i + 1}
                                </span>
                                <span className="table-cell">
                                  <span style={{ paddingLeft: `${indent * 8}px` }}>
                                    {isComment ? (
                                      <span className="text-slate-500">{line}</span>
                                    ) : isKeyword ? (
                                      <span>
                                        <span className="text-purple-400">{trimmed.split(' ')[0]}</span>
                                        <span className="text-slate-300">{' '}{trimmed.split(' ').slice(1).join(' ')}</span>
                                      </span>
                                    ) : (
                                      <span className="text-slate-300">{line}</span>
                                    )}
                                  </span>
                                </span>
                              </div>
                            );
                          })}
                        </pre>
                      </div>
                      {algo && (
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary-500" /> Time: <ComplexityBadge notation={algo.timeAvg} size="sm" /></span>
                          <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-teal-500" /> Space: <ComplexityBadge notation={algo.space} size="sm" /></span>
                          <span className="flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> Best: <ComplexityBadge notation={algo.timeBest} size="sm" /></span>
                          <span className="flex items-center gap-1"><ArrowDownRight className="w-3.5 h-3.5 text-amber-500" /> Worst: <ComplexityBadge notation={algo.timeWorst} size="sm" /></span>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </div>
      </Section>
    </div>
  );
}
