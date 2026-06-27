import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Code, Clock, CheckCircle, Database, Search, SortAsc,
  FileText, Layers, BarChart3, TrendingUp, Zap, Shield, Plus,
  ArrowRight, GraduationCap, BookOpen,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatCard from '../components/StatCard';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── demo data ─── */
const demoMahasiswa = [
  { nim: '2021001', nama: 'Ahmad Rizky', jurusan: 'Informatika', semester: 6, ipk: 3.75, tipe: 'S1' },
  { nim: '2021002', nama: 'Budi Santoso', jurusan: 'Sistem Informasi', semester: 4, ipk: 3.42, tipe: 'S1' },
  { nim: '2021003', nama: 'Citra Dewi', jurusan: 'Teknik Komputer', semester: 8, ipk: 3.88, tipe: 'S1' },
  { nim: '2022001', nama: 'Diana Putri', jurusan: 'Informatika', semester: 2, ipk: 3.91, tipe: 'S2' },
  { nim: '2022002', nama: 'Eko Prasetyo', jurusan: 'Manajemen', semester: 5, ipk: 3.25, tipe: 'S1' },
];

const ipkDistribution = [
  { range: '0-2.0', count: 2 },
  { range: '2.0-2.5', count: 8 },
  { range: '2.5-3.0', count: 18 },
  { range: '3.0-3.5', count: 38 },
  { range: '3.5-4.0', count: 58 },
];

const jurusanData = [
  { name: 'Informatika', value: 45 },
  { name: 'Sistem Informasi', value: 32 },
  { name: 'Teknik Komputer', value: 28 },
  { name: 'Manajemen', value: 19 },
];

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#8b5cf6'];

/* ─── feature cards ─── */
const features = [
  { icon: Database, title: 'CRUD Lengkap', desc: 'Input, edit, hapus, dan tampilkan data mahasiswa dengan antarmuka modern.', link: '/mahasiswa', linkText: 'Kelola Data', color: '#6366f1', bg: '#eef2ff' },
  { icon: Search, title: 'Multi-Algoritma Pencarian', desc: 'Linear Search, Binary Search, dan Sequential Search dengan metrik performa.', link: '/pencarian', linkText: 'Cari Data', color: '#14b8a6', bg: '#ccfbf1' },
  { icon: SortAsc, title: '5 Algoritma Sorting', desc: 'Insertion, Selection, Merge, Bubble, dan Shell Sort dengan visualisasi.', link: '/pengurutan', linkText: 'Urutkan Data', color: '#6366f1', bg: '#eef2ff' },
  { icon: FileText, title: 'Penyimpanan File', desc: 'Simpan dan baca data dari file CSV/JSON. Implementasi File I/O.', link: '', linkText: '', color: '#14b8a6', bg: '#ccfbf1' },
  { icon: Layers, title: 'Konsep OOP', desc: 'Class, objek, enkapsulasi, pewarisan, dan polimorfisme.', link: '/tentang', linkText: 'Pelajari', color: '#6366f1', bg: '#eef2ff' },
  { icon: BarChart3, title: 'Big-O Analysis', desc: 'Tabel perbandingan kompleksitas waktu dan ruang setiap algoritma.', link: '/analisis', linkText: 'Lihat Analisis', color: '#14b8a6', bg: '#ccfbf1' },
];

/* ─── algorithm cards ─── */
const algorithmCards = [
  {
    badge: 'PENCARIAN',
    badgeColor: '#eef2ff',
    badgeText: '#4f46e5',
    icon: Search,
    title: 'Searching Algorithms',
    items: ['Linear Search — O(n)', 'Binary Search — O(log n)', 'Sequential Search — O(n)'],
    bars: [80, 30, 80],
  },
  {
    badge: 'PENGURUTAN',
    badgeColor: '#ccfbf1',
    badgeText: '#0f766e',
    icon: SortAsc,
    title: 'Sorting Algorithms',
    items: ['Insertion Sort — O(n\u00B2)', 'Selection Sort — O(n\u00B2)', 'Merge Sort — O(n log n)', 'Bubble Sort — O(n\u00B2)', 'Shell Sort — O(n log n)'],
    bars: [70, 70, 35, 70, 35],
  },
  {
    badge: 'OOP',
    badgeColor: '#eef2ff',
    badgeText: '#4f46e5',
    icon: Layers,
    title: 'OOP Concepts',
    items: ['Class & Object', 'Enkapsulasi', 'Pewarisan (Inheritance)', 'Polimorfisme'],
    bars: [],
  },
  {
    badge: 'VALIDASI',
    badgeColor: '#ccfbf1',
    badgeText: '#0f766e',
    icon: Shield,
    title: 'Error Handling',
    items: ['Regex Validation', 'Try-Catch Exception', 'File I/O Error Handling', 'Input Type Checking'],
    bars: [],
  },
];

