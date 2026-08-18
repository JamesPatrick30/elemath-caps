import type { StudentLeaderboardTable } from "../../types";
import { Crown } from "lucide-react";
const notchClip = (size = 8) =>
    ({
        clipPath: `polygon(0 ${size}px, ${size}px ${size}px, ${size}px 0, calc(100% - ${size}px) 0, calc(100% - ${size}px) ${size}px, 100% ${size}px, 100% calc(100% - ${size}px), calc(100% - ${size}px) calc(100% - ${size}px), calc(100% - ${size}px) 100%, ${size}px 100%, ${size}px calc(100% - ${size}px), 0 calc(100% - ${size}px))`,
    } as const);

const PODIUM_STYLES = {
    1: {
        height: "h-40",
        bar: "bg-gradient-to-b from-mango-400 to-mango-600",
        ring: "ring-4 ring-sun-400",
        avatarBg: "bg-mango-500",
        glow: "shadow-[0_0_25px_rgba(251,191,36,0.5)]",
        label: "text-sun-300",
    },
    2: {
        height: "h-28",
        bar: "bg-gradient-to-b from-parchment-300 to-parchment-500",
        ring: "ring-4 ring-parchment-400",
        avatarBg: "bg-parchment-400",
        glow: "",
        label: "text-parchment-200",
    },
    3: {
        height: "h-20",
        bar: "bg-gradient-to-b from-orange-500 to-orange-700",
        ring: "ring-4 ring-orange-500",
        avatarBg: "bg-orange-600",
        glow: "",
        label: "text-orange-300",
    },
} as const;
export default function PodiumSpot({
    student,
    rank,
}: {
    student?: StudentLeaderboardTable;
    rank: 1 | 2 | 3;
}) {
    const style = PODIUM_STYLES[rank];
    const initial = student?.name?.charAt(0)?.toUpperCase() ?? "?";

    return (
        <div className="flex flex-col items-center gap-2 w-full max-w-36">
            {rank === 1 && (
                <Crown
                    className="w-7 h-7 text-sun-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)] mb-1"
                    fill="currentColor"
                />
            )}

            <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-pixel text-sm text-canopy-950 ${style.avatarBg} ${style.ring} ${style.glow}`}
            >
                {initial}
            </div>

            <p
                className={`font-sans font-semibold text-sm text-center truncate w-full ${style.label}`}
            >
                {student?.name ?? "—"}
            </p>
            <p className="font-pixel text-[10px] text-parchment-100">
                {student?.score ?? 0} pts
            </p>

            <div
                className={`flex flex-col justify-start items-center w-full ${style.height} ${style.bar} border-2 border-canopy-950/40 ${style.glow}`}
                style={notchClip(6)}
            >
                <span className="font-pixel text-lg text-canopy-950/70 mt-2">
                    {rank}
                </span>
            </div>
        </div>
    );
}