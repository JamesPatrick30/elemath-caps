import type { StudentLeaderboardTable } from "../../types";
import { Medal } from "lucide-react";

const notchClip = (size = 8) =>
    ({
        clipPath: `polygon(0 ${size}px, ${size}px ${size}px, ${size}px 0, calc(100% - ${size}px) 0, calc(100% - ${size}px) ${size}px, 100% ${size}px, 100% calc(100% - ${size}px), calc(100% - ${size}px) calc(100% - ${size}px), calc(100% - ${size}px) 100%, ${size}px 100%, ${size}px calc(100% - ${size}px), 0 calc(100% - ${size}px))`,
    } as const);

const RANK_COLORS: Record<number, string> = {
    1: "bg-mango-500 text-canopy-950",
    2: "bg-parchment-400 text-canopy-950",
    3: "bg-orange-600 text-canopy-950",
};

function RankBadge({ rank }: { rank: number }) {
    if (rank <= 3) {
        return (
            <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-pixel text-[10px] ${RANK_COLORS[rank]}`}
            >
                {rank}
            </div>
        );
    }
    return (
        <div className="w-7 h-7 rounded-full flex items-center justify-center font-pixel text-[10px] text-parchment-200 bg-canopy-800 border border-canopy-700">
            {rank}
        </div>
    );
}

export default function LeaderBoardTable({
    students,
}: {
    students: StudentLeaderboardTable[];
}) {
    const sortedStudents = [...students].sort((a, b) => b.score - a.score);

    return (
        <div
            className="w-full max-w-4xl bg-canopy-900 border-2 border-leaf-700 p-4"
            style={notchClip(10)}
        >
            <div className="flex items-center gap-2 mb-3">
                <Medal className="w-4 h-4 text-sun-400" />
                <h2 className="font-pixel text-xs text-sun-300 tracking-wide">
                    Full Rankings
                </h2>
            </div>

            <table className="w-full text-left border-collapse font-sans">
                <thead>
                    <tr>
                        <th className="border-b-2 border-leaf-700 p-2 font-pixel text-[10px] text-parchment-300 tracking-widest uppercase">
                            Rank
                        </th>
                        <th className="border-b-2 border-leaf-700 p-2 font-pixel text-[10px] text-parchment-300 tracking-widest uppercase">
                            Student
                        </th>
                        <th className="border-b-2 border-leaf-700 p-2 font-pixel text-[10px] text-parchment-300 tracking-widest uppercase text-right">
                            Score
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedStudents.map((student, index) => {
                        const rank = index + 1;
                        return (
                            <tr
                                key={student.id}
                                className={`transition-colors hover:bg-leaf-900/40 ${
                                    index % 2 === 0
                                        ? "bg-canopy-950/30"
                                        : "bg-transparent"
                                }`}
                            >
                                <td className="border-b border-canopy-700 p-2">
                                    <RankBadge rank={rank} />
                                </td>
                                <td className="border-b border-canopy-700 p-2 text-parchment-100 font-medium">
                                    {student.name}
                                </td>
                                <td className="border-b border-canopy-700 p-2 text-right font-pixel text-xs text-sun-300">
                                    {student.score}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}