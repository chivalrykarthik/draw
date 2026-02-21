import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { registerD2Language } from '../utils/d2Language';
import type { Monaco } from '@monaco-editor/react';

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
    const [isDragging, setIsDragging] = useState(false);

    const handleEditorMount = useCallback((_editor: unknown, monaco: Monaco) => {
        registerD2Language(monaco);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result;
            if (typeof text === 'string') onCodeChange(text);
        };
        reader.readAsText(file);
    }, [onCodeChange]);

    return (
        <div
            className="flex flex-col min-h-0 h-full relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
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
                    defaultLanguage="d2"
                    language="d2"
                    value={code}
                    onChange={(val) => onCodeChange(val || '')}
                    theme={isDark ? 'd2-dark' : 'd2-light'}
                    onMount={handleEditorMount}
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
                        quickSuggestions: true,
                        suggestOnTriggerCharacters: true,
                    }}
                />
            </div>

            {/* Drag & Drop Overlay */}
            {isDragging && (
                <div
                    className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in"
                    style={{
                        background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(241, 245, 249, 0.9)',
                        border: '2px dashed var(--color-brand-500)',
                        borderRadius: '8px',
                    }}
                >
                    <div className="text-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3" style={{ color: 'var(--color-brand-400)' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p className="text-sm font-medium" style={{ color: 'var(--theme-text-primary)' }}>Drop .d2 file here</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--theme-text-muted)' }}>File contents will replace the editor</p>
                    </div>
                </div>
            )}

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
