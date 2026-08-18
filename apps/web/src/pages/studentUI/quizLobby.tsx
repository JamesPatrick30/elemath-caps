import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import type { quizSession } from "@repo/types";
import { getStudentsInSession } from "../../api/gameApi";
import { socket } from "../../socket/socket";
import type { socketEvents } from "@repo/types";
const HABITATS = [
  { bg: "#E4F5D8", border: "#3FA34D", text: "#1F5C2B", emoji: "🐸" },
  { bg: "#DCF0F8", border: "#2F9BCB", text: "#1B5A78", emoji: "🐟" },
  { bg: "#FDEAD3", border: "#F2994A", text: "#8A4E15", emoji: "🦁" },
  { bg: "#FBE3F1", border: "#D66BB8", text: "#7A2C60", emoji: "🦋" },
  { bg: "#FBF0CF", border: "#E8B93F", text: "#7A5E10", emoji: "🐒" },
  { bg: "#E1F6F1", border: "#39B592", text: "#155C48", emoji: "🦜" },
];

function habitatFor(index: number) {
  return HABITATS[index % HABITATS.length];
}

function timeAgo(ts: number | null | undefined, now: number = Date.now()) {
    if (!ts) return "just now";
  const diff = Math.max(0, Math.floor((now - ts) / 1000));
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}

const MOCK_STUDENTS: quizSession['students'] = [
  { id: "1", name: "Miguel", isInGame: false, joinedAt: Date.now() - 120000 },
  { id: "2", name: "Andrea", isInGame: true, joinedAt: Date.now() - 95000 },
  { id: "3", name: "Josh", isInGame: false, joinedAt: Date.now() - 60000 },
  { id: "4", name: "Bea", isInGame: false, joinedAt: Date.now() - 40000 },
  { id: "5", name: "Kyle", isInGame: false, joinedAt: Date.now() - 20000 },
  { id: "6", name: "Nadine", isInGame: false, joinedAt: Date.now() - 4000 },
];

const SocketEvents: socketEvents = {
  STUDENT_JOIN: "student-join",
  QUIZ_STARTED: "quiz-started",
  QUIZ_ENDED: "quiz-ended",
  PDF_UPLOADED: "pdf-uploaded",
  SUBMIT_ANSWER: "submit-answer"
};
export default function StudentQuizLobby() {
  const [now, setNow] = useState(Date.now());

  const navigate = useNavigate();
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);


  useEffect(() => {
    socket.connect();
    socket.on(SocketEvents.STUDENT_JOIN, (data) => {
      console.log("Student joined:", data);
      handleGetStudents();
    });

    socket.on(SocketEvents.QUIZ_STARTED, (data) => {
            console.log("Quiz started:", data);
            navigate(`/student/quiz-session`);
      });
    socket.emit(SocketEvents.STUDENT_JOIN, { roomId: "quiz_room_123" });
    return () => {
      socket.off(SocketEvents.STUDENT_JOIN);
    }
  }, []);
  const handleGetStudents = async () => {
    try {
      const students = await getStudentsInSession();
      setStudents(students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

    useEffect(() => {
        handleGetStudents();
    }, []);
  const [ students, setStudents ] = useState<quizSession['students']>(MOCK_STUDENTS);

  const [filteredStudents, setFilteredStudents] = useState<{ id: string; name: string; isInGame: boolean; joinedAt: number | null }[]>(students.filter(s => s.isInGame));

    useEffect(() => {
        setFilteredStudents(students.filter(s => s.isInGame));
    }, [students]);

  return (
    <div
      style={{ fontFamily: "'Baloo 2', sans-serif" }}
      className="min-h-screen bg-green-200 w-full flex flex-col items-center px-4 py-8 sm:py-12"
    >


      {/* Signpost header */}
      {/* <div
        className="pixel-notch w-full max-w-md flex flex-col items-center gap-3 px-6 py-6 mb-2"
        style={{ background: "#1F3A24", border: "4px solid #16241A" }}
      >
        <p className="mono-font" style={{ fontSize: "10px", letterSpacing: "2px", color: "#9FD8A8" }}>
          ROOM CODE
        </p>
        <p className="pixel-font text-2xl sm:text-3xl" style={{ color: "#F2FBF3", letterSpacing: "2px" }}>
          {quizCode}
        </p>
      </div> */}

      {/* Waiting status */}
      <div className="flex flex-col items-center gap-2 mt-6 mb-8 text-center">
        <p className="pixel-font text-xs" style={{ color: "#1F3A24" }}>
          Jungle Camp Lobby
        </p>
        <div className="flex items-center gap-2" style={{ color: "#5C6B5F" }}>
          {/* <span className="text-sm">Waiting for {teacherName} to start</span> */}
          <span className="flex gap-1">
            <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: "#3FA34D" }} />
            <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: "#3FA34D" }} />
            <span className="dot w-1.5 h-1.5 rounded-full" style={{ background: "#3FA34D" }} />
          </span>
        </div>
      </div>

      {/* Students grid */}
      <div className="w-full max-w-3xl flex-1">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="text-5xl">🌿</span>
            <p className="text-sm" style={{ color: "#5C6B5F" }}>
              No explorers yet. Share the code above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredStudents.map((s, i) => {
              const h = habitatFor(i);
              return (
                <div
                  key={s.id}
                  className="pop-in pixel-notch-sm flex flex-col items-center gap-2 px-3 py-4"
                  style={{ background: h.bg, border: `3px solid ${h.border}` }}
                >
                  <span className="text-2xl">{h.emoji}</span>
                  <p
                    className="text-sm font-semibold text-center leading-tight break-words w-full"
                    style={{ color: h.text }}
                  >
                    {s.name}
                  </p>
                  <p className="mono-font" style={{ fontSize: "9px", color: h.text, opacity: 0.7 }}>
                    {timeAgo(s.joinedAt, now)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer counter */}
      <div
        className="pixel-notch-sm sticky bottom-4 mt-8 flex items-center gap-3 px-5 py-3"
        style={{ background: "#FFFFFF", border: "3px solid #1F3A24" }}
      >
        <span className="live-dot w-2 h-2 rounded-full" style={{ background: "#3FA34D" }} />
        <p className="mono-font text-xs" style={{ color: "#1F3A24" }}>
          {filteredStudents.length} / {students.length} explorers ready
        </p>
      </div>
    </div>
  );
}