import type { ReactNode } from "react";
import type { Accent } from "../../types/dashboard.types";

const ACCENTS: Record<Accent, string> = {
  leaf: "border-leaf-500/60",
  sky: "border-sky-400/60",
  gold: "border-gold-400/60",
  ember: "border-ember-500/60",
  bark: "border-bark-700/70",
};

interface PixelPanelProps {
  children: ReactNode;
  title?: string;
  accent?: Accent;
  className?: string;
}

export default function PixelPanel({
  children,
  title,
  accent = "bark",
  className = "",
}: PixelPanelProps) {
  return (
    <div
      className={`relative bg-canopy-800/90 border-[3px] ${ACCENTS[accent]} shadow-[0_0_0_2px_rgba(0,0,0,0.35)] ${className}`}
    >
      <span className="absolute -top-1 -left-1 w-2 h-2 bg-bark-700" />
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-bark-700" />
      <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-bark-700" />
      <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-bark-700" />

      {title && (
        <div className="px-4 py-2.5 border-b-[3px] border-bark-700/60 font-pixel text-[9px] leading-none text-parchment-100 tracking-wider uppercase">
          {title}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}