import ScoreBadge from "./ScoreBadge";
import type { RecentAttempt } from "@repo/types";

interface RecentAdventuresProps {
  attempts: RecentAttempt[];
}

export default function RecentAdventures({ attempts }: RecentAdventuresProps) {
  return (
    <div>
      <h2 className="text-lg font-extrabold mb-4 text-[#1B4332]">📖 Recent Adventures</h2>

      {attempts.length === 0 ? (
        <p className="text-sm text-[#5C6B5F]">No quizzes taken yet — your first one will show up here.</p>
      ) : (
        <div className="space-y-3">
          {attempts.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between border-4 border-[#1B4332] bg-white px-4 py-3"
              style={{ boxShadow: "3px 3px 0 #FFD23F" }}
            >
              <div className="min-w-0">
                <p className="font-bold text-sm truncate text-[#1B4332]">{r.title}</p>
                <p className="text-xs text-[#8A8570]">
                  {Math.floor(r.durationSec / 60)}m {r.durationSec % 60}s
                </p>
              </div>
              <ScoreBadge score={r.score} totalItems={r.totalItems} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}