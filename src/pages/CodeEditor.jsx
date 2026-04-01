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
    const [leftWidth, setLeftWidth] = useState(40);
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
                "flex flex-col md:flex-row h-[calc(100vh-57px)] w-full overflow-hidden bg-transparent font-code transition-all p-6 px-10 gap-0",
                isDragging && "select-none cursor-col-resize"
            )}
        >
            <div className="flex w-full h-full border border-border-focus rounded shadow-[0_0_30px_rgba(0,255,65,0.05)] overflow-hidden">
                {/* Left Panel: Problem Statement */}
                <div
                    className="h-full border-r border-border-focus bg-editor-dark flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide py-4 px-4 shrink-0 relative"
                    style={{ width: `${leftWidth}%`, minWidth: '300px' }}
                >
                    <div className="text-[11px] tracking-[3px] text-muted-text bg-raised-dark px-4 py-2 mb-4 border-b border-subtle-line -mx-4 -mt-4 uppercase">
            // PROBLEM DEFINITION
                    </div>
                    <h2 className="text-[15px] font-display font-bold text-accent-primary mb-2 tracking-[1px] text-glow">
                        {mockProblem.title}
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-4 text-[11px] tracking-[1px] font-bold">
                        <span className="text-easy-diff border border-easy-diff px-2 py-0.5 rounded-sm [text-shadow:0_0_8px_#00ff41]">{mockProblem.difficulty}</span>
                        {mockProblem.tags.map(tag => (
                            <span key={tag} className="text-muted-text bg-raised-dark px-1.5 py-0.5 rounded border border-subtle-line uppercase">{tag}</span>
                        ))}
                    </div>

                    <div className="prose prose-invert prose-sm max-w-none mb-6 text-text-alt leading-relaxed font-code text-[13px]">
                        <ReactMarkdown>{mockProblem.description}</ReactMarkdown>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="text-[11px] tracking-[2px] text-muted-text mt-4 mb-2 uppercase">// EXAMPLES</div>
                        {mockProblem.examples.map((ex, i) => (
                            <div key={i} className="bg-surface border border-subtle-line rounded-sm p-2 text-[12px] leading-[1.6] text-text-alt mb-2">
                                <p className="mb-1"><span className="text-muted-text">Input:</span> <span className="font-code bg-black/50 px-1 py-0.5 rounded">{ex.input}</span></p>
                                <p className="mb-1"><span className="text-muted-text">Output:</span> <span className="font-code text-accent-primary bg-accent-primary/10 px-1 py-0.5 rounded">{ex.output}</span></p>
                                {ex.explanation && <p className="text-muted-text text-[11px] mt-2 border-t border-subtle-line pt-2"><span className="text-text-alt">Explanation:</span> {ex.explanation}</p>}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-1 mt-4">
                        <div className="text-[11px] tracking-[2px] text-muted-text mt-4 mb-2 uppercase">// CONSTRAINTS</div>
                        <ul className="list-disc pl-4 text-[12px] font-code text-muted-text space-y-1">
                            {mockProblem.constraints.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Draggable Divider */}
                <div
                    className="w-1.5 items-center justify-center cursor-col-resize bg-editor-dark hover:bg-border-focus transition-colors z-10 shrink-0 group relative flex flex-col gap-1"
                    onMouseDown={() => setIsDragging(true)}
                >
                    <div className="w-[1px] h-3 bg-subtle-line group-hover:bg-accent-primary"></div>
                    <div className="w-[1px] h-3 bg-subtle-line group-hover:bg-accent-primary"></div>
                    {isDragging && <div className="absolute inset-y-0 -inset-x-8 z-50 cursor-col-resize" />}
                </div>

                {/* Right Panel: Editor & IO */}
                <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] min-w-[300px]">
                    {/* Editor Top Bar (Mock) */}
                    <div className="px-3 py-2 bg-raised-dark border-b border-subtle-line flex items-center justify-end">
                        <span className="text-[11px] text-muted-text tracking-[1px] cursor-pointer hover:border-accent-primary hover:text-accent-primary transition-all border border-transparent px-3 py-1 rounded">RESET</span>
                        <span className="text-[11px] text-muted-text tracking-[1px] cursor-pointer hover:border-accent-primary hover:text-accent-primary transition-all border border-transparent px-3 py-1 rounded">FORMAT</span>
                    </div>

                    {/* Editor Instance */}
                    <div className="flex-1 relative overflow-hidden bg-[#050505] p-2">
                        <Editor
                            height="100%"
                            language={activeLanguage === 'cpp' ? 'cpp' : activeLanguage}
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: '"Share Tech Mono", monospace',
                                scrollBeyondLastLine: false,
                                padding: { top: 10 },
                                lineHeight: 1.6,
                                automaticLayout: true,
                                cursorBlinking: 'smooth',
                                cursorWidth: 2,
                            }}
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="bg-raised-dark border-t border-subtle-line flex flex-col">
                        <div className="flex border-b border-subtle-line">
                            <button
                                onClick={() => setActiveTab('testcases')}
                                className={cn("px-4 py-2 text-[11px] tracking-[1px] border-b-[2px] cursor-pointer transition-all focus:outline-none", activeTab === 'testcases' ? "border-accent-primary text-accent-primary" : "border-transparent text-muted-text hover:text-text-alt")}
                            >
                                TESTCASES
                            </button>
                            <button
                                onClick={() => setActiveTab('output')}
                                className={cn("px-4 py-2 text-[11px] tracking-[1px] border-b-[2px] cursor-pointer transition-all focus:outline-none", activeTab === 'output' ? "border-accent-primary text-accent-primary" : "border-transparent text-muted-text hover:text-text-alt")}
                            >
                                OUTPUT
                            </button>
                        </div>

                        <div className="h-40 flex flex-col pt-2 transition-all overflow-hidden bg-[#0a0a0a]">
                            {activeTab === 'testcases' ? (
                                <div className="flex h-full p-2 gap-2">
                                    <div className="w-24 flex flex-col gap-[1px] pr-2 overflow-y-auto scrollbar-hide">
                                        {testCases.map((tc, idx) => (
                                            <button key={tc.id} onClick={() => setActiveTestCaseId(tc.id)} className={cn("text-left px-2 py-1.5 rounded-sm text-[11px] tracking-[1px] truncate text-muted-text", activeTestCaseId === tc.id ? "bg-raised-dark text-text-alt" : "hover:bg-editor-dark")}>
                                                Case {idx + 1}
                                            </button>
                                        ))}
                                        <button className="text-left px-2 py-1 mt-1 text-[11px] text-accent-primary opacity-50 hover:opacity-100 tracking-[1px]">+ Add case</button>
                                    </div>
                                    <div className="flex-1 px-4 flex flex-col pb-2">
                                        <span className="text-[10px] tracking-[2px] text-muted-text mb-[4px] font-code">STDIN</span>
                                        <textarea
                                            className="flex-1 w-full bg-[#020f02] border border-subtle-line rounded-[3px] p-3 text-[13px] font-code text-[#00ff41] resize-none focus:outline-none focus:border-accent-primary focus:shadow-[0_0_15px_rgba(0,255,65,0.15)] shadow-inner"
                                            value={testCases.find(t => t.id === activeTestCaseId)?.text}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full px-4 py-2 justify-center items-center text-muted-text text-[12px] uppercase tracking-[1px]">
                                    # Run your code to compile output
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end px-3 py-2.5 gap-2 border-t border-subtle-line">
                            <button className="px-[20px] py-[7px] border border-accent-dim rounded-[3px] bg-editor-dark text-accent-primary font-code text-[12px] tracking-[2px] cursor-pointer transition-all hover:border-accent-primary hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] hover:bg-raised-dark">
                                RUN
                            </button>
                            <button className="px-[20px] py-[7px] border border-accent-primary rounded-[3px] bg-accent-dim text-accent-primary font-code text-[12px] tracking-[2px] cursor-pointer transition-all shadow-[0_0_10px_rgba(0,255,65,0.05)] hover:shadow-[0_0_20px_rgba(0,255,65,0.15),0_0_40px_rgba(0,255,65,0.05)] hover:bg-[#005520]">
                                SUBMIT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
