import type { MouseEvent, ReactNode } from "react";
import { X } from "lucide-react";
import PixelPanel from "./PixelPanel";
import type { Accent } from "../../types";

interface PixelModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  accent?: Accent;
}

export default function PixelModal({
  title,
  children,
  onClose,
  accent = "gold",
}: PixelModalProps) {
  function stop(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-canopy-950/80 p-4"
      onClick={onClose}
    >
      <div onClick={stop} className="w-full max-w-md">
        <PixelPanel accent={accent} className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-parchment-300 hover:text-parchment-100"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="font-pixel text-[10px] text-parchment-100 uppercase tracking-wider mb-4 pr-6">
            {title}
          </h2>
          {children}
        </PixelPanel>
      </div>
    </div>
  );
}