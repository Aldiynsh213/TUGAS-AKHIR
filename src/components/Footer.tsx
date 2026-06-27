import { Link } from 'react-router-dom';
import { GraduationCap, Github, Code, Database } from 'lucide-react';

const quickLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/mahasiswa', label: 'Data Mahasiswa' },
  { path: '/pencarian', label: 'Pencarian' },
  { path: '/pengurutan', label: 'Pengurutan' },
  { path: '/analisis', label: 'Analisis' },
  { path: '/tentang', label: 'Tentang' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* App Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-6 h-6 text-primary-400" />
              <span className="text-lg font-bold text-white">DataMahasiswa</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Aplikasi manajemen data mahasiswa edukatif dengan implementasi
              algoritma pencarian, pengurutan, dan analisis kompleksitas.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs bg-slate-700 px-2 py-1 rounded-md">
                <Code className="w-3 h-3" /> React + TypeScript
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-slate-700 px-2 py-1 rounded-md">
                <Database className="w-3 h-3" /> Python Flask
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Tech Stack
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Code className="w-4 h-4 text-primary-400" /> React + TypeScript
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary-400" /> Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <Github className="w-4 h-4 text-primary-400" /> shadcn/ui
              </li>
              <li className="flex items-center gap-2">
                <Code className="w-4 h-4 text-primary-400" /> Python Flask REST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-6 text-center">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Manajemen Data Mahasiswa. Built for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
