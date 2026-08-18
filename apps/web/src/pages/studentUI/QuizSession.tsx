import { useEffect, useState } from 'react';
import MultipleChoices from '../../components/game/MultipleChoices';
import TrueOrFalse from '../../components/game/TrueOrFales';
import InputAnswer from '../../components/game/InputAnswer';
import { getQuestion, submitAnswer } from '../../api/gameApi';
import { socket } from '../../socket/socket';
import { SocketEvents } from '../../socket/socketEvents';

interface BaseQuestion {
    id: string;
    question: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
    options: string[];
}

interface TrueFalseQuestion extends BaseQuestion {
    options: ['True', 'False'];
}

interface ShortAnswerQuestion extends BaseQuestion {}

type Question =
    | MultipleChoiceQuestion
    | TrueFalseQuestion
    | ShortAnswerQuestion;

const isMultipleChoiceQuestion = (
    question: Question | null | undefined,
): question is MultipleChoiceQuestion => {
    return !!question && 'options' in question;
};

// Pixel-notch clip path, same shape used across PixelPanel elsewhere in Elemath.
const notch = 'polygon(0 8px,8px 8px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 8px) calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 8px),0 calc(100% - 8px))';


const TYPE_LABELS: Record<'multiple-choice' | 'true-false' | 'short-answer', string> = {
    'multiple-choice': 'Multiple Choice',
    'true-false': 'True or False',
    'short-answer': 'Short Answer',
};

export default function QuizSession() {
    const [typeOfQuestions, setTypeOfQuestions] = useState<'multiple-choice' | 'true-false' | 'short-answer'>('multiple-choice');

    const [question, setQuestion] = useState<Question | null>(null);
    // const [currentQuestionText, setCurrentQuestionText] = useState('');
    // const [questionId]

    useEffect(() => {
        socket.connect();

        socket.emit(SocketEvents.STUDENT_JOIN);
        socket.on(SocketEvents.SUBMIT_ANSWER, (data) => {
            console.log('Answer submitted:', data);
        });

        return () => {
            socket.off(SocketEvents.SUBMIT_ANSWER);
        }
    }, []);
    const handleRequestNewQuestion = async () => {
        try {
            const newQuestion = await getQuestion();

            if (!newQuestion?.question) {
                console.log('Quiz finished');
                setQuestion(null);
                return;
            }
            console.log('New question received:', newQuestion);
            setTypeOfQuestions(newQuestion.type);
            setQuestion(newQuestion.question);
        } catch (error) {
            console.error('Error fetching new question:', error);
        }
    };
    const [selected, setSelected] = useState<string | null>(null);

    const [isAnswerClicked, setIsAnswerClicked] = useState(false);
    const handleSubmitAnswer = async (answer: string) => {
        console.log('Submitting answer:', answer, 'for question:', question, 'Selected:', selected, 'IsAnswerClicked:', isAnswerClicked);
        if (isAnswerClicked || !question) return;

        setSelected(answer);
        setIsAnswerClicked(true);

        try {
            const res = await submitAnswer(answer, question.id);

            console.log('submit:', res);

            // setTypeOfQuestions(res.type);
            setQuestion(res.nextQuestion);
            // setCurrentQuestionText(res.nextQuestion?.question ?? '');
            setIsAnswerClicked(false);
            setSelected(null);
        } catch (error) {
            console.error(error);
        } finally {
            
        }
    };

    useEffect(  () =>{
         handleRequestNewQuestion();
    },[]);
    // if(!question){
    //     return(
    //         <div className="min-h-screen w-full bg-canopy-950 flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
    //         {/* ambient jungle texture */}
    //             <div
    //                 className="pointer-events-none absolute inset-0 opacity-[0.08]"
    //                 style={{
    //                     backgroundImage:
    //                         'repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(255,255,255,0.4) 22px, rgba(255,255,255,0.4) 24px)',
    //                 }}
    //             />
    //         </div>
    //     )
    // }
    return (
        <div className="min-h-screen w-full bg-canopy-950 flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
            {/* ambient jungle texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(255,255,255,0.4) 22px, rgba(255,255,255,0.4) 24px)',
                }}
            />

            <div className="relative w-full max-w-xl">
                {/* Question type badge */}
                <div className="mb-4 flex items-center justify-between">
                    <span
                        className="inline-flex items-center gap-2 bg-mango-400 text-canopy-950 text-[10px] sm:text-xs font-pixel px-3 py-2 border-2 border-canopy-950 shadow-[3px_3px_0_0_theme(--colors.canopy.950)]"
                        style={{ clipPath: notch }}
                    >
                        {TYPE_LABELS[typeOfQuestions]}
                    </span>

                    {/* quick switcher for dev/testing */}
                    <div className="flex gap-1">
                        {(['multiple-choice', 'true-false', 'short-answer'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => {
                                    setTypeOfQuestions(t);
                                    setSelected(null);
                                }}
                                className={`w-2.5 h-2.5 border border-canopy-950 ${
                                    typeOfQuestions === t ? 'bg-sun-300' : 'bg-leaf-700/40'
                                }`}
                                aria-label={`Switch to ${t}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Main pixel panel */}
                <div
                    className="bg-parchment-100 border-4 border-canopy-950 shadow-[6px_6px_0_0_theme(--colors-canopy.950)] p-5 sm:p-8"
                    style={{ clipPath: notch }}
                >
                    {typeOfQuestions === 'multiple-choice' && question && (
                        <MultipleChoices
                            question={question.question}
                            options={'options' in question ? question.options : []}
                            onSubmit={handleSubmitAnswer}
                        />
                    )}

                    {typeOfQuestions === 'true-false' && question && (
                        <TrueOrFalse
                            question={question.question}
                            onSubmit={handleSubmitAnswer}
                        />
                    )}

                    {typeOfQuestions === 'short-answer' && question && (
                        <InputAnswer
                            question={question.question}
                            onSubmit={handleSubmitAnswer}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}