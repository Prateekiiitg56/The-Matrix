import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Zap, FileCode, Beaker, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

const mockProblem = {
    id: 1,
    title: '1. Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
    ],
    constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9'
    ]
};

const boilerplate = {
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`
};

export default function CodeEditor({ activeLanguage }) {
    const [code, setCode] = useState(boilerplate[activeLanguage]);
    const [activeTab, setActiveTab] = useState('testcases');
    const [testCases, setTestCases] = useState([{ id: 1, text: '[2,7,11,15]\\n9' }]);
    const [activeTestCaseId, setActiveTestCaseId] = useState(1);
    const [leftWidth, setLeftWidth] = useState(40); // 40% width for left panel
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        setCode(boilerplate[activeLanguage]);
    }, [activeLanguage]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging || !containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            // Constraint between 20% and 60%
            if (newWidth >= 20 && newWidth <= 60) {
                setLeftWidth(newWidth);
            }
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "flex flex-col md:flex-row h-[calc(100vh-56px)] w-full overflow-hidden bg-void-black font-ui transition-all",
                isDragging && "select-none cursor-col-resize"
            )}
        >
            {/* Left Panel: Problem Statement */}
            <div
                className="w-full h-[40%] md:h-full border-b md:border-b-0 md:border-r border-subtle-line bg-editor-dark flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide py-4 px-4 md:py-6 md:px-8 shrink-0 relative"
                style={{ width: `${leftWidth}%`, minWidth: '300px' }}
            >
                <h2 className="text-xl md:text-2xl font-display font-bold text-body-text mb-2 tracking-tight">
                    {mockProblem.title}
                </h2>

                <div className="flex flex-wrap gap-2 mb-4 md:mb-6 text-xs md:text-sm font-medium">
                    <span className="text-easy-diff bg-[#00b341]/10 px-2 py-0.5 rounded-md border border-easy-diff/20">{mockProblem.difficulty}</span>
                    {mockProblem.tags.map(tag => (
                        <span key={tag} className="text-muted-text bg-raised-dark px-2 py-0.5 rounded-md border border-subtle-line">{tag}</span>
                    ))}
                </div>

                <div className="prose prose-invert prose-sm md:prose-base max-w-none mb-6 md:mb-8 text-body-text/90 leading-relaxed font-ui">
                    <ReactMarkdown>{mockProblem.description}</ReactMarkdown>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-md md:text-lg font-semibold text-body-text font-display">Examples</h3>
                    {mockProblem.examples.map((ex, i) => (
                        <div key={i} className="bg-raised-dark border border-subtle-line rounded-lg p-3 md:p-4 text-xs md:text-sm">
                            <p className="mb-2"><span className="text-muted-text">Input:</span> <span className="font-code bg-black/50 px-1 py-0.5 rounded">{ex.input}</span></p>
                            <p className="mb-2"><span className="text-muted-text">Output:</span> <span className="font-code text-accent-primary bg-accent-primary/10 px-1 py-0.5 rounded">{ex.output}</span></p>
                            {ex.explanation && <p className="text-muted-text"><span className="text-body-text">Explanation:</span> {ex.explanation}</p>}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 mt-6 md:mt-8">
                    <h3 className="text-md md:text-lg font-semibold text-body-text font-display">Constraints</h3>
                    <ul className="list-disc pl-5 text-xs md:text-sm font-code text-muted-text space-y-1">
                        {mockProblem.constraints.map((c, i) => (
                            <li key={i}>{c}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Draggable Divider (Desktop Only) */}
            <div
                className="hidden md:flex w-2 items-center justify-center cursor-col-resize bg-editor-dark hover:bg-subtle-line transition-colors border-r border-subtle-line z-10 shrink-0 group relative"
                onMouseDown={() => setIsDragging(true)}
            >
                <GripVertical size={14} className="text-muted-text group-hover:text-white transition-colors" />
                {isDragging && <div className="absolute inset-y-0 -inset-x-8 z-50 cursor-col-resize" />}
            </div>

            {/* Right Panel: Editor & IO */}
            <div className="flex-1 flex flex-col h-[60%] md:h-full bg-void-black min-w-[300px]">
                {/* Editor Instance */}
                <div className="flex-1 border-b border-subtle-line relative overflow-hidden">
                    <Editor
                        height="100%"
                        language={activeLanguage === 'cpp' ? 'cpp' : activeLanguage}
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', monospace",
                            scrollBeyondLastLine: false,
                            padding: { top: 20 },
                            lineHeight: 1.6,
                            automaticLayout: true,
                        }}
                    />
                </div>

                {/* Action Bar */}
                <div className="h-12 bg-editor-dark border-b border-subtle-line flex items-center justify-between px-2 md:px-4 shrink-0 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 md:gap-4 flex-shrink-0">
                        <button
                            onClick={() => setActiveTab('testcases')}
                            className={cn("text-xs md:text-sm font-medium flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors", activeTab === 'testcases' ? "bg-raised-dark text-body-text" : "text-muted-text hover:text-body-text")}
                        >
                            <Beaker size={14} /> Testcases
                        </button>
                        <button
                            onClick={() => setActiveTab('output')}
                            className={cn("text-xs md:text-sm font-medium flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors", activeTab === 'output' ? "bg-raised-dark text-body-text" : "text-muted-text hover:text-body-text")}
                        >
                            <FileCode size={14} /> Output
                        </button>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <button className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-md bg-raised-dark text-body-text font-medium text-xs md:text-sm hover:bg-[#20252b] transition-colors border border-subtle-line whitespace-nowrap">
                            <Play size={14} className="text-med-diff" /> Run
                        </button>
                        <button className="flex items-center gap-1.5 px-4 md:px-5 py-1.5 rounded-md bg-accent-primary text-void-black font-semibold text-xs md:text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,135,0.4)] whitespace-nowrap">
                            <Zap size={14} /> Submit
                        </button>
                    </div>
                </div>

                {/* Bottom Area: Test cases / Output */}
                <div className="h-40 md:h-64 bg-editor-dark shrink-0 flex flex-col pt-2 transition-all">
                    {activeTab === 'testcases' ? (
                        <div className="flex h-full px-2 gap-2">
                            <div className="w-24 md:w-32 flex flex-col gap-1 border-r border-subtle-line pr-2 overflow-y-auto scrollbar-hide">
                                {testCases.map((tc, idx) => (
                                    <button key={tc.id} onClick={() => setActiveTestCaseId(tc.id)} className={cn("text-left px-2 md:px-3 py-1.5 md:py-2 rounded-md font-ui text-xs md:text-sm truncate", activeTestCaseId === tc.id ? "bg-raised-dark text-body-text" : "text-muted-text hover:bg-raised-dark/50")}>
                                        Case {idx + 1}
                                    </button>
                                ))}
                                <button className="text-left px-2 md:px-3 py-2 text-xs md:text-sm text-accent-primary hover:text-accent-secondary mt-2">
                                    + Add case
                                </button>
                            </div>
                            <div className="flex-1 px-2 md:px-4 flex flex-col pb-2">
                                <span className="text-xs text-muted-text mb-1.5 font-code">stdin</span>
                                <textarea
                                    className="flex-1 bg-void-black border border-subtle-line rounded-md p-2 md:p-3 text-xs md:text-sm font-code text-body-text resize-none focus:outline-none focus:border-accent-primary shadow-inner"
                                    value={testCases.find(t => t.id === activeTestCaseId)?.text}
                                    readOnly
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full px-6 py-4 justify-center items-center text-muted-text">
                            <span className="font-ui text-sm">Run your code to see output</span>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
