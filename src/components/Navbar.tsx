import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/mahasiswa', label: 'Data Mahasiswa' },
  { path: '/pencarian', label: 'Pencarian' },
  { path: '/pengurutan', label: 'Pengurutan' },
  { path: '/analisis', label: 'Analisis' },
  { path: '/tentang', label: 'Tentang' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <GraduationCap className="w-7 h-7 text-primary-600" />
          <span className="text-lg font-bold text-primary-900">DataMahasiswa</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 h-full">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <span className="font-bold text-primary-900">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
