import { Users, ChevronRight } from 'lucide-react';
import type { ClassRoom } from '../types/dashboard.types';

const habitatStyles: Record<ClassRoom['habitat'], { bg: string; label: string }> = {
  canopy: { bg: 'bg-leaf-400', label: 'Canopy' },
  river: { bg: 'bg-sky-400', label: 'River' },
  savanna: { bg: 'bg-mango-400', label: 'Savanna' },
  reef: { bg: 'bg-sun-300', label: 'Reef' },
};

export default function ClassCard({
  classroom,
  onClick,
}: {
  classroom: ClassRoom;
  onClick?: (classroom: ClassRoom) => void;
}) {
  const habitat = habitatStyles[classroom.habitat];

  return (
    <button
      onClick={() => onClick?.(classroom)}
      className="flex w-full items-center gap-4 border-2 border-canopy-700 bg-canopy-900/60 p-4 text-left transition-colors hover:border-leaf-400 hover:bg-canopy-800"
    >
      <span className={`h-10 w-2 shrink-0 ${habitat.bg}`} />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-pixel text-[11px] text-parchment-100">{classroom.name}</p>
          <span className="border border-canopy-700 px-1.5 py-0.5 text-[10px] text-parchment-400">
            {classroom.gradeLevel}
          </span>
        </div>
        <p className="mt-1 text-xs text-parchment-400">
          Focus: {classroom.topicFocus} · {habitat.label} habitat
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs text-parchment-300">
        <Users className="h-3.5 w-3.5 text-parchment-500" />
        {classroom.studentCount}
      </div>

      <div className="w-16 text-right">
        <span
          className={`font-pixel text-xs ${
            classroom.avgScore >= 80
              ? 'text-leaf-400'
              : classroom.avgScore >= 60
                ? 'text-sun-300'
                : 'text-mango-400'
          }`}
        >
          {classroom.avgScore}%
        </span>
      </div>

      <ChevronRight className="h-4 w-4 text-parchment-500" />
    </button>
  );
}