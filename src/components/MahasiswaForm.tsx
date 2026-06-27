import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
// MahasiswaForm - no direct type import needed
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';

export interface FormData {
  nim: string;
  nama: string;
  jurusan: string;
  semester: string;
  ipk: string;
  tahun_masuk: string;
  jenis_kelamin: string;
  email: string;
  no_telepon: string;
  tipe: string;
  judul_skripsi: string;
  dosen_pembimbing: string;
  anggota_ukm: string[];
  judul_tesis: string;
  dosen_promotor: string;
  beasiswa: string;
  publikasi_jurnal: string;
  info_tambahan: string;
}

export interface FormErrors {
  [key: string]: string;
}

interface MahasiswaFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const JURUSAN_OPTIONS = [
  'Informatika',
  'Sistem Informasi',
  'Teknik Elektro',
  'Teknik Komputer',
  'Manajemen',
  'Akuntansi',
  'Psikologi',
  'Hukum',
  'Kedokteran',
  'Ekonomi',
];

const TIPE_OPTIONS = ['Sarjana (S1)', 'Magister (S2)'];

const emptyForm: FormData = {
  nim: '',
  nama: '',
  jurusan: '',
  semester: '',
  ipk: '',
  tahun_masuk: '',
  jenis_kelamin: 'Laki-laki',
  email: '',
  no_telepon: '',
  tipe: 'Sarjana (S1)',
  judul_skripsi: '',
  dosen_pembimbing: '',
  anggota_ukm: [],
  judul_tesis: '',
  dosen_promotor: '',
  beasiswa: '',
  publikasi_jurnal: '',
  info_tambahan: '',
};

