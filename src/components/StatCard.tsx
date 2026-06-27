import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: LucideIcon;
  accentColor?: string;
  delay?: number;
}

export default function StatCard({
  value,
  label,
  icon: Icon,
  accentColor = '#6366f1',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className="relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      style={{ borderLeftWidth: '4px', borderLeftColor: accentColor }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-2xl font-bold tracking-tight"
            style={{ color: '#1e293b' }}
          >
            {value}
          </p>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
            {label}
          </p>
        </div>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: accentColor + '14' }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
      </div>
    </motion.div>
  );
}
