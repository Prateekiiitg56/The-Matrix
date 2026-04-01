import { X, Send, Sparkles, Code2, BookOpen, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function AIHintsPanel({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'INITIALIZING AI ORACLE... \n\nREADY. STUCK ON TWO SUM?' }
    ]);
    const [input, setInput] = useState('');

    if (!isOpen) return null;

    const quickActions = [
        { label: 'GIVE ME A HINT', icon: Lightbulb },
        { label: 'EXPLAIN HASHMAP IN PYTHON', icon: BookOpen },
        { label: 'REVIEW MY CODE', icon: Code2 },
        { label: 'SYNTAX: FOR LOOP', icon: BookOpen },
    ];

    return (
        <div className="absolute right-0 top-0 h-full w-[420px] bg-editor-dark border-l border-border-focus z-50 flex flex-col shadow-[0_0_20px_rgba(0,255,65,0.05)] transition-transform transform translate-x-0 font-code text-accent-primary">

            {/* Header */}
            <div className="h-16 border-b border-border-focus flex items-center justify-between px-6 bg-raised-dark shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-accent-secondary/20 p-2 rounded-sm border border-accent-secondary/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Sparkles size={16} className="text-accent-secondary" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-accent-primary leading-tight text-[11px] tracking-[3px] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent-primary shadow-glow-sm animate-pulse" />
                            AI ORACLE
                        </h2>
                    </div>
                </div>
                <button onClick={onClose} className="text-muted-text hover:text-accent-primary transition-colors bg-editor-dark p-2 border border-subtle-line hover:border-accent-primary rounded-sm cursor-pointer">
                    <X size={14} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide flex flex-col pt-6">
                {messages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === 'ai' ? 'items-start' : 'items-end'}`}>
                        <span className="text-[10px] text-muted-text tracking-[2px] mb-1">{m.role === 'ai' ? 'SYSTEM' : 'USER'}</span>
                        <div className={cn("max-w-[90%] rounded-[4px] px-[14px] py-[10px] text-[12px] leading-[1.6] font-code whitespace-pre-wrap",
                            m.role === 'ai'
                                ? 'bg-raised-dark border border-border-focus text-text-alt border-l-[2px] border-l-accent-dim'
                                : 'bg-accent-dim border border-accent-dim text-accent-primary'
                        )}>
                            {m.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 flex flex-col gap-3 border-t border-border-focus bg-surface shadow-[inset_0_20px_20px_-20px_rgba(0,0,0,0.5)]">
                <div className="grid grid-cols-2 gap-2 mb-1">
                    {quickActions.map((action, i) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={i}
                                className="flex items-center gap-2 text-[10px] bg-transparent hover:bg-raised-dark border border-subtle-line text-text-alt hover:text-accent-primary px-3 py-2.5 rounded-sm transition-all text-left tracking-[1px] cursor-pointer hover:border-accent-primary hover:shadow-[0_0_10px_rgba(0,255,65,0.05)]"
                                onClick={() => setInput(action.label)}
                            >
                                <Icon size={10} className="text-accent-primary shrink-0" />
                                <span className="truncate">{action.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Input */}
                <div className="relative">
                    <textarea
                        className="w-full bg-editor-dark border border-border-focus rounded-sm pl-4 pr-12 py-3 text-[12px] text-accent-primary placeholder-muted-text focus:outline-none focus:border-accent-primary resize-none h-14 font-code transition-all focus:shadow-[0_0_12px_rgba(0,255,65,0.05)]"
                        placeholder="ENTER QUERY..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-accent-primary hover:text-void-black bg-raised-dark hover:bg-accent-dim p-2 rounded-sm border border-accent-primary hover:border-transparent transition-all cursor-pointer">
                        <Send size={15} />
                    </button>
                </div>
            </div>

        </div>
    );
}
