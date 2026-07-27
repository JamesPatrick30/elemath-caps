import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import PixelPanel from './PixelPanel';
import type { QuizDraftConfig } from '../types/dashboard.types';

const difficulties: { value: QuizDraftConfig['difficulty']; label: string }[] = [
  { value: 'sprout', label: 'Sprout' },
  { value: 'sapling', label: 'Sapling' },
  { value: 'canopy', label: 'Canopy' },
];

export default function QuizGeneratorPanel() {
  const [config, setConfig] = useState<QuizDraftConfig>({
    topic: '',
    gradeLevel: 'Grade 4',
    questionCount: 10,
    difficulty: 'sapling',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!config.topic.trim()) return;
    setIsGenerating(true);
    // Wire this up to the AI quiz generation endpoint.
    setTimeout(() => setIsGenerating(false), 1600);
  };

  return (
    <PixelPanel label="AI Quiz Generator" accent="mango">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-mango-300" />
        <p className="text-xs text-parchment-400">
          Describe a topic and let the jungle guide draft questions for you.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-xs text-parchment-400">Topic</label>
          <input
            type="text"
            value={config.topic}
            onChange={(e) => setConfig({ ...config, topic: e.target.value })}
            placeholder="e.g. Multiplying fractions"
            className="w-full border-2 border-canopy-700 bg-canopy-950 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500 focus:border-mango-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-parchment-400">Grade level</label>
            <select
              value={config.gradeLevel}
              onChange={(e) => setConfig({ ...config, gradeLevel: e.target.value })}
              className="w-full border-2 border-canopy-700 bg-canopy-950 px-3 py-2 text-sm text-parchment-100 focus:border-mango-400 focus:outline-none"
            >
              {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(
                (g) => (
                  <option key={g}>{g}</option>
                ),
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-parchment-400">Questions</label>
            <input
              type="number"
              min={5}
              max={30}
              value={config.questionCount}
              onChange={(e) =>
                setConfig({ ...config, questionCount: Number(e.target.value) })
              }
              className="w-full border-2 border-canopy-700 bg-canopy-950 px-3 py-2 text-sm text-parchment-100 focus:border-mango-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-parchment-400">Difficulty</label>
          <div className="flex gap-2">
            {difficulties.map((d) => (
              <button
                key={d.value}
                onClick={() => setConfig({ ...config, difficulty: d.value })}
                className={`flex-1 border-2 px-3 py-1.5 text-xs transition-colors ${
                  config.difficulty === d.value
                    ? 'border-mango-400 bg-mango-400/15 text-mango-200'
                    : 'border-canopy-700 text-parchment-400 hover:border-canopy-500'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !config.topic.trim()}
          className="mt-1 flex items-center justify-center gap-2 border-2 border-mango-400 bg-mango-400 px-4 py-2.5 font-pixel text-[11px] text-canopy-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Generate Quiz
            </>
          )}
        </button>
      </div>
    </PixelPanel>
  );
}