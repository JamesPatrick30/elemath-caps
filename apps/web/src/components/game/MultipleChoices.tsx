import { useState } from "react";

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const notch = 'polygon(0 8px,8px 8px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 8px) calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 8px),0 calc(100% - 8px))';

export default function multipleChoices({ question, options, onSubmit }: { question: string; options: string[]; onSubmit: (answer: string) => void }) {

    const [selected, setSelected] = useState<string | null>(null);
    // const [isAnswerClicked, setIsAnswerClicked] = useState(false);

    const handleSubmitAnswer = (answer: string) => {
        // if (isAnswerClicked) return; // Prevent multiple submissions
        setSelected(answer);
        // setIsAnswerClicked(true);
        onSubmit(answer);
    }
    return (
        <div>
            <h1 className="font-pixel text-base sm:text-lg leading-relaxed text-canopy-950 mb-6">
                {question}
            </h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((option: string, index: number) => {
                    const isSelected = selected === option;
                    return (
                        <li key={index}>
                            <button
                                onClick={() => handleSubmitAnswer(option)}
                                className={`w-full flex items-center gap-3 text-left font-sans font-semibold text-sm sm:text-base
                                    border-3 border-canopy-950 px-4 py-3 transition-all
                                    ${isSelected
                                        ? 'bg-sun-300 text-canopy-950 translate-x-0.5 translate-y-0.5 shadow-none'
                                        : 'bg-leaf-400 text-canopy-950 shadow-[4px_4px_0_0_theme(--colors-canopy-950)] hover:bg-leaf-300 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                                    }`}
                                style={{ clipPath: notch }}
                            >
                                <span className="shrink-0 w-6 h-6 flex items-center justify-center font-pixel text-[10px] bg-canopy-950 text-mango-300">
                                    {OPTION_LETTERS[index] ?? index + 1}
                                </span>
                                <span className="truncate">{option}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}