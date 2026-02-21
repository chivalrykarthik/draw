import Editor from '@monaco-editor/react';

interface EditorPanelProps {
    code: string;
    isDark: boolean;
    isCompiling: boolean;
    error: string | null;
    svg: string;
    onCodeChange: (code: string) => void;
}

export function EditorPanel({ code, isDark, isCompiling, error, svg, onCodeChange }: EditorPanelProps) {
    const statusText = isCompiling ? 'Compiling...' : error ? 'Error' : svg ? 'Ready' : 'Empty';
    const statusClass = isCompiling ? 'loading' : error ? 'error' : 'success';

    return (
        <div className="flex flex-col min-h-0 h-full">
            {/* Editor Toolbar */}
            <div
                className="flex items-center justify-between px-4 py-2"
                style={{
                    borderBottom: '1px solid var(--theme-border)',
                    background: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.5)',
                }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'var(--theme-text-muted)' }}>
                        D2 Editor
                    </span>
                    <div className="w-px h-3" style={{ background: 'var(--theme-border)' }} />
                    <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
                        {code.split('\n').length} lines
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`status-dot ${statusClass}`} />
                    <span className={`text-[10px] font-medium ${statusClass === 'error' ? 'text-accent-rose' :
                            statusClass === 'loading' ? 'text-accent-amber' :
                                'text-accent-emerald'
                        }`}>
                        {statusText}
                    </span>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
                <Editor
                    height="100%"
                    defaultLanguage="plaintext"
                    value={code}
                    onChange={(val) => onCodeChange(val || '')}
                    theme={isDark ? 'vs-dark' : 'light'}
                    options={{
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontLigatures: true,
                        lineNumbers: 'on',
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorSmoothCaretAnimation: 'on',
                        cursorBlinking: 'smooth',
                        padding: { top: 16, bottom: 16 },
                        renderLineHighlight: 'line',
                        renderWhitespace: 'none',
                        wordWrap: 'on',
                        automaticLayout: true,
                        bracketPairColorization: { enabled: true },
                        guides: { bracketPairs: true },
                        scrollbar: {
                            verticalScrollbarSize: 6,
                            horizontalScrollbarSize: 6,
                        },
                    }}
                />
            </div>

            {/* Error panel */}
            {error && (
                <div className="px-4 py-3 bg-accent-rose/5 border-t border-accent-rose/20 animate-fade-in">
                    <div className="flex items-start gap-2">
                        <span className="text-accent-rose text-sm mt-0.5">⚠</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-accent-rose uppercase tracking-wider">Compilation Error</p>
                            <pre className="text-xs text-accent-rose/80 mt-1 font-mono whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                                {error}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
