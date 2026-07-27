import { Flame, BrainCircuit, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function TopBar({ activeLanguage, setLanguage, onExit }) {
    return (
        <div className="glass-panel h-14 font-code border-b flex items-center justify-between px-6 z-20 shrink-0" style={{ borderRadius: 0 }}>
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
                <div className="glass-inner flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                    <Flame size={14} className="text-muted-text" />
                    <span className="text-muted-text font-display font-bold text-[16px]">0</span>
                    <span className="text-[11px] text-muted-text tracking-[1px] font-ui">DAY STREAK</span>
                </div>

                {/* Today's Count */}
                <div className="flex items-center gap-2 border-l border-[rgba(0,255,65,0.15)] pl-4 opacity-60">
                    <span className="text-muted-text font-display font-bold text-[14px]">0</span>
                    <span className="text-[11px] text-muted-text tracking-[1px] font-ui">SOLVED TODAY</span>
                </div>

                {/* Language Switcher */}
                <div className="flex gap-1 glass-inner rounded-full ml-4 p-[3px]" style={{ borderRadius: 'var(--glass-radius-pill)' }}>
                    {['python', 'java', 'cpp'].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLanguage(l)}
                            className={cn(
                                "px-3 py-[4px] text-[11px] tracking-[1.5px] uppercase font-bold rounded-full transition-all focus:outline-none",
                                activeLanguage === l
                                    ? "bg-accent-primary/20 text-accent-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                                    : "text-muted-text hover:text-text-alt hover:bg-white/5"
                            )}
                        >
                            {l === 'cpp' ? 'C++' : l}
                        </button>
                    ))}
                </div>

                {/* Exit Button */}
                {onExit && (
                    <button
                        onClick={onExit}
                        className="glass-btn glass-btn--red ml-2 px-4 py-1.5 tracking-widest text-xs font-display"
                    >
                        EXIT
                    </button>
                )}

            </div>
        </div>
    );
}
