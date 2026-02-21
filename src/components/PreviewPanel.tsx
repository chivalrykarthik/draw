import { useRef, useEffect, useCallback } from 'react';
import { ZoomInIcon, ZoomOutIcon, FitIcon, HexagonIcon } from '../icons/Icons';

interface PreviewPanelProps {
    svg: string;
    isDark: boolean;
    isCompiling: boolean;
    isWasmReady: boolean;
    error: string | null;
    zoom: number;
    pan: { x: number; y: number };
    isPanning: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitView: (containerW: number, containerH: number, contentW: number, contentH: number) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onWheel: (e: React.WheelEvent) => void;
}

export function PreviewPanel({
    svg,
    isDark,
    isCompiling,
    isWasmReady,
    error,
    zoom,
    pan,
    isPanning,
    onZoomIn,
    onZoomOut,
    onFitView,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
}: PreviewPanelProps) {
    const previewRef = useRef<HTMLDivElement>(null);

    /**
     * Extract intrinsic dimensions from the SVG string.
     * Tries width/height attributes first, then falls back to viewBox.
     */
    const getSvgDimensions = useCallback((svgStr: string): { w: number; h: number } | null => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgStr, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (!svgEl) return null;

        // Try explicit width/height attributes
        const w = parseFloat(svgEl.getAttribute('width') || '0');
        const h = parseFloat(svgEl.getAttribute('height') || '0');
        if (w > 0 && h > 0) return { w, h };

        // Fallback to viewBox
        const vb = svgEl.getAttribute('viewBox');
        if (vb) {
            const parts = vb.split(/[\s,]+/).map(Number);
            if (parts.length >= 4 && parts[2] > 0 && parts[3] > 0) {
                return { w: parts[2], h: parts[3] };
            }
        }

        return null;
    }, []);

    /** Trigger fit-to-view using current container & SVG dimensions */
    const doFitToView = useCallback(() => {
        const container = previewRef.current;
        if (!container || !svg) return;
        const dims = getSvgDimensions(svg);
        if (!dims) return;
        onFitView(container.clientWidth, container.clientHeight, dims.w, dims.h);
    }, [svg, getSvgDimensions, onFitView]);

    // Track previous SVG dimensions to detect significant changes
    const prevDimsRef = useRef<{ w: number; h: number } | null>(null);
    const hasInitialFit = useRef(false);

    // Auto-fit ONLY on first SVG render or when dimensions change significantly
    // (e.g., template switch). Normal typing/editing does NOT reset the view.
    useEffect(() => {
        if (!svg) {
            // Reset tracking when SVG is cleared
            hasInitialFit.current = false;
            prevDimsRef.current = null;
            return;
        }

        const dims = getSvgDimensions(svg);
        if (!dims) return;

        const prev = prevDimsRef.current;

        // First render — always fit
        if (!hasInitialFit.current) {
            hasInitialFit.current = true;
            prevDimsRef.current = dims;
            const timer = setTimeout(doFitToView, 50);
            return () => clearTimeout(timer);
        }

        // Significant dimension change (>20% difference) — auto-fit
        // This catches template switches and major structural changes
        if (prev) {
            const wRatio = Math.abs(dims.w - prev.w) / Math.max(prev.w, 1);
            const hRatio = Math.abs(dims.h - prev.h) / Math.max(prev.h, 1);
            if (wRatio > 0.2 || hRatio > 0.2) {
                prevDimsRef.current = dims;
                const timer = setTimeout(doFitToView, 50);
                return () => clearTimeout(timer);
            }
        }

        // Update tracked dimensions without triggering fit
        prevDimsRef.current = dims;
    }, [svg, getSvgDimensions, doFitToView]);

    // Attach wheel handler natively with { passive: false } so preventDefault()
    // actually blocks the browser's default Ctrl+Scroll zoom behavior.
    const wheelHandler = useCallback((e: WheelEvent) => {
        e.preventDefault();
        onWheel(e as unknown as React.WheelEvent);
    }, [onWheel]);

    useEffect(() => {
        const el = previewRef.current;
        if (!el) return;
        el.addEventListener('wheel', wheelHandler, { passive: false });
        return () => el.removeEventListener('wheel', wheelHandler);
    }, [wheelHandler]);

    return (
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
            {/* Preview Toolbar */}
            <div
                className="flex items-center justify-between px-4 py-2"
                style={{
                    borderBottom: '1px solid var(--theme-border)',
                    background: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.5)',
                }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'var(--theme-text-muted)' }}>
                        Preview
                    </span>
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
                        onClick={onZoomOut}
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
                        onClick={onZoomIn}
                        className="p-1.5 rounded-md transition-colors cursor-pointer"
                        style={{ color: 'var(--theme-text-muted)' }}
                        title="Zoom in"
                    >
                        <ZoomInIcon />
                    </button>
                    <button
                        id="fit-btn"
                        onClick={doFitToView}
                        className="p-1.5 rounded-md transition-colors cursor-pointer"
                        style={{ color: 'var(--theme-text-muted)' }}
                        title="Fit diagram to viewport"
                    >
                        <FitIcon />
                    </button>
                </div>
            </div>

            {/* SVG Preview */}
            <div
                ref={previewRef}
                className="flex-1 min-h-0 overflow-hidden svg-preview-container relative"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}

                style={{ cursor: isPanning ? 'grabbing' : 'grab', background: 'var(--theme-bg-alt)' }}
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
                        <div dangerouslySetInnerHTML={{ __html: svg }} />
                    </div>
                ) : !isWasmReady ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
                        <div className="w-12 h-12 border-2 border-brand-400 border-t-transparent rounded-full animate-spin-slow" />
                        <div className="text-center">
                            <p className="text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>Initializing D2 Engine...</p>
                            <p className="text-xs mt-1" style={{ color: 'var(--theme-text-dimmed)' }}>
                                Loading WASM module
                            </p>
                        </div>
                    </div>
                ) : !error && !isCompiling ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center"
                            style={{
                                background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                                border: '1px solid var(--theme-border)',
                            }}
                        >
                            <HexagonIcon size={36} className="opacity-50" />
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
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ background: 'var(--theme-overlay)', backdropFilter: 'blur(1px)' }}
                    >
                        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin-slow" />
                    </div>
                )}
            </div>
        </div>
    );
}
