import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, School, BarChart3, Settings, TreePine } from "lucide-react";
import type { NavKey } from "../../types/dashboard.types";

interface NavItem {
  key: NavKey;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "classes", label: "Classes", icon: School },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  active?: NavKey;
  onNavigate?: (key: NavKey) => void;
}

export default function Sidebar({ active = "dashboard", onNavigate }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-col w-56 shrink-0 bg-canopy-900 border-r-[3px] border-bark-700/70">
      <div className="flex items-center gap-2 px-4 py-5 border-b-[3px] border-bark-700/60">
        <TreePine className="w-5 h-5 text-leaf-500" />
        <span className="font-pixel text-[10px] text-parchment-100 tracking-wide">
          ELEMATH
        </span>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate?.(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left font-body text-sm transition-colors ${
                isActive
                  ? "bg-canopy-700 text-parchment-100 border-l-[3px] border-leaf-500"
                  : "text-parchment-300 hover:bg-canopy-800 hover:text-parchment-100 border-l-[3px] border-transparent"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t-[3px] border-bark-700/60 font-data text-[10px] text-parchment-500">
        v2.0 · teacher build
      </div>
    </aside>
  );
}