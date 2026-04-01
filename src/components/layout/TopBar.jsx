import { Flame, CheckCircle2 } from 'lucide-react';

export default function TopBar({ activeLanguage, setLanguage }) {
    return (
        <header className="h-[57px] border-b border-border-focus bg-[rgba(0,8,0,0.95)] backdrop-blur shadow-glow-sm flex items-center justify-between px-6 z-[100] shrink-0 sticky top-0">
            <div className="flex flex-col select-none">
                <h1 className="text-accent-primary font-display font-black text-[18px] tracking-[4px] text-glow">
                    THE MATRIX
                </h1>
                <span className="text-accent-dim font-display text-[11px] tracking-[8px] mt-0.5">
                    DSA TRACKER v2.0
                </span>
            </div>

            <div className="flex items-center gap-4">
                {/* Streak Pill */}
                <div className="flex items-center gap-2 bg-editor-dark px-3.5 py-1.5 rounded border border-border-focus glow-pulse cursor-pointer">
                    <Flame size={14} className="text-med-diff" />
                    <span className="text-accent-primary font-display font-bold text-[16px] text-glow">7</span>
                    <span className="text-[11px] text-muted-text tracking-[1px] font-ui">DAY STREAK</span>
                </div>

                {/* Today's Count */}
                <div className="flex items-center gap-2 border-l border-subtle-line pl-4">
                    <span className="text-accent-secondary font-display font-bold text-[14px]">3</span>
                    <span className="text-[11px] text-muted-text tracking-[1px] font-ui">SOLVED TODAY</span>
                </div>

                <div className="h-6 w-px bg-subtle-line mx-2" />

                <div className="relative">
                    <select
                        value={activeLanguage}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="appearance-none bg-raised-dark border border-subtle-line text-accent-primary font-code text-xs rounded px-3 py-1 focus:outline-none focus:border-accent-primary focus:shadow-glow w-24 cursor-pointer"
                    >
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
            </div>
        </header>
    );
}
