import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useD2 } from './useD2';
import type { DiagramType } from './templates';
import { templates, DEFAULT_CODE, DIAGRAM_TYPE_META } from './templates';
import { downloadSVG, downloadPNG } from './exportUtils';
import { useTheme } from './ThemeContext';
import { HelpModal } from './HelpModal';

// ─── Icon Components ───
function FlowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function SequenceIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V4" /><path d="m5 11 7-7 7 7" /><path d="M5 20h14" />
    </svg>
  );
}

function ArchitectureIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function DownloadIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronIcon({ className = '', open }: { className?: string; open: boolean }) {
  return (
    <svg className={`${className} transition-transform duration-200 ${open ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ZoomInIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
  );
}

function ZoomOutIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
  );
}

function FitIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
  );
}

// Theme toggle icons
function SunIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const TYPE_ICONS: Record<DiagramType, typeof FlowIcon> = {
  flow: FlowIcon,
  sequence: SequenceIcon,
  architecture: ArchitectureIcon,
};

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [activeType, setActiveType] = useState<DiagramType>('flow');
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  const { svg, error, isCompiling, compile } = useD2();
  const resizerRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Compile on code or theme change
  useEffect(() => {
    compile(code, isDark);
  }, [code, isDark, compile]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(e.target as Node)) {
        setTemplateDropdownOpen(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setExportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Resizer
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = editorWidth;

    function onMove(ev: MouseEvent) {
      const delta = ev.clientX - startX;
      const containerWidth = window.innerWidth;
      const newWidth = startWidth + (delta / containerWidth) * 100;
      setEditorWidth(Math.max(20, Math.min(80, newWidth)));
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [editorWidth]);

  // Pan
  const handlePreviewMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 0) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    }
  }, [pan]);

  const handlePreviewMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
  }, [isPanning]);

  const handlePreviewMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.max(0.1, Math.min(5, z + delta)));
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Switch diagram type — loads the first template for that type
  const switchDiagramType = useCallback((type: DiagramType) => {
    const firstTemplate = templates.find(t => t.type === type);
    if (firstTemplate) {
      setCode(firstTemplate.code);
    }
    setActiveType(type);
    resetView();
  }, [resetView]);

  const loadTemplate = useCallback((templateId: string) => {
    const t = templates.find(t => t.id === templateId);
    if (t) {
      setCode(t.code);
      setActiveType(t.type);
      setTemplateDropdownOpen(false);
      resetView();
    }
  }, [resetView]);

  // Export handlers
  const handleExportSVG = useCallback(async () => {
    if (!svg) return;
    setIsExporting(true);
    try {
      downloadSVG(svg, 'd2-diagram');
    } catch { /* noop */ }
    setIsExporting(false);
    setExportDropdownOpen(false);
  }, [svg]);

  const handleExportPNG = useCallback(async () => {
    if (!svg) return;
    setIsExporting(true);
    try {
      await downloadPNG(svg, 'd2-diagram', 2, isDark);
    } catch { /* noop */ }
    setIsExporting(false);
    setExportDropdownOpen(false);
  }, [svg, isDark]);

  // Status indicator
  const statusText = isCompiling ? 'Compiling...' : error ? 'Error' : svg ? 'Ready' : 'Empty';
  const statusClass = isCompiling ? 'loading' : error ? 'error' : 'success';

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--theme-bg)' }}
    >
      {/* ─── Header ─── */}
      <header className="glass flex items-center justify-between px-5 py-3 z-50 shrink-0">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight" style={{ color: 'var(--theme-text-primary)' }}>
                D2 <span className="text-brand-400">Draw</span>
              </h1>
              <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: 'var(--theme-text-muted)' }}>Diagram Studio</p>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-8" style={{ background: 'var(--theme-border)' }} />

          {/* Type Tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'var(--theme-tabs-bg)' }}>
            {(Object.keys(DIAGRAM_TYPE_META) as DiagramType[]).map(type => {
              const meta = DIAGRAM_TYPE_META[type];
              const Icon = TYPE_ICONS[type];
              const isActive = activeType === type;
              return (
                <button
                  key={type}
                  id={`tab-${type}`}
                  onClick={() => switchDiagramType(type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive ? 'var(--theme-tab-active-bg)' : 'transparent',
                    color: isActive ? 'var(--theme-tab-active-text)' : 'var(--theme-text-muted)',
                    boxShadow: isActive ? `0 1px 2px var(--theme-tab-active-shadow)` : 'none',
                  }}
                >
                  <Icon className={isActive ? '' : ''} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Help Button */}
          <button
            id="help-btn"
            onClick={() => setHelpOpen(true)}
            className="p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 mr-1"
            title="Quick Help & Cheat Sheet"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle"
            className="theme-toggle no-theme-transition"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <div className="track" />
            <div className="stars">
              <span className="star" style={{ top: '6px', right: '10px' }} />
              <span className="star" style={{ top: '14px', right: '16px' }} />
              <span className="star" style={{ top: '8px', right: '22px' }} />
            </div>
            <div className="thumb" style={{ color: isDark ? '#e0e7ff' : '#78350f' }}>
              {isDark ? <MoonIcon /> : <SunIcon />}
            </div>
          </button>

          {/* Separator */}
          <div className="w-px h-6" style={{ background: 'var(--theme-border)' }} />

          {/* Template Dropdown */}
          <div className="relative" ref={templateDropdownRef}>
            <button
              id="template-dropdown-btn"
              onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: 'var(--theme-template-btn-bg)',
                border: `1px solid var(--theme-template-btn-border)`,
                color: 'var(--theme-text-secondary)',
              }}
            >
              <span>Templates</span>
              <ChevronIcon open={templateDropdownOpen} />
            </button>
            {templateDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl glass-light overflow-hidden z-50 animate-fade-in" style={{ boxShadow: `0 25px 50px -12px var(--theme-shadow-color)` }}>
                <div className="px-4 py-3" style={{ borderBottom: `1px solid var(--theme-border)` }}>
                  <p className="text-xs font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>Pre-built Templates</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>Click to load a template into the editor</p>
                </div>
                <div className="p-2 max-h-72 overflow-y-auto">
                  {templates.map(t => {
                    const meta = DIAGRAM_TYPE_META[t.type];
                    const Icon = TYPE_ICONS[t.type];
                    return (
                      <button
                        key={t.id}
                        id={`template-${t.id}`}
                        onClick={() => loadTemplate(t.id)}
                        className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group cursor-pointer"
                        style={{ background: 'transparent' }}
                        onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`${meta.color} opacity-70 group-hover:opacity-100`} />
                          <span className="text-xs font-medium group-hover:text-brand-500" style={{ color: 'var(--theme-text-secondary)' }}>
                            {t.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${meta.color} ml-auto`} style={{ background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)' }}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-[10px] mt-1 ml-6" style={{ color: 'var(--theme-text-muted)' }}>{t.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              id="export-dropdown-btn"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              disabled={!svg || isExporting}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium
                bg-gradient-to-r from-brand-600 to-brand-700 text-white
                hover:from-brand-500 hover:to-brand-600
                disabled:opacity-40 disabled:cursor-not-allowed
                shadow-lg shadow-brand-500/20 transition-all duration-200 cursor-pointer"
            >
              <DownloadIcon />
              <span>{isExporting ? 'Exporting...' : 'Download'}</span>
              <ChevronIcon open={exportDropdownOpen} className="text-brand-200" />
            </button>
            {exportDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl glass-light overflow-hidden z-50 animate-fade-in" style={{ boxShadow: `0 25px 50px -12px var(--theme-shadow-color)` }}>
                <div className="p-2">
                  <button
                    id="export-svg-btn"
                    onClick={handleExportSVG}
                    className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group cursor-pointer"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-accent-cyan/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-accent-cyan">SVG</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium group-hover:text-brand-500" style={{ color: 'var(--theme-text-secondary)' }}>Export as SVG</p>
                        <p className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>Vector format, scalable</p>
                      </div>
                    </div>
                  </button>
                  <button
                    id="export-png-btn"
                    onClick={handleExportPNG}
                    className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group cursor-pointer"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-accent-emerald/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-accent-emerald">PNG</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium group-hover:text-brand-500" style={{ color: 'var(--theme-text-secondary)' }}>Export as PNG</p>
                        <p className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>High-res (2x scale)</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex min-h-0">
        {/* ─── Editor Panel ─── */}
        <div className="flex flex-col min-h-0" style={{ width: `${editorWidth}%` }}>
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: `1px solid var(--theme-border)`, background: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.5)' }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'var(--theme-text-muted)' }}>D2 Editor</span>
              <div className="w-px h-3" style={{ background: 'var(--theme-border)' }} />
              <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>{code.split('\n').length} lines</span>
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
              onChange={(val) => setCode(val || '')}
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

        {/* ─── Resizer ─── */}
        <div
          ref={resizerRef}
          className="resizer w-1 shrink-0"
          onMouseDown={handleMouseDown}
        />

        {/* ─── Preview Panel ─── */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: `1px solid var(--theme-border)`, background: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.5)' }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'var(--theme-text-muted)' }}>Preview</span>
              {isCompiling && (
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full animate-spin-slow" />
                  <span className="text-[10px] text-brand-400">Rendering...</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                id="zoom-out-btn"
                onClick={() => setZoom(z => Math.max(0.1, z - 0.2))}
                className="p-1.5 rounded-md transition-colors cursor-pointer"
                style={{ color: 'var(--theme-text-muted)' }}
                title="Zoom out"
              >
                <ZoomOutIcon />
              </button>
              <span className="text-[10px] font-mono w-10 text-center" style={{ color: 'var(--theme-text-muted)' }}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                id="zoom-in-btn"
                onClick={() => setZoom(z => Math.min(5, z + 0.2))}
                className="p-1.5 rounded-md transition-colors cursor-pointer"
                style={{ color: 'var(--theme-text-muted)' }}
                title="Zoom in"
              >
                <ZoomInIcon />
              </button>
              <button
                id="fit-btn"
                onClick={resetView}
                className="p-1.5 rounded-md transition-colors cursor-pointer"
                style={{ color: 'var(--theme-text-muted)' }}
                title="Reset view"
              >
                <FitIcon />
              </button>
            </div>
          </div>

          {/* SVG Preview */}
          <div
            ref={previewRef}
            className="flex-1 min-h-0 overflow-auto svg-preview-container relative"
            onMouseDown={handlePreviewMouseDown}
            onMouseMove={handlePreviewMouseMove}
            onMouseUp={handlePreviewMouseUp}
            onMouseLeave={handlePreviewMouseUp}
            onWheel={handleWheel}
            style={{ cursor: isPanning ? 'grabbing' : 'grab', background: isDark ? 'var(--theme-bg-alt)' : 'var(--theme-bg-alt)' }}
          >
            {svg ? (
              <div
                className="p-4"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'top left',
                  transition: isPanning ? 'none' : 'transform 0.15s ease-out',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>
            ) : !error && !isCompiling ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)', border: `1px solid var(--theme-border)` }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--theme-text-muted)' }}>
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                    <line x1="12" y1="22" x2="12" y2="15.5" />
                    <polyline points="22 8.5 12 15.5 2 8.5" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>No Diagram Yet</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--theme-text-dimmed)' }}>
                    Write D2 code or select a template to get started
                  </p>
                </div>
              </div>
            ) : null}

            {/* Loading overlay */}
            {isCompiling && svg && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ background: 'var(--theme-overlay)', backdropFilter: 'blur(1px)' }}>
                <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin-slow" />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="flex items-center justify-between px-5 py-1.5 shrink-0" style={{ borderTop: `1px solid var(--theme-border-subtle)`, background: isDark ? 'rgba(2, 6, 23, 0.8)' : 'rgba(248, 250, 252, 0.8)' }}>
        <div className="flex items-center gap-3">
          <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
            D2 WASM • 100% Client-Side
          </span>
          <div className="w-px h-3" style={{ background: 'var(--theme-border)' }} />
          <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
            Layout: Dagre
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
            Theme: {isDark ? 'Dark' : 'Light'}
          </span>
          <div className="w-px h-3" style={{ background: 'var(--theme-border)' }} />
          <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
            Active: {DIAGRAM_TYPE_META[activeType].label}
          </span>
        </div>
      </footer>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
