import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Search, ArrowUpDown, BarChart3, Info } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/mahasiswa', label: 'Data', icon: Users },
  { path: '/pencarian', label: 'Cari', icon: Search },
  { path: '/pengurutan', label: 'Urut', icon: ArrowUpDown },
  { path: '/analisis', label: 'Analisis', icon: BarChart3 },
  { path: '/tentang', label: 'Tentang', icon: Info },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                isActive ? 'text-primary-600' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
