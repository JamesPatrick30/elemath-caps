import { useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatHUD from "../../components/common/StatHUD";
import ClassOverview from "../../components/classes/ClassOverview";
import PerformanceOverview from "../../components/analytics/PerformanceOverview";
import type { ClassItem, NavKey, StatItem, Teacher } from "../../types/dashboard.types";

interface TeacherDashboardProps {
  teacher?: Teacher;
}

export default function TeacherDashboard({ teacher }: TeacherDashboardProps) {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [nav, setNav] = useState<NavKey>("dashboard");

  const breadcrumbs = useMemo(
    () => (selectedClass ? ["Dashboard", selectedClass.name] : ["Dashboard"]),
    [selectedClass]
  );

  // Placeholder HUD numbers — wire these to a /analytics/summary
  // endpoint once it exists, or derive them from ClassOverview's data
  // via a shared context/store.
  const stats: StatItem[] = [
    { label: "Classes", value: "4", accent: "leaf" },
    { label: "Students", value: "112", accent: "sky" },
    { label: "Avg Score", value: "78%", accent: "gold" },
    { label: "Needs Attention", value: "9", accent: "ember" },
  ];

  return (
    <DashboardLayout
      active={nav}
      onNavigate={setNav}
      breadcrumbs={breadcrumbs}
      teacher={teacher}
    >
      <StatHUD stats={stats} />
      <ClassOverview onSelectClass={setSelectedClass} />
      <PerformanceOverview classId={selectedClass?.id} />
    </DashboardLayout>
  );
}