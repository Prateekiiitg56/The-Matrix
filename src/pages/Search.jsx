import { cn } from '../lib/utils';
import { useState } from 'react';

const mockProblems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'], status: 'solved' },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', tags: ['Linked List', 'Math'], status: 'unsolved' },
    { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Sliding Window'], status: 'unsolved' },
    { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Array', 'Binary Search', 'Divide and Conquer'], status: 'attempted' },
];

export default function Search({ setActivePanel }) {
    const [query, setQuery] = useState('');
    const [activeDiff, setActiveDiff] = useState('all');
    const [activeTopics, setActiveTopics] = useState([]);

    const toggleTopic = (topic) => {
        setActiveTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-57px)] overflow-y-auto bg-transparent text-accent-primary p-6 px-10 items-center scrollbar-hide">

            <div className="w-full max-w-5xl flex flex-col pt-4">

                {/* Section Header */}
                <div className="mb-6 pb-3 border-b border-subtle-line">
                    <div className="font-display text-[14px] font-bold tracking-[4px] text-accent-primary text-glow-alt">
            // PROBLEM SEARCH
                    </div>
                    <div className="text-[12px] text-muted-text mt-1 tracking-[2px] font-code">
                        QUERY THE MATRIX DATABASE
                    </div>
                </div>

                {/* Search Input */}
                <div className="flex gap-2 mb-4 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text font-code text-base pointer-events-none">▶</span>
                    <input
                        type="text"
                        className="flex-1 bg-editor-dark border border-border-focus rounded text-[14px] font-code text-accent-primary pl-10 pr-4 py-3 outline-none transition-all shadow-[inset_0_0_20px_rgba(0,255,65,0.05)] focus:border-accent-primary focus:shadow-[0_0_20px_rgba(0,255,65,0.15),inset_0_0_20px_rgba(0,255,65,0.05)] placeholder-muted-text"
                        placeholder="SEARCH PROBLEMS... (e.g. 'two sum', 'binary tree')"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Filter Row */}
                <div className="flex gap-2 flex-wrap mb-6">
                    <button onClick={() => setActiveDiff('all')} className={cn("px-3 py-1 border rounded-[3px] text-[11px] font-code cursor-pointer transition-all tracking-[1px]", activeDiff === 'all' ? "border-accent-primary text-accent-primary bg-raised-dark shadow-glow-sm" : "border-subtle-line text-muted-text hover:border-accent-primary hover:text-accent-primary hover:shadow-[0_0_8px_rgba(0,255,65,0.05)]")}>ALL</button>
                    <button onClick={() => setActiveDiff('Easy')} className={cn("px-3 py-1 border rounded-[3px] text-[11px] font-code cursor-pointer transition-all tracking-[1px]", activeDiff === 'Easy' ? "border-easy-diff text-easy-diff bg-raised-dark shadow-glow-sm" : "border-subtle-line text-muted-text hover:border-accent-primary hover:text-accent-primary hover:shadow-[0_0_8px_rgba(0,255,65,0.05)]")}>EASY</button>
                    <button onClick={() => setActiveDiff('Medium')} className={cn("px-3 py-1 border rounded-[3px] text-[11px] font-code cursor-pointer transition-all tracking-[1px]", activeDiff === 'Medium' ? "border-med-diff text-med-diff bg-raised-dark shadow-glow-sm" : "border-subtle-line text-muted-text hover:border-accent-primary hover:text-accent-primary hover:shadow-[0_0_8px_rgba(0,255,65,0.05)]")}>MEDIUM</button>
                    <button onClick={() => setActiveDiff('Hard')} className={cn("px-3 py-1 border rounded-[3px] text-[11px] font-code cursor-pointer transition-all tracking-[1px]", activeDiff === 'Hard' ? "border-hard-diff text-hard-diff bg-raised-dark shadow-glow-sm" : "border-subtle-line text-muted-text hover:border-accent-primary hover:text-accent-primary hover:shadow-[0_0_8px_rgba(0,255,65,0.05)]")}>HARD</button>

                    <div className="w-px h-4 bg-subtle-line self-center mx-1" />

                    {['ARRAY', 'HASHMAP', 'TREE', 'DP', 'GRAPH'].map(topic => (
                        <button key={topic} onClick={() => toggleTopic(topic)} className={cn("px-3 py-1 border rounded-[3px] text-[11px] font-code cursor-pointer transition-all tracking-[1px]", activeTopics.includes(topic) ? "border-accent-primary text-accent-primary bg-raised-dark shadow-glow-sm" : "border-subtle-line text-muted-text hover:border-accent-primary hover:text-accent-primary hover:shadow-[0_0_8px_rgba(0,255,65,0.05)]")}>{topic}</button>
                    ))}
                </div>

                {/* Results List */}
                <div className="flex flex-col gap-1.5 w-full">
                    {mockProblems.map((p) => (
                        <div key={p.id} className="group flex items-center gap-3 bg-editor-dark hover:border-border-focus border border-subtle-line rounded p-3 transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.05)] hover:translate-x-[2px] relative overflow-hidden">
                            {/* Neon green left bar on hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-dim pointer-events-none group-hover:bg-accent-primary transition-colors group-hover:shadow-[0_0_8px_#00ff41]" />

                            {/* Title */}
                            <div className="flex-1 flex items-center gap-3 ml-2">
                                <span className="text-muted-text font-code text-[12px] min-w-[30px]">#{p.id}</span>
                                <span className="text-text-alt font-code text-[13px] group-hover:text-accent-primary transition-colors cursor-pointer" onClick={() => setActivePanel('editor')}>
                                    {p.title}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-1.5">
                                {p.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-sm bg-raised-dark border border-subtle-line text-muted-text font-code tracking-[1px] uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Difficulty */}
                            <div className="w-20 flex justify-end shrink-0 pr-2">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-sm text-[11px] font-bold font-code tracking-[1px] border",
                                    p.difficulty === 'Easy' && "text-easy-diff border-easy-diff [text-shadow:0_0_8px_#00ff41]",
                                    p.difficulty === 'Medium' && "text-med-diff border-med-diff",
                                    p.difficulty === 'Hard' && "text-hard-diff border-hard-diff"
                                )}>
                                    {p.difficulty}
                                </span>
                            </div>

                            {/* Action */}
                            <button onClick={() => setActivePanel('editor')} className="px-3.5 py-1.5 border border-accent-dim rounded-sm bg-transparent text-accent-primary font-code text-[11px] tracking-[1px] cursor-pointer transition-all whitespace-nowrap hover:bg-[#00441a] hover:border-accent-primary hover:shadow-glow-sm">
                                SOLVE ▶
                            </button>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
