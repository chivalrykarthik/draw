import { useCallback, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useDropdown } from '../hooks/useDropdown';
import { templates, DIAGRAM_TYPE_META } from '../data/templates';
import { downloadSVG, downloadPNG } from '../utils/exportUtils';
import { downloadMermaid, downloadPlantUML } from '../utils/d2Converter';
import {
    DownloadIcon, ChevronIcon, SunIcon, MoonIcon, HelpIcon,
    DIAGRAM_TYPE_ICONS,
} from '../icons/Icons';
import type { DiagramType } from '../types';

interface HeaderProps {
    activeType: DiagramType;
    svg: string;
    isDark: boolean;
    code: string;
    onTypeChange: (type: DiagramType) => void;
    onCodeChange: (code: string) => void;
    onResetView: () => void;
    onOpenHelp: () => void;
}

export function Header({
    activeType,
    svg,
    isDark,
    code,
    onTypeChange,
    onCodeChange,
    onResetView,
    onOpenHelp,
}: HeaderProps) {
    const { toggleTheme } = useTheme();
    const templateDropdown = useDropdown();
    const exportDropdown = useDropdown();
    const [isExporting, setIsExporting] = useState(false);
    const [templateSearch, setTemplateSearch] = useState('');
    const [copyFeedback, setCopyFeedback] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter templates by search query
    const filteredTemplates = templateSearch.trim()
        ? templates.filter(t =>
            t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
            t.description.toLowerCase().includes(templateSearch.toLowerCase())
        )
        : templates;

    const switchDiagramType = useCallback((type: DiagramType) => {
        if (type === activeType) return;
        const firstTemplate = templates.find(t => t.type === type);
        if (firstTemplate) {
            if (!confirm('Switching diagram type will replace your current code with a template. Continue?')) return;
            onCodeChange(firstTemplate.code);
        }
        onTypeChange(type);
        onResetView();
    }, [activeType, onCodeChange, onTypeChange, onResetView]);

    const loadTemplate = useCallback((templateId: string) => {
        const t = templates.find(t => t.id === templateId);
        if (t) {
            if (!confirm(`Load template "${t.name}"? This will replace your current code.`)) return;
            onCodeChange(t.code);
            onTypeChange(t.type);
            templateDropdown.close();
            onResetView();
        }
    }, [onCodeChange, onTypeChange, onResetView, templateDropdown]);

    const handleExportSVG = useCallback(async () => {
        if (!svg) return;
        setIsExporting(true);
        try {
            downloadSVG(svg, 'd2-diagram');
        } catch (err) {
            alert(`SVG export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        setIsExporting(false);
        exportDropdown.close();
    }, [svg, exportDropdown]);

    const handleExportPNG = useCallback(async () => {
        if (!svg) return;
        setIsExporting(true);
        try {
            await downloadPNG(svg, 'd2-diagram', 2, isDark);
        } catch (err) {
            alert(`PNG export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        setIsExporting(false);
        exportDropdown.close();
    }, [svg, isDark, exportDropdown]);

    const handleExportMermaid = useCallback(() => {
        if (!code) return;
        try {
            downloadMermaid(code, 'd2-diagram');
        } catch (err) {
            alert(`Mermaid export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        exportDropdown.close();
    }, [code, exportDropdown]);

    const handleExportPlantUML = useCallback(() => {
        if (!code) return;
        try {
            downloadPlantUML(code, 'd2-diagram');
        } catch (err) {
            alert(`PlantUML export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        exportDropdown.close();
    }, [code, exportDropdown]);

    const handleCopyCode = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopyFeedback(true);
            setTimeout(() => setCopyFeedback(false), 2000);
        } catch { /* noop */ }
    }, [code]);

    const handleImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result;
            if (typeof text === 'string') {
                onCodeChange(text);
            }
        };
        reader.readAsText(file);
        // Reset input so same file can be re-imported
        e.target.value = '';
    }, [onCodeChange]);

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
                {/* Copy Code */}
                <button
                    id="copy-code-btn"
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    title={copyFeedback ? 'Copied!' : 'Copy D2 code to clipboard'}
                    style={{ color: copyFeedback ? 'var(--color-accent-emerald)' : 'var(--theme-text-muted)' }}
                >
                    {copyFeedback ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    )}
                </button>

                {/* Import File */}
                <button
                    id="import-file-btn"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    title="Import .d2 file"
                    style={{ color: 'var(--theme-text-muted)' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".d2,.txt"
                    onChange={handleImportFile}
                    className="hidden"
                />

                {/* Help Button */}
                <button
                    id="help-btn"
                    onClick={onOpenHelp}
                    className="p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10"
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
                        onClick={() => { templateDropdown.toggle(); setTemplateSearch(''); }}
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
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={templateSearch}
                                    onChange={e => setTemplateSearch(e.target.value)}
                                    autoFocus
                                    className="w-full mt-2 px-2.5 py-1.5 rounded-md text-xs outline-none"
                                    style={{
                                        background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                                        border: '1px solid var(--theme-border)',
                                        color: 'var(--theme-text-primary)',
                                    }}
                                />
                            </div>
                            <div className="p-2 max-h-72 overflow-y-auto">
                                {filteredTemplates.length === 0 ? (
                                    <p className="text-center text-[10px] py-4" style={{ color: 'var(--theme-text-muted)' }}>No templates match "{templateSearch}"</p>
                                ) : filteredTemplates.map(t => {
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
                                <p className="px-3 pt-1 pb-2 text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>Image Formats</p>
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

                                {/* Divider */}
                                <div className="my-1.5 mx-3" style={{ borderTop: '1px solid var(--theme-border)' }} />

                                <p className="px-3 pt-1 pb-2 text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>Code Formats</p>
                                <button
                                    id="export-mermaid-btn"
                                    onClick={handleExportMermaid}
                                    className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group cursor-pointer"
                                    style={{ background: 'transparent' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.06)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.08)' }}>
                                            <span className="text-[8px] font-bold" style={{ color: '#a855f7' }}>MMD</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium group-hover:text-brand-500" style={{ color: 'var(--theme-text-secondary)' }}>Export as Mermaid</p>
                                            <p className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>Flowchart (.mmd)</p>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    id="export-plantuml-btn"
                                    onClick={handleExportPlantUML}
                                    className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group cursor-pointer"
                                    style={{ background: 'transparent' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.06)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: isDark ? 'rgba(244, 114, 182, 0.1)' : 'rgba(244, 114, 182, 0.08)' }}>
                                            <span className="text-[8px] font-bold" style={{ color: '#f472b6' }}>UML</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium group-hover:text-brand-500" style={{ color: 'var(--theme-text-secondary)' }}>Export as PlantUML</p>
                                            <p className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>Component diagram (.puml)</p>
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
