import StatCard from './StatCard';
import type { StatSummary } from '../types/dashboard.types';

export default function StatsOverview({ stats }: { stats: StatSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}