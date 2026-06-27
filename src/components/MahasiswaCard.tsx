import type { Mahasiswa } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface MahasiswaCardProps {
  mahasiswa: Mahasiswa;
  index: number;
  onEdit: (m: Mahasiswa) => void;
  onDelete: (m: Mahasiswa) => void;
  onView: (m: Mahasiswa) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
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

function getIpkColor(ipk: number): string {
  if (ipk >= 3.5) return 'text-emerald-600';
  if (ipk >= 3.0) return 'text-amber-600';
  return 'text-red-500';
}

function getIpkBg(ipk: number): string {
  if (ipk >= 3.5) return 'bg-emerald-50 border-emerald-200';
  if (ipk >= 3.0) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

function getJurusanColor(jurusan: string): string {
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

export default function MahasiswaCard({ mahasiswa, onEdit, onDelete, onView }: MahasiswaCardProps) {
  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      onClick={() => onView(mahasiswa)}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${getAvatarColor(mahasiswa.nama)}`}
        >
          {getInitials(mahasiswa.nama)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-800 truncate">{mahasiswa.nama}</p>
              <p className="text-xs font-mono text-indigo-600 mt-0.5">{mahasiswa.nim}</p>
            </div>
            <Badge variant="outline" className={`text-xs shrink-0 ${getJurusanColor(mahasiswa.jurusan)}`}>
              {mahasiswa.jurusan}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span>Semester {mahasiswa.semester}</span>
            <span>{mahasiswa.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${getIpkBg(mahasiswa.ipk)} ${getIpkColor(mahasiswa.ipk)}`}>
                IPK {mahasiswa.ipk.toFixed(2)}
              </span>
              <Badge variant="outline" className={`text-xs ${mahasiswa.tipe === 'Sarjana (S1)' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                {mahasiswa.tipe === 'Sarjana (S1)' ? 'S1' : 'S2'}
              </Badge>
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => onEdit(mahasiswa)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
                onClick={() => onDelete(mahasiswa)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
