import { Users, ClipboardList } from "lucide-react";
import type { ClassItem } from "../../types";
import PixelPanel from "../common/PixelPanel";
import PixelButton from "../common/PixelButton";
import { getHabitatMeta } from "../../lib/pixel";

interface ClassCardProps {
  classItem: ClassItem;
  onSelect?: (classItem: ClassItem) => void;
}

export default function ClassCard({ classItem, onSelect }: ClassCardProps) {
  const meta = getHabitatMeta(classItem.habitat);
  const Icon = meta.icon;
  const avgScore = classItem.classAnalytics?.averageScore ?? 0;

  return (
    <PixelPanel accent={meta.hex}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} style={{ color: meta.hex }} />
        <span className="font-body text-[10px] uppercase tracking-wide text-parchment-500">
          {classItem.habitat}
        </span>
      </div>

      <p className="font-body text-sm font-bold text-parchment-100 mb-3">{classItem.name}</p>

      <div className="flex items-center gap-4 font-body text-[11px] text-parchment-300 mb-3">
        <span className="flex items-center gap-1">
          <Users size={12} /> {classItem.studentCount}
        </span>
        <span className="flex items-center gap-1">
          <ClipboardList size={12} /> {classItem.quizCount}
        </span>
      </div>

      <div className="h-1.5 bg-canopy-950 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full" style={{ width: `${avgScore}%`, background: meta.hex }} />
      </div>

      <PixelButton type="button" variant="gold" className="w-full" onClick={() => onSelect?.(classItem)}>
        Start quiz
      </PixelButton>
    </PixelPanel>
  );
}