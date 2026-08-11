import type { Teacher } from "../../types";
import { notch } from "../../lib/pixel";

interface TopBarProps {
  breadcrumbs?: string[];
  teacher?: Teacher;
}

export default function TopBar({ breadcrumbs = [], teacher }: TopBarProps) {
  const initials = teacher?.name
    ? teacher.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "TG";

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-canopy-900 border-b-4 border-bark-800">
      <div className="flex items-center gap-2 font-pixel text-[10px]">
        <span className="text-parchment-500 uppercase">Camp</span>
        {breadcrumbs.map((crumb) => (
          <span key={crumb} className="flex items-center gap-2">
            <span className="text-bark-700">/</span>
            <span className="text-gold-400 uppercase">{crumb}</span>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div
          style={{ ...notch(6), background: "#ff7fb0" }}
          className="w-9 h-9 flex items-center justify-center font-body text-xs font-bold text-[#4b1528]"
        >
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="font-body text-sm font-semibold text-parchment-100 leading-tight">
            {teacher?.name ?? "Trail Guide"}
          </p>
          <p className="font-body text-[10px] text-parchment-500 leading-tight">
            {teacher?.email ?? ""}
          </p>
        </div>
      </div>
    </header>
  );
}