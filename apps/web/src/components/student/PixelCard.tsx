import type { ReactNode } from "react";

interface PixelCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent: string; // hex color — kept as inline style since it's data-driven
  // (Tailwind's JIT can't pick up arbitrary classes built from runtime
  // strings, so dynamic colors go through style, static layout stays Tailwind)
}

export default function PixelCard({ icon, label, value, accent }: PixelCardProps) {
  return (
    <div
      className="relative bg-white border-4 border-[#1B4332] px-4 py-4 flex flex-col gap-2"
      style={{ boxShadow: `4px 4px 0 ${accent}` }}
    >
      <div
        className="w-9 h-9 flex items-center justify-center border-2 border-[#1B4332]"
        style={{ backgroundColor: accent }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] tracking-wide uppercase text-[#1B4332]/60 font-pixel">
          {label}
        </p>
        <p className="text-2xl mt-1 text-[#1B4332] font-pixel">{value}</p>
      </div>
    </div>
  );
}