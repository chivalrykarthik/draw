import { DIAGRAM_TYPE_META } from '../data/templates';
import type { DiagramType, LayoutEngine } from '../types';

interface FooterProps {
    isDark: boolean;
    activeType: DiagramType;
    layoutEngine: LayoutEngine;
    onLayoutChange: (layout: LayoutEngine) => void;
}

export function Footer({ isDark, activeType, layoutEngine, onLayoutChange }: FooterProps) {
    return (
        <footer
            className="flex items-center justify-between px-5 py-1.5 shrink-0"
            style={{
                borderTop: '1px solid var(--theme-border-subtle)',
                background: isDark ? 'rgba(2, 6, 23, 0.8)' : 'rgba(248, 250, 252, 0.8)',
            }}
        >
            <div className="flex items-center gap-3">
                <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
                    D2 WASM • 100% Client-Side
                </span>
                <div className="w-px h-3" style={{ background: 'var(--theme-border)' }} />
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>Layout:</span>
                    <div
                        className="flex items-center gap-0.5 p-0.5 rounded-md"
                        style={{
                            background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                            border: '1px solid var(--theme-border)',
                        }}
                    >
                        {(['elk', 'dagre'] as LayoutEngine[]).map(engine => (
                            <button
                                key={engine}
                                id={`layout-${engine}-btn`}
                                onClick={() => onLayoutChange(engine)}
                                className="px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-200 cursor-pointer"
                                style={{
                                    background: layoutEngine === engine ? 'var(--theme-tab-active-bg)' : 'transparent',
                                    color: layoutEngine === engine ? 'var(--theme-tab-active-text)' : 'var(--theme-text-muted)',
                                    boxShadow: layoutEngine === engine ? '0 1px 2px var(--theme-tab-active-shadow)' : 'none',
                                }}
                                title={engine === 'elk'
                                    ? 'ELK layout engine — better alignment and cleaner edges'
                                    : 'Dagre layout engine — fast hierarchical layouts'
                                }
                            >
                                {engine.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
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
    );
}
