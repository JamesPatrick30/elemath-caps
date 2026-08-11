import { LayoutDashboard, Trees, Users, ClipboardList, BarChart3, Settings } from "lucide-react";
import type { NavKey } from "../../types";
import { notch } from "../../lib/pixel";

interface SidebarProps {
  active?: NavKey;
  onNavigate?: (key: NavKey) => void;
}

const NAV_ITEMS: { key: NavKey; label: string; icon: typeof Trees }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "classes", label: "Classes", icon: Trees },
  { key: "students", label: "Students", icon: Users },
  { key: "quizzes", label: "Quizzes", icon: ClipboardList },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="w-20 md:w-56 flex flex-col py-6 px-3 gap-1 bg-bark-900 border-r-4 border-canopy-900">
      <div className="flex items-center gap-2 px-2 mb-8">
        <Trees size={20} className="text-leaf-400" />
        <span className="font-pixel text-[10px] text-gold-400 hidden md:inline">ELEMATH</span>
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate?.(item.key)}
            style={{ ...notch(6), background: isActive ? "#6fcf67" : "transparent" }}
            className={`flex items-center gap-3 px-3 py-2.5 mb-1 font-body text-xs font-semibold transition-colors ${
              isActive ? "text-canopy-950" : "text-parchment-300 hover:text-parchment-100"
            }`}
          >
            <item.icon size={16} strokeWidth={2.25} />
            <span className="hidden md:inline">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}