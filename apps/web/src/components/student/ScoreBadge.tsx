
interface ScoreBadgeProps {
  score: number;
  totalItems: number;
}

export default function ScoreBadge({ score, totalItems }: ScoreBadgeProps) {
  const pct = totalItems > 0 ? Math.round((score / totalItems) * 100) : 0;
  const color = pct >= 90 ? "#4CD07D" : pct >= 70 ? "#FFD23F" : "#FF6FA5";

  return (
    <span
      className="text-[10px] px-2 py-1 border-2 border-[#1B4332] whitespace-nowrap font-pixel"
      style={{ backgroundColor: color }}
    >
      {score}/{totalItems}
    </span>
  );
}