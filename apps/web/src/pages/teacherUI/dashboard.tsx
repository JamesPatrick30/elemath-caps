import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatHUD from "../../components/common/StatHUD";
import ClassOverview from "../../components/classes/ClassOverview";
import PerformanceOverview from "../../components/analytics/PerformanceOverview";
import StartQuizModal from "../../components/classes/Startquizmodal";
import type { ClassItem, NavKey, StatItem, Teacher } from "../../types";
import { socket } from "../../socket/socket";
import { useNavigate } from "react-router-dom";
interface TeacherDashboardProps {
  teacher?: Teacher;
}

export default function TeacherDashboard({ teacher }: TeacherDashboardProps) {
  const [nav, setNav] = useState<NavKey>("dashboard");
  const [startingClass, setStartingClass] = useState<ClassItem | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    // Connect to the socket when the component mounts
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to the socket server");
    });
  }, []);
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
      breadcrumbs={["Dashboard"]}
      teacher={teacher}
    >
      <StatHUD stats={stats} />

      {/* Clicking a class now opens the "start a quiz session" flow
          instead of filtering the analytics below — performance shows
          the aggregate across all classes on this page. Per-class
          performance still works from ClassesPage's roster view. */}
      <ClassOverview onSelectClass={setStartingClass} />
      <PerformanceOverview />

      {startingClass && (
        <StartQuizModal
          classItem={startingClass}
          onClose={() => setStartingClass(null)}
          onEnterLobby={(session) => {
            // setActiveSession({ classItem: startingClass, session });
            navigate(`/teacher/quiz-lobby/${session.sessionId}`);
            setStartingClass(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}