import type { ReactNode } from "react";
import { accentHex, notch } from "../../lib/pixel";

interface PixelPanelProps {
  children: ReactNode;
  accent?: string; // named accent ("leaf" | "sky" | "gold" | "ember" | "bark" | "grape" | "bubblegum") or a raw hex
  className?: string;
  notchSize?: number;
}

export default function PixelPanel({
  children,
  accent = "bark",
  className = "",
  notchSize = 10,
}: PixelPanelProps) {
  const hex = accentHex(accent);

  return (
    <div style={{ ...notch(notchSize), background: hex }} className={`p-0.75 ${className}`}>
      <div style={notch(Math.max(notchSize - 3, 4))} className="h-full w-full bg-canopy-900 p-4">
        {children}
      </div>
    </div>
  );
}