import { Flame } from "lucide-react";
import PixelFrog from "./PixelFrog";
import type { StudentAnalyticsSummary } from "@repo/types";

interface DashboardHeaderProps {
  studentName: string;
  streakDays: number;
  analytics: StudentAnalyticsSummary;
}

export default function DashboardHeader({ studentName, streakDays, analytics }: DashboardHeaderProps) {
  const level = Math.floor(analytics.quizzesTaken / 5) + 1;
  const xpPercent = Math.min(100, ((analytics.quizzesTaken % 5) / 5) * 100);

  return (
    <div className="relative overflow-hidden border-b-4 border-[#1B4332] bg-[#5EC8F2]">
      {[10, 30, 55, 75, 90].map((left, i) => (
        <span
          key={i}
          className="absolute text-lg"
          style={{
            left: `${left}%`,
            top: "-20px",
            animation: `leaf-drift ${5 + i}s linear infinite`,
            animationDelay: `${i * 1.1}s`,
          }}
        >
          🍃
        </span>
      ))}

      <div className="relative max-w-4xl mx-auto px-5 py-6 flex items-center gap-5">
        <div
          className="border-4 border-[#1B4332] bg-white p-2 shrink-0"
          style={{ boxShadow: "4px 4px 0 #1B4332" }}
        >
          <PixelFrog size={6} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-[#1B4332] font-pixel">
            Level {level} Explorer
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-[#1B4332]">
            Hey, {studentName}! 🌿
          </h1>

          <div className="mt-3 h-4 w-full max-w-xs border-2 border-[#1B4332] bg-white">
            <div
              className="h-full bg-[#9B5DE5] transition-[width]"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        <div
          className="hidden sm:flex flex-col items-center border-4 border-[#1B4332] bg-white px-4 py-2 shrink-0"
          style={{ boxShadow: "4px 4px 0 #FF6FA5" }}
        >
          <Flame size={22} color="#FF6FA5" />
          <p className="text-[10px] mt-1 text-[#1B4332] font-pixel">{streakDays} day</p>
        </div>
      </div>
    </div>
  );
}