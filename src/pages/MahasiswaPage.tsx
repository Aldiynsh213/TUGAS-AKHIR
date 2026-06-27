import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import type { Mahasiswa } from '@/types';
import type { FormData } from '@/components/MahasiswaForm';
import { useMahasiswa } from '@/hooks/useMahasiswa';
import type { FilterOptions, SortConfig } from '@/hooks/useMahasiswa';
import MahasiswaForm from '@/components/MahasiswaForm';
import MahasiswaCard from '@/components/MahasiswaCard';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  AlertCircle,
  Users,
  GraduationCap,
  BookOpen,
  Mail,
  Phone,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── helpers ─── */
function getIpkClass(ipk: number): string {
  if (ipk >= 3.5) return 'text-emerald-600 font-semibold';
  if (ipk >= 3.0) return 'text-amber-600 font-semibold';
  return 'text-red-500 font-semibold';
}

function getIpkBadgeClass(ipk: number): string {
  if (ipk >= 3.5) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (ipk >= 3.0) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-red-50 text-red-600 border-red-200';
}

function getJurusanBadgeClass(jurusan: string): string {
  const map: Record<string, string> = {
    'Informatika': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Sistem Informasi': 'bg-teal-50 text-teal-700 border-teal-200',
    'Teknik Komputer': 'bg-amber-50 text-amber-700 border-amber-200',
    'Teknik Elektro': 'bg-sky-50 text-sky-700 border-sky-200',
    'Manajemen': 'bg-rose-50 text-rose-700 border-rose-200',
    'Akuntansi': 'bg-violet-50 text-violet-700 border-violet-200',
    'Psikologi': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    'Hukum': 'bg-orange-50 text-orange-700 border-orange-200',
    'Kedokteran': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Ekonomi': 'bg-lime-50 text-lime-700 border-lime-200',
  };
  return map[jurusan] || 'bg-slate-100 text-slate-700 border-slate-200';
}

