import type { ButtonHTMLAttributes } from "react";
import { accentHex, notch } from "../../lib/pixel";

type Variant = "gold" | "leaf" | "sky" | "ember" | "ghost";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const TEXT_ON_FILL = "#173404";

export default function PixelButton({
  variant = "gold",
  className = "",
  children,
  ...rest
}: PixelButtonProps) {
  if (variant === "ghost") {
    return (
      <button
        {...rest}
        className={`font-body text-xs font-semibold px-4 py-2 text-parchment-300 hover:text-parchment-100 transition-colors disabled:opacity-50 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      {...rest}
      style={{ ...notch(4), background: accentHex(variant), color: TEXT_ON_FILL }}
      className={`font-body text-xs font-bold px-4 py-2 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${className}`}
    >
      {children}
    </button>
  );
}