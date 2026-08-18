export default function StudentListLobbyTable({students}: {students: any[]}) {

    return (
        <div className="flex-1 flex flex-col min-h-0 border-4 border-canopy-800 bg-canopy-900 p-6 shadow-[6px_6px_0_theme(--colors-canopy-950)]">
                <div className="flex items-center justify-between border-b-2 border-leaf-700 pb-3 mb-4">
                    <h2 className="font-pixel text-sm text-sun-300 tracking-wide">
                        Students
                    </h2>
                    <span className="font-pixel text-[9px] text-leaf-400 bg-canopy-950 px-2 py-1 border border-leaf-700">
                        {students?.filter((s: any) => s.isInGame).length ?? 0}
                        /
                        {students?.length ?? 0} joined
                    </span>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                    {students?.length ? (
                        <ul className="space-y-2">
                            {students.map((student: any, i: number) => (
                                <li
                                    key={i}
                                    className="bg-canopy-800 border-2 border-canopy-700 p-3 flex justify-between items-center"
                                >
                                    <p className="font-sans text-parchment-100 text-sm">
                                        {student.name}
                                    </p>
                                    <span
                                        className={`font-pixel text-[9px] tracking-wide px-2 py-1 border ${
                                            student.isInGame
                                                ? "bg-leaf-500/20 text-leaf-400 border-leaf-500"
                                                : "bg-canopy-950 text-parchment-400 border-canopy-700"
                                        }`}
                                    >
                                        {student.isInGame ? "In Game" : "Not In Game"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                            <p className="font-pixel text-[11px] text-parchment-400 tracking-wide">
                                Waiting for students...
                            </p>
                        </div>
                    )}
                </div>
            </div>
    );
}