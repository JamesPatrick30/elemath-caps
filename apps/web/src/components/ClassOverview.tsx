import PixelPanel from './PixelPanel';
import ClassCard from './ClassCard';
import type { ClassRoom } from '../types/dashboard.types';
import { Plus } from 'lucide-react';

export default function ClassOverview({
  classes,
  onSelectClass,
}: {
  classes: ClassRoom[];
  onSelectClass: (classroom: ClassRoom) => void;
}) {
  return (
    <PixelPanel label="Your Classes" accent="leaf">
      <div className="flex items-center justify-between">
        <p className="text-xs text-parchment-400">
          {classes.length} active classes this term
        </p>
        <button className="flex items-center gap-1.5 border-2 border-mango-400 bg-mango-400/10 px-3 py-1.5 text-xs text-mango-300 hover:bg-mango-400/20">
          <Plus className="h-3.5 w-3.5" />
          New Class
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {classes.map((classroom) => (
          <ClassCard key={classroom.id} classroom={classroom} onClick={onSelectClass} />
        ))}
      </div>
    </PixelPanel>
  );
}