function validateField(name: string, value: string, _form: FormData): string {
  switch (name) {
    case 'nim':
      if (!value) return 'NIM wajib diisi';
      if (!/^[0-9]{6,8}$/.test(value)) return 'NIM harus 6-8 digit angka';
      return '';
    case 'nama':
      if (!value) return 'Nama wajib diisi';
      if (!/^[A-Za-z\s\.'-]{3,100}$/.test(value)) return 'Nama hanya boleh huruf, spasi, dan tanda baca';
      return '';
    case 'jurusan':
      if (!value) return 'Jurusan wajib dipilih';
      return '';
    case 'semester':
      if (!value) return 'Semester wajib diisi';
      if (Number(value) < 1 || Number(value) > 14) return 'Semester harus 1-14';
      return '';
    case 'ipk':
      if (!value) return 'IPK wajib diisi';
      if (!/^[0-4](\.\d{1,2})?$/.test(value) || Number(value) > 4) return 'IPK harus antara 0.00 dan 4.00';
      return '';
    case 'tahun_masuk':
      if (!value) return 'Tahun masuk wajib diisi';
      if (Number(value) < 2000 || Number(value) > 2030) return 'Tahun masuk tidak valid';
      return '';
    case 'email':
      if (!value) return 'Email wajib diisi';
      if (!/[\w.-]+@[\w.-]+\.\w{2,}/.test(value)) return 'Format email tidak valid';
      return '';
    case 'no_telepon':
      if (!value) return 'No. telepon wajib diisi';
      if (!/^[0-9]{10,13}$/.test(value)) return 'No. telepon harus 10-13 digit';
      return '';
    case 'tipe':
      if (!value) return 'Tipe wajib dipilih';
      return '';
    default:
      return '';
  }
}

export default function MahasiswaForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: MahasiswaFormProps) {
  const [form, setForm] = useState<FormData>({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [ukmInput, setUkmInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value, form);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, form[name as keyof FormData] as string, form);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleNumberInput = (name: string, value: string, max: number, decimals = 0) => {
    const regex = decimals === 2 ? /^\d*\.?\d{0,2}$/ : /^\d*$/;
    if (value === '' || regex.test(value)) {
      const num = Number(value);
      if (value === '' || num <= max) {
        handleChange(name, value);
      }
    }
  };

  const addUkm = () => {
    if (ukmInput.trim() && !form.anggota_ukm.includes(ukmInput.trim())) {
      setForm((prev) => ({
        ...prev,
        anggota_ukm: [...prev.anggota_ukm, ukmInput.trim()],
      }));
      setUkmInput('');
    }
  };

  const removeUkm = (index: number) => {
    setForm((prev) => ({
      ...prev,
      anggota_ukm: prev.anggota_ukm.filter((_, i) => i !== index),
    }));
  };

  const validateAll = (): boolean => {
    const requiredFields: (keyof FormData)[] = [
      'nim', 'nama', 'jurusan', 'semester', 'ipk', 'tahun_masuk',
      'email', 'no_telepon', 'tipe',
    ];
    const newErrors: FormErrors = {};
    let valid = true;

    requiredFields.forEach((field) => {
      const err = validateField(field, form[field] as string, form);
      if (err) {
        newErrors[field] = err;
        valid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.fromEntries(requiredFields.map((f) => [f, true])));
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit(form);
    }
  };

  const isS1 = form.tipe === 'Sarjana (S1)';
  const isS2 = form.tipe === 'Magister (S2)';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0">
      <Tabs defaultValue="umum" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="umum">Data Umum</TabsTrigger>
          <TabsTrigger value="spesifik">Data Spesifik</TabsTrigger>
        </TabsList>

        {/* Tab: Data Umum */}
        <TabsContent value="umum" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NIM */}
            <div className="space-y-1.5">
              <Label htmlFor="nim">Nomor Induk Mahasiswa <span className="text-red-500">*</span></Label>
              <Input
                id="nim"
                placeholder="Contoh: 210001"
                value={form.nim}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('nim', e.target.value)}
                onBlur={() => handleBlur('nim')}
                aria-invalid={!!errors.nim}
                disabled={!!initialData?.nim}
                className="font-mono"
              />
              {errors.nim && <p className="text-xs text-red-500 mt-1">{errors.nim}</p>}
            </div>

            {/* Nama */}
            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama Lengkap <span className="text-red-500">*</span></Label>
              <Input
                id="nama"
                placeholder="Contoh: Budi Santoso"
                value={form.nama}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('nama', e.target.value)}
                onBlur={() => handleBlur('nama')}
                aria-invalid={!!errors.nama}
              />
              {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
            </div>

            {/* Jurusan */}
            <div className="space-y-1.5">
              <Label>Jurusan <span className="text-red-500">*</span></Label>
              <Select
                value={form.jurusan}
                onValueChange={(value) => handleChange('jurusan', value)}
              >
                <SelectTrigger aria-invalid={!!errors.jurusan}>
                  <SelectValue placeholder="Pilih Jurusan" />
                </SelectTrigger>
                <SelectContent>
                  {JURUSAN_OPTIONS.map((j) => (
                    <SelectItem key={j} value={j}>{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.jurusan && <p className="text-xs text-red-500 mt-1">{errors.jurusan}</p>}
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <Label htmlFor="semester">Semester <span className="text-red-500">*</span></Label>
              <Input
                id="semester"
                type="number"
                min={1}
                max={14}
                placeholder="1 - 14"
                value={form.semester}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput('semester', e.target.value, 14)}
                onBlur={() => handleBlur('semester')}
                aria-invalid={!!errors.semester}
              />
              {errors.semester && <p className="text-xs text-red-500 mt-1">{errors.semester}</p>}
            </div>

            {/* IPK */}
            <div className="space-y-1.5">
              <Label htmlFor="ipk">IPK <span className="text-red-500">*</span></Label>
              <Input
                id="ipk"
                type="text"
                inputMode="decimal"
                placeholder="0.00 - 4.00"
                value={form.ipk}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput('ipk', e.target.value, 4, 2)}
                onBlur={() => handleBlur('ipk')}
                aria-invalid={!!errors.ipk}
              />
              {errors.ipk && <p className="text-xs text-red-500 mt-1">{errors.ipk}</p>}
            </div>

            {/* Tahun Masuk */}
            <div className="space-y-1.5">
              <Label htmlFor="tahun_masuk">Tahun Masuk <span className="text-red-500">*</span></Label>
              <Input
                id="tahun_masuk"
                type="number"
                min={2000}
                max={2030}
                placeholder="Contoh: 2021"
                value={form.tahun_masuk}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput('tahun_masuk', e.target.value, 2030)}
                onBlur={() => handleBlur('tahun_masuk')}
                aria-invalid={!!errors.tahun_masuk}
              />
              {errors.tahun_masuk && <p className="text-xs text-red-500 mt-1">{errors.tahun_masuk}</p>}
            </div>

            {/* Tipe */}
            <div className="space-y-1.5">
              <Label>Tipe <span className="text-red-500">*</span></Label>
              <Select
                value={form.tipe}
                onValueChange={(value) => handleChange('tipe', value)}
              >
                <SelectTrigger aria-invalid={!!errors.tipe}>
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  {TIPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipe && <p className="text-xs text-red-500 mt-1">{errors.tipe}</p>}
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-1.5">
              <Label>Jenis Kelamin</Label>
              <RadioGroup
                value={form.jenis_kelamin}
                onValueChange={(value) => handleChange('jenis_kelamin', value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Laki-laki" id="laki" />
                  <Label htmlFor="laki" className="font-normal cursor-pointer">Laki-laki</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Perempuan" id="perempuan" />
                  <Label htmlFor="perempuan" className="font-normal cursor-pointer">Perempuan</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={form.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* No. Telepon */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="no_telepon">No. Telepon <span className="text-red-500">*</span></Label>
              <Input
                id="no_telepon"
                type="tel"
                placeholder="081234567890"
                value={form.no_telepon}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('no_telepon', e.target.value.replace(/\D/g, ''))}
                onBlur={() => handleBlur('no_telepon')}
                aria-invalid={!!errors.no_telepon}
              />
              {errors.no_telepon && <p className="text-xs text-red-500 mt-1">{errors.no_telepon}</p>}
            </div>

            {/* Info Tambahan */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="info_tambahan">Catatan Tambahan</Label>
              <Textarea
                id="info_tambahan"
                placeholder="Catatan opsional..."
                value={form.info_tambahan}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('info_tambahan', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab: Data Spesifik */}
        <TabsContent value="spesifik" className="space-y-4 mt-0">
          {isS1 && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm font-medium text-indigo-800">Data Skripsi &mdash; S1</p>
                <p className="text-xs text-indigo-600 mt-0.5">Informasi spesifik untuk mahasiswa Sarjana</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="judul_skripsi">Judul Skripsi</Label>
                <Input
                  id="judul_skripsi"
                  placeholder="Judul skripsi..."
                  value={form.judul_skripsi}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('judul_skripsi', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dosen_pembimbing">Dosen Pembimbing</Label>
                <Input
                  id="dosen_pembimbing"
                  placeholder="Nama dosen pembimbing..."
                  value={form.dosen_pembimbing}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('dosen_pembimbing', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Anggota UKM</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tambah UKM..."
                    value={ukmInput}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUkmInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUkm(); } }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addUkm}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {form.anggota_ukm.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.anggota_ukm.map((ukm, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                      >
                        {ukm}
                        <button type="button" onClick={() => removeUkm(i)} className="hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {isS2 && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm font-medium text-purple-800">Data Tesis &mdash; S2</p>
                <p className="text-xs text-purple-600 mt-0.5">Informasi spesifik untuk mahasiswa Magister</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="judul_tesis">Judul Tesis</Label>
                <Input
                  id="judul_tesis"
                  placeholder="Judul tesis..."
                  value={form.judul_tesis}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('judul_tesis', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dosen_promotor">Dosen Promotor</Label>
                <Input
                  id="dosen_promotor"
                  placeholder="Nama dosen promotor..."
                  value={form.dosen_promotor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('dosen_promotor', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="beasiswa">Beasiswa</Label>
                <Input
                  id="beasiswa"
                  placeholder="Nama beasiswa (jika ada)..."
                  value={form.beasiswa}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('beasiswa', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="publikasi_jurnal">Jumlah Publikasi Jurnal</Label>
                <Input
                  id="publikasi_jurnal"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.publikasi_jurnal}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput('publikasi_jurnal', e.target.value, 100)}
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-primary-600 hover:bg-primary-700">
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
