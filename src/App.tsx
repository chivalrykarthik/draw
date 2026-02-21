import { useState, useEffect, useCallback } from 'react';
import { useTheme } from './context/ThemeContext';
import { useD2 } from './hooks/useD2';
import { usePanZoom } from './hooks/usePanZoom';
import { useResizer } from './hooks/useResizer';
import { DEFAULT_CODE } from './data/templates';
import { Header } from './components/Header';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { Footer } from './components/Footer';
import { HelpModal } from './components/HelpModal';
import type { DiagramType, LayoutEngine } from './types';

const CODE_STORAGE_KEY = 'd2-draw-code';

function loadSavedCode(): string {
  try {
    const saved = localStorage.getItem(CODE_STORAGE_KEY);
    if (saved !== null) return saved;
  } catch { /* noop */ }
  return DEFAULT_CODE;
}

export default function App() {
  const { isDark } = useTheme();

  // ─── App State ───
  const [code, setCode] = useState(loadSavedCode);
  const [activeType, setActiveType] = useState<DiagramType>('flow');
  const [layoutEngine, setLayoutEngine] = useState<LayoutEngine>('elk');
  const [editorWidth, setEditorWidth] = useState(20);
  const [isHelpOpen, setHelpOpen] = useState(false);

  // ─── Hooks ───
  const { svg, error, isCompiling, isWasmReady, compile } = useD2();
  const panZoom = usePanZoom();
  const { handleMouseDown: handleResizerMouseDown } = useResizer(editorWidth, setEditorWidth);

  // Persist code to localStorage on change
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    try { localStorage.setItem(CODE_STORAGE_KEY, newCode); } catch { /* noop */ }
  }, []);

  // Compile on code, theme, or layout change
  useEffect(() => {
    compile(code, isDark, layoutEngine);
  }, [code, isDark, layoutEngine, compile]);

  // ─── Keyboard Shortcuts ───
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+S / Cmd+S — prevent browser save dialog
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      // Escape — close help modal
      if (e.key === 'Escape') {
        setHelpOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--theme-bg)' }}>
      <Header
        activeType={activeType}
        code={code}
        svg={svg}
        isDark={isDark}
        onTypeChange={setActiveType}
        onCodeChange={handleCodeChange}
        onResetView={panZoom.resetView}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <main className="flex-1 flex min-h-0">
        {/* Editor Panel */}
        <div className="flex flex-col min-h-0" style={{ width: `${editorWidth}%` }}>
          <EditorPanel
            code={code}
            isDark={isDark}
            isCompiling={isCompiling}
            error={error}
            svg={svg}
            onCodeChange={handleCodeChange}
          />
        </div>

        {/* Resizer */}
        <div
          className="resizer w-1 shrink-0"
          onMouseDown={handleResizerMouseDown}
        />

        {/* Preview Panel */}
        <PreviewPanel
          svg={svg}
          isDark={isDark}
          isCompiling={isCompiling}
          isWasmReady={isWasmReady}
          error={error}
          zoom={panZoom.zoom}
          pan={panZoom.pan}
          isPanning={panZoom.isPanning}
          onZoomIn={panZoom.zoomIn}
          onZoomOut={panZoom.zoomOut}
          onFitView={panZoom.fitToView}
          onMouseDown={panZoom.handleMouseDown}
          onMouseMove={panZoom.handleMouseMove}
          onMouseUp={panZoom.handleMouseUp}
          onWheel={panZoom.handleWheel}
        />
      </main>

      <Footer
        isDark={isDark}
        activeType={activeType}
        layoutEngine={layoutEngine}
        onLayoutChange={setLayoutEngine}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
