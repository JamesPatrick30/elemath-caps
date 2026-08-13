import { socket } from "../../socket/socket";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SocketEvents } from "../../socket/socketEvents";
import { getGameSession } from "../../api/gameApi";
import { uploadPdf, getPdf } from "../../api/pdfApi";
import { generateQuestions, addQuestion } from "../../api/gameApi";
import type { QuizSessiondata } from "../../types";
import type { uploadTask } from "@repo/types";
// Fun critter avatars assigned per student index — gives kids something to
// recognize at a glance instead of a wall of plain names.
const CRITTERS = ["🐸", "🦎", "🦉", "🐿️", "🦋", "🐝", "🐢", "🦔", "🐍", "🦜"];

// TODO: confirm exact PDF_UPLOADED payload shape with backend. Assuming it
// carries at least the file id + processing status + resulting summary
// once the BullMQ job finishes.
interface FileProcessedUpdate extends uploadTask {
    id: string;
    status: string;
    isDone: boolean;
    context?: string;
}

interface UploadedFile {
    id: string;
    fileName: string;
    context: string; // empty string = still processing, per getPdf backend
}

type UploadPanelStatus = "idle" | "selected" | "uploading" | "error";
type GenerateStatus = "idle" | "generating" | "success" | "error";

const QUESTION_TYPES = [
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "true-false", label: "True / False" },
    { value: "short-answer", label: "Short Answer" },
] as const;

