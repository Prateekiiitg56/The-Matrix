import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Zap, FileCode, Beaker, GripVertical, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

const defaultMock = {
    problemId: 1,
    title: '1. Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.`,
    examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
    ],
    constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9'
    ],
    boilerplates: {
        python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        `,
        java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
        cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`
    }
};

// Piston API Version Mappings
const PISTON_LANG_MAP = {
    'python': { lang: 'python', version: '*' },
    'java': { lang: 'java', version: '*' },
    'cpp': { lang: 'c++', version: '*' }
};

export default function CodeEditor({ activeLanguage, activeProblemId, setActiveProblemId }) {
    const [problem, setProblem] = useState(null);
    const [allProblems, setAllProblems] = useState([]);
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState('testcases');
    const [testCases, setTestCases] = useState([]);
    const [activeTestCaseId, setActiveTestCaseId] = useState(0);

    // Execution states
    const [isCompiling, setIsCompiling] = useState(false);
    const [output, setOutput] = useState(null);

    const [leftWidth, setLeftWidth] = useState(40);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);

    // Fetch DB Context
    useEffect(() => {
        setLoading(true);
        const targetId = activeProblemId || 1;

        fetch('http://localhost:5000/api/problems')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Sort by problemId natively
                    const sorted = data.sort((a, b) => a.problemId - b.problemId);
                    setAllProblems(sorted);
                }
            })
            .catch(() => { });

        fetch(`http://localhost:5000/api/problems/${targetId}`)
            .then(res => {
                if (!res.ok) throw new Error('API not available');
                return res.json();
            })
            .then(data => {
                setProblem(data);
                if (data.examples && data.examples.length > 0) {
                    setTestCases(data.examples.map((ex, i) => ({ id: i, text: ex.input, isRaw: false })));
                    setActiveTestCaseId(0);
                } else {
                    setTestCases([{ id: 0, text: '', isRaw: true }]);
                }
            })
            .catch((err) => {
                console.warn('Backend unavailable, using fallback problem:', err);
                setProblem(defaultMock);
                setTestCases(defaultMock.examples.map((ex, i) => ({ id: i, text: ex.input, isRaw: false })));
                setActiveTestCaseId(0);
            })
            .finally(() => setLoading(false));
    }, [activeProblemId]);

    // Update Boilerplate when language or problem changes
    useEffect(() => {
        if (problem && problem.boilerplates) {
            setCode(problem.boilerplates[activeLanguage] || problem.boilerplates['python']);
        }
    }, [activeLanguage, problem]);

    // Handle Resize
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

    const handleTestcaseChange = (val) => {
        setTestCases(prev => prev.map(t => t.id === activeTestCaseId ? { ...t, text: val, isRaw: true } : t));
    };

    const executeCode = async () => {
        setIsCompiling(true);
        setActiveTab('output');
        setOutput({ status: 'running', message: 'HACKING MAINFRAME... COMPILING...' });

        const activeTC = testCases.find(t => t.id === activeTestCaseId)?.text || '';
        const executionLang = PISTON_LANG_MAP[activeLanguage] || PISTON_LANG_MAP['python'];

        try {
            const res = await fetch('http://localhost:5000/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: executionLang.lang,
                    code: code,
                    stdin: activeTC
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setOutput({ status: 'error', message: data.message || `API ERROR: ${res.statusText}` });
                setIsCompiling(false);
                return;
            }

            if (!data.run) {
                setOutput({ status: 'error', message: 'CRITICAL FAILURE: Unexpected response payload from Engine.' });
                setIsCompiling(false);
                return;
            }

            if (data.run.stderr || data.run.code !== 0) {
                setOutput({ status: 'error', message: data.run.stderr || data.run.output || 'Execution Failed.' });
            } else if (data.compile && data.compile.code !== 0) {
                setOutput({ status: 'error', message: data.compile.stderr || data.compile.output || 'Compilation Failed.' });
            } else {
                setOutput({ status: 'success', message: data.run.stdout || data.run.output || 'Program ran successfully without output.' });
            }
        } catch (err) {
            setOutput({ status: 'error', message: `CRITICAL FAILURE: Execution Engine unreachable. Error: ${err.message}` });
        } finally {
            setIsCompiling(false);
        }
    };

    // Navigation Logic
    const handlePrevProblem = () => {
        const targetId = activeProblemId || 1;
        if (allProblems.length > 0) {
            const currentIndex = allProblems.findIndex(p => p.problemId === targetId);
            if (currentIndex > 0) {
                if (setActiveProblemId) setActiveProblemId(allProblems[currentIndex - 1].problemId);
            }
        }
    };

    const handleNextProblem = () => {
        const targetId = activeProblemId || 1;
        if (allProblems.length > 0) {
            const currentIndex = allProblems.findIndex(p => p.problemId === targetId);
            if (currentIndex !== -1 && currentIndex < allProblems.length - 1) {
                if (setActiveProblemId) setActiveProblemId(allProblems[currentIndex + 1].problemId);
            }
        }
    };

    const cleanMarkdown = (text) => {
        if (!text) return '';
        return text
            .replace(/\\n/g, '\n')
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/<strong[^>]*>/g, '**')
            .replace(/<span[^>]*>/g, '')
            .replace(/<\/span>/g, '')
            .replace(/<em[^>]*>/g, '*')
            .replace(/<sup[^>]*>/g, '^')
            .replace(/<\/sup>/g, '')
            .replace(/<sub[^>]*>/g, '_')
            .replace(/<\/sub>/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/\*\*\*\*/g, '**')
            .replace(/\*\*\*\*\*\*/g, '**');
    };

    if (loading || !problem) {
        return (
            <div className="flex-1 flex items-center justify-center h-[calc(100vh-57px)] text-accent-dim font-code animate-pulse tracking-[4px]">
                DOWNLOADING MATRIX DATA...
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "flex flex-col md:flex-row h-[calc(100vh-57px)] w-full overflow-hidden bg-transparent font-code transition-all p-6 px-10 gap-0",
                isDragging && "select-none cursor-col-resize"
            )}
        >
            <div className="flex w-full h-full border border-border-focus rounded shadow-[0_0_30px_rgba(0,255,65,0.05)] overflow-hidden">

                {/* Left Panel */}
                <div
                    className="h-full border-r border-border-focus bg-editor-dark flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide py-4 px-4 shrink-0 relative"
                    style={{ width: `${leftWidth}%`, minWidth: '300px' }}
                >
                    <div className="text-[11px] tracking-[3px] text-muted-text bg-raised-dark px-4 py-2 mb-4 border-b border-subtle-line -mx-4 -mt-4 uppercase flex justify-between items-center">
                        <span>// PROBLEM DEFINITION</span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handlePrevProblem}
                                className="p-0.5 hover:bg-editor-dark hover:text-accent-primary rounded transition-colors text-muted-text"
                                title="Previous Problem"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={handleNextProblem}
                                className="p-0.5 hover:bg-editor-dark hover:text-accent-primary rounded transition-colors text-muted-text"
                                title="Next Problem"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                    <h2 className="text-[15px] font-display font-bold text-accent-primary mb-2 tracking-[1px] text-glow">
                        {problem.problemId}. {problem.title}
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-4 text-[11px] tracking-[1px] font-bold">
                        <span className="text-easy-diff border border-easy-diff px-2 py-0.5 rounded-sm [text-shadow:0_0_8px_#00ff41]">{problem.difficulty}</span>
                        {problem.tags?.map(tag => (
                            <span key={tag} className="text-muted-text bg-raised-dark px-1.5 py-0.5 rounded border border-subtle-line uppercase">{tag}</span>
                        ))}
                    </div>

                    <div className="mb-6 text-text-alt leading-[1.8] font-code text-[14px] tracking-wide markdown-content">
                        <ReactMarkdown
                            components={{
                                strong: ({ node, ...props }) => <span className="text-white font-bold tracking-[0.5px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" {...props} />,
                                code: ({ node, inline, ...props }) => inline ? (
                                    <code className="bg-[#081208] border border-subtle-line text-accent-primary px-1.5 py-[2px] rounded text-[12.5px] shadow-[inset_0_0_5px_rgba(0,255,65,0.05)] mx-0.5" {...props} />
                                ) : (
                                    <pre className="bg-[#030903] border border-border-focus p-4 rounded-md my-5 overflow-x-auto text-[13px] text-text-alt shadow-[0_0_15px_rgba(0,255,65,0.03)] border-l-[3px] border-l-accent-primary"><code {...props} /></pre>
                                ),
                                p: ({ node, ...props }) => <p className="mb-4 text-[#bfbfbf]" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2 text-[#bfbfbf]" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1 marker:text-accent-dim" {...props} />
                            }}
                        >
                            {cleanMarkdown(problem.description)}
                        </ReactMarkdown>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="text-[11px] tracking-[2px] text-muted-text mt-2 uppercase flex items-center gap-2">
                            <Zap size={10} className="text-accent-dim" />
                            // RAW TEST DATA
                        </div>
                        {problem.examples?.map((ex, i) => (
                            <div key={i} className="bg-[#050B05] border border-border-focus rounded-sm p-3.5 text-[12px] leading-[1.6] text-text-alt shadow-[0_0_10px_rgba(0,255,65,0.02)]">
                                <div className="flex items-start gap-2 mb-2">
                                    <span className="text-accent-dim uppercase tracking-[1px] font-bold text-[10px] shrink-0 mt-[2px] w-12 border-b border-accent-dim/30 pb-0.5">INPUT:</span>
                                    <span className="font-code bg-void-black px-2 py-1 rounded border border-subtle-line text-[#e0e0e0] flex-1 break-all">{ex.input}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-accent-primary uppercase tracking-[1px] font-bold text-[10px] shrink-0 mt-[2px] w-12 border-b border-accent-primary/30 pb-0.5">OUTPUT:</span>
                                    <span className="font-code text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-2 py-1 rounded flex-1 break-all">{ex.output}</span>
                                </div>
                                {ex.explanation && (
                                    <div className="mt-3 border-t border-subtle-line/50 pt-2 flex items-start gap-2 text-[11.5px]">
                                        <span className="text-muted-text">Explanation:</span>
                                        <span className="text-[#bfbfbf] leading-relaxed flex-1">{ex.explanation}</span>
                                    </div>
                                )}
                            </div>
                        ))}
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
                    {/* Editor Top Bar */}
                    <div className="px-3 py-2 bg-raised-dark border-b border-subtle-line flex items-center justify-between">
                        <div className="text-[10px] tracking-[2px] text-muted-text uppercase flex items-center gap-2">
                            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isCompiling ? "bg-med-diff" : "bg-accent-primary shadow-glow-sm")} />
                            {isCompiling ? 'SYSTEM COMPILING...' : 'LOCAL HOST ENGINE READY'}
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[11px] text-muted-text tracking-[1px] cursor-pointer hover:border-accent-primary hover:text-accent-primary transition-all border border-transparent px-3 py-1 rounded" onClick={() => setCode(problem.boilerplates[activeLanguage])}>RESET</span>
                            <span className="text-[11px] text-muted-text tracking-[1px] cursor-pointer hover:border-accent-primary hover:text-accent-primary transition-all border border-transparent px-3 py-1 rounded">FORMAT</span>
                        </div>
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

                    {/* Action Bar & Terminal IO */}
                    <div className="bg-raised-dark border-t border-subtle-line flex flex-col h-48 shrink-0">
                        <div className="flex border-b border-subtle-line">
                            <button
                                onClick={() => setActiveTab('testcases')}
                                className={cn("px-4 py-2 text-[11px] tracking-[1px] border-b-[2px] cursor-pointer transition-all focus:outline-none", activeTab === 'testcases' ? "border-accent-primary text-accent-primary" : "border-transparent text-muted-text hover:text-text-alt")}
                            >
                                TESTCASES
                            </button>
                            <button
                                onClick={() => setActiveTab('output')}
                                className={cn("px-4 py-2 text-[11px] tracking-[1px] border-b-[2px] cursor-pointer transition-all focus:outline-none flex items-center gap-1", activeTab === 'output' ? "border-accent-primary text-accent-primary" : "border-transparent text-muted-text hover:text-text-alt")}
                            >
                                {isCompiling && <Loader2 size={12} className="animate-spin text-med-diff" />} OUTPUT
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col transition-all overflow-hidden bg-[#0a0a0a]">
                            {activeTab === 'testcases' && (
                                <div className="flex h-full p-2 gap-2">
                                    <div className="w-24 flex flex-col gap-[1px] pr-2 overflow-y-auto scrollbar-hide">
                                        {testCases.map((tc, idx) => (
                                            <button key={tc.id} onClick={() => setActiveTestCaseId(tc.id)} className={cn("text-left px-2 py-1.5 rounded-sm text-[11px] tracking-[1px] truncate text-muted-text", activeTestCaseId === tc.id ? "bg-raised-dark text-text-alt" : "hover:bg-editor-dark")}>
                                                Case {idx + 1}
                                            </button>
                                        ))}
                                        <button className="text-left px-2 py-1 mt-1 text-[11px] text-accent-primary opacity-50 hover:opacity-100 tracking-[1px]" onClick={() => setTestCases([...testCases, { id: testCases.length, text: '', isRaw: true }])}>+ Add case</button>
                                    </div>
                                    <div className="flex-1 px-4 flex flex-col pb-2">
                                        <span className="text-[10px] tracking-[2px] text-muted-text mb-[4px] font-code">STDIN (RAW TEXT)</span>
                                        <textarea
                                            className="flex-1 w-full bg-[#020f02] border border-subtle-line rounded-[3px] p-3 text-[13px] font-code text-accent-primary resize-none focus:outline-none focus:border-accent-primary focus:shadow-[0_0_15px_rgba(0,255,65,0.15)] shadow-inner"
                                            value={testCases.find(t => t.id === activeTestCaseId)?.text || ''}
                                            onChange={(e) => handleTestcaseChange(e.target.value)}
                                            placeholder="Drop raw inputs here..."
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'output' && (
                                <div className="flex flex-col h-full bg-[#020f02] overflow-y-auto scrollbar-hide p-4 font-code text-[12px]">
                                    {output ? (
                                        <div className="flex flex-col gap-2">
                                            <span className={cn(
                                                "text-[10px] tracking-[2px] uppercase",
                                                output.status === 'running' ? "text-med-diff animate-pulse" :
                                                    output.status === 'error' ? "text-hard-diff" : "text-accent-primary"
                                            )}>
                         // {output.status === 'running' ? 'EXECUTING' : output.status === 'error' ? 'FATAL EXCEPTION' : 'SUCCESS'}
                                            </span>
                                            <pre className={cn("whitespace-pre-wrap font-code leading-[1.6]", output.status === 'error' ? "text-[#ff6b6b]" : "text-text-alt")}>
                                                {output.message}
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center h-full text-muted-text text-[11px] uppercase tracking-[1px]">
                                            # Run your code to intercept terminal output
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end px-3 py-2.5 gap-2 border-t border-subtle-line bg-raised-dark">
                            <button onClick={executeCode} disabled={isCompiling} className="px-[20px] py-[7px] border border-accent-dim rounded-[3px] bg-editor-dark text-accent-primary font-code text-[12px] tracking-[2px] cursor-pointer transition-all hover:border-accent-primary hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] hover:bg-raised-dark disabled:opacity-50 flex items-center gap-2">
                                {isCompiling ? <Loader2 size={12} className="animate-spin text-med-diff" /> : <Play size={12} className="text-accent-primary" />}
                                RUN
                            </button>
                            <button disabled={isCompiling} className="px-[20px] py-[7px] border border-accent-primary rounded-[3px] bg-accent-dim text-accent-primary font-code text-[12px] tracking-[2px] cursor-pointer transition-all shadow-[0_0_10px_rgba(0,255,65,0.05)] hover:shadow-[0_0_20px_rgba(0,255,65,0.15),0_0_40px_rgba(0,255,65,0.05)] hover:bg-[#005520] disabled:opacity-50 flex items-center gap-2">
                                <Zap size={12} className="text-void-black drop-shadow-md" />
                                SUBMIT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
