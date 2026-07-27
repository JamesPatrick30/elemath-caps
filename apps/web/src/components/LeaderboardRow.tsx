import { Flame } from 'lucide-react';
import type { LeaderboardEntry } from '../types/dashboard.types';

const rankStyles = ['text-sun-300', 'text-parchment-300', 'text-mango-400'];

export default function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const rankColor = rankStyles[entry.rank - 1] ?? 'text-parchment-500';

  return (
    <div className="flex items-center gap-3 border-2 border-canopy-700 bg-canopy-900/60 px-3 py-2.5">
      <span className={`w-5 font-pixel text-xs ${rankColor}`}>#{entry.rank}</span>
      <span className="text-lg leading-none">{entry.avatarEmoji}</span>

      <div className="flex-1">
        <p className="text-sm text-parchment-100">{entry.studentName}</p>
        <p className="text-[11px] text-parchment-500">{entry.className}</p>
      </div>

      <div className="flex items-center gap-1 text-xs text-mango-300">
        <Flame className="h-3.5 w-3.5" />
        {entry.streak}
      </div>

      <span className="w-14 text-right font-pixel text-[11px] text-leaf-300">
        {entry.xp} XP
      </span>
    </div>
  );
}