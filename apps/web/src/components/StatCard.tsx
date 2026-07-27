import { Users, BookCheck, Target, Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { StatSummary } from '../types/dashboard.types';

const iconMap = {
  students: Users,
  quizzes: BookCheck,
  accuracy: Target,
  streak: Flame,
};

const deltaIconMap = {
  up: ArrowUp,
  down: ArrowDown,
  flat: Minus,
};

const deltaColorMap = {
  up: 'text-leaf-400',
  down: 'text-mango-400',
  flat: 'text-parchment-500',
};

export default function StatCard({ stat }: { stat: StatSummary }) {
  const Icon = iconMap[stat.icon];
  const DeltaIcon = stat.deltaDirection ? deltaIconMap[stat.deltaDirection] : null;

  return (
    <div className="border-2 border-canopy-700 bg-canopy-900/80 p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-parchment-400">
          {stat.label}
        </span>
        <Icon className="h-4 w-4 text-leaf-400" />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="font-pixel text-lg text-parchment-100">{stat.value}</span>
        {stat.delta && DeltaIcon && (
          <span
            className={`flex items-center gap-0.5 text-xs ${deltaColorMap[stat.deltaDirection!]}`}
          >
            <DeltaIcon className="h-3 w-3" />
            {stat.delta}
          </span>
        )}
      </div>
    </div>
  );
}