import type { StatItem } from "../../types";
import PixelPanel from "./PixelPanel";

interface StatHUDProps {
  stats: StatItem[];
}

export default function StatHUD({ stats }: StatHUDProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <PixelPanel key={stat.label} accent={stat.accent || "bark"}>
          <p className="font-pixel text-[8px] text-parchment-500 uppercase tracking-wider mb-2">
            {stat.label}
          </p>
          <p className="font-data text-2xl font-semibold text-parchment-100">
            {stat.value}
          </p>
        </PixelPanel>
      ))}
    </div>
  );
}