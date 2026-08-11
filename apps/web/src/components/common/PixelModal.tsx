import type { ReactNode } from "react";
import { X } from "lucide-react";
import { accentHex, notch } from "../../lib/pixel";

interface PixelModalProps {
  title: string;
  accent?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function PixelModal({ title, accent = "gold", onClose, children }: PixelModalProps) {
  const hex = accentHex(accent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div style={{ ...notch(10), background: hex }} className="p-0.75 w-full max-w-sm">
        <div style={notch(7)} className="bg-canopy-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-pixel text-[10px]" style={{ color: hex }}>
              {title}
            </span>
            <button onClick={onClose} aria-label="Close">
              <X size={16} className="text-parchment-300" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}