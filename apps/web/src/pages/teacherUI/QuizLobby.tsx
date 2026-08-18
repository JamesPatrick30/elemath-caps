import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { getPdf, uploadPdf,getProcessingFiles } from "../../api/pdfApi";
import { socket } from "../../socket/socket";
import { SocketEvents } from "../../socket/socketEvents";
import type { uploadTask } from "@repo/types";
import StudentListLobbyTable from "../../components/game/StudentListLobbyTable";
import { generateQuestions, getGameSession } from "../../api/gameApi";

interface FileProcessedUpdate extends uploadTask {
    status: string;
    isDone: boolean;
}

export default function QuizLobby() {

    const navigate = useNavigate();
    
    const { classId } = useParams<{ classId: string }>();
    const [session, setSession] = useState<any>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [Dropfile, setDropfile] = useState<File | null>(null);
    const [uploadPanelStatus, setUploadPanelStatus] = useState<FileProcessedUpdate | null>(null);
    const dragCounter = useRef(0);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);
    const [questionType, setQuestionType] = useState<'multiple-choice' | 'true-false' | 'short-answer'>('multiple-choice');
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [lessons, setLessons] = useState<any[]>([]);

    useEffect(() => {
        const checkSessionExistence = async () => {
            try {
                const response = await getGameSession(classId!);
                if (response.data) {
                    console.log("Quiz session exists:", response.data);
                    setSession(response.data);
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    navigate("/teacher/");
                }
                console.error("Error checking quiz session existence:", error);
            }
        };
        checkSessionExistence();
    },[]);

    const refreshUploadedFiles = async () => {
        if (!classId) return;
        try {
            const files = await getPdf(classId);
            console.log("Fetched uploaded files:", files);
            setLessons(files ?? []);
        } catch (error) {
            console.error("Error fetching uploaded files:", error);
        }
    };

    const refreshProcessingStatus = async () => {
        if (!classId) return;
        setLoadingFiles(true);

        try {

            const status = await getProcessingFiles();
            console.log("Fetched processing status:", status);
            if (status.processing) {
                setUploadPanelStatus({status: status.status, isDone: false, id: "", userId: ""});
            }else{
                setUploadPanelStatus(null);

            }

        }
        catch (error) {
            console.error("Error fetching processing status:", error);
        }finally {
            setLoadingFiles(false);
        }
    };

    // Refresh the processing status and uploaded files when the component mounts or when classId changes
    useEffect( ()=> {
        refreshProcessingStatus();
        refreshUploadedFiles();
    }, [classId]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer.types.includes("Files")) return;

        dragCounter.current += 1;
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current -= 1;
        if (dragCounter.current <= 0) {
            dragCounter.current = 0;
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        // Must preventDefault on dragover, or drop never fires — but don't touch state here.
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current = 0;
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setDropfile(files[0]);
        }
    };

    const handleUpload = async () => {
        if (!Dropfile || !classId) return;

        try {
            await uploadPdf(classId, Dropfile, (percent) => {
                setUploadProgress(percent);
            });
            resetUploadPanel();
        } catch (error) {

            console.error("PDF upload failed:", error);

        }
    };

    const handleGenerateStart = async () => {
        console.log("Starting question generation with parameters:", {
            lessonId: selectedLesson?.id,
            numberOfQuestions,
            type: questionType,
        });
        if (!classId) return;
        if (!selectedLesson) return;
        if (!numberOfQuestions || numberOfQuestions <= 0) return;
        if (!questionType) return;
        try{
            await generateQuestions({
                classId,
                lessonId: selectedLesson.id,
                numberOfQuestions,
                type: questionType,
            });
        }catch(error){
            console.error("Error starting question generation:", error);
        }
    }

    const resetUploadPanel = () => {
        setDropfile(null);
        setUploadProgress(0);
        setUploadPanelStatus(null);
    }

    useEffect(() => {
        socket.connect();
        socket.on(SocketEvents.PDF_UPLOADED, (data: FileProcessedUpdate) => {
            console.log("PDF uploaded event received:", data);
            setUploadPanelStatus(data);
            if (data.isDone) {
                // 3 second delay to allow the user to see the "done" status before resetting the panel
                setTimeout(() => {
                    resetUploadPanel();
                }, 3000);
                
            }
        });
        socket.on(SocketEvents.STUDENT_JOIN, (data) => {

            console.log("Student joined:", data);
            setSession((prevSession: any) => {
                if (!prevSession) return prevSession;
                const updatedStudents = prevSession.students.map((student: any) => {
                    if (student.id === data.id) {
                        return { ...student, isInGame: true, joinedAt: Date.now() };
                    }
                    return student;
                });
                return { ...prevSession, students: updatedStudents };
            });
        });

        socket.on(SocketEvents.QUIZ_STARTED, (data) => {
            console.log("Quiz started:", data);
            navigate(`/teacher/leaderboard/${classId}`);
        });

        socket.emit(SocketEvents.STUDENT_JOIN, { roomId: classId });

        return () => {
            socket.off(SocketEvents.PDF_UPLOADED);
            socket.off(SocketEvents.STUDENT_JOIN);
            socket.off(SocketEvents.QUIZ_STARTED);
        }
    }, []);

    const notchClip = (size = 8) =>
    ({
        clipPath: `polygon(0 ${size}px, ${size}px ${size}px, ${size}px 0, calc(100% - ${size}px) 0, calc(100% - ${size}px) ${size}px, 100% ${size}px, 100% calc(100% - ${size}px), calc(100% - ${size}px) calc(100% - ${size}px), calc(100% - ${size}px) 100%, ${size}px 100%, ${size}px calc(100% - ${size}px), 0 calc(100% - ${size}px))`,
    } as const);

    return (
        <div className="h-screen w-full overflow-hidden bg-canopy-950 p-6 md:p-10 flex flex-col md:flex-row items-stretch justify-center gap-2.5">
            <div className="flex flex-col gap-3 w-full md:w-100 md:shrink-0 min-h-0">
                <div
                    className="border-4 border-canopy-800 bg-canopy-900 p-6 shadow-[6px_6px_0_theme(--colors-canopy-950)] flex flex-col gap-3 w-full"
                    style={notchClip(10)}
                >
                    <div className="flex items-center justify-between border-b-2 border-leaf-700 pb-3 mb-1">
                        <h3 className="font-pixel text-xs text-sun-300 tracking-wide">
                            Quiz Lobby
                        </h3>
                        <span className="font-pixel text-[9px] text-leaf-400 bg-canopy-950 px-2 py-1 border border-leaf-700">
                            Lobby
                        </span>
                    </div>

                    <p className="font-sans text-parchment-100">
                        This is a simple lesson
                    </p>
                </div>

                {/* Drag handlers now scoped to just this drop zone */}
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-4 border-canopy-800 bg-canopy-900 p-6 shadow-[6px_6px_0_theme(--colors-canopy-950)] flex flex-col gap-3 w-full h-100 justify-center items-center"
                >
                    {loadingFiles? (
                        <div className="flex flex-col items-center justify-center gap-4 h-full w-full px-4 py-6 text-center">
                            {/* Pixel-block loader: three squares stepping in sequence, classic 8-bit style */}
                            <div className="flex items-end gap-1.5">
                                <span className="w-3 h-3 bg-leaf-400 animate-pixel-bounce [animation-delay:0ms]" />
                                <span className="w-3 h-3 bg-leaf-400 animate-pixel-bounce [animation-delay:150ms]" />
                                <span className="w-3 h-3 bg-leaf-400 animate-pixel-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    ) : isDragging ? (
                        <div className="border-sky-400/60 bg-sky-500/5 transition-colors px-4 py-6 flex flex-col items-center gap-2 justify-center border-2 border-dashed h-full w-full pointer-events-none ">
                            <p className="text-white text-lg">Drop files here</p>
                        </div>
                    ) : uploadProgress > 0 ? (
                        <div className=" transition-colors px-4 py-6 flex flex-col items-center gap-2 text-center h-full w-full">
                            <p className="text-white text-lg">Uploading...</p>
                            <div className="w-full bg-canopy-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-sky-500 h-full"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    ) : Dropfile != null ? (
                        <div className="flex flex-col items-center justify-center gap-4 h-full w-full px-4 py-6 text-center border-2 border-dashed border-leaf-400/50 bg-leaf-500/5">
                            {/* File icon, since a name alone is easy to miss at a glance */}
                            <svg
                                className="w-10 h-10 text-leaf-400"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6" />
                            </svg>

                            <div className="flex flex-col gap-1">
                                <p className="text-white font-sans text-sm">File dropped</p>
                                <p className="text-leaf-400 font-mono text-xs break-all px-2">
                                    {Dropfile.name}
                                </p>
                            </div>

                            <button
                                onClick={handleUpload}
                                className="group relative py-2 px-4 mt-1 bg-mango-500 hover:bg-mango-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-canopy-950 font-pixel text-[10px] tracking-wide shadow-[3px_3px_0_theme(--colors-canopy-950)] transition-all duration-100"
                            >
                                Upload Another File
                            </button>
                        </div>
                    ) : uploadPanelStatus != null ? (
                        <div className="flex flex-col items-center justify-center gap-4 h-full w-full px-4 py-6 text-center">
                            {/* Pixel-block loader: three squares stepping in sequence, classic 8-bit style */}
                            <div className="flex items-end gap-1.5">
                                <span className="w-3 h-3 bg-leaf-400 animate-pixel-bounce [animation-delay:0ms]" />
                                <span className="w-3 h-3 bg-leaf-400 animate-pixel-bounce [animation-delay:150ms]" />
                                <span className="w-3 h-3 bg-leaf-400 animate-pixel-bounce [animation-delay:300ms]" />
                            </div>

                            <p className="text-sun-400 font-pixel text-[11px] tracking-wide">
                                {uploadPanelStatus.status}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <select className="w-full appearance-none p-3 pr-10 bg-canopy-800 text-white font-sans text-sm border-2 border-canopy-700 focus:border-leaf-400 focus:outline-none transition-colors cursor-pointer" value={selectedLesson?.id ?? ""} onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const lesson = lessons.find((lesson) => lesson.id.toString() === selectedId);
                                    setSelectedLesson(lesson ?? null);
                                }}>
                                    <option value="">Select a lesson</option>
                                    {lessons.map((lesson) => (
                                        <option key={lesson.id} value={lesson.id}>
                                            {lesson.fileName}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom dropdown arrow, since appearance-none strips the native one */}
                                <svg
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-leaf-400"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-4 w-full pt-2 border-t-2 border-canopy-800">
                                <div className="flex items-center gap-3 w-full">
                                    <input
                                        type="number"
                                        min={1}
                                        placeholder="No. of questions"
                                        value={numberOfQuestions}
                                        onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                                        className="w-1/2 p-3 bg-canopy-800 text-white placeholder-canopy-500 font-sans text-sm border-2 border-canopy-700 focus:border-leaf-400 focus:outline-none transition-colors"
                                    />
                                    <select className="w-1/2 appearance-none p-3 bg-canopy-800 text-white font-sans text-sm border-2 border-canopy-700 focus:border-leaf-400 focus:outline-none transition-colors cursor-pointer" value={questionType ?? ""} onChange={(e) => setQuestionType(e.target.value as 'multiple-choice' | 'true-false' | 'short-answer' )}>
                                        
                                        <option value="multiple-choice">Multiple Choice</option>
                                        <option value="true-false">True/False</option>
                                        <option value="short-answer">Short Answer</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleGenerateStart}
                                    className="group relative w-full py-3 px-4 bg-mango-500 hover:bg-mango-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-canopy-950 font-pixel text-[11px] tracking-wide shadow-[4px_4px_0_theme(--colors-canopy-950)] transition-all duration-100"
                                >
                                    Generate Questions
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <StudentListLobbyTable students={session?.students ?? []} />
        </div>
    );
}