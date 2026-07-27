import type { ReactNode } from 'react';

interface PixelPanelProps {
  label?: string;
  children: ReactNode;
  className?: string;
  accent?: 'leaf' | 'mango' | 'sun';
}

const accentMap = {
  leaf: 'border-leaf-400 text-leaf-300',
  mango: 'border-mango-400 text-mango-300',
  sun: 'border-sun-300 text-sun-200',
};

/**
 * PixelPanel — the dashboard's signature element.
 * A game-HUD style container: stepped pixel corners (via clip-path),
 * a thick double border, and an optional nameplate tab that reads like
 * an in-game panel label ("QUEST LOG", "PARTY STATUS").
 */
export default function PixelPanel({
  label,
  children,
  className = '',
  accent = 'leaf',
}: PixelPanelProps) {
  return (
    <div className={`relative mt-5 ${className}`}>
      {label && (
        <div
          className={`absolute -top-4 left-4 z-10 border-2 bg-canopy-950 px-3 py-1 font-pixel text-[10px] tracking-wider ${accentMap[accent]}`}
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 100% 70%, 92% 100%, 8% 100%, 0 70%)',
          }}
        >
          {label}
        </div>
      )}
      <div
        className="border-2 border-canopy-700 bg-canopy-900/80 p-5 pt-7 shadow-[6px_6px_0_0_rgba(0,0,0,0.35)]"
        style={{
          clipPath:
            'polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px))',
        }}
      >
        {children}
      </div>
    </div>
  );
}