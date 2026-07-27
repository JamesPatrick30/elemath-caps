import { CheckCircle2, Sparkles, Flame, UserPlus } from 'lucide-react';
import type { ActivityEvent } from '../types/dashboard.types';

const iconMap = {
  quiz_completed: CheckCircle2,
  quiz_generated: Sparkles,
  streak: Flame,
  joined: UserPlus,
};

const colorMap = {
  quiz_completed: 'text-leaf-400',
  quiz_generated: 'text-mango-300',
  streak: 'text-sun-300',
  joined: 'text-sky-300',
};

export default function ActivityItem({ event }: { event: ActivityEvent }) {
  const Icon = iconMap[event.type];

  return (
    <div className="flex items-start gap-3 border-b border-canopy-800 py-2.5 last:border-0">
      <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${colorMap[event.type]}`} />
      <div className="flex-1">
        <p className="text-xs text-parchment-200">{event.message}</p>
        <p className="mt-0.5 text-[10px] text-parchment-500">{event.timestamp}</p>
      </div>
    </div>
  );
}