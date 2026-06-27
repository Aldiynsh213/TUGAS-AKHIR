import { cn } from '@/lib/utils';
import { Clock, HardDrive, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import ComplexityBadge from './ComplexityBadge';

interface AlgorithmInfoProps {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  bestCase: string;
  worstCase: string;
  category: string;
  className?: string;
}

const categoryColors: Record<string, string> = {
  'Pencarian': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pengurutan': 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function AlgorithmInfo({
  name,
  description,
  timeComplexity,
  spaceComplexity,
  bestCase,
  worstCase,
  category,
  className,
}: AlgorithmInfoProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-800">{name}</h3>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border',
            categoryColors[category] || 'bg-slate-50 text-slate-700 border-slate-200'
          )}
        >
          <Tag className="w-3 h-3" />
          {category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">{description}</p>

      {/* Complexity Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-500 shrink-0" />
          <div>
            <p className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-medium">Time Avg</p>
            <ComplexityBadge notation={timeComplexity} size="sm" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-teal-500 shrink-0" />
          <div>
            <p className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-medium">Space</p>
            <ComplexityBadge notation={spaceComplexity} size="sm" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <p className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-medium">Best</p>
            <ComplexityBadge notation={bestCase} size="sm" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownRight className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <p className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-medium">Worst</p>
            <ComplexityBadge notation={worstCase} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
