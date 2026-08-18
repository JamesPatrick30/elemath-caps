import { useState } from 'react';
export default function InputAnswer({ question, onSubmit }: { question?: string; onSubmit: (answer: string) => void }) {

    const [answer, setAnswer] = useState('');

    const handleSubmit = () => {
        if (answer.trim()) {
            onSubmit(answer.trim());
            setAnswer('');
        }
    };

    return (
        <div>
            <h1 className="font-pixel text-base sm:text-lg leading-relaxed text-canopy-950 mb-8 text-center">
                {question}
            </h1>
            <div className="flex gap-4 justify-center">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="font-pixel text-sm py-6 border-3 border-canopy-950 bg-leaf-400 text-canopy-950 placeholder:text-canopy-950/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your answer..."
                />
                <button
                    onClick={handleSubmit}
                    className="font-pixel text-sm py-6 border-3 border-canopy-950 bg-sun-300 text-canopy-950 hover:bg-sun-400 active:bg-sun-500"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}