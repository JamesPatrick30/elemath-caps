import { Flame, LogOut } from "lucide-react";

interface Analytics {
  quizzesTaken: number;
  averageScore: number;
  highestScore: number;
  accuracy: number;
}

interface DashboardHeaderProps {
  studentName: string;
  streakDays: number;
  analytics: Analytics;
  onLogout?: () => void;
}

export default function DashboardHeader({ studentName, streakDays, onLogout }: DashboardHeaderProps) {
  const initial = studentName.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-20 w-full bg-[#F2FBF3] border-b-4 border-[#1B4332]">
      <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 shrink-0 flex items-center justify-center border-4 border-[#1B4332] font-pixel text-sm text-[#1B4332]"
            style={{ backgroundColor: "#4CD07D", boxShadow: "3px 3px 0 #1B4332" }}
            aria-hidden="true"
          >
            {initial}
          </div>
          <div className="min-w-0">
            <p className="font-pixel text-[11px] text-[#1B4332] truncate">Hi, {studentName}!</p>
            <p className="text-xs text-[#5C6B5F] mt-1">Ready for today's quest?</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border-4 border-[#1B4332] font-extrabold text-xs text-[#1B4332]"
            style={{ backgroundColor: "#FFD23F", boxShadow: "3px 3px 0 #1B4332" }}
          >
            <Flame size={14} color="#1B4332" />
            {streakDays} day{streakDays === 1 ? "" : "s"}
          </div>

          <button
            onClick={onLogout}
            aria-label="Log out"
            className="flex items-center gap-1.5 px-3 py-1.5 border-4 border-[#1B4332] font-extrabold text-xs text-[#1B4332] bg-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            style={{ boxShadow: "3px 3px 0 #1B4332" }}
          >
            <LogOut size={14} color="#1B4332" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}