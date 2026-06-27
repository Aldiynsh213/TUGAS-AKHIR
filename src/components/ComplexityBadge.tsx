import { cn } from '@/lib/utils';

interface ComplexityBadgeProps {
  notation: string;
  size?: 'sm' | 'md' | 'lg';
}

const getComplexityColor = (notation: string) => {
  if (notation.includes('O(1)')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (notation.includes('O(log n)')) return 'bg-teal-100 text-teal-700 border-teal-200';
  if (notation.includes('O(n\u00b2)') || notation.includes('O(n^2)') || notation.includes('O(n²)')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (notation.includes('O(n log n)')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
  if (notation.includes('O(n)')) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const sizeClasses = {
  sm: 'text-[0.65rem] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export default function ComplexityBadge({ notation, size = 'md' }: ComplexityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block font-mono font-semibold border rounded-md whitespace-nowrap',
        getComplexityColor(notation),
        sizeClasses[size]
      )}
    >
      {notation}
    </span>
  );
}
