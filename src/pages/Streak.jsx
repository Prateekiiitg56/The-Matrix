import { cn } from '../lib/utils';
import { Flame, Star, Trophy } from 'lucide-react';

export default function Streak() {
    const weeks = 52;
    const days = 7;
    const generateIntensity = () => Math.floor(Math.random() * 5); // 0 to 4

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-57px)] overflow-y-auto bg-transparent text-accent-primary p-6 px-10 items-center scrollbar-hide">

            <div className="w-full max-w-5xl flex flex-col pt-4">

                {/* Section Header */}
                <div className="mb-6 pb-3 border-b border-subtle-line">
                    <div className="font-display text-[14px] font-bold tracking-[4px] text-accent-primary text-glow-alt">
            // ACTIVITY MATRIX
                    </div>
                    <div className="text-[12px] text-muted-text mt-1 tracking-[2px] font-code">
                        YOUR CONTRIBUTION TO THE SYSTEM
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                    <div className="bg-editor-dark border border-subtle-line rounded p-3.5 text-center relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-dim to-transparent" />
                        <div className="font-display text-[28px] font-bold text-accent-primary text-glow-alt">7</div>
                        <div className="text-[10px] text-muted-text tracking-[2px] mt-1 font-code">CURRENT STREAK</div>
                    </div>
                    <div className="bg-editor-dark border border-subtle-line rounded p-3.5 text-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-dim to-transparent" />
                        <div className="font-display text-[28px] font-bold text-accent-primary text-glow-alt">23</div>
                        <div className="text-[10px] text-muted-text tracking-[2px] mt-1 font-code">LONGEST STREAK</div>
                    </div>
                    <div className="bg-editor-dark border border-subtle-line rounded p-3.5 text-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-dim to-transparent" />
                        <div className="font-display text-[28px] font-bold text-accent-primary text-glow-alt">124</div>
                        <div className="text-[10px] text-muted-text tracking-[2px] mt-1 font-code">TOTAL SOLVED</div>
                    </div>
                    <div className="bg-editor-dark border border-subtle-line rounded p-3.5 text-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-dim to-transparent" />
                        <div className="font-display text-[28px] font-bold text-accent-primary text-glow-alt">2026</div>
                        <div className="text-[10px] text-muted-text tracking-[2px] mt-1 font-code">YEAR</div>
                    </div>
                </div>

                {/* Heatmap Section */}
                <div className="bg-editor-dark border border-border-focus rounded p-5 w-full shadow-[0_0_20px_rgba(0,255,65,0.05)]">
                    <div className="mb-4 text-[11px] tracking-[3px] text-muted-text font-code">
             // 52-WEEK CONTRIBUTION GRID
                    </div>

                    <div className="flex gap-2 w-full mt-2 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex flex-col gap-[2px] pt-[2px] mt-[14px]">
                            {['MON', 'T', 'WED', 'T', 'FRI', 'S', 'S'].map((day, i) => (
                                <div key={i} className={cn("text-[10px] font-code h-[12px] leading-[12px] tracking-[1px]", day === 'T' || day === 'S' ? "opacity-0" : "text-muted-text")}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 flex gap-[2px]">
                            {Array.from({ length: weeks }).map((_, col) => (
                                <div key={col} className="flex flex-col gap-[2px] relative group">
                                    {col > 0 && col % 4 === 0 && (
                                        <div className="absolute -top-[16px] text-[10px] text-muted-text tracking-[1px] font-code w-[52px] text-center">MM.YY</div>
                                    )}
                                    {col === 0 && (
                                        <div className="absolute -top-[16px] text-[10px] text-muted-text tracking-[1px] font-code w-[52px] text-center">JAN</div>
                                    )}
                                    <div className="h-[14px]" /> {/* Spacing for month label */}
                                    {Array.from({ length: days }).map((_, row) => {
                                        const intensity = generateIntensity();
                                        return (
                                            <div
                                                key={row}
                                                className="heatmap-cell"
                                                data-level={intensity}
                                            />
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-1.5 justify-end mt-3">
                        <span className="text-[10px] text-muted-text font-code tracking-[1px] mr-1">Less</span>
                        {[0, 1, 2, 3, 4].map(level => (
                            <div key={level} className="heatmap-cell h-3 w-3" data-level={level} />
                        ))}
                        <span className="text-[10px] text-muted-text font-code tracking-[1px] ml-1">More</span>
                    </div>

                </div>

            </div>
        </div>
    );
}
