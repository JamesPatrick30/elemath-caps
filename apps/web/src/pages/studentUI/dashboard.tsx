import { Target, Star, Trophy, Clock3 } from "lucide-react";
import DashboardHeader from "../../components/student/DashboardHeader";
import PixelCard from "../../components/student/PixelCard";
import JungleTrail from "../../components/student/JungleTrail";
import RecentAdventures from "../../components/student/RecentAdventures";
import JoinQuizButton from "../../components/student/Joinquizbutton";
import type { StudentDashboardData } from "@repo/types";
import { isGameSessionExist } from "../../api/studentsApi";
import { useEffect } from "react";

interface StudentDashboardProps {
  data: StudentDashboardData | null; // pass your API response here
  isLoading?: boolean;
  onContinueQuest?: () => void; // fires when the "Continue Quest" button is pressed
  onJoinQuiz?: () => void; // fires when a live quiz is found
  onLogout?: () => void; // fires when the header's logout button is pressed
}

export default function StudentDashboard({
  data,
  isLoading,
  onContinueQuest,
  onJoinQuiz,
  onLogout,
}: StudentDashboardProps) {
  if (isLoading || !data) {
    return (
      <div className="min-h-screen w-full bg-[#F2FBF3] flex items-center justify-center">
        <p className="text-sm text-[#5C6B5F] font-pixel">Loading your jungle trail...</p>
      </div>
    );
  }

  const handleCheckGameSession = async () => {
    try {
      const response = await isGameSessionExist();
      console.log(`Game session check result:`, response);
      if (response.exists && onJoinQuiz) {
        onJoinQuiz();
      }
    } catch (error) {
      console.error("Failed to check game session", error);
    }
  };

  useEffect(() => {
    handleCheckGameSession();
  }, []);

  const { studentName, streakDays, analytics, trail, recentAttempts } = data;

  return (
    <div className="min-h-screen w-full bg-[#F2FBF3] font-sans">
      {/* Fonts + keyframes — move these into your global CSS/index.html
          instead of a per-mount <style> tag once this is wired for real. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Baloo+2:wght@500;700;800&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        body, .font-sans { font-family: 'Baloo 2', sans-serif; }
        @keyframes frog-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 4px 4px 0 #FFD23F; } 50% { box-shadow: 4px 4px 0 #FF9EC4; } }
        @keyframes leaf-drift { 0% { transform: translateY(0) rotate(0deg); opacity: 0.5; } 100% { transform: translateY(120px) rotate(40deg); opacity: 0; } }
      `}</style>

      <DashboardHeader
        studentName={studentName}
        streakDays={streakDays}
        analytics={analytics}
        onLogout={onLogout}
      />

      <div className="max-w-4xl mx-auto px-5 py-8 space-y-10">
        {trail[0] && onJoinQuiz && (
          <JoinQuizButton classId={trail[0].classId} onJoin={onJoinQuiz} />
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <PixelCard icon={<Target size={18} color="#1B4332" />} label="Quizzes" value={analytics.quizzesTaken} accent="#4CD07D" />
          <PixelCard icon={<Star size={18} color="#1B4332" />} label="Avg score" value={`${analytics.averageScore}%`} accent="#FFD23F" />
          <PixelCard icon={<Trophy size={18} color="#1B4332" />} label="Best score" value={`${analytics.highestScore}%`} accent="#FF6FA5" />
          <PixelCard icon={<Clock3 size={18} color="#1B4332" />} label="Accuracy" value={`${analytics.accuracy}%`} accent="#9B5DE5" />
        </div>

        <JungleTrail trail={trail} />
        <RecentAdventures attempts={recentAttempts} />

        <div className="flex justify-center pb-4">
          <button
            onClick={onContinueQuest}
            className="px-6 py-3 border-4 border-[#1B4332] font-extrabold text-white active:translate-x-0.75 active:translate-y-0.75 active:shadow-none transition-all"
            style={{ backgroundColor: "#FF6FA5", boxShadow: "5px 5px 0 #1B4332" }}
          >
            Continue Quest →
          </button>
        </div>
      </div>
    </div>
  );
}