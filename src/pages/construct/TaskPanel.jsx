import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { runUserCode, checkVariable } from '../../lib/pyodideManager';

export default function TaskPanel({ lesson, onProceed }) {
    const [code, setCode] = useState(lesson.task.starterCode);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [showHint, setShowHint] = useState(false);

    const handleRunAndCheck = async () => {
        setIsRunning(true);
        setTestResults(null);
        setOutput('Loading WASM runtime...\n');

        // Run Code
        const execResult = await runUserCode(code);
        setOutput(execResult.error || execResult.output);

        if (execResult.error) {
            setIsRunning(false);
            return;
        }

        // Run Tests Assertions using Pyodide environment
        const results = [];
        let allPassed = true;

        for (const test of lesson.task.tests) {
            let passed = false;

            if (test.type === 'var') {
                const val = await checkVariable(test.check);
                // Basic equality check 
                if (Array.isArray(test.expected) && Array.isArray(val)) {
                    passed = JSON.stringify(val) === JSON.stringify(test.expected);
                } else {
                    passed = val === test.expected;
                }
            } else if (test.type === 'output') {
                passed = execResult.output.includes(test.check);
            }

            if (!passed) allPassed = false;
            results.push({ ...test, passed });
        }

        setTestResults({ allPassed, results });
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col w-full h-full">

            <div className="flex flex-1 h-[60%] border-b border-subtle-line">

                {/* Zone 1: Instruction Card */}
                <div className="w-1/3 h-full p-6 bg-surface overflow-y-auto border-r border-subtle-line relative">
                    <h3 className="font-display text-accent-secondary mb-4 tracking-widest text-lg">MISSION OBJECTIVE</h3>
                    <p className="text-white text-lg leading-relaxed mb-6 font-ui">
                        {lesson.task.instruction}
                    </p>

                    {!showHint ? (
                        <button
                            onClick={() => setShowHint(true)}
                            className="text-muted-text hover:text-white border-b border-muted-text text-sm transition-colors"
                        >
                            Request Hint
                        </button>
                    ) : (
                        <div className="mt-4 p-4 border border-med-diff/50 bg-med-diff/10 text-med-diff rounded">
                            <strong>HINT:</strong> {lesson.task.tests[0].hint}
                        </div>
                    )}
                </div>

                {/* Zone 2: Editor */}
                <div className="w-2/3 h-full flex flex-col">
                    <div className="px-4 py-2 border-b border-subtle-line bg-editor-dark flex justify-between items-center text-xs text-muted-text tracking-widest font-display">
                        <span>TERMINAL ROOT // {lesson.id}.py</span>
                    </div>
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 16,
                                fontFamily: '"Share Tech Mono", monospace',
                                padding: { top: 16 }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Zone 3: Runner & Test Output */}
            <div className="h-[40%] flex min-h-0 bg-void-black">

                {/* Actions & Console */}
                <div className="w-2/3 flex flex-col border-r border-subtle-line">
                    <div className="flex bg-surface p-2 gap-4 border-b border-subtle-line">
                        <button
                            onClick={handleRunAndCheck}
                            disabled={isRunning}
                            className="flex-1 bg-accent-primary text-black font-display font-bold py-2 hover:bg-white transition-all text-center tracking-widest"
                        >
                            {isRunning ? 'COMPILING...' : 'RUN & CHECK ANSWER'}
                        </button>
                    </div>

                    <div className="flex-1 p-4 font-vt text-lg overflow-y-auto">
                        <h4 className="text-accent-secondary mb-1">STDOUT:</h4>
                        <pre className="text-white font-vt whitespace-pre-wrap m-0">{output}</pre>
                    </div>
                </div>

                {/* Test Results */}
                <div className="w-1/3 p-6 flex flex-col overflow-y-auto">
                    <h4 className="font-display tracking-widest text-muted-text mb-4">SYSTEM ASSERTIONS</h4>

                    {!testResults ? (
                        <div className="text-muted-text text-sm">Awaiting execution run...</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {testResults.results.map((t, i) => (
                                <div key={i} className={"p-3 border rounded font-code text-sm " + (t.passed ? 'border-success-verd bg-success-verd/10 text-success-verd' : 'border-fail-verd bg-fail-verd/10 text-fail-verd')}>
                                    {t.passed ? '✓ SUCCESS:' : '✗ FAILED:'} Check against target data structure
                                </div>
                            ))}
                        </div>
                    )}

                    {testResults?.allPassed && (
                        <div className="mt-auto pt-6 text-center animate-pulseGlow mb-2">
                            <button
                                onClick={onProceed}
                                className="w-full py-4 border border-accent-primary text-accent-primary font-bold tracking-widest hover:bg-accent-primary hover:text-black transition-all shadow-[0_0_15px_var(--theme-accent-primary)]"
                            >
                                TESTS PASSED // PROCEED ▶
                            </button>
                        </div>
                    )}
                </div>

            </div>

        </div >
    );
}
