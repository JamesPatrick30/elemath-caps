import { Pencil, Trash2 } from "lucide-react";
import PixelPanel from "../common/PixelPanel";
import type { RosterStudent } from "../../types";

interface RosterTableProps {
  students: RosterStudent[];
  onEdit?: (student: RosterStudent) => void;
  onDelete?: (student: RosterStudent) => void;
}

export default function RosterTable({
  students,
  onEdit,
  onDelete,
}: RosterTableProps) {
  return (
    <PixelPanel title="Roster">
      <div className="overflow-x-auto max-h-72">
        <table className="w-full text-left">
          <thead>
            <tr className="font-pixel text-[8px] uppercase tracking-wider text-parchment-500 border-b border-bark-700/60">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody className="font-body text-sm">
            {students.map((s) => (
              <tr key={s.id} className="border-b border-bark-700/30 last:border-0">
                <td className="py-2.5 pr-4 text-parchment-100">{s.name}</td>
                <td className="py-2.5 pr-4 text-parchment-300">{s.email}</td>
                <td className="py-2.5 pr-4">
                  <span
                    className={`px-2 py-0.5 text-xs border ${
                      s.isActive
                        ? "text-leaf-400 bg-leaf-500/10 border-leaf-500/40"
                        : "text-parchment-500 bg-canopy-950 border-bark-700/60"
                    }`}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit?.(s)}
                      className="p-1 text-parchment-500 hover:text-sky-400"
                      aria-label={`Edit ${s.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete?.(s)}
                      className="p-1 text-parchment-500 hover:text-ember-400"
                      aria-label={`Remove ${s.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <p className="font-body text-sm text-parchment-300 py-4">
            No students in this class yet.
          </p>
        )}
      </div>
    </PixelPanel>
  );
}