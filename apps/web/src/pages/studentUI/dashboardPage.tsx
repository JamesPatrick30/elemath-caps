import  { useEffect, useState } from "react";
import StudentDashboard from ".//dashboard";
import type { StudentDashboardData } from "@repo/types";
import { useNavigate } from "react-router-dom";

// import axios from "../../lib/axios"; // whatever your configured instance is

// Remove once the endpoint is wired up — kept here just so the page
// renders something while you build against it.
import { getStudentDashboard, isGameSessionExist } from "../../api/studentsApi";
import { joinQuizSession } from "../../api/gameApi";

import { logout } from "../../api/auth";
export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

   const handleJoinQuiz = async () => {
    console.log("Attempting to join a quiz session...");
    if (!data || data.trail.length === 0) {
      console.error("No trail data available to join a quiz session.");
      return;
    }
    try {
      const response = await joinQuizSession(data.trail[0].classId);
      console.log(`Joined quiz session:`, response);

      onJoinQuiz();
      
    } catch (error) {
      console.error("Failed to join quiz session", error);
    }
  };

  const onJoinQuiz = () => {
    // Navigate to the quiz lobby or quiz page
    navigate("/student/quiz-lobby");
  }
  useEffect(() => {
    const isGameSessionExists = async () => {
      try {
        const response = await isGameSessionExist();
        console.log(`Game session check result:`, response);
        if (response.exists) {
          // Handle the case where a live quiz session exists
          // For example, you might want to navigate to the quiz lobby or show a modal
          console.log("A game session exists for the student.");
          return;
        }
        console.log("No active game session for the student.");
      } catch (error) {
        console.error("Failed to check game session", error);
      }
      
    }

    isGameSessionExists();
  }, []);
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
      onJoinQuiz={handleJoinQuiz}
      onLogout={handleLogout}
    />
  );
}