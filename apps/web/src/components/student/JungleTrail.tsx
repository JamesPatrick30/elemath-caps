import TrailNode from "./TrailNode";
import type { TrailClass } from "@repo/types";

interface JungleTrailProps {
  trail: TrailClass[];
}

export default function JungleTrail({ trail }: JungleTrailProps) {
  if (trail.length === 0) {
    return (
      <p className="text-sm text-[#5C6B5F]">
        No classes yet — once your teacher adds you to one, your trail shows up here.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-extrabold mb-1 text-[#1B4332]">🗺️ Your Jungle Trail</h2>
      <p className="text-sm mb-5 text-[#5C6B5F]">Follow the vine to your next quiz.</p>

      {trail.map((cls, ci) => (
        <div key={cls.classId} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] px-2 py-1 border-2 border-[#1B4332] bg-[#5EC8F2] font-pixel">
              {cls.className}
            </span>
          </div>

          <div
            className="relative flex flex-col gap-6"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, #4CD07D 0, #4CD07D 10px, transparent 10px, transparent 20px)",
              backgroundSize: "4px 100%",
              backgroundPosition: "center",
              backgroundRepeat: "repeat-y",
            }}
          >
            {cls.quizzes.map((quiz, i) => (
              <TrailNode key={quiz.id} quiz={quiz} side={i % 2 === 0 ? "left" : "right"} />
            ))}
          </div>

          {ci < trail.length - 1 && (
            <p className="text-center text-xs mt-6 text-[#9A9584]">
              🔒 Finish this trail to unlock the next habitat
            </p>
          )}
        </div>
      ))}
    </div>
  );
}