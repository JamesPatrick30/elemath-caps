import { useState } from 'react';
import { X, Pencil, Check, Users, Swords } from 'lucide-react';
import type { ClassRoom } from '../types/dashboard.types';
import ClassFilesList from './ClassFilesList';

const habitatStyles: Record<ClassRoom['habitat'], { bg: string; label: string }> = {
  canopy: { bg: 'bg-leaf-400', label: 'Canopy' },
  river: { bg: 'bg-sky-400', label: 'River' },
  savanna: { bg: 'bg-mango-400', label: 'Savanna' },
  reef: { bg: 'bg-sun-300', label: 'Reef' },
};

interface ClassDetailModalProps {
  classroom: ClassRoom;
  onClose: () => void;
  onSave: (updated: ClassRoom) => void;
  onBuildQuizRoom: (classroom: ClassRoom) => void;
  onDeleteFile: (classId: string, fileId: string) => void;
}

export default function ClassDetailModal({
  classroom,
  onClose,
  onSave,
  onBuildQuizRoom,
  onDeleteFile,
}: ClassDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: classroom.name,
    gradeLevel: classroom.gradeLevel,
    topicFocus: classroom.topicFocus,
  });

  const habitat = habitatStyles[classroom.habitat];

  const handleSave = () => {
    onSave({ ...classroom, ...draft });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft({
      name: classroom.name,
      gradeLevel: classroom.gradeLevel,
      topicFocus: classroom.topicFocus,
    });
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-xl flex-col border-2 border-leaf-400 bg-canopy-900 shadow-[8px_8px_0_0_rgba(0,0,0,0.4)]"
        style={{
          clipPath:
            'polygon(0 10px, 10px 10px, 10px 0, calc(100% - 10px) 0, calc(100% - 10px) 10px, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 10px calc(100% - 10px), 0 calc(100% - 10px))',
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b-2 border-canopy-700 p-5">
          <span className={`h-10 w-2 shrink-0 ${habitat.bg}`} />

          <div className="flex-1">
            {isEditing ? (
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full border-2 border-leaf-400 bg-canopy-950 px-2 py-1 font-pixel text-xs text-parchment-100 focus:outline-none"
              />
            ) : (
              <h2 className="font-pixel text-sm text-parchment-100">{classroom.name}</h2>
            )}
            <p className="mt-1 text-xs text-parchment-400">
              {habitat.label} habitat · {classroom.studentCount} students
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-parchment-400 hover:text-mango-400"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Editable / static details */}
          <div className="flex items-center justify-between">
            <p className="font-pixel text-[10px] tracking-wide text-parchment-300">
              Class Details
            </p>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="border-2 border-canopy-700 px-2.5 py-1 text-[11px] text-parchment-300 hover:border-mango-400 hover:text-mango-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 border-2 border-leaf-400 bg-leaf-400/10 px-2.5 py-1 text-[11px] text-leaf-300 hover:bg-leaf-400/20"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 border-2 border-canopy-700 px-2.5 py-1 text-[11px] text-parchment-300 hover:border-leaf-400 hover:text-leaf-300"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="border-2 border-canopy-700 bg-canopy-950/60 p-3">
              <p className="text-[10px] text-parchment-500">Grade level</p>
              {isEditing ? (
                <select
                  value={draft.gradeLevel}
                  onChange={(e) => setDraft({ ...draft, gradeLevel: e.target.value })}
                  className="mt-1 w-full border-2 border-canopy-700 bg-canopy-950 px-2 py-1 text-xs text-parchment-100 focus:border-leaf-400 focus:outline-none"
                >
                  {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(
                    (g) => (
                      <option key={g}>{g}</option>
                    ),
                  )}
                </select>
              ) : (
                <p className="mt-1 text-sm text-parchment-100">{classroom.gradeLevel}</p>
              )}
            </div>

            <div className="border-2 border-canopy-700 bg-canopy-950/60 p-3">
              <p className="text-[10px] text-parchment-500">Topic focus</p>
              {isEditing ? (
                <input
                  value={draft.topicFocus}
                  onChange={(e) => setDraft({ ...draft, topicFocus: e.target.value })}
                  className="mt-1 w-full border-2 border-canopy-700 bg-canopy-950 px-2 py-1 text-xs text-parchment-100 focus:border-leaf-400 focus:outline-none"
                />
              ) : (
                <p className="mt-1 text-sm text-parchment-100">{classroom.topicFocus}</p>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 border-2 border-canopy-700 bg-canopy-950/60 p-3">
            <Users className="h-4 w-4 text-parchment-400" />
            <p className="text-xs text-parchment-300">
              {classroom.studentCount} students · avg score{' '}
              <span
                className={
                  classroom.avgScore >= 80
                    ? 'text-leaf-400'
                    : classroom.avgScore >= 60
                      ? 'text-sun-300'
                      : 'text-mango-400'
                }
              >
                {classroom.avgScore}%
              </span>
            </p>
          </div>

          {/* Build quiz room */}
          <button
            onClick={() => onBuildQuizRoom(classroom)}
            className="mt-4 flex w-full items-center justify-center gap-2 border-2 border-mango-400 bg-mango-400 px-4 py-2.5 font-pixel text-[11px] text-canopy-950 hover:opacity-90"
          >
            <Swords className="h-3.5 w-3.5" />
            Build Quiz Room
          </button>

          {/* Files */}
          <div className="mt-6">
            <ClassFilesList
              files={classroom.files}
              onDelete={(fileId) => onDeleteFile(classroom.id, fileId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}