/* ─── insights ─── */
const insights = [
  { icon: TrendingUp, label: 'Mahasiswa Terbanyak', value: 'Informatika (45)' },
  { icon: Users, label: 'Rata-rata per Jurusan', value: '31 mahasiswa' },
  { icon: Zap, label: 'Input Tercepat', value: '0.05 detik' },
  { icon: Shield, label: 'Validasi Berhasil', value: '124/124 data' },
];

/* ─── component ─── */
export default function DashboardPage() {
  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #4f46e5 70%, #0d9488 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Manajemen Data Mahasiswa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
            className="mt-4 text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed"
          >
            Aplikasi edukasi lengkap dengan implementasi OOP, algoritma pencarian,
            pengurutan, dan analisis kompleksitas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/mahasiswa"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg shadow-lg hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] transition-all duration-200"
            >
              <GraduationCap className="w-5 h-5" />
              Kelola Data
            </Link>
            <Link
              to="/analisis"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <BarChart3 className="w-5 h-5" />
              Lihat Analisis
            </Link>
          </motion.div>

          {/* Hero Stats */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
            {[
              { value: '124', label: 'Total Mahasiswa', icon: Users },
              { value: '8', label: 'Algoritma Tersedia', icon: Code },
              { value: '0.3ms', label: 'Waktu Pencarian', icon: Clock },
              { value: '100%', label: 'Data Valid', icon: CheckCircle },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: easeOutExpo }}
                className="bg-white/[0.08] border border-white/[0.12] rounded-xl p-4 md:p-5 text-left relative"
              >
                <stat.icon className="w-5 h-5 text-white/50 absolute top-3 right-3" />
                <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ROW ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard value="124" label="Total Mahasiswa" icon={Users} accentColor="#6366f1" delay={0} />
          <StatCard value="3.47" label="Rata-rata IPK" icon={BookOpen} accentColor="#14b8a6" delay={0.1} />
          <StatCard value="98" label="Mahasiswa S1" icon={GraduationCap} accentColor="#f59e0b" delay={0.2} />
          <StatCard value="26" label="Mahasiswa S2" icon={Layers} accentColor="#8b5cf6" delay={0.3} />
        </div>
      </section>

      {/* ═══════════════ FITUR UTAMA ═══════════════ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="text-center mb-10"
          >
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs font-semibold rounded-full tracking-wide">
              FITUR
            </span>
            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-primary-800">
              Semua yang Anda Butuhkan
            </h2>
            <p className="mt-2 text-slate-500 max-w-xl mx-auto">
              Dari manajemen data hingga analisis algoritma — dalam satu aplikasi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: easeOutExpo }}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{f.desc}</p>
                {f.link && (
                  <Link
                    to={f.link}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
                  >
                    {f.linkText} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ RECENT MAHASISWA + IPK CHART ═══════════════ */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Mahasiswa Table */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Mahasiswa Terbaru</h3>
                <Link to="/mahasiswa" className="text-sm font-medium text-primary-600 hover:underline flex items-center gap-1">
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="text-left px-4 py-3">NIM</th>
                      <th className="text-left px-4 py-3">Nama</th>
                      <th className="text-left px-4 py-3">Jurusan</th>
                      <th className="text-center px-4 py-3">IPK</th>
                      <th className="text-center px-4 py-3">Tipe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {demoMahasiswa.map((m) => (
                      <tr key={m.nim} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-slate-600">{m.nim}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{m.nama}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{m.jurusan}</td>
                        <td className="px-4 py-3 text-sm text-center font-semibold text-primary-600">{m.ipk.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                            m.tipe === 'S1' ? 'bg-primary-50 text-primary-600' : 'bg-teal-50 text-teal-600'
                          }`}>
                            {m.tipe}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* IPK Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Distribusi IPK Mahasiswa</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ipkDistribution} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {ipkDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DISTRIBUSI DATA + INSIGHTS ═══════════════ */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Distribusi Mahasiswa per Jurusan
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                {jurusanData.map((j, i) => (
                  <div key={j.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm text-slate-600">{j.name}</span>
                    <span className="text-sm font-semibold text-slate-800">({j.value})</span>
                  </div>
                ))}
              </div>
              {/* Donut chart via simple SVG */}
              <div className="mt-6 flex justify-center">
                <svg width="280" height="280" viewBox="0 0 280 280">
                  <g transform="translate(140,140)">
                    {jurusanData.reduce<
                      { elements: JSX.Element[]; cumulative: number }
                    >(
                      (acc, item, i) => {
                        const total = jurusanData.reduce((s, d) => s + d.value, 0);
                        const startAngle = (acc.cumulative / total) * Math.PI * 2 - Math.PI / 2;
                        const endAngle = ((acc.cumulative + item.value) / total) * Math.PI * 2 - Math.PI / 2;
                        const outerR = 100;
                        const innerR = 60;
                        const x1 = Math.cos(startAngle) * outerR;
                        const y1 = Math.sin(startAngle) * outerR;
                        const x2 = Math.cos(endAngle) * outerR;
                        const y2 = Math.sin(endAngle) * outerR;
                        const x3 = Math.cos(endAngle) * innerR;
                        const y3 = Math.sin(endAngle) * innerR;
                        const x4 = Math.cos(startAngle) * innerR;
                        const y4 = Math.sin(startAngle) * innerR;
                        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
                        const d = [
                          `M ${x1} ${y1}`,
                          `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
                          `L ${x3} ${y3}`,
                          `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
                          'Z',
                        ].join(' ');
                        acc.elements.push(
                          <path
                            key={item.name}
                            d={d}
                            fill={COLORS[i]}
                            stroke="white"
                            strokeWidth={2}
                          />
                        );
                        acc.cumulative += item.value;
                        return acc;
                      },
                      { elements: [], cumulative: 0 }
                    ).elements}
                    <text textAnchor="middle" dy="-0.2em" className="text-2xl font-bold" fill="#1e293b" style={{ fontSize: '24px', fontWeight: 700 }}>
                      124
                    </text>
                    <text textAnchor="middle" dy="1.2em" fill="#64748b" style={{ fontSize: '12px' }}>
                      Mahasiswa
                    </text>
                  </g>
                </svg>
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Statistik Terkini</h3>
              <div className="space-y-4">
                {insights.map((ins, i) => (
                  <motion.div
                    key={ins.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                    className="flex items-center gap-4 bg-slate-50 rounded-lg p-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                      <ins.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{ins.label}</p>
                      <p className="text-sm font-semibold text-slate-800">{ins.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ALGORITMA ═══════════════ */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="text-center mb-10"
          >
            <span className="inline-block px-3 py-1 bg-teal-50 text-teal-600 text-xs font-semibold rounded-full tracking-wide">
              ALGORITMA
            </span>
            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-primary-800">
              Implementasi Lengkap
            </h2>
            <p className="mt-2 text-slate-500 max-w-xl mx-auto">
              Setiap algoritma dilengkapi dengan estimasi time complexity dan metrik performa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {algorithmCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: i * 0.12, ease: easeOutExpo }}
                className="relative overflow-hidden rounded-xl border border-primary-200 p-6"
                style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdfa 100%)' }}
              >
                {/* Badge */}
                <span
                  className="absolute top-4 right-4 px-2 py-0.5 text-[10px] font-bold rounded-full"
                  style={{ backgroundColor: card.badgeColor, color: card.badgeText }}
                >
                  {card.badge}
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">{card.title}</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  {card.items.map((item) => (
                    <li key={item} className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                      <span>{item.split(' — ')[0]}</span>
                      {item.includes(' — ') && (
                        <span className="font-mono text-xs text-primary-600 bg-white/60 px-1.5 py-0.5 rounded">
                          {item.split(' — ')[1]}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {/* Mini bars */}
                {card.bars.length > 0 && (
                  <div className="flex items-end gap-1.5 h-8 mt-2">
                    {card.bars.map((h, bi) => (
                      <motion.div
                        key={bi}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${h * 0.6}px` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + bi * 0.1, duration: 0.5, ease: easeOutExpo }}
                        className="h-4 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ QUICK ACTIONS ═══════════════ */}
      <section
        className="py-16 md:py-20"
        style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdfa 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900">
              Siap Mengelola Data?
            </h2>
            <p className="mt-2 text-slate-600 max-w-lg mx-auto">
              Mulai dengan menambahkan data mahasiswa atau eksplorasi fitur algoritma.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/mahasiswa"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-lg hover:bg-primary-700 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Tambah Mahasiswa
              </Link>
              <Link
                to="/analisis"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-all duration-200"
              >
                <BarChart3 className="w-5 h-5" />
                Eksplorasi Algoritma
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
