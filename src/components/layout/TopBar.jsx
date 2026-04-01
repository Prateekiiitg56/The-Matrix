import { Flame, BrainCircuit, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function TopBar({ activeLanguage, setLanguage }) {
    return (
        <div className="h-14 font-code border-b border-subtle-line bg-editor-dark flex items-center justify-between px-6 z-20 shrink-0">
            {/* LATECODE MATRIX BRANDING */}
            <div className="flex flex-col select-none">
                <div className="font-display font-extrabold text-[16px] tracking-[6px] text-accent-primary text-glow-alt lead-none mb-[2px]">
                    THE MATRIX
                </div>
                <div className="font-code font-semibold tracking-[4px] text-[10px] text-accent-primary lead-none">
                    DSA TRACKER v2.0
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Streak Pill */}
                <div className="flex items-center gap-2 bg-editor-dark px-3.5 py-1.5 rounded border border-subtle-line cursor-pointer opacity-50">
                    <Flame size={14} className="text-muted-text" />
                    <span className="text-muted-text font-display font-bold text-[16px]">0</span>
                    <span className="text-[11px] text-muted-text tracking-[1px] font-ui">DAY STREAK</span>
                </div>

                {/* Today's Count */}
                <div className="flex items-center gap-2 border-l border-subtle-line pl-4 opacity-50">
                    <span className="text-muted-text font-display font-bold text-[14px]">0</span>
                    <span className="text-[11px] text-muted-text tracking-[1px] font-ui">SOLVED TODAY</span>
                </div>

                {/* Language Switcher */}
                <div className="flex gap-1 border border-border-focus rounded-[4px] ml-4 bg-[#050B05] p-[2px]">
                    {['python', 'java', 'cpp'].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLanguage(l)}
                            className={cn(
                                "px-3 py-[4px] text-[11px] tracking-[1.5px] uppercase font-bold rounded-sm transition-all focus:outline-none",
                                activeLanguage === l
                                    ? "bg-accent-primary/20 text-accent-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                                    : "text-muted-text hover:text-text-alt hover:bg-white/5"
                            )}
                        >
                            {l === 'cpp' ? 'C++' : l}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
