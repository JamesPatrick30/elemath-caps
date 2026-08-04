import type { InputHTMLAttributes } from "react";

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function PixelInput({
  label,
  id,
  className = "",
  ...rest
}: PixelInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block font-pixel text-[8px] text-parchment-500 uppercase tracking-wider"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full bg-canopy-950 border-2 border-bark-700/60 px-3 py-2 font-body text-sm text-parchment-100 placeholder:text-parchment-500 outline-none focus:border-leaf-500 ${className}`}
        {...rest}
      />
    </div>
  );
}