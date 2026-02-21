import { useCallback, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useDropdown } from '../hooks/useDropdown';
import { templates, DIAGRAM_TYPE_META, DEFAULT_CODE } from '../data/templates';
import { downloadSVG, downloadPNG } from '../utils/exportUtils';
import {
    FlowIcon, SequenceIcon, ArchitectureIcon,
    DownloadIcon, ChevronIcon, SunIcon, MoonIcon, HelpIcon,
    DIAGRAM_TYPE_ICONS,
} from '../icons/Icons';
import type { DiagramType } from '../types';

interface HeaderProps {
    activeType: DiagramType;
    code: string;
    svg: string;
    isDark: boolean;
    onTypeChange: (type: DiagramType) => void;
    onCodeChange: (code: string) => void;
    onResetView: () => void;
    onOpenHelp: () => void;
}

export function Header({
    activeType,
    code,
    svg,
    isDark,
    onTypeChange,
    onCodeChange,
    onResetView,
    onOpenHelp,
}: HeaderProps) {
    const { toggleTheme } = useTheme();
    const templateDropdown = useDropdown();
    const exportDropdown = useDropdown();
    const [isExporting, setIsExporting] = useState(false);

    const switchDiagramType = useCallback((type: DiagramType) => {
        const firstTemplate = templates.find(t => t.type === type);
        if (firstTemplate) {
            onCodeChange(firstTemplate.code);
        }
        onTypeChange(type);
        onResetView();
    }, [onCodeChange, onTypeChange, onResetView]);

    const loadTemplate = useCallback((templateId: string) => {
        const t = templates.find(t => t.id === templateId);
        if (t) {
            onCodeChange(t.code);
            onTypeChange(t.type);
            templateDropdown.close();
            onResetView();
        }
    }, [onCodeChange, onTypeChange, onResetView, templateDropdown]);

    const handleExportSVG = useCallback(async () => {
        if (!svg) return;
        setIsExporting(true);
        try { downloadSVG(svg, 'd2-diagram'); } catch { /* noop */ }
        setIsExporting(false);
        exportDropdown.close();
    }, [svg, exportDropdown]);

    const handleExportPNG = useCallback(async () => {
        if (!svg) return;
        setIsExporting(true);
        try { await downloadPNG(svg, 'd2-diagram', 2, isDark); } catch { /* noop */ }
        setIsExporting(false);
        exportDropdown.close();
    }, [svg, isDark, exportDropdown]);

    return (
        <header className="glass flex items-center justify-between px-5 py-3 relative z-[100] shrink-0">
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
                        const Icon = DIAGRAM_TYPE_ICONS[type];
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
                                    boxShadow: isActive ? '0 1px 2px var(--theme-tab-active-shadow)' : 'none',
                                }}
                            >
                                <Icon />
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
                    onClick={onOpenHelp}
                    className="p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 mr-1"
                    title="Quick Help & Cheat Sheet"
                    style={{ color: 'var(--theme-text-muted)' }}
                >
                    <HelpIcon />
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
                <div className="relative" ref={templateDropdown.ref}>
                    <button
                        id="template-dropdown-btn"
                        onClick={templateDropdown.toggle}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                        style={{
                            background: 'var(--theme-template-btn-bg)',
                            border: '1px solid var(--theme-template-btn-border)',
                            color: 'var(--theme-text-secondary)',
                        }}
                    >
                        <span>Templates</span>
                        <ChevronIcon open={templateDropdown.isOpen} />
                    </button>
                    {templateDropdown.isOpen && (
                        <div
                            className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-[100] animate-fade-in"
                            style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', opacity: 1, backdropFilter: 'none', border: '1px solid var(--theme-border)', boxShadow: '0 25px 50px -12px var(--theme-shadow-color)' }}
                        >
                            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--theme-border)' }}>
                                <p className="text-xs font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>Pre-built Templates</p>
                                <p className="text-[10px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>Click to load a template into the editor</p>
                            </div>
                            <div className="p-2 max-h-72 overflow-y-auto">
                                {templates.map(t => {
                                    const meta = DIAGRAM_TYPE_META[t.type];
                                    const Icon = DIAGRAM_TYPE_ICONS[t.type];
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
                <div className="relative" ref={exportDropdown.ref}>
                    <button
                        id="export-dropdown-btn"
                        onClick={exportDropdown.toggle}
                        disabled={!svg || isExporting}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium
              bg-gradient-to-r from-brand-600 to-brand-700 text-white
              hover:from-brand-500 hover:to-brand-600
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-lg shadow-brand-500/20 transition-all duration-200 cursor-pointer"
                    >
                        <DownloadIcon />
                        <span>{isExporting ? 'Exporting...' : 'Download'}</span>
                        <ChevronIcon open={exportDropdown.isOpen} className="text-brand-200" />
                    </button>
                    {exportDropdown.isOpen && (
                        <div
                            className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-[100] animate-fade-in"
                            style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', opacity: 1, backdropFilter: 'none', border: '1px solid var(--theme-border)', boxShadow: '0 25px 50px -12px var(--theme-shadow-color)' }}
                        >
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
    );
}
