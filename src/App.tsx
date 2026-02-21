import { useState, useEffect, useRef } from 'react';
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

export default function App() {
  const { isDark } = useTheme();

  // ─── App State ───
  const [code, setCode] = useState(DEFAULT_CODE);
  const [activeType, setActiveType] = useState<DiagramType>('flow');
  const [layoutEngine, setLayoutEngine] = useState<LayoutEngine>('elk');
  const [editorWidth, setEditorWidth] = useState(20);
  const [isHelpOpen, setHelpOpen] = useState(false);

  // ─── Hooks ───
  const { svg, error, isCompiling, compile } = useD2();
  const panZoom = usePanZoom();
  const { handleMouseDown: handleResizerMouseDown } = useResizer(editorWidth, setEditorWidth);
  const resizerRef = useRef<HTMLDivElement>(null);

  // Compile on code, theme, or layout change
  useEffect(() => {
    compile(code, isDark, layoutEngine);
  }, [code, isDark, layoutEngine, compile]);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--theme-bg)' }}>
      <Header
        activeType={activeType}
        code={code}
        svg={svg}
        isDark={isDark}
        onTypeChange={setActiveType}
        onCodeChange={setCode}
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
            onCodeChange={setCode}
          />
        </div>

        {/* Resizer */}
        <div
          ref={resizerRef}
          className="resizer w-1 shrink-0"
          onMouseDown={handleResizerMouseDown}
        />

        {/* Preview Panel */}
        <PreviewPanel
          svg={svg}
          isDark={isDark}
          isCompiling={isCompiling}
          error={error}
          zoom={panZoom.zoom}
          pan={panZoom.pan}
          isPanning={panZoom.isPanning}
          onZoomIn={panZoom.zoomIn}
          onZoomOut={panZoom.zoomOut}
          onResetView={panZoom.resetView}
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