export default function QuizLobby() {
    // Route now keyed on classId — students auto-join via their own button,
    // so there's no manual "session code" to display anymore.
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();

    const [session, setSession] = useState<QuizSessiondata | null>(null);

    // --- Upload panel state ---
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadPanelStatus, setUploadPanelStatus] = useState<UploadPanelStatus>("idle");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- File library + generate panel state ---
    const [fileUploadedStatus, setFileUploadedStatus] = useState<FileProcessedUpdate|null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState(10);
    const [questionType, setQuestionType] = useState<(typeof QUESTION_TYPES)[number]["value"]>(
        "multiple-choice"
    );
    const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle");
    const [generatedCount, setGeneratedCount] = useState<number | null>(null);

    if (classId === undefined || classId === null) {
        console.error("Class ID is undefined or null. Redirecting to teacher dashboard.");
        navigate("/teacher/");
    }

    const refreshUploadedFiles = async () => {
        if (!classId) return;
        try {
            const files = await getPdf(classId);
            setUploadedFiles(files ?? []);
        } catch (error) {
            console.error("Error fetching uploaded files:", error);
        }
    };

    useEffect(() => {
        const checkSessionExistence = async () => {
            try {
                const response = await getGameSession(classId!);
                if (response.data) {
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
        refreshUploadedFiles();
    }, [classId]);

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            console.log(`Connected to WebSocket server with socket ID: ${socket.id}`);
        });
        socket.on(SocketEvents.STUDENT_JOIN, (data) => {
            console.log("Student joined:", data);
            setSession((prevSession) => {
                if (!prevSession) return prevSession;
                const updatedStudents = prevSession.students.map((student) => {
                    if (student.id === data.id) {
                        return { ...student, isInGame: true, joinedAt: Date.now() };
                    }
                    return student;
                });
                return { ...prevSession, students: updatedStudents };
            });
        });

        socket.on(SocketEvents.PDF_UPLOADED, (data: FileProcessedUpdate) => {
            console.log("PDF uploaded:", data);
            if ( data.isDone) {
                refreshUploadedFiles();
                setTimeout(() => {
                    setFileUploadedStatus(null);

                }, 1000);
                setFileUploadedStatus(data);

                return;
            }
            setFileUploadedStatus(data);
        });
        socket.emit(SocketEvents.STUDENT_JOIN, { roomId:classId  });


        return () => {
            socket.off(SocketEvents.PDF_UPLOADED);
            socket.off(SocketEvents.STUDENT_JOIN);
        };
    }, []);

    const joinedCount = session?.students.length ?? 0;
    const inGameCount = session?.students.filter((s) => s.isInGame).length ?? 0;

    // --- Upload handlers ---
    const handleFileSelect = (file: File | null) => {
        setErrorMessage(null);
        if (!file) return;
        if (file.type !== "application/pdf") {
            setErrorMessage("Please choose a PDF file.");
            return;
        }
        setSelectedFile(file);
        setUploadPanelStatus("selected");
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files?.[0] ?? null);
    };

    const handleUpload = async () => {
        if (!selectedFile || !classId) return;
        setUploadPanelStatus("uploading");
        setUploadProgress(0);
        setErrorMessage(null);

        try {
            await uploadPdf(classId, selectedFile, (percent) => {
                setUploadProgress(percent);
            });
            // Controller only queues the BullMQ job and returns { success: true }
            // — no file id back yet, so refetch the list to pick up the new
            // (still-processing) entry. PDF_UPLOADED will fill in context later.
            await refreshUploadedFiles();
            resetUploadPanel();
        } catch (error) {
            console.error("PDF upload failed:", error);
            setErrorMessage("Upload failed. Try again?");
            setUploadPanelStatus("error");
        }
    };

    const resetUploadPanel = () => {
        setSelectedFile(null);
        setUploadPanelStatus("idle");
        setUploadProgress(0);
        setErrorMessage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // --- Generate handlers ---
    const handleGenerate = async () => {
        if (!selectedFileId || !classId) return;
        const file = uploadedFiles.find((f) => f.id === selectedFileId);
        if (!file || !file.context) return; // guard: not done processing

        setGenerateStatus("generating");
        try {
            // TODO: confirm response shape — assuming it returns the array of
            // generated questions rather than auto-attaching them to the
            // session, since GenerateQuestionsDto takes no classId.
            const { data: questions } = await generateQuestions({
                content: file.context,
                numberOfQuestions,
                type: questionType,
            });

            console.log("Generated questions:", questions);
            // Attach each generated question to this class's session.
            await Promise.all(
                questions.map((q: any) =>
                    addQuestion({
                        classId,
                        question: q.question,
                        choices: q.choices,
                        type: q.type,
                        answer: q.answer,
                    })
                )
            );

            setGeneratedCount(questions.length);
            setGenerateStatus("success");
        } catch (error) {
            console.error("Question generation failed:", error);
            setGenerateStatus("error");
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-canopy-950 p-6 md:p-10 flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,theme(colors.canopy.900)_0%,transparent_45%),radial-gradient(circle_at_85%_80%,theme(colors.canopy.900)_0%,transparent_40%)]" />
            <div className="pointer-events-none absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <span
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-sun-300 animate-pulse"
                        style={{
                            top: `${(i * 37) % 100}%`,
                            left: `${(i * 53) % 100}%`,
                            animationDelay: `${(i % 5) * 0.4}s`,
                            animationDuration: "2.5s",
                            boxShadow: "0 0 6px theme(colors.sun.300)",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row gap-6">
                {/* LEFT: upload + file library + generate */}
                <div className="md:w-[380px] flex flex-col gap-4">
                    <div className="border-4 border-canopy-800 bg-canopy-900 p-6 shadow-[6px_6px_0_theme(colors.canopy.950)]">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🔥</span>
                            <h1 className="font-press text-lg text-sun-300 leading-tight">
                                Quiz Lobby
                            </h1>
                        </div>
                        <p className="font-mono text-xs text-parchment-400 mt-2 leading-relaxed">
                            Your explorers can join this class's quiz anytime from their dashboard.
                        </p>
                    </div>

                    {/* Upload panel */}
                    <div className="border-4 border-canopy-800 bg-canopy-900 p-6 shadow-[6px_6px_0_theme(colors.canopy.950)] flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📤</span>
                            <h2 className="font-press text-xs text-parchment-100 leading-tight">
                                Upload Material
                            </h2>
                        </div>

                        {fileUploadedStatus === null ? (
                            <label
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                className="cursor-pointer border-2 border-dashed border-sky-400/60 bg-sky-500/5 hover:bg-sky-500/10 transition-colors px-4 py-6 flex flex-col items-center gap-2 text-center"
                            >
                                <span className="text-2xl">📄</span>
                                <span className="font-mono text-xs text-sky-300">
                                    Drop a PDF or click to choose
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                                />
                            </label>
                        ):(
                            <div className="flex flex-col items-center gap-2 py-6 text-center">
                                <span className="text-2xl">📄</span>
                                <span className="font-mono text-xs text-sky-300">
                                    Uploading {fileUploadedStatus.id} — {fileUploadedStatus.status}
                                </span>
                            </div>
                        )}

                        {(uploadPanelStatus === "selected" || uploadPanelStatus === "error") && selectedFile && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-2 border-2 border-canopy-700 bg-canopy-950/60 px-3 py-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-lg shrink-0">📄</span>
                                        <span className="font-mono text-xs text-parchment-100 truncate">
                                            {selectedFile.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={resetUploadPanel}
                                        className="font-mono text-[10px] text-parchment-400 hover:text-bubblegum-400 shrink-0"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {errorMessage && (
                                    <p className="font-mono text-[11px] text-bubblegum-400">{errorMessage}</p>
                                )}

                                <button
                                    onClick={handleUpload}
                                    className="font-press text-[10px] uppercase tracking-wider text-canopy-950 bg-sky-400
                                        border-4 border-canopy-950 px-4 py-3
                                        shadow-[4px_4px_0_theme(colors.canopy.950)]
                                        transition-all hover:bg-sky-300
                                        active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                                >
                                    ⬆ Upload PDF
                                </button>
                            </div>
                        )}

                        {uploadPanelStatus === "uploading" && (
                            <div className="flex flex-col gap-2">
                                <p className="font-mono text-xs text-sky-300 truncate">
                                    Uploading {selectedFile?.name}…
                                </p>
                                <div className="h-3 border-2 border-canopy-700 bg-canopy-950/60 overflow-hidden">
                                    <div
                                        className="h-full bg-sky-400 transition-all duration-200"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* File library + generate panel */}
                    <div className="border-4 border-canopy-800 bg-canopy-900 p-6 shadow-[6px_6px_0_theme(colors.canopy.950)] flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✨</span>
                            <h2 className="font-press text-xs text-parchment-100 leading-tight">
                                Generate Questions
                            </h2>
                        </div>

                        {uploadedFiles.length === 0 ? (
                            <p className="font-mono text-xs text-parchment-400 py-2">
                                Upload a PDF above to get started.
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                                {uploadedFiles.map((file) => {
                                    const isReady = !!file.context;
                                    const isSelected = selectedFileId === file.id;
                                    return (
                                        <li key={file.id}>
                                            <button
                                                disabled={!isReady}
                                                onClick={() => setSelectedFileId(file.id)}
                                                className={`w-full flex items-center justify-between gap-2 border-2 px-3 py-2 text-left transition-colors ${
                                                    isSelected
                                                        ? "border-mango-400 bg-mango-400/10"
                                                        : "border-canopy-700 bg-canopy-950/60"
                                                } ${isReady ? "hover:border-mango-400/60" : "opacity-50 cursor-not-allowed"}`}
                                            >
                                                <span className="font-mono text-xs text-parchment-100 truncate">
                                                    {file.fileName}
                                                </span>
                                                {isReady ? (
                                                    <span className="font-mono text-[9px] uppercase text-leaf-400 shrink-0">
                                                        Ready
                                                    </span>
                                                ) : (
                                                    <span className="font-mono text-[9px] uppercase text-sun-300 shrink-0 flex items-center gap-1">
                                                        <span className="animate-spin">⏳</span> Processing
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {selectedFileId && (
                            <div className="flex flex-col gap-3 pt-2 border-t-2 border-canopy-800">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="font-mono text-[10px] uppercase text-parchment-400 mb-1 block">
                                            # Questions
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={50}
                                            value={numberOfQuestions}
                                            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                                            className="w-full font-mono text-sm text-parchment-100 bg-canopy-950/60 border-2 border-canopy-700 px-2 py-1 focus:border-mango-400 outline-none"
                                        />
                                    </div>
                                    <div className="flex-[1.4]">
                                        <label className="font-mono text-[10px] uppercase text-parchment-400 mb-1 block">
                                            Type
                                        </label>
                                        <select
                                            value={questionType}
                                            onChange={(e) => setQuestionType(e.target.value as typeof questionType)}
                                            className="w-full font-mono text-xs text-parchment-100 bg-canopy-950/60 border-2 border-canopy-700 px-2 py-1.5 focus:border-mango-400 outline-none"
                                        >
                                            {QUESTION_TYPES.map((t) => (
                                                <option key={t.value} value={t.value}>
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {generateStatus === "idle" || generateStatus === "error" ? (
                                    <button
                                        onClick={handleGenerate}
                                        className="font-press text-[10px] uppercase tracking-wider text-canopy-950 bg-mango-400
                                            border-4 border-canopy-950 px-4 py-3
                                            shadow-[4px_4px_0_theme(colors.canopy.950)]
                                            transition-all hover:bg-mango-300
                                            active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                                    >
                                        ✨ Generate Questions
                                    </button>
                                ) : generateStatus === "generating" ? (
                                    <div className="flex flex-col items-center gap-2 py-3 text-center">
                                        <span className="text-xl animate-bounce">✨</span>
                                        <p className="font-mono text-xs text-mango-300">
                                            Cooking up questions…
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 border-2 border-leaf-500/60 bg-leaf-500/10 px-3 py-2">
                                        <span className="text-lg">✅</span>
                                        <span className="font-mono text-xs text-leaf-300">
                                            {generatedCount} questions added
                                        </span>
                                    </div>
                                )}

                                {generateStatus === "error" && (
                                    <p className="font-mono text-[11px] text-bubblegum-400">
                                        Generation failed. Try again?
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Live joined counter */}
                    <div className="border-4 border-canopy-800 bg-canopy-900 p-5 shadow-[6px_6px_0_theme(colors.canopy.950)]">
                        <p className="font-mono text-[11px] uppercase tracking-wider text-leaf-400 mb-2">
                            Explorers Joined
                        </p>
                        <div className="flex items-end gap-2">
                            <span className="font-press text-4xl text-leaf-400">{joinedCount}</span>
                            {inGameCount > 0 && (
                                <span className="font-mono text-xs text-bubblegum-400 mb-1.5">
                                    {inGameCount} already in-game
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: roster panel — unchanged */}
                <div className="flex-1 flex flex-col border-4 border-canopy-800 bg-canopy-900 p-6 shadow-[6px_6px_0_theme(colors.canopy.950)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-press text-sm text-parchment-100">🌿 Who's Here</h2>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-parchment-400">
                            {joinedCount} joined
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 min-h-[300px]">
                        {joinedCount === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-10">
                                <span className="text-4xl animate-bounce">🦉</span>
                                <p className="font-mono text-sm text-parchment-400">
                                    Waiting for explorers to join the jungle...
                                </p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {session?.students.map((student, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between gap-3 border-2 border-canopy-700 bg-canopy-800/60 px-4 py-3 transition-colors hover:border-leaf-500"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-xl shrink-0">
                                                {CRITTERS[index % CRITTERS.length]}
                                            </span>
                                            <span className="font-mono text-sm text-parchment-100 truncate">
                                                {student.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span
                                                className={`h-2 w-2 rounded-full ${
                                                    student.isInGame
                                                        ? "bg-leaf-400 shadow-[0_0_6px_theme(colors.leaf.400)] animate-pulse"
                                                        : "bg-canopy-600"
                                                }`}
                                            />
                                            <span
                                                className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 border ${
                                                    student.isInGame
                                                        ? "border-leaf-500 text-leaf-400 bg-leaf-500/10"
                                                        : "border-canopy-600 text-parchment-400 bg-canopy-700/40"
                                                }`}
                                            >
                                                {student.isInGame ? "In Game" : "Waiting"}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            disabled={joinedCount === 0}
                            className="font-press text-xs uppercase tracking-wider text-canopy-950 bg-sun-400
                                border-4 border-canopy-950 px-6 py-3
                                shadow-[4px_4px_0_theme(colors.canopy.950)]
                                transition-all
                                hover:bg-sun-300
                                active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                                disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0_theme(colors.canopy.950)]"
                        >
                            ▶ Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}