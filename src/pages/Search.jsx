import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

const mockProblemsFallback = [
    { problemId: 1, title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'], status: 'unsolved' },
    { problemId: 2, title: 'Valid Parentheses', difficulty: 'Easy', tags: ['String', 'Stack'], status: 'unsolved' },
    { problemId: 3, title: 'Merge Intervals', difficulty: 'Medium', tags: ['Array', 'Sorting'], status: 'unsolved' },
];

export default function Search({ setActivePanel, setActiveProblemId }) {
    const [query, setQuery] = useState('');
    const [activeDiff, setActiveDiff] = useState('all');
    const [activeTopics, setActiveTopics] = useState([]);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/problems`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setProblems(data);
                } else {
                    setProblems(mockProblemsFallback);
                }
            })
            .catch(err => {
                console.warn('Backend not strictly reachable, using fallback:', err);
                setProblems(mockProblemsFallback);
            })
            .finally(() => setLoading(false));
    }, []);

    const toggleTopic = (topic) => {
        setActiveTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
    };

    const handleSolveClick = (id) => {
        setActiveProblemId(id);
        setActivePanel('editor');
    }

    // Frontend filtering logic
    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase());
        const matchesDiff = activeDiff === 'all' || p.difficulty === activeDiff;
        const matchesTopic = activeTopics.length === 0 || activeTopics.some(t => p.tags.includes(t));
        return matchesSearch && matchesDiff && matchesTopic;
    });

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-57px)] overflow-y-auto bg-transparent text-accent-primary p-6 px-10 items-center scrollbar-hide">

            <div className="w-full max-w-5xl flex flex-col pt-4">

                {/* Section Header */}
                <div className="mb-6 pb-3 border-b border-[rgba(0,255,65,0.15)] flex justify-between items-end">
                    <div>
                        <div className="font-display text-[14px] font-bold tracking-[4px] text-accent-primary text-glow-alt">
              // PROBLEM SEARCH
                        </div>
                        <div className="text-[12px] text-muted-text mt-1 tracking-[2px] font-code" style={{ color: 'var(--glass-text)' }}>
                            QUERY THE MATRIX DATABASE
                        </div>
                    </div>
                    {loading && <div className="text-[10px] tracking-[2px] font-code text-accent-dim animate-pulse">SYNCING WITH CORE...</div>}
                </div>

                {/* Search Input */}
                <div className="flex gap-2 mb-4 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text font-code text-base pointer-events-none">▶</span>
                    <input
                        type="text"
                        className="flex-1 glass-card rounded-xl text-[14px] font-code text-accent-primary pl-10 pr-4 py-3 outline-none transition-all focus:border-accent-primary focus:shadow-[0_0_20px_rgba(0,255,65,0.15)] placeholder-muted-text"
                        placeholder="SEARCH PROBLEMS... (e.g. 'two sum', 'binary tree')"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Filter Row */}
                <div className="flex gap-2 flex-wrap mb-6">
                    <button onClick={() => setActiveDiff('all')} className={cn("glass-btn text-[11px] font-code", activeDiff === 'all' ? "border-accent-primary text-accent-primary bg-[rgba(0,255,65,0.1)] shadow-[0_0_12px_rgba(0,255,65,0.15)]" : "text-muted-text")}>ALL</button>
                    <button onClick={() => setActiveDiff('Easy')} className={cn("glass-btn text-[11px] font-code", activeDiff === 'Easy' ? "border-easy-diff text-easy-diff bg-[rgba(0,255,65,0.1)] shadow-[0_0_12px_rgba(0,255,65,0.15)]" : "text-muted-text")}>EASY</button>
                    <button onClick={() => setActiveDiff('Medium')} className={cn("glass-btn text-[11px] font-code", activeDiff === 'Medium' ? "border-med-diff text-med-diff bg-[rgba(255,225,53,0.08)] shadow-[0_0_12px_rgba(255,225,53,0.1)]" : "text-muted-text")}>MEDIUM</button>
                    <button onClick={() => setActiveDiff('Hard')} className={cn("glass-btn text-[11px] font-code", activeDiff === 'Hard' ? "border-hard-diff text-hard-diff bg-[rgba(255,49,49,0.08)] shadow-[0_0_12px_rgba(255,49,49,0.1)]" : "text-muted-text")}>HARD</button>

                    <div className="w-px h-4 bg-[rgba(0,255,65,0.15)] self-center mx-1" />

                    {['Array', 'Hash Table', 'Tree', 'Stack', 'Sorting'].map(topic => (
                        <button key={topic} onClick={() => toggleTopic(topic)} className={cn("glass-btn text-[11px] font-code", activeTopics.includes(topic) ? "border-accent-primary text-accent-primary bg-[rgba(0,255,65,0.1)] shadow-[0_0_12px_rgba(0,255,65,0.15)]" : "text-muted-text")}>{topic.toUpperCase()}</button>
                    ))}
                </div>

                {/* Results List */}
                <div className="flex flex-col gap-2 w-full">
                    {filteredProblems.map((p) => (
                        <div key={p.problemId} className="group glass-card flex items-center gap-3 p-3.5 relative overflow-hidden">
                            {/* Neon green left bar on hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-dim pointer-events-none group-hover:bg-accent-primary transition-colors group-hover:shadow-[0_0_8px_#00ff41] rounded-l-[14px]" />

                            {/* Title */}
                            <div className="flex-1 flex items-center gap-3 ml-2">
                                <span className="text-muted-text font-code text-[12px] min-w-[30px]">#{p.problemId}</span>
                                <span className="font-code text-[13px] group-hover:text-accent-primary transition-colors cursor-pointer" style={{ color: 'var(--glass-text)' }} onClick={() => handleSolveClick(p.problemId)}>
                                    {p.title}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-1.5 flex-wrap hidden md:flex">
                                {p.tags?.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full glass-inner text-muted-text font-code tracking-[1px] uppercase whitespace-nowrap">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Difficulty */}
                            <div className="w-20 flex justify-end shrink-0 pr-2">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[11px] font-bold font-code tracking-[1px] border",
                                    p.difficulty === 'Easy' && "text-easy-diff border-easy-diff/40 [text-shadow:0_0_8px_#00ff41]",
                                    p.difficulty === 'Medium' && "text-med-diff border-med-diff/40",
                                    p.difficulty === 'Hard' && "text-hard-diff border-hard-diff/40"
                                )}>
                                    {p.difficulty}
                                </span>
                            </div>

                            {/* Action */}
                            <button onClick={() => handleSolveClick(p.problemId)} className="glass-btn px-3.5 py-1.5 text-[11px] tracking-[1px]">
                                SOLVE ▶
                            </button>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
