import { useState, useEffect } from 'react';
import { fetchProgress, updateProgress, LEVELS } from '../../lib/progressStorage';
import { curriculum } from '../../data/curriculum';
import ModuleMap from './ModuleMap';
import TheoryPanel from './TheoryPanel';
import TaskPanel from './TaskPanel';
import QuizPanel from './QuizPanel';

function getLevelInfo(xp) {
    const sorted = [...LEVELS].sort((a, b) => b.xpNeeded - a.xpNeeded);
    const current = sorted.find(l => xp >= l.xpNeeded) || LEVELS[0];
    const nextIdx = LEVELS.findIndex(l => l.level === current.level) + 1;
    const next = LEVELS[nextIdx] || null;
    const xpInLevel = xp - current.xpNeeded;
    const xpNeeded = next ? next.xpNeeded - current.xpNeeded : 1;
    const progress = next ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100;
    return { current, next, progress };
}

export default function ConstructApp({ onExit }) {
    const [progress, setProgress] = useState(null);
    const [view, setView] = useState('module-map');
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [xpPopup, setXpPopup] = useState(null);

    const activeLesson = (() => {
        for (const mod of curriculum) {
            const lesson = mod.lessons.find(l => l.id === activeLessonId);
            if (lesson) return lesson;
        }
        return null;
    })();

    useEffect(() => {
        document.body.classList.add('theme-blue');
        fetchProgress('guest_user').then(setProgress);
        return () => document.body.classList.remove('theme-blue');
    }, []);

    const handleCompleteLesson = async () => {
        if (!progress || !activeLesson) return;
        let newCompleted = [...progress.completedLessons];
        let newXp = progress.xp;
        if (!newCompleted.includes(activeLesson.id)) {
            newCompleted.push(activeLesson.id);
            newXp += activeLesson.xp;
            setXpPopup(`+${activeLesson.xp} XP`);
            setTimeout(() => setXpPopup(null), 2500);
        }
        const newProgress = await updateProgress('guest_user', { completedLessons: newCompleted, xp: newXp });
        setProgress(newProgress || { ...progress, completedLessons: newCompleted, xp: newXp });
        setView('module-map');
        setActiveLessonId(null);
    };

    const handleStartLesson = (lessonId) => {
        setActiveLessonId(lessonId);
        setView('theory');
    };

    if (!progress) {
        return (
            <div className="flex items-center justify-center h-screen bg-void-black">
                <div className="text-center">
                    <div className="text-4xl font-display text-accent-primary tracking-widest mb-4" style={{ textShadow: '0 0 30px #00aaff' }}>
                        INITIALIZING
                    </div>
                    <div className="text-muted-text text-sm tracking-widest animate-pulse">LOADING CONSTRUCT...▓▓▓▓▒▒░░</div>
                </div>
            </div>
        );
    }

    const { current: rank, next: nextRank, progress: xpProgress } = getLevelInfo(progress.xp);
    const totalLessons = curriculum.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedCount = progress.completedLessons?.length || 0;

    return (
        <div className="flex flex-col h-screen w-full bg-void-black text-body-text font-code relative overflow-hidden">

            {/* === TOP HEADER === */}
            <div className="relative z-20 border-b border-subtle-line bg-surface/80 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4"
                style={{ boxShadow: '0 0 30px rgba(0,170,255,0.08)' }}>

                {/* Left: Logo + Current Lesson Breadcrumb */}
                <div className="flex items-center gap-4 min-w-0">
                    <div>
                        <div className="font-display font-black tracking-[0.3em] text-accent-primary text-lg leading-none"
                            style={{ textShadow: '0 0 20px #00aaff, 0 0 40px #00aaff44' }}>
                            THE CONSTRUCT
                        </div>
                        <div className="text-xs text-muted-text tracking-widest mt-0.5">
                            {view === 'module-map' ? '// PYTHON MASTERY OS' :
                                view === 'theory' ? `> THEORY: ${activeLesson?.title}` :
                                    view === 'task' ? `> TASK: ${activeLesson?.title}` :
                                        `> QUIZ: ${activeLesson?.title}`}
                        </div>
                    </div>
                </div>

                {/* Center: XP Bar */}
                <div className="flex-1 max-w-xs hidden md:block">
                    <div className="flex justify-between text-xs text-muted-text mb-1 tracking-widest">
                        <span className="text-accent-primary font-bold">{rank.title}</span>
                        <span>{progress.xp} XP {nextRank ? `/ ${nextRank.xpNeeded}` : '(MAX)'}</span>
                    </div>
                    <div className="h-1.5 bg-raised-dark rounded-full overflow-hidden border border-subtle-line">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: `${xpProgress}%`,
                                background: 'linear-gradient(90deg, #0055aa, #00aaff, #66ddff)',
                                boxShadow: '0 0 10px #00aaff88'
                            }}
                        />
                    </div>
                    <div className="text-right text-xs text-muted-text mt-1">{completedCount}/{totalLessons} lessons</div>
                </div>

                {/* Right: Stats + Exit */}
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-muted-text tracking-widest">RANK</div>
                        <div className="font-display font-bold text-white tracking-widest">{rank.title}</div>
                    </div>
                    <button
                        onClick={onExit}
                        className="border border-fail-verd/50 text-fail-verd/70 hover:border-fail-verd hover:text-fail-verd px-4 py-1.5 tracking-widest text-xs transition-all font-display"
                    >
                        EXIT
                    </button>
                </div>
            </div>

            {/* === XP POPUP === */}
            {xpPopup && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                    <div
                        className="font-display text-3xl font-black text-accent-primary animate-bounce"
                        style={{ textShadow: '0 0 30px #00aaff, 0 0 60px #00aaff88' }}
                    >
                        {xpPopup}
                    </div>
                </div>
            )}

            {/* === MAIN AREA === */}
            <div className="flex-1 overflow-hidden relative">
                {/* Subtle grid background */}
                <div className="absolute inset-0 pointer-events-none opacity-5"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,170,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,170,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="relative h-full border-t border-subtle-line">
                    {view === 'module-map' && (
                        <ModuleMap
                            curriculum={curriculum}
                            progress={progress}
                            onSelectLesson={handleStartLesson}
                        />
                    )}
                    {view === 'theory' && activeLesson && (
                        <TheoryPanel
                            lesson={activeLesson}
                            onProceed={() => setView('task')}
                        />
                    )}
                    {view === 'task' && activeLesson && (
                        <TaskPanel
                            lesson={activeLesson}
                            onProceed={() => setView('quiz')}
                        />
                    )}
                    {view === 'quiz' && activeLesson && (
                        <QuizPanel
                            lesson={activeLesson}
                            onComplete={handleCompleteLesson}
                        />
                    )}
                </div>
            </div>

            {/* === Bottom Nav (when inside a lesson) === */}
            {view !== 'module-map' && (
                <div className="relative z-20 border-t border-subtle-line bg-surface/80 backdrop-blur-md px-6 py-2 flex items-center justify-between">
                    <button
                        onClick={() => {
                            if (view === 'quiz') setView('task');
                            else if (view === 'task') setView('theory');
                            else { setView('module-map'); setActiveLessonId(null); }
                        }}
                        className="text-muted-text hover:text-white text-xs tracking-widest transition-colors"
                    >
                        ← BACK
                    </button>
                    <div className="flex gap-3">
                        {['theory', 'task', 'quiz'].map((step) => (
                            <div
                                key={step}
                                className="h-1 w-12 rounded-full transition-all duration-300"
                                style={{
                                    background: view === step ? '#00aaff' : '#0a2542',
                                    boxShadow: view === step ? '0 0 8px #00aaff' : 'none'
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-muted-text tracking-widest uppercase">{view}</span>
                </div>
            )}
        </div>
    );
}
