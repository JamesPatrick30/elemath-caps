import { useNavigate, useParams } from "react-router-dom";
import { getGameSession, leaderboard, saveQuizSession } from "../../api/gameApi";
import { useEffect, useState } from "react";
import LeaderBoardTable from "../../components/game/LeaderBoardTable";
import type { StudentLeaderboardTable, updateStudentScore } from "@repo/types";
import { Trophy, PartyPopper, Loader2 } from "lucide-react";
import PodiumSpot from "../../components/game/PodiumSpot";
import { socket } from "../../socket/socket";
import { SocketEvents } from "../../socket/socketEvents";

export default function LeaderBoard() {
    const classId = useParams<{ classId: string }>().classId;
    const navigate = useNavigate();

    const [isSessionDone, setIsSessionDone] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [studentsInSession, setStudentsInSession] = useState<
        StudentLeaderboardTable[]
    >([]);

    const sortedStudents = [...studentsInSession].sort(
        (a, b) => b.score - a.score
    );

    const handleGetSessionData = async () => {
        try {
            const response = await getGameSession(classId!);
            console.log("Students in session:", response);
        } catch (error) {
            console.error("Error fetching students in session:", error);
        }
    };

    const handleSaveQuizSession = async () => {
        setIsSaving(true);
        try {
            const response = await saveQuizSession(classId!);
            console.log("Quiz session saved:", response);
            navigate(`/teacher`);
        } catch (error) {
            console.error("Error saving quiz session:", error);
            setIsSaving(false);
        }
    };

    const handleGetLeaderboard = async () => {
        try {
            const leaderboardData = await leaderboard(classId!);
            setStudentsInSession(leaderboardData.leaderboard);
            setIsSessionDone(leaderboardData.isSessionDone);
            console.log("Leaderboard data:", leaderboardData);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleGetSessionData();
        handleGetLeaderboard();
    }, []);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected to server with ID:", socket.id);
            if (!classId) {
                console.error("classId is undefined. Cannot join room.");
                return;
            }
            console.log(`Joining room with classId: ${classId}`);
            socket.emit(SocketEvents.STUDENT_JOIN, { roomId: classId });
        });
        socket.emit(SocketEvents.STUDENT_JOIN, { roomId: classId });

        socket.on(SocketEvents.SUBMIT_ANSWER, (data: updateStudentScore) => {
            console.log("Answer submitted:", data);
            setStudentsInSession((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === data.studentId
                        ? { ...student, score: data.score }
                        : student
                )
            );
        });

        socket.on(SocketEvents.QUIZ_COMPLETED, (data) => {
            console.log("Quiz completed event received:", data);
            setIsSessionDone(true);
        });

        return () => {
            socket.off(SocketEvents.SUBMIT_ANSWER);
            socket.off(SocketEvents.QUIZ_COMPLETED);
        };
    }, []);

    return (
        <div className="relative flex flex-col items-center bg-canopy-950 w-full min-h-screen gap-8 pb-32 overflow-hidden">
            {/* ambient jungle glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(101,163,13,0.18),transparent_55%)]" />
            <div className="pointer-events-none absolute -left-24 top-1/3 w-72 h-72 bg-leaf-700/10 blur-3xl rounded-full" />
            <div className="pointer-events-none absolute -right-24 top-2/3 w-72 h-72 bg-mango-600/10 blur-3xl rounded-full" />

            {/* header */}
            <div className="relative flex flex-col items-center gap-2 pt-10">
                <div className="relative">
                    <Trophy
                        className={`w-9 h-9 text-sun-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)] ${
                            isSessionDone ? "animate-bounce" : ""
                        }`}
                    />
                </div>
                <h1 className="font-pixel text-2xl text-sun-300 drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)] tracking-wide">
                    Leaderboard
                </h1>
                <p className="font-sans text-sm text-parchment-300/70">
                    {isSessionDone
                        ? "Final results are in!"
                        : "Live scores — updating in real time"}
                </p>
            </div>

            {/* loading state */}
            {isLoading ? (
                <div className="relative flex flex-col items-center gap-3 py-16 text-parchment-300/70">
                    <Loader2 className="w-8 h-8 animate-spin text-leaf-400" />
                    <span className="font-sans text-sm">Loading leaderboard…</span>
                </div>
            ) : (
                <>
                    {/* podium */}
                    <div className="relative w-full max-w-md flex justify-center items-end gap-4 px-4">
                        {studentsInSession.length > 1 && (
                            <div className="translate-y-2">
                                <PodiumSpot student={sortedStudents[1]} rank={2} />
                            </div>
                        )}
                        <div className="-translate-y-2 scale-105 z-10">
                            <PodiumSpot student={sortedStudents[0]} rank={1} />
                        </div>
                        {studentsInSession.length > 2 && (
                            <div className="translate-y-4">
                                <PodiumSpot student={sortedStudents[2]} rank={3} />
                            </div>
                        )}
                    </div>

                    {/* table panel */}
                    <div
                        className="relative w-full max-w-md bg-canopy-900/60 border-2 border-leaf-700/40 backdrop-blur-sm px-3 py-4"
                        style={{
                            clipPath:
                                "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
                        }}
                    >
                        <LeaderBoardTable students={sortedStudents} />
                    </div>

                    {/* completion banner */}
                    {isSessionDone && (
                        <div
                            className="relative flex items-center gap-2 bg-parchment-100 border-2 border-mango-500 px-5 py-3"
                            style={{
                                clipPath:
                                    "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
                            }}
                        >
                            <PartyPopper className="w-5 h-5 text-mango-600" />
                            <span className="font-pixel text-xs text-canopy-900">
                                Quiz Completed!
                            </span>
                        </div>

                    )}
                    {/* sticky save bar */}
                    <div className="fixed bottom-0 left-0 w-full bg-canopy-950/90 backdrop-blur-sm border-t-2 border-leaf-700/40 px-4 py-4 flex justify-center">
                        <button
                            onClick={handleSaveQuizSession}
                            disabled={isSaving}
                            className={`font-pixel text-xs tracking-wide px-6 py-3 border-2 border-canopy-900 transition-all
                                ${
                                    isSaving
                                        ? "bg-leaf-700/50 text-parchment-300/60 cursor-not-allowed"
                                        : "bg-mango-500 text-canopy-950 hover:bg-mango-400 active:scale-95 shadow-[3px_3px_0_rgba(0,0,0,0.4)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.4)]"
                                }`}
                            style={{
                                clipPath:
                                    "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))",
                            }}
                        >
                            {isSaving ? "Saving…" : "Save Quiz Session"}
                        </button>
                    </div>
                </>
            )}

        </div>
    );
}