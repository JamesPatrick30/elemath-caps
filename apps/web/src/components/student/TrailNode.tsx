import { CheckCircle2, ChevronRight, Lock } from "lucide-react";
import ScoreBadge from "./ScoreBadge";
import type { TrailQuiz } from "@repo/types";

interface TrailNodeProps {
  quiz: TrailQuiz;
  side: "left" | "right";
}

export default function TrailNode({ quiz, side }: TrailNodeProps) {
  const isDone = quiz.status === "done";
  const isCurrent = quiz.status === "current";
  const isLocked = quiz.status === "locked";

  const stoneColor = isDone ? "#4CD07D" : isCurrent ? "#FFD23F" : "#E7E2D3";
  const borderColor = isLocked ? "#C9C3AE" : "#1B4332";
  const textColor = isLocked ? "text-[#9A9584]" : "text-[#1B4332]";

  return (
    <div className={`flex ${side === "right" ? "justify-end" : "justify-start"} w-full`}>
      <div
        className={`w-[86%] sm:w-[46%] flex items-center gap-3 border-4 px-4 py-3 bg-white ${
          isCurrent ? "animate-[pulse-glow_1.8s_ease-in-out_infinite]" : ""
        }`}
        style={{
          borderColor,
          boxShadow: isLocked ? "none" : `4px 4px 0 ${stoneColor}`,
        }}
      >
        <div
          className="w-8 h-8 shrink-0 flex items-center justify-center border-2"
          style={{ borderColor, backgroundColor: stoneColor }}
        >
          {isDone && <CheckCircle2 size={16} color="#1B4332" />}
          {isCurrent && <ChevronRight size={16} color="#1B4332" />}
          {isLocked && <Lock size={14} color="#7A7563" />}
        </div>

        <div className="min-w-0 flex-1">
          <p className={`text-[11px] leading-snug truncate font-bold ${textColor}`}>
            {quiz.title}
          </p>
          {isCurrent && <p className="text-[10px] text-[#B08A00]">Up next</p>}
        </div>

        {isDone && quiz.score !== undefined && quiz.totalItems !== undefined && (
          <ScoreBadge score={quiz.score} totalItems={quiz.totalItems} />
        )}
      </div>
    </div>
  );
}