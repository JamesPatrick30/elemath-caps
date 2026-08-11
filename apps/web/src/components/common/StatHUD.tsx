import type { StatItem } from "../../types";
import PixelPanel from "./PixelPanel";
import { accentHex } from "../../lib/pixel";

interface StatHUDProps {
  stats: StatItem[];
}

export default function StatHUD({ stats }: StatHUDProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <PixelPanel key={stat.label} accent={stat.accent || "bark"}>
          <p className="font-pixel text-[8px] text-parchment-400 uppercase tracking-wider mb-2">
            {stat.label}
          </p>
          <p className="font-data text-2xl font-bold" style={{ color: accentHex(stat.accent) }}>
            {stat.value}
          </p>
        </PixelPanel>
      ))}
    </div>
  );
}