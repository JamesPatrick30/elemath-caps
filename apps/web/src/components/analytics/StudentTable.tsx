import PixelPanel from "../common/PixelPanel";
import { getStudentStatus } from "../../lib/studentStatus";
import type { Student, StudentStatus } from "../../types/dashboard.types";

const STATUS_STYLES: Record<StudentStatus, string> = {
  "on-track": "text-leaf-400 bg-leaf-500/10 border-leaf-500/40",
  watch: "text-gold-400 bg-gold-400/10 border-gold-400/40",
  "needs-attention": "text-ember-400 bg-ember-500/10 border-ember-500/40",
};

const STATUS_LABEL: Record<StudentStatus, string> = {
  "on-track": "On track",
  watch: "Watch",
  "needs-attention": "Needs attention",
};

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  return (
    <PixelPanel title="Student Performance">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="font-pixel text-[8px] uppercase tracking-wider text-parchment-500 border-b border-bark-700/60">
              <th className="py-2 pr-4">Student</th>
              <th className="py-2 pr-4">Class</th>
              <th className="py-2 pr-4">Avg Score</th>
              <th className="py-2 pr-4">Quizzes Taken</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="font-body text-sm">
            {students.map((s) => {
              const status = getStudentStatus(s);
              return (
                <tr key={s.id} className="border-b border-bark-700/30 last:border-0">
                  <td className="py-2.5 pr-4 text-parchment-100">{s.name}</td>
                  <td className="py-2.5 pr-4 text-parchment-300">
                    {s.className ?? "—"}
                  </td>
                  <td className="py-2.5 pr-4 font-data text-parchment-100">
                    {(s.analytics?.averageScore ?? 0).toFixed(0)}%
                  </td>
                  <td className="py-2.5 pr-4 font-data text-parchment-300">
                    {s.analytics?.quizzesTaken ?? 0}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`px-2 py-0.5 text-xs border ${STATUS_STYLES[status]}`}
                    >
                      {STATUS_LABEL[status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {students.length === 0 && (
          <p className="font-body text-sm text-parchment-300 py-4">
            No student data yet.
          </p>
        )}
      </div>
    </PixelPanel>
  );
}