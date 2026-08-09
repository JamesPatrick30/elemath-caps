import  { useEffect, useState } from "react";
import StudentDashboard from ".//dashboard";
import type { StudentDashboardData } from "@repo/types";
// import axios from "../../lib/axios"; // whatever your configured instance is

// Remove once the endpoint is wired up — kept here just so the page
// renders something while you build against it.
import { getStudentDashboard } from "../../api/studentsApi";
const DUMMY_DATA: StudentDashboardData = {
  studentName: "Maya",
  streakDays: 5,
  analytics: {
    quizzesTaken: 12,
    averageScore: 84,
    highestScore: 98,
    accuracy: 91,
  },
  trail: [
    {
      classId: "class_1",
      className: "Rainforest Fractions",
      habitat: "rainforest",
      quizzes: [
        { id: "quiz_1", title: "Counting Canopy Vines", status: "done", score: 9, totalItems: 10 },
        { id: "quiz_2", title: "Splitting the Banana Stash", status: "done", score: 8, totalItems: 10 },
        { id: "quiz_3", title: "Riverbank Ratios", status: "current" },
        { id: "quiz_4", title: "Treetop Percentages", status: "locked" },
      ],
    },
    {
      classId: "class_2",
      className: "Savanna Geometry",
      habitat: "savanna",
      quizzes: [
        { id: "quiz_5", title: "Shapes of the Watering Hole", status: "locked" },
        { id: "quiz_6", title: "Angles on the Trail", status: "locked" },
      ],
    },
  ],
  recentAttempts: [
    { id: "attempt_1", title: "Splitting the Banana Stash", score: 8, totalItems: 10, durationSec: 210 },
    { id: "attempt_2", title: "Counting Canopy Vines", score: 9, totalItems: 10, durationSec: 185 },
    { id: "attempt_3", title: "Jungle Number Line", score: 7, totalItems: 10, durationSec: 240 },
  ],
};

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        const response = await getStudentDashboard();
        if (!cancelled) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Failed to load student dashboard", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StudentDashboard
      data={data}
      isLoading={isLoading}
      onContinueQuest={() => {
        // navigate to the next unlocked quiz, e.g. via react-router's useNavigate
      }}
    />
  );
}