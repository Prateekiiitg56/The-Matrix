import { Home, ListTodo, Flame, Code2, Lightbulb } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
    { id: 'search', icon: '🔍', label: 'SEARCH' },
    { id: 'my-questions', icon: '📋', label: 'MY PROBLEMS' },
    { id: 'streak', icon: '🔥', label: 'STREAK' },
    { id: 'editor', icon: '💻', label: 'CODE EDITOR' },
    { id: 'ai-hints', icon: '💡', label: 'AI ORACLE' },
];

export default function Sidebar({ activePanel, setActivePanel }) {
    return (
        <div className="w-[56px] h-[calc(100vh-57px)] sticky top-[57px] glass-panel flex flex-col items-center py-4 gap-2 flex-shrink-0 z-50" style={{ borderRadius: '0', borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
            {navItems.map((item) => {
                const isActive = activePanel === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActivePanel(item.id)}
                        className={cn(
                            "group relative w-10 h-10 flex items-center justify-center rounded-lg border border-transparent text-[18px] transition-all cursor-pointer",
                            isActive ? "glass-inner border-[rgba(0,255,65,0.3)] text-accent-primary shadow-[0_0_15px_rgba(0,255,65,0.15)]" : "text-accent-dim hover:bg-[rgba(0,255,65,0.05)] hover:border-[rgba(0,255,65,0.2)] hover:text-accent-primary hover:shadow-[0_0_15px_rgba(0,255,65,0.1)]"
                        )}
                    >
                        <span>{item.icon}</span>
                        <span className="absolute left-[52px] glass-inner px-2.5 py-1 text-[11px] whitespace-nowrap rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-accent-primary shadow-[0_0_10px_rgba(0,255,65,0.05)] font-code tracking-[1px]">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
