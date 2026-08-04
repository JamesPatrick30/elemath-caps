import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "leaf" | "sky" | "gold" | "ghost";

const VARIANTS: Record<ButtonVariant, string> = {
  leaf: "bg-leaf-500 hover:bg-leaf-400 text-canopy-950",
  sky: "bg-sky-400 hover:bg-sky-300 text-canopy-950",
  gold: "bg-gold-400 hover:bg-gold-300 text-canopy-950",
  ghost:
    "bg-transparent hover:bg-canopy-700 text-parchment-100 border-[2px] border-bark-700",
};

interface PixelButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export default function PixelButton({
  children,
  variant = "leaf",
  className = "",
  type = "button",
  ...rest
}: PixelButtonProps) {
  return (
    <button
      type={type}
      className={`px-3 py-2 font-pixel text-[9px] uppercase tracking-wide shadow-[0_3px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 active:shadow-none transition-all ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}