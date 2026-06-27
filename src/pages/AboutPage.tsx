import { motion } from 'framer-motion';
import {
  Code, Terminal, GitBranch, Shield, Layers, Database,
  FileText, AlertCircle, CheckCircle, ArrowRight,
  ChevronDown, Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

/* ------------------------------------------------------------------ */
/*  ANIMATION VARIANTS                                                 */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

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
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const TECH_STACK = [
  {
    icon: Code,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    title: 'React 19 + TypeScript',
    description: 'Frontend framework dengan type safety. Komponen reusable, state management, dan hooks untuk logic yang bersih.',
    tags: ['Vite', 'Tailwind CSS', 'shadcn/ui'],
  },
  {
    icon: Terminal,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    title: 'Python Flask',
    description: 'Backend micro-framework untuk REST API. Menangani CRUD operations, file I/O, dan algorithm execution.',
    tags: ['REST API', 'JSON', 'CSV'],
  },
  {
    icon: GitBranch,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    title: 'Algoritma & Struktur Data',
    description: 'Implementasi 8 algoritma (3 pencarian + 5 pengurutan) dengan analisis Big-O dan visualisasi interaktif.',
    tags: ['OOP', 'Complexity Analysis'],
  },
  {
    icon: Shield,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    title: 'Validasi & Error Handling',
    description: 'Regular Expression untuk validasi input, Try-Catch untuk exception handling, dan feedback error yang informatif.',
    tags: ['Regex', 'Try-Catch', 'Exception'],
  },
  {
    icon: Layers,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    title: 'Desain Modern & Responsif',
    description: 'Mobile-first responsive design dengan Tailwind CSS. Animasi halus, micro-interactions, dan accessibility-aware components.',
    tags: ['Responsive', 'GSAP', 'Framer Motion'],
  },
  {
    icon: Database,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    title: 'Penyimpanan Data',
    description: 'File I/O untuk CSV dan JSON export/import. Demonstrasi konsep pointer, array, dan struktur data dalam praktik.',
    tags: ['File I/O', 'CSV', 'JSON'],
  },
];

const OOP_PILLARS = [
  {
    num: '01',
    title: 'Enkapsulasi (Encapsulation)',
    description: 'Data disembunyikan (private/protected) dan diakses melalui getter/setter method. Validasi input dilakukan dalam setter untuk menjaga integritas data.',
    code: 'getNim(), setNim(nim), getIpk(), setIpk(ipk)',
  },
  {
    num: '02',
    title: 'Pewarisan (Inheritance)',
    description: 'Class anak mewarisi atribut dan method dari class induk. Contoh: class Dosen mewarisi dari class Person, menambahkan atribut spesifik seperti nidn dan matakuliah.',
    code: 'class Dosen extends Person { nidn, matakuliah[] }',
  },
  {
    num: '03',
    title: 'Polimorfisme (Polymorphism)',
    description: 'Method yang sama dapat berperilaku berbeda tergantung class yang memanggilnya. Contoh: method tampilkanInfo() berbeda output untuk Mahasiswa vs Dosen.',
    code: 'tampilkanInfo() \u2192 override di subclass',
  },
  {
    num: '04',
    title: 'Abstraksi (Abstraction)',
    description: 'Abstract base class Mahasiswa mendefinisikan interface umum. Subclass (MahasiswaSarjana, MahasiswaMagister) mengimplementasikan method spesifik masing-masing.',
    code: 'abstract class Mahasiswa { abstract getInfo() }',
  },
];

const GUIDELINES = [
  {
    icon: Code,
    title: 'Penamaan Variabel (Naming Convention)',
    items: [
      'Gunakan **camelCase** untuk variabel dan function: `namaMahasiswa`, `hitungIpk()`',
      'Gunakan **PascalCase** untuk nama class: `Mahasiswa`, `DataManager`',
      'Gunakan **UPPER_SNAKE_CASE** untuk konstanta: `MAX_DATA = 1000`',
      'Nama variabel harus **deskriptif**: `daftarMahasiswa` (\u2713) vs `dm` (\u2717)',
      'Hindari singkatan yang tidak umum',
    ],
  },
  {
    icon: Layers,
    title: 'Modularisasi Kode',
    items: [
      'Pisahkan logic ke dalam **function yang spesifik** \u2014 satu function, satu tugas',
      'Gunakan **class** untuk mengelompokkan data dan behavior yang terkait',
      'Pisahkan concerns: UI logic, business logic, dan data access',
      'Setiap module/file tidak lebih dari 300-400 baris',
      'Gunakan import/export untuk dependency management',
    ],
  },
  {
    icon: FileText,
    title: 'Komentar dan Dokumentasi',
    items: [
      'Tulis **docstring** untuk setiap class dan function publik',
      'Gunakan komentar untuk menjelaskan **mengapa**, bukan **apa** \u2014 kode harus self-documenting',
      'Format docstring: deskripsi, parameter, return value, contoh penggunaan',
      'Update komentar saat mengubah kode \u2014 komentar usang lebih buruk dari tidak ada komentar',
      'Contoh: `// Menggunakan Binary Search karena data sudah terurut`',
    ],
  },
  {
    icon: Shield,
    title: 'Validasi Input dengan Regex',
    items: [
      'Validasi **selalu** dilakukan sebelum memproses data',
      'Gunakan **Regular Expression** untuk format spesifik: NIM (`^[0-9]{6}$`), Email, IPK',
      'Berikan **error message yang jelas** kepada pengguna',
      'Validasi di **frontend** untuk UX, di **backend** untuk keamanan',
      'Contoh validasi NIM: `const nimRegex = /^[0-9]{6}$/; nimRegex.test(input)`',
    ],
  },
  {
    icon: AlertCircle,
    title: 'Penanganan Error (Try-Catch & Exception)',
    items: [
      'Gunakan **Try-Catch** untuk operasi yang mungkin gagal: file I/O, parsing, network',
      'Tangkap exception **spesifik**, bukan catch-all',
      'Berikan **fallback behavior** \u2014 jangan biarkan aplikasi crash',
      'Log error untuk debugging, tampilkan pesan yang user-friendly',
      'Contoh: `try { bacaFile() } catch (FileNotFoundError) { tampilkanPesan(\'File tidak ditemukan\') }`',
    ],
  },
  {
    icon: Zap,
    title: 'Penggunaan Algoritma',
    items: [
      'Pilih algoritma berdasarkan **kebutuhan** dan karakteristik data',
      'Pertimbangkan **time & space complexity** sebelum implementasi',
      'Test dengan **data besar** untuk mengidentifikasi bottleneck',
      'Dokumentasikan kompleksitas di komentar atau README',
    ],
  },
];

const FEATURES = [
  'Input, edit, hapus, tampilkan data (CRUD)',
  'Penyimpanan & pembacaan file (File I/O)',
  'Konsep OOP (Class, Objek, Enkapsulasi, Pewarisan, Polimorfisme)',
  'Pencarian (Linear, Binary, Sequential Search)',
  'Pengurutan (Insertion, Selection, Merge, Bubble, Shell Sort)',
  'Validasi Regex (NIM, Nama, Email, IPK)',
  'Error Handling (Try-Catch & Exception)',
  'Estimasi Time Complexity (Big-O Analysis)',
  'Guidelines & Best Practices',
];

const PROJECT_DETAILS = [
  { label: 'Nama Proyek', value: 'Aplikasi Manajemen Data Mahasiswa' },
  { label: 'Versi', value: 'v1.0.0' },
  { label: 'Dibuat dengan', value: 'React 19 + TypeScript + Flask' },
  { label: 'Lisensi', value: 'MIT License' },
  { label: 'Terakhir Diperbarui', value: 'Januari 2026' },
];

/* ------------------------------------------------------------------ */
/*  CODE SNIPPET COMPONENT                                             */
/* ------------------------------------------------------------------ */

function CodeSnippet({ code }: { code: string }) {
  return (
    <div className="mt-3 bg-slate-100 rounded-md px-3 py-2 font-mono text-[0.8rem] text-slate-700 overflow-x-auto">
      {code}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  OOP DIAGRAM SVG                                                    */
/* ------------------------------------------------------------------ */

function OopDiagram() {
  return (
    <svg viewBox="0 0 600 320" className="w-full max-w-xl mx-auto" fill="none">
      {/* Abstract base class */}
      <rect x="200" y="10" width="200" height="70" rx="10" fill="#eef2ff" stroke="#6366f1" strokeWidth="2" />
      <text x="300" y="38" textAnchor="middle" className="text-sm font-semibold" fill="#312e81">
        Mahasiswa (Abstract)
      </text>
      <text x="300" y="58" textAnchor="middle" fontSize="11" fill="#6366f1" fontFamily="monospace">
        # nim, nama, jurusan, ipk
      </text>
      <text x="300" y="72" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">
        + getInfo(), validate()
      </text>

      {/* Arrows to subclasses */}
      <line x1="300" y1="80" x2="300" y2="110" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 3" />
      <polygon points="295,105 300,115 305,105" fill="#6366f1" />
      <text x="310" y="102" fontSize="10" fill="#6366f1">extends</text>

      {/* Left: MahasiswaSarjana */}
      <rect x="50" y="120" width="200" height="80" rx="10" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2" />
      <text x="150" y="148" textAnchor="middle" className="text-sm font-semibold" fill="#0f766e">
        MahasiswaSarjana
      </text>
      <text x="150" y="168" textAnchor="middle" fontSize="11" fill="#14b8a6" fontFamily="monospace">
        - judul_skripsi
      </text>
      <text x="150" y="185" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">
        + getInfo(), getBeasiswa()
      </text>

      {/* Arrow */}
      <line x1="180" y1="90" x2="250" y2="120" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 3" />
      <polygon points="178,97 180,88 186,94" fill="#6366f1" />

      {/* Right: MahasiswaMagister */}
      <rect x="350" y="120" width="200" height="80" rx="10" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2" />
      <text x="450" y="148" textAnchor="middle" className="text-sm font-semibold" fill="#0f766e">
        MahasiswaMagister
      </text>
      <text x="450" y="168" textAnchor="middle" fontSize="11" fill="#14b8a6" fontFamily="monospace">
        - judul_tesis, promotor
      </text>
      <text x="450" y="185" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">
        + getInfo(), getPublikasi()
      </text>

      {/* Arrow */}
      <line x1="420" y1="90" x2="350" y2="120" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 3" />
      <polygon points="418,97 420,88 426,94" fill="#6366f1" />

      {/* Bottom: Person (parent) */}
      <rect x="200" y="240" width="200" height="60" rx="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="300" y="265" textAnchor="middle" className="text-sm font-semibold" fill="#475569">
        Person (Base Class)
      </text>
      <text x="300" y="285" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">
        # nama, email, no_telepon
      </text>

      {/* Arrow up */}
      <line x1="300" y1="240" x2="300" y2="200" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 3" />
      <polygon points="295,205 300,195 305,205" fill="#94a3b8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
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
            <p className="text-sm text-white/60 mb-2">Dashboard / Tentang</p>
            <h1 className="text-3xl lg:text-[2.5rem] font-extrabold text-white leading-tight mb-4">
              Tentang Aplikasi
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed"
          >
            Dokumentasi teknis, konsep OOP, guidelines penulisan kode, dan teknologi yang digunakan dalam aplikasi Manajemen Data Mahasiswa ini.
          </motion.p>
        </div>
      </section>

      {/* ====== TECH STACK ====== */}
      <Section bg="bg-slate-50">
        <div className="mb-10">
          <SectionBadge text="Teknologi" />
          <h2 className="text-2xl lg:text-[1.75rem] font-bold text-primary-800 mt-3 mb-2">Stack Teknologi</h2>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Aplikasi ini dibangun dengan teknologi modern untuk frontend dan backend, mengedepankan type safety, responsivitas, dan performa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_STACK.map((tech, i) => (
            <motion.div
              key={tech.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
            >
              <Card className="border-slate-200 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full ${tech.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <tech.icon className={`w-6 h-6 ${tech.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800 mb-2">{tech.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{tech.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tech.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ====== OOP CONCEPTS ====== */}
      <Section bg="bg-white">
        <div className="mb-10">
          <SectionBadge text="OOP" color="bg-teal-50 text-teal-700" />
          <h2 className="text-2xl lg:text-[1.75rem] font-bold text-primary-800 mt-3 mb-2">Penerapan Konsep OOP</h2>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Empat pilar Object-Oriented Programming yang diimplementasikan dalam arsitektur aplikasi ini.
          </p>
        </div>

        {/* OOP Diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto mb-10 bg-slate-50 rounded-xl border border-slate-200 p-6"
        >
          <OopDiagram />
          <p className="text-center text-xs text-slate-400 mt-3">
            Diagram hierarki class: Person \u2192 Mahasiswa \u2192 MahasiswaSarjana / MahasiswaMagister
          </p>
        </motion.div>

        {/* 4 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OOP_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.num}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
            >
              <Card className="border-slate-200 h-full bg-gradient-to-br from-primary-50/50 to-teal-50/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                      className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold shrink-0"
                    >
                      {pillar.num}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-800 mb-2">{pillar.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-2">{pillar.description}</p>
                      <CodeSnippet code={pillar.code} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ====== GUIDELINES & BEST PRACTICES ====== */}
      <Section bg="bg-slate-50">
        <div className="mb-10">
          <SectionBadge text="Guidelines" color="bg-amber-50 text-amber-600" />
          <h2 className="text-2xl lg:text-[1.75rem] font-bold text-primary-800 mt-3 mb-2">Pedoman Penulisan Kode</h2>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Standar dan best practices yang diterapkan dalam pengembangan aplikasi ini. Ikuti pedoman ini untuk menjaga kualitas kode.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="multiple" className="space-y-2">
            {GUIDELINES.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.35 }}
                >
                  <AccordionItem value={guide.title} className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50 transition-colors [&[data-state=open]]:bg-slate-50">
                      <div className="flex items-center gap-3 text-left">
                        <Icon className="w-5 h-5 text-primary-500 shrink-0" />
                        <span className="text-sm font-semibold text-slate-700">{guide.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <ul className="space-y-2.5 mt-1">
                        {guide.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                            <ChevronDown className="w-3.5 h-3.5 text-primary-400 mt-0.5 shrink-0 rotate-[-90deg]" />
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item
                                  .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-800">$1</strong>')
                                  .replace(/`(.+?)`/g, '<code class="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">$1</code>'),
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </div>
      </Section>

      {/* ====== PROJECT INFO ====== */}
      <Section bg="bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left — Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-primary-900 mb-5">Informasi Proyek</h3>
              <div className="space-y-4">
                {PROJECT_DETAILS.map((detail, i) => (
                  <motion.div
                    key={detail.label}
                    custom={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-0.5">
                      {detail.label}
                    </p>
                    <p className="text-sm font-medium text-slate-700">{detail.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — Feature Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <h3 className="text-lg font-semibold text-primary-900 mb-5">Fitur yang Diimplementasikan</h3>
              <div className="space-y-3">
                {FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature}
                    custom={i}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-14 text-center"
          >
            <h3 className="text-xl font-bold text-primary-900 mb-4">
              Siap mulai mengelola data?
            </h3>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-primary-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Ke Dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
