export default function ModuleMap({ curriculum, progress, onSelectLesson }) {
    return (
        <div className="w-full h-full overflow-y-auto p-10 flex flex-col items-center">
            <div className="max-w-3xl w-full">
                <h2 className="text-3xl font-display text-accent-primary mb-8 tracking-widest text-glow">MODULE PATHWAY</h2>

                {/* Node Tree */}
                <div className="relative border-l-2 border-subtle-line ml-6">
                    {curriculum.map((module, mIdx) => (
                        <div key={module.id} className="mb-12 relative pl-8">

                            {/* Module Node Indicator */}
                            <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-surface border-2 border-accent-secondary shadow-[0_0_10px_var(--theme-accent-secondary)]"></div>

                            <h3 className="text-2xl font-bold tracking-widest text-white mb-2">{module.title}</h3>
                            <p className="text-muted-text mb-6">{module.description}</p>

                            <div className="flex flex-col gap-4">
                                {module.lessons.map((lesson, lIdx) => {
                                    const isCompleted = progress?.completedLessons?.includes(lesson.id) || false;

                                    let baseClasses = "group cursor-pointer p-4 border rounded-md transition-all duration-300 flex justify-between items-center";
                                    let stateClasses = isCompleted
                                        ? "border-accent-dim bg-accent-dark/20 opacity-60"
                                        : "border-subtle-line bg-surface hover:border-accent-primary hover:bg-accent-primary/5 hover:shadow-[0_0_15px_rgba(0,170,255,0.15)]";

                                    return (
                                        <div
                                            key={lesson.id}
                                            onClick={() => onSelectLesson(lesson.id)}
                                            className={baseClasses + " " + stateClasses}
                                        >
                                            <div>
                                                <div className="text-xs text-muted-text mb-1 tracking-widest">LESSON {mIdx + 1}.{lIdx + 1}</div>
                                                <div className={isCompleted ? "font-bold text-accent-dim" : "font-bold text-accent-primary group-hover:text-white"}>
                                                    {lesson.title}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-accent-secondary font-bold text-sm">+{lesson.xp} XP</span>
                                                {isCompleted && <span className="text-accent-primary font-display">✓</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
