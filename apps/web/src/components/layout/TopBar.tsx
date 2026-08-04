import { useState } from "react";
import { Search, ChevronDown, LogOut, User } from "lucide-react";
import type { Teacher } from "../../types";
import { logout } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
interface TopBarProps {
  breadcrumbs?: string[];
  teacher?: Teacher;
}

export default function TopBar({ breadcrumbs = ["Dashboard"], teacher }: TopBarProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const { logout } = useAuth();

    const navigate = useNavigate();
    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
        navigate("/teacher/login", { replace: true });
    }
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-canopy-900 border-b-[3px] border-bark-700/70">
      <div className="flex items-center gap-2 font-pixel text-[9px] uppercase tracking-wider text-parchment-300">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-2">
            {i > 0 && <span className="text-bark-600">/</span>}
            <span className={i === breadcrumbs.length - 1 ? "text-leaf-400" : ""}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-canopy-800 border-[2px] border-bark-700/60 px-3 py-1.5">
          <Search className="w-4 h-4 text-parchment-500" />
          <input
            type="text"
            placeholder="Search students, classes..."
            className="bg-transparent outline-none font-body text-sm text-parchment-100 placeholder:text-parchment-500 w-48"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-canopy-800 transition-colors"
          >
            <div className="w-8 h-8 bg-leaf-500 flex items-center justify-center text-canopy-950">
              <User className="w-4 h-4" />
            </div>
            <span className="font-body text-sm text-parchment-100 hidden sm:inline">
              {teacher?.name || "Teacher"}
            </span>
            <ChevronDown className="w-4 h-4 text-parchment-500" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-canopy-800 border-[2px] border-bark-700/70 shadow-[0_4px_0_rgba(0,0,0,0.4)] z-10">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-left font-body text-sm text-parchment-100 hover:bg-canopy-700">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-left font-body text-sm text-ember-400 hover:bg-canopy-700" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}