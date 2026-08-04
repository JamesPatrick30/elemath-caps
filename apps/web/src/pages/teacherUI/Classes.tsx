import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ClassOverview from "../../components/classes/ClassOverview";
import RosterTable from "../../components/classes/RosterTable";
import EditStudentModal from "../../components/classes/EditStudentModal";
import PixelPanel from "../../components/common/PixelPanel";
import PixelButton from "../../components/common/PixelButton";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AddStudentModal from "../../components/classes/AddStudentModal";
import { deleteStudent, getAllStudentRosters } from "../../api/studentsApi";
import type {
  ClassItem,
  ClassRoster,
  NavKey,
  RosterStudent,
  Teacher,
} from "../../types";

type RosterStatus = "loading" | "ready" | "error";

interface ClassesPageProps {
  teacher?: Teacher;
}

export default function ClassesPage({ teacher }: ClassesPageProps) {
  const [nav, setNav] = useState<NavKey>("classes");
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [rosters, setRosters] = useState<ClassRoster[]>([]);
  const [rosterStatus, setRosterStatus] = useState<RosterStatus>("loading");
  const [addingStudent, setAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<RosterStudent | null>(
    null
  );
  const [deletingStudent, setDeletingStudent] = useState<RosterStudent | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  // GET /students returns every class's roster at once — fetch once and
  // derive the selected class's group client-side rather than re-fetching
  // per class (there's no per-class roster route to call instead).
  const loadRosters = useCallback(() => {
    setRosterStatus("loading");
    getAllStudentRosters()
      .then((res) => {
        setRosters(res.data);
        setRosterStatus("ready");
      })
      .catch(() => setRosterStatus("error"));
  }, []);

  useEffect(() => {
    loadRosters();
  }, [loadRosters]);

  const activeRoster = useMemo(
    () => rosters.find((r) => r.classId === selectedClass?.id) ?? null,
    [rosters, selectedClass]
  );

  const breadcrumbs = selectedClass
    ? ["Classes", selectedClass.name]
    : ["Classes"];

  async function handleConfirmDeleteStudent() {
    if (!deletingStudent) return;
    setDeleting(true);
    try {
      await deleteStudent(deletingStudent.id);
      setDeletingStudent(null);
      loadRosters();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout
      active={nav}
      onNavigate={setNav}
      breadcrumbs={breadcrumbs}
      teacher={teacher}
    >
      <ClassOverview onSelectClass={setSelectedClass} />

      {selectedClass && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-[11px] text-parchment-100 uppercase tracking-wider">
              {selectedClass.name} — Roster
            </h2>
            <PixelButton variant="gold" onClick={() => setAddingStudent(true)}>
              + Add student
            </PixelButton>
          </div>

          {rosterStatus === "loading" && (
            <PixelPanel>
              <p className="font-body text-sm text-parchment-300">
                Loading roster…
              </p>
            </PixelPanel>
          )}

          {rosterStatus === "error" && (
            <PixelPanel accent="ember">
              <p className="font-body text-sm text-parchment-100">
                Couldn't load rosters. Try again shortly.
              </p>
            </PixelPanel>
          )}

          {rosterStatus === "ready" && (
            <RosterTable
              students={activeRoster?.students ?? []}
              onEdit={setEditingStudent}
              onDelete={setDeletingStudent}
            />
          )}
        </section>
      )}

      {addingStudent && selectedClass && (
        <AddStudentModal
          classItem={selectedClass}
          onClose={() => setAddingStudent(false)}
          onCreated={loadRosters}
        />
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onUpdated={loadRosters}
        />
      )}

      {deletingStudent && (
        <ConfirmDialog
          title="Remove Student"
          message={`Remove "${deletingStudent.name}" from this class? They're deactivated rather than deleted outright.`}
          confirmLabel="Remove"
          loading={deleting}
          onConfirm={handleConfirmDeleteStudent}
          onClose={() => setDeletingStudent(null)}
        />
      )}
    </DashboardLayout>
  );
}