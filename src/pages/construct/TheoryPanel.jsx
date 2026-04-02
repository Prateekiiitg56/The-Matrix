import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import { runUserCode } from '../../lib/pyodideManager';

export default function TheoryPanel({ lesson, onProceed }) {
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleRunExample = async () => {
        setIsRunning(true);
        setOutput('Loading runtime...\n');
        const result = await runUserCode(lesson.codeExample);
        if (result.error) {
            setOutput(result.error);
        } else {
            setOutput(result.output);
        }
        setIsRunning(false);
    };

    return (
        <div className="flex w-full h-full text-body-text">

            {/* Left side: Theory Markdown */}
            <div className="w-1/2 h-full overflow-y-auto p-8 border-r border-subtle-line pb-24 relative">
                <h2 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-widest">{lesson.title}</h2>
                <div className="prose prose-invert prose-p:text-muted-text prose-headings:text-accent-primary max-w-none">
                    <ReactMarkdown>{lesson.theory}</ReactMarkdown>
                </div>

                {/* Proceed Button */}
                <div className="absolute bottom-8 right-8">
                    <button
                        onClick={onProceed}
                        className="flex items-center gap-2 bg-accent-primary text-black px-6 py-3 font-display font-bold hover:bg-white transition-all shadow-[0_0_15px_var(--theme-accent-primary)] hover:shadow-[0_0_25px_var(--theme-accent-primary)]"
                    >
                        UNDERSTOOD <span className="text-xl">▶</span>
                    </button>
                </div>
            </div>

            {/* Right side: Live Code Viewer */}
            <div className="w-1/2 h-full flex flex-col p-6 bg-editor-dark">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-muted-text tracking-widest text-sm">LIVE EXAMPLE // READ-ONLY</h3>
                    <button
                        onClick={handleRunExample}
                        disabled={isRunning}
                        className="border border-accent-secondary text-accent-secondary hover:bg-accent-secondary/10 px-4 py-1 text-sm tracking-widest transition-all"
                    >
                        {isRunning ? 'EXECUTING...' : 'RUN EXAMPLE ▶'}
                    </button>
                </div>

                {/* Editor */}
                <div className="flex-1 rounded-md overflow-hidden border border-subtle-line mb-4 shrink-0 max-h-[300px]">
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        value={lesson.codeExample}
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: '"Share Tech Mono", monospace',
                            scrollBeyondLastLine: false,
                        }}
                    />
                </div>

                {/* Terminal Output */}
                <h3 className="font-display text-muted-text tracking-widest text-sm mb-2 mt-2">CONSOLE OUTPUT</h3>
                <div className="flex-1 rounded-md border border-subtle-line bg-void-black p-4 overflow-y-auto font-vt text-lg text-white">
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
                </div>

            </div>

        </div>
    );
}
