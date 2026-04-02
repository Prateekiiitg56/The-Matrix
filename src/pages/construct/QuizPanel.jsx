import { useState } from 'react';

export default function QuizPanel({ lesson, onComplete }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const quiz = lesson.quiz[0]; // Currently supporting one question per lesson

    const handleSelect = (idx) => {
        if (showResult) return;
        setSelectedOption(idx);
        setShowResult(true);
    };

    const isCorrect = selectedOption === quiz.answer;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-void-black text-body-text p-10">

            <div className="max-w-2xl w-full flex flex-col gap-8">
                {/* Question Head */}
                <div className="text-center">
                    <h3 className="font-display text-accent-secondary tracking-widest text-sm mb-4 border-b border-subtle-line pb-4 inline-block">SECURITY OVERRIDE QUESTION</h3>
                    <h2 className="text-3xl font-code leading-relaxed text-white">{quiz.question}</h2>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-4">
                    {quiz.options.map((opt, idx) => {

                        let btnClass = "border border-subtle-line bg-surface hover:border-accent-primary hover:bg-accent-primary/10 text-white p-4 font-ui text-lg transition-all rounded shadow-md text-left";

                        if (showResult) {
                            if (idx === quiz.answer) {
                                // Correct answer always glows green
                                btnClass = "border border-success-verd bg-success-verd/20 text-success-verd p-4 font-ui text-lg rounded shadow-[0_0_20px_rgba(0,255,65,0.3)] text-left";
                            } else if (idx === selectedOption) {
                                // Selected wrong answer glows red
                                btnClass = "border border-fail-verd bg-fail-verd/20 text-fail-verd p-4 font-ui text-lg rounded shadow-[0_0_20px_rgba(255,49,49,0.3)] text-left shake-animation";
                            } else {
                                btnClass = "border border-subtle-line bg-surface/50 text-muted-text p-4 font-ui text-lg rounded text-left opacity-50";
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                className={btnClass}
                            >
                                <span className="font-display text-sm tracking-widest opacity-50 mr-4">[{idx}]</span>
                                {opt}
                            </button>
                        )
                    })}
                </div>

                {/* Post-Answer Result & Explanation */}
                {showResult && (
                    <div className="mt-8 text-center animate-fadeIn">
                        {isCorrect ? (
                            <div className="mb-6 font-display text-2xl tracking-widest text-success-verd text-glow-alt">
                                VERIFIED // ACCESS GRANTED
                            </div>
                        ) : (
                            <div className="mb-6 font-display text-xl tracking-widest text-fail-verd">
                                MISTAKE LOGGED // RE-EVALUATING // VERIFIED
                            </div>
                        )}

                        <p className="text-muted-text mb-8 max-w-lg mx-auto font-ui">
                            {quiz.explanation}
                        </p>

                        <button
                            onClick={onComplete}
                            className="bg-accent-primary text-black font-display font-bold py-4 px-12 tracking-widest hover:bg-white hover:shadow-[0_0_20px_var(--theme-accent-primary)] transition-all"
                        >
                            {isCorrect ? 'DOWNLOAD NEW SKILLS (COMPLETE LESSON) ▶' : 'CONTINUE ANYWAY ▶'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
