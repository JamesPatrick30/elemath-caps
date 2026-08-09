import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import type { ActiveQuizSession, JoinQuizResponse } from "@repo/types";
// import axios from "../../lib/axios"; // whatever your configured instance is

interface JoinQuizButtonProps {
  classId: string;
  onJoin: (session: ActiveQuizSession) => void; // e.g. navigate to the lobby + connect the socket
}

export default function JoinQuizButton({ classId, onJoin }: JoinQuizButtonProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleJoin() {
    setIsChecking(true);
    setMessage(null);
    if (!classId) {
      setMessage("Class ID is missing.");
      setIsChecking(false);
      return;
    }
    try {
      // const res = await axios.get<JoinQuizResponse>(`/classes/${classId}/active-quiz`);
      // const data = res.data;
      const data: JoinQuizResponse = { hasActiveQuiz: false }; // placeholder until the endpoint exists

      if (data.hasActiveQuiz && data.session) {
        onJoin(data.session);
      } else {
        setMessage("No live quiz right now — check back once your teacher starts one.");
      }
    } catch (err) {
      console.error("Failed to check for an active quiz", err);
      setMessage("Couldn't reach the server. Try again.");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleJoin}
        disabled={isChecking}
        className="px-6 py-3 border-4 border-[#1B4332] font-extrabold text-white flex items-center gap-2 active:translate-x-0.75 active:translate-y-0.75 active:shadow-none transition-all disabled:opacity-70"
        style={{ backgroundColor: "#4CD07D", boxShadow: "5px 5px 0 #1B4332" }}
      >
        {isChecking ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
        {isChecking ? "Checking..." : "Join Quiz"}
      </button>

      {message && <p className="text-xs text-[#8A8570]">{message}</p>}
    </div>
  );
}