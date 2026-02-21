import { useRef, useEffect, useCallback } from 'react';
import { ZoomInIcon, ZoomOutIcon, FitIcon, HexagonIcon } from '../icons/Icons';

interface PreviewPanelProps {
    svg: string;
    isDark: boolean;
    isCompiling: boolean;
    error: string | null;
    zoom: number;
    pan: { x: number; y: number };
    isPanning: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetView: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onWheel: (e: React.WheelEvent) => void;
}

export function PreviewPanel({
    svg,
    isDark,
    isCompiling,
    error,
    zoom,
    pan,
    isPanning,
    onZoomIn,
    onZoomOut,
    onResetView,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
}: PreviewPanelProps) {
    const previewRef = useRef<HTMLDivElement>(null);

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
                        onClick={onResetView}
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
