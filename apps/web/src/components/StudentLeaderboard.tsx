import PixelPanel from './PixelPanel';
import LeaderboardRow from './LeaderboardRow';
import type { LeaderboardEntry } from '../types/dashboard.types';
import { Trophy } from 'lucide-react';

export default function StudentLeaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <PixelPanel label="Top Explorers" accent="sun">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-sun-300" />
        <p className="text-xs text-parchment-400">Ranked by XP earned this week</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {entries.map((entry) => (
          <LeaderboardRow key={entry.id} entry={entry} />
        ))}
      </div>
    </PixelPanel>
  );
}