import { useState } from "react";

const notch = 'polygon(0 8px,8px 8px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 8px) calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 8px),0 calc(100% - 8px))';
export default function TrueOrFalse({ question, onSubmit }: { question: string; onSubmit: (answer: string) => void }) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSubmitAnswer = (answer: string) => {
        setSelected(answer);
        onSubmit(answer);
    }

    return (
        <div>
            <h1 className="font-pixel text-base sm:text-lg leading-relaxed text-canopy-950 mb-8 text-center">
                {question}
            </h1>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => handleSubmitAnswer('true')}
                    className={`flex-1 max-w-40 font-pixel text-sm py-6 border-3 border-canopy-950 transition-all
                        ${selected === 'true'
                            ? 'bg-sun-300 translate-x-0.5 translate-y-0.5 shadow-none'
                            : 'bg-leaf-400 shadow-[4px_4px_0_0_theme(--colors-canopy-950)] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                        } text-canopy-950`}
                    style={{ clipPath: notch }}
                >
                    TRUE
                </button>
                <button
                    onClick={() => handleSubmitAnswer('false')}
                    className={`flex-1 max-w-40 font-pixel text-sm py-6 border-3 border-canopy-950 transition-all
                        ${selected === 'false'
                            ? 'bg-sun-300 translate-x-0.5 translate-y-0.5 shadow-none'
                            : 'bg-mango-400 shadow-[4px_4px_0_0_theme(--colors-canopy-950)] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                        } text-canopy-950`}
                    style={{ clipPath: notch }}
                >
                    FALSE
                </button>
            </div>
        </div>
    )
}