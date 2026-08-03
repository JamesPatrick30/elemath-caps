import { Users } from "lucide-react";
import PixelPanel from "../common/PixelPanel";
import type { Accent, ClassItem } from "../../types/dashboard.types";

function accentForScore(score: number): Accent {
  if (score >= 80) return "leaf";
  if (score >= 60) return "gold";
  return "ember";
}

interface ClassCardProps {
  classItem: ClassItem;
  onSelect?: (classItem: ClassItem) => void;
}

export default function ClassCard({ classItem, onSelect }: ClassCardProps) {
  const { name, habitat, classAnalytics } = classItem;
  const studentCount = classAnalytics?.totalStudents ?? 0;
  const avgScore = classAnalytics?.averageScore ?? 0;
  const accent = accentForScore(avgScore);

  return (
    <PixelPanel accent={accent} className="cursor-pointer hover:brightness-110">
      <button onClick={() => onSelect?.(classItem)} className="w-full text-left">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-pixel text-[9px] text-parchment-500 uppercase mb-1">
              {habitat}
            </p>
            <h3 className="font-body font-semibold text-parchment-100">{name}</h3>
          </div>
          <div className="flex items-center gap-1 text-parchment-300 font-data text-xs">
            <Users className="w-3.5 h-3.5" />
            {studentCount}
          </div>
        </div>

        <div className="h-2 bg-canopy-950 border border-bark-700/60">
          <div
            className={`h-full ${
              accent === "leaf"
                ? "bg-leaf-500"
                : accent === "gold"
                ? "bg-gold-400"
                : "bg-ember-500"
            }`}
            style={{ width: `${Math.min(avgScore, 100)}%` }}
          />
        </div>
        <p className="font-data text-xs text-parchment-300 mt-1">
          {avgScore.toFixed(0)}% avg score
        </p>
      </button>
    </PixelPanel>
  );
}