function getTipeBadgeClass(tipe: string): string {
  return tipe === 'Sarjana (S1)'
    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
    : 'bg-purple-50 text-purple-700 border-purple-200';
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-teal-100 text-teal-700',
    'bg-rose-100 text-rose-700',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
    'bg-sky-100 text-sky-700',
    'bg-violet-100 text-violet-700',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function mhsToFormData(m: Mahasiswa): Partial<FormData> {
  return {
    nim: m.nim,
    nama: m.nama,
    jurusan: m.jurusan,
    semester: String(m.semester),
    ipk: String(m.ipk),
    tahun_masuk: String(m.tahun_masuk),
    jenis_kelamin: m.jenis_kelamin,
    email: m.email,
    no_telepon: m.no_telepon,
    tipe: m.tipe,
    judul_skripsi: m.judul_skripsi || '',
    dosen_pembimbing: m.dosen_pembimbing || '',
    anggota_ukm: m.anggota_ukm || [],
    judul_tesis: m.judul_tesis || '',
    dosen_promotor: m.dosen_promotor || '',
    beasiswa: m.beasiswa || '',
    publikasi_jurnal: m.publikasi_jurnal !== undefined ? String(m.publikasi_jurnal) : '',
    info_tambahan: m.info_tambahan || '',
  };
}

function formToMahasiswa(form: FormData): Omit<Mahasiswa, 'nim'> & { nim: string } {
  return {
    nim: form.nim,
    nama: form.nama,
    jurusan: form.jurusan,
    semester: Number(form.semester),
    ipk: Number(form.ipk),
    tahun_masuk: Number(form.tahun_masuk),
    jenis_kelamin: form.jenis_kelamin,
    email: form.email,
    no_telepon: form.no_telepon,
    tipe: form.tipe,
    ...(form.tipe === 'Sarjana (S1)' ? {
      judul_skripsi: form.judul_skripsi || undefined,
      dosen_pembimbing: form.dosen_pembimbing || undefined,
      anggota_ukm: form.anggota_ukm.length > 0 ? form.anggota_ukm : undefined,
    } : {
      judul_tesis: form.judul_tesis || undefined,
      dosen_promotor: form.dosen_promotor || undefined,
      beasiswa: form.beasiswa || undefined,
      publikasi_jurnal: form.publikasi_jurnal ? Number(form.publikasi_jurnal) : undefined,
    }),
    info_tambahan: form.info_tambahan || undefined,
  };
}

/* ─── page ─── */
export default function MahasiswaPage() {
  const {
    data: allData,
    create,
    update,
    remove,
    filterAndSort,
    jurusanOptions,
    semesterOptions,
    tipeOptions,
  } = useMahasiswa();

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    jurusan: 'all',
    semester: 'all',
    tipe: 'all',
  });

  const [sort, setSort] = useState<SortConfig>({ key: null, direction: 'asc' });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editMhs, setEditMhs] = useState<Mahasiswa | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Mahasiswa | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMhs, setDetailMhs] = useState<Mahasiswa | null>(null);

  /* Filtered & sorted data */
  const filteredData = useMemo(
    () => filterAndSort(filters, sort),
    [filters, sort, filterAndSort, allData]
  );

  const totalCount = allData.length;
  const filteredCount = filteredData.length;

  /* Sort handler */
  const handleSort = (key: keyof Mahasiswa) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ column }: { column: keyof Mahasiswa }) => {
    if (sort.key !== column) return <ChevronUp className="w-3 h-3 text-slate-300" />;
    return sort.direction === 'asc'
      ? <ChevronUp className="w-3 h-3 text-indigo-600" />
      : <ChevronDown className="w-3 h-3 text-indigo-600" />;
  };

  /* Create */
  const openCreate = () => {
    setModalMode('create');
    setEditMhs(null);
    setModalOpen(true);
  };

  /* Edit */
  const openEdit = (m: Mahasiswa) => {
    setModalMode('edit');
    setEditMhs(m);
    setModalOpen(true);
  };

  /* Delete */
  const openDelete = (m: Mahasiswa) => {
    setDeleteTarget(m);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await remove(deleteTarget.nim);
      toast.success(`Data ${deleteTarget.nama} berhasil dihapus`);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error('Gagal menghapus data');
    } finally {
      setDeleteLoading(false);
    }
  };

  /* View detail */
  const openDetail = (m: Mahasiswa) => {
    setDetailMhs(m);
    setDetailOpen(true);
  };

  /* Submit form */
  const handleFormSubmit = async (form: FormData) => {
    setFormLoading(true);
    try {
      if (modalMode === 'create') {
        await create(formToMahasiswa(form));
        toast.success(`Mahasiswa ${form.nama} berhasil ditambahkan`);
      } else {
        if (!editMhs) return;
        const updates = formToMahasiswa(form);
        // Remove nim from updates for edit
        const { nim, ...rest } = updates;
        void nim;
        await update(editMhs.nim, rest);
        toast.success(`Data ${form.nama} berhasil diperbarui`);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc]">
      <Toaster position="top-right" richColors />

      {/* ── Header ── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-500">Data Mahasiswa</span>
          </nav>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
            >
              <h1 className="text-xl lg:text-2xl font-bold text-primary-900">
                Data Mahasiswa
                <Badge variant="outline" className="ml-2.5 bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                  {filteredCount}
                </Badge>
              </h1>
              <p className="text-sm text-slate-500 mt-1">Kelola data mahasiswa aktif</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: easeOutExpo }}
            >
              <Button
                onClick={openCreate}
                className="bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{ borderRadius: '0.5rem' }}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah Mahasiswa
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            className="flex flex-wrap items-center gap-2"
          >
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari nama, NIM, atau jurusan..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-9 h-9 text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Jurusan filter */}
            <Select
              value={filters.jurusan}
              onValueChange={(v) => setFilters((prev) => ({ ...prev, jurusan: v }))}
            >
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="Semua Jurusan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jurusan</SelectItem>
                {jurusanOptions.filter((o) => o !== 'all').map((j) => (
                  <SelectItem key={j} value={j}>{j}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Semester filter */}
            <Select
              value={filters.semester}
              onValueChange={(v) => setFilters((prev) => ({ ...prev, semester: v }))}
            >
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <SelectValue placeholder="Semua Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Semester</SelectItem>
                {semesterOptions.filter((o) => o !== 'all').map((s) => (
                  <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tipe filter */}
            <Select
              value={filters.tipe}
              onValueChange={(v) => setFilters((prev) => ({ ...prev, tipe: v }))}
            >
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <SelectValue placeholder="Semua Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                {tipeOptions.filter((o) => o !== 'all').map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear filters */}
            {(filters.search || filters.jurusan !== 'all' || filters.semester !== 'all' || filters.tipe !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ search: '', jurusan: 'all', semester: 'all', tipe: 'all' })}
                className="h-9 text-slate-500 hover:text-slate-700"
              >
                Reset
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
        {filteredCount === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <Empty className="min-h-[400px] bg-white rounded-xl border border-slate-200">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <GraduationCap className="w-6 h-6 text-slate-400" />
                </EmptyMedia>
                <EmptyTitle className="text-slate-700">
                  {allData.length === 0 ? 'Belum ada data mahasiswa' : 'Tidak ada data yang cocok'}
                </EmptyTitle>
                <EmptyDescription>
                  {allData.length === 0
                    ? 'Mulai tambahkan data mahasiswa pertama Anda.'
                    : 'Coba ubah filter atau kata kunci pencarian.'}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                {allData.length === 0 && (
                  <Button onClick={openCreate} className="bg-primary-600 hover:bg-primary-700">
                    <Plus className="w-4 h-4 mr-1.5" />
                    Tambah Mahasiswa
                  </Button>
                )}
              </EmptyContent>
            </Empty>
          </motion.div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="w-[48px] text-xs font-semibold text-slate-500 uppercase tracking-wider">#</TableHead>
                      <TableHead
                        className="text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => handleSort('nim')}
                      >
                        <span className="flex items-center gap-1">
                          NIM
                          <SortIcon column="nim" />
                        </span>
                      </TableHead>
                      <TableHead
                        className="text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => handleSort('nama')}
                      >
                        <span className="flex items-center gap-1">
                          Nama
                          <SortIcon column="nama" />
                        </span>
                      </TableHead>
                      <TableHead
                        className="text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => handleSort('jurusan')}
                      >
                        <span className="flex items-center gap-1">
                          Jurusan
                          <SortIcon column="jurusan" />
                        </span>
                      </TableHead>
                      <TableHead
                        className="text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => handleSort('semester')}
                      >
                        <span className="flex items-center gap-1">
                          Smt
                          <SortIcon column="semester" />
                        </span>
                      </TableHead>
                      <TableHead
                        className="text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => handleSort('ipk')}
                      >
                        <span className="flex items-center gap-1">
                          IPK
                          <SortIcon column="ipk" />
                        </span>
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jenis Kelamin</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipe</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredData.map((m, i) => (
                        <motion.tr
                          key={m.nim}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: i * 0.03, ease: easeOutExpo }}
                          className={`border-b border-slate-100 transition-colors hover:bg-indigo-50/40 cursor-pointer ${i % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}
                          onClick={() => openDetail(m)}
                        >
                          <TableCell className="text-sm text-slate-400">{i + 1}</TableCell>
                          <TableCell className="font-mono text-sm text-indigo-600 font-medium">{m.nim}</TableCell>
                          <TableCell className="text-sm font-medium text-slate-800">{m.nama}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-xs ${getJurusanBadgeClass(m.jurusan)}`}>
                              {m.jurusan}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">{m.semester}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${getIpkBadgeClass(m.ipk)} ${getIpkClass(m.ipk)}`}>
                              {m.ipk.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {m.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-xs ${getTipeBadgeClass(m.tipe)}`}>
                              {m.tipe === 'Sarjana (S1)' ? 'S1' : 'S2'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                                onClick={() => openEdit(m)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
                                onClick={() => openDelete(m)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </motion.div>
            </div>

            {/* Mobile Card List */}
            <div className="lg:hidden space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredData.map((m, i) => (
                  <motion.div
                    key={m.nim}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.05, ease: easeOutExpo }}
                  >
                    <MahasiswaCard
                      mahasiswa={m}
                      index={i}
                      onEdit={openEdit}
                      onDelete={openDelete}
                      onView={openDetail}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Result count */}
            <p className="text-xs text-slate-400 mt-4">
              Menampilkan {filteredCount} dari {totalCount} data mahasiswa
              {(filters.search || filters.jurusan !== 'all' || filters.semester !== 'all' || filters.tipe !== 'all') && ' (terfilter)'}
            </p>
          </>
        )}
      </section>

      {/* ── Create/Edit Modal ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[520px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200">
            <DialogTitle className="text-lg font-semibold text-slate-800">
              {modalMode === 'create' ? 'Tambah Mahasiswa' : 'Edit Mahasiswa'}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {modalMode === 'create'
                ? 'Isi formulir berikut untuk menambahkan mahasiswa baru.'
                : 'Perbarui informasi mahasiswa yang dipilih.'}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <MahasiswaForm
              key={modalOpen ? (editMhs?.nim || 'new') : 'closed'}
              initialData={editMhs ? mhsToFormData(editMhs) : undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setModalOpen(false)}
              isLoading={formLoading}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-[400px] p-0">
          <div className="px-6 pt-8 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            >
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Hapus Data?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Data mahasiswa <strong>{deleteTarget?.nama}</strong> akan dihapus permanen.
              <br />Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteLoading}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Hapus
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Detail Sheet ── */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="right">
          <SheetHeader className="pb-4 border-b border-slate-200">
            <SheetTitle className="text-lg font-semibold text-slate-800">Detail Mahasiswa</SheetTitle>
            <SheetDescription className="text-sm text-slate-500">
              Informasi lengkap mahasiswa
            </SheetDescription>
          </SheetHeader>

          {detailMhs && (
            <div className="py-5 space-y-5">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(detailMhs.nama)}`}>
                  {getInitials(detailMhs.nama)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{detailMhs.nama}</h3>
                  <p className="text-sm font-mono text-indigo-600">{detailMhs.nim}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className={`text-xs ${getJurusanBadgeClass(detailMhs.jurusan)}`}>
                      {detailMhs.jurusan}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getTipeBadgeClass(detailMhs.tipe)}`}>
                      {detailMhs.tipe === 'Sarjana (S1)' ? 'S1' : 'S2'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* General Info */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Informasi Umum
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Semester</p>
                    <p className="text-sm font-medium text-slate-700">{detailMhs.semester}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">IPK</p>
                    <p className={`text-sm font-bold ${getIpkClass(detailMhs.ipk)}`}>
                      {detailMhs.ipk.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Tahun Masuk</p>
                    <p className="text-sm font-medium text-slate-700">{detailMhs.tahun_masuk}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Jenis Kelamin</p>
                    <p className="text-sm font-medium text-slate-700">{detailMhs.jenis_kelamin}</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  Kontak
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{detailMhs.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{detailMhs.no_telepon}</span>
                  </div>
                </div>
              </div>

              {/* S1 Specific */}
              {detailMhs.tipe === 'Sarjana (S1)' && (
                <div className="bg-indigo-50/60 rounded-lg p-4 space-y-3 border border-indigo-100">
                  <h4 className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Data Skripsi (S1)
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-indigo-500/70">Judul Skripsi</p>
                      <p className="text-sm font-medium text-indigo-900">
                        {detailMhs.judul_skripsi || <span className="text-indigo-400 italic">Belum ada</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-500/70">Dosen Pembimbing</p>
                      <p className="text-sm font-medium text-indigo-900">
                        {detailMhs.dosen_pembimbing || <span className="text-indigo-400 italic">Belum ada</span>}
                      </p>
                    </div>
                    {detailMhs.anggota_ukm && detailMhs.anggota_ukm.length > 0 && (
                      <div>
                        <p className="text-xs text-indigo-500/70 mb-1">Anggota UKM</p>
                        <div className="flex flex-wrap gap-1.5">
                          {detailMhs.anggota_ukm.map((ukm, i) => (
                            <Badge key={i} variant="outline" className="bg-white text-indigo-700 border-indigo-200 text-xs">
                              {ukm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* S2 Specific */}
              {detailMhs.tipe === 'Magister (S2)' && (
                <div className="bg-purple-50/60 rounded-lg p-4 space-y-3 border border-purple-100">
                  <h4 className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Data Tesis (S2)
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-purple-500/70">Judul Tesis</p>
                      <p className="text-sm font-medium text-purple-900">
                        {detailMhs.judul_tesis || <span className="text-purple-400 italic">Belum ada</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-500/70">Dosen Promotor</p>
                      <p className="text-sm font-medium text-purple-900">
                        {detailMhs.dosen_promotor || <span className="text-purple-400 italic">Belum ada</span>}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-purple-500/70">Beasiswa</p>
                        <p className="text-sm font-medium text-purple-900">
                          {detailMhs.beasiswa || <span className="text-purple-400 italic">-</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-500/70">Publikasi Jurnal</p>
                        <p className="text-sm font-medium text-purple-900">
                          {detailMhs.publikasi_jurnal !== undefined ? detailMhs.publikasi_jurnal : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setDetailOpen(false);
                    openEdit(detailMhs);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    setDetailOpen(false);
                    openDelete(detailMhs);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Hapus
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
