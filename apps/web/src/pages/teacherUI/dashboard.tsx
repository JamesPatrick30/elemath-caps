import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatHUD from "../../components/common/StatHUD";
import ClassOverview from "../../components/classes/ClassOverview";
import PerformanceOverview from "../../components/analytics/PerformanceOverview";
import StartQuizModal from "../../components/classes/Startquizmodal";
import { getDashboardStats, getTeacherProfile } from "../../api/teacherApi";
import type { ClassItem, NavKey, StatItem, Teacher } from "../../types";
import { socket } from "../../socket/socket";
import { useNavigate } from "react-router-dom";

interface TeacherDashboardProps {
  teacher?: Teacher;
}

const FALLBACK_STATS: StatItem[] = [
  { label: "Classes", value: "—", accent: "leaf" },
  { label: "Students", value: "—", accent: "sky" },
  { label: "Avg Score", value: "—", accent: "gold" },
  { label: "Needs Attention", value: "—", accent: "ember" },
];

export default function TeacherDashboard({ teacher: teacherProp }: TeacherDashboardProps) {
  const [nav, setNav] = useState<NavKey>("dashboard");
  const [startingClass, setStartingClass] = useState<ClassItem | null>(null);
  const [teacher, setTeacher] = useState<Teacher | undefined>(teacherProp);
  const [stats, setStats] = useState<StatItem[]>(FALLBACK_STATS);

  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to the socket server");
    });
  }, []);

  // Only fetch the profile if it wasn't already passed down — avoids a
  // redundant call when a parent route already loaded it.
  useEffect(() => {
    if (teacherProp) return;

    let cancelled = false;
    getTeacherProfile()
      .then((res) => {
        if (!cancelled) setTeacher(res.data);
      })
      .catch(() => {
        // Topbar falls back to "Trail Guide" if this never resolves.
      });

    return () => {
      cancelled = true;
    };
  }, [teacherProp]);

  useEffect(() => {
    let cancelled = false;

    getDashboardStats()
      .then((res) => {
        if (cancelled) return;
        const { totalClasses, totalStudents, averageScore, needsAttention } = res.data;
        setStats([
          { label: "Classes", value: String(totalClasses), accent: "leaf" },
          { label: "Students", value: String(totalStudents), accent: "sky" },
          { label: "Avg Score", value: `${averageScore}%`, accent: "gold" },
          { label: "Needs Attention", value: String(needsAttention), accent: "ember" },
        ]);
      })
      .catch(() => {
        // StatHUD keeps showing the "—" placeholders on failure rather
        // than a separate error panel — it's non-critical chrome above
        // ClassOverview/PerformanceOverview, which already report their
        // own errors.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardLayout active={nav} onNavigate={setNav} breadcrumbs={["Dashboard"]} teacher={teacher}>
      <StatHUD stats={stats} />

      {/* Clicking a class opens the "start a quiz session" flow
          instead of filtering the analytics below — performance shows
          the aggregate across all classes on this page. */}
      <ClassOverview onSelectClass={setStartingClass} />
      <PerformanceOverview />

      {startingClass && (
        <StartQuizModal
          classItem={startingClass}
          onClose={() => setStartingClass(null)}
          onEnterLobby={(session) => {
            navigate(`/teacher/quiz-lobby/${session.sessionId}`);
            setStartingClass(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}