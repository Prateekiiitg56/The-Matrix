import { cn } from '../lib/utils';
import { ChartNoAxesColumn, Clock } from 'lucide-react';

// Using an empty array to represent no backend data loaded yet
const mockSolved = [];

export default function MyQuestions() {
    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-57px)] overflow-y-auto bg-transparent text-accent-primary p-6 px-10 items-center scrollbar-hide">

            <div className="w-full max-w-5xl flex flex-col pt-4">
                {/* Section Header */}
                <div className="mb-6 pb-3 border-b border-subtle-line">
                    <div className="font-display text-[14px] font-bold tracking-[4px] text-accent-primary text-glow-alt">
            // MY SOLVED PROBLEMS
                    </div>
                    <div className="text-[12px] text-muted-text mt-1 tracking-[2px] font-code">
                        YOUR PATH THROUGH THE MATRIX
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-editor-dark border border-subtle-line rounded p-3.5 text-center relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-dim to-transparent" />
                        <div className="font-display text-[28px] font-bold text-accent-primary text-glow-alt opacity-50">0</div>
                        <div className="text-[10px] text-muted-text tracking-[2px] mt-1 font-code">TOTAL SOLVED</div>
                    </div>
                    <div className="bg-editor-dark border border-subtle-line rounded p-3.5 text-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-dim to-transparent" />
                        <div className="font-display text-[28px] font-bold text-easy-diff [text-shadow:0_0_15px_rgba(0,255,65,0.4)] opacity-50">0</div>
                        <div className="text-[10px] text-muted-text tracking-[2px] mt-1 font-code">EASY</div>
                    </div>
                    <div className="bg-editor-dark border border-subtle-line rounded p-3.5 text-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-dim to-transparent" />
                        <div className="font-display text-[28px] font-bold text-med-diff [text-shadow:0_0_15px_rgba(255,225,53,0.4)] opacity-50">0</div>
                        <div className="text-[10px] text-muted-text tracking-[2px] mt-1 font-code">MEDIUM</div>
                    </div>
                    <div className="bg-editor-dark border border-subtle-line rounded p-3.5 text-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-dim to-transparent" />
                        <div className="font-display text-[28px] font-bold text-hard-diff [text-shadow:0_0_15px_rgba(255,49,49,0.4)] opacity-50">0</div>
                        <div className="text-[10px] text-muted-text tracking-[2px] mt-1 font-code">HARD</div>
                    </div>
                </div>

                {/* Solved List */}
                <div className="flex flex-col gap-2 w-full">
                    {mockSolved.length > 0 ? mockSolved.map(p => (
                        <div key={p.id} className="bg-editor-dark border border-subtle-line rounded p-3.5 flex items-center gap-3 relative overflow-hidden transition-all hover:border-border-focus hover:shadow-[0_0_15px_rgba(0,255,65,0.05)] cursor-pointer">
                            <div className="w-7 h-7 rounded-[3px] border border-accent-primary flex items-center justify-center text-accent-primary text-[14px] shadow-[0_0_8px_rgba(0,255,65,0.15)] shrink-0">✓</div>
                            <div className="flex-1 ml-2">
                                <div className="text-[13px] text-text-alt mb-1 font-code tracking-[0.5px]">{p.title}</div>
                                <div className="flex gap-2.5 items-center">
                                    <span className="text-[11px] text-muted-text font-code flex items-center gap-1"><Clock size={12} /> {p.date}</span>
                                    <span className="text-[10px] px-1.5 border border-border-focus text-muted-text rounded-sm font-code">{p.lang}</span>
                                    <span className="text-[10px] px-2 py-[1px] border border-subtle-line bg-raised-dark text-muted-text rounded-sm font-code flex items-center gap-1">{p.topic}</span>
                                </div>
                            </div>
                            <div className="font-mono text-[11px] text-accent-primary bg-raised-dark border border-border-focus px-2 py-0.5 rounded-sm tracking-[1px] flex gap-1 items-center">
                                <ChartNoAxesColumn size={12} /> {p.runtime}
                            </div>
                            <div className={cn(
                                "px-2 py-[2px] rounded-sm text-[10px] font-bold font-code tracking-[1px] ml-2 border",
                                p.difficulty === 'Easy' && "text-easy-diff border-easy-diff/50",
                                p.difficulty === 'Medium' && "text-med-diff border-med-diff/50",
                                p.difficulty === 'Hard' && "text-hard-diff border-hard-diff/50"
                            )}>
                                {p.difficulty}
                            </div>
                        </div>
                    )) : (
                        <div className="my-10 flex flex-col items-center justify-center text-center opacity-50">
                            <span className="text-[18px] text-accent-dim tracking-[2px] font-code mb-2">
                                // NO SOLVED PROBLEMS YET.
                            </span>
                            <span className="text-[12px] text-muted-text tracking-[4px] uppercase font-ui">
                                ENTER THE MATRIX.
                            </span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
