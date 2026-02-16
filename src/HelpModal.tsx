import { useState } from 'react';
import { useTheme } from './ThemeContext';
import { GENERAL_PROPERTIES, STYLE_PROPERTIES, SHAPES_LIST, CHEAT_SHEETS } from './helpData';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'reference' | 'shapes' | 'styling' | 'cheatsheet';

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<Tab>('reference');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-scale-in"
                style={{
                    background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: 'var(--theme-border)',
                    color: 'var(--theme-text-primary)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
                    <div>
                        <h2 className="text-xl font-bold">Quick Help & Documentation</h2>
                        <p className="text-xs mt-1 opacity-70">Reference guide for D2 syntax and properties</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                        style={{ color: 'var(--theme-text-muted)' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b" style={{ borderColor: 'var(--theme-border)', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
                    {[
                        { id: 'reference', label: 'General Properties' },
                        { id: 'styling', label: 'Styling' },
                        { id: 'shapes', label: 'Shapes' },
                        { id: 'cheatsheet', label: 'Cheat Sheet' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-brand-500 text-brand-500'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

                    {/* Reference Tab */}
                    {activeTab === 'reference' && (
                        <div className="space-y-6">
                            <div className="grid gap-4">
                                {GENERAL_PROPERTIES.map((prop) => (
                                    <div key={prop.name} className="p-4 rounded-lg border" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-bg-alt)' }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-bold text-brand-500">{prop.name}</code>
                                        </div>
                                        <p className="text-sm mb-3 opacity-80">{prop.description}</p>
                                        <div className="bg-black/5 dark:bg-black/30 p-2 rounded text-xs font-mono overflow-x-auto">
                                            {prop.example}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Styling Tab */}
                    {activeTab === 'styling' && (
                        <div className="space-y-6">
                            <div className="grid gap-4">
                                {STYLE_PROPERTIES.map((prop) => (
                                    <div key={prop.name} className="p-4 rounded-lg border" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-bg-alt)' }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-bold text-accent-cyan">{prop.name}</code>
                                        </div>
                                        <p className="text-sm mb-3 opacity-80">{prop.description}</p>
                                        <div className="bg-black/5 dark:bg-black/30 p-2 rounded text-xs font-mono overflow-x-auto">
                                            {prop.example}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Shapes Tab */}
                    {activeTab === 'shapes' && (
                        <div>
                            <p className="text-sm mb-4 opacity-70">
                                Use <code className="bg-black/10 dark:bg-white/10 px-1 rounded">shape: name</code> to define the shape of an object.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {SHAPES_LIST.map((shape) => (
                                    <div
                                        key={shape.name}
                                        className="p-3 rounded-lg border text-center transition-colors hover:border-brand-500 flex flex-col items-center justify-center gap-1"
                                        style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-bg-alt)' }}
                                    >
                                        <code className="text-sm font-bold text-brand-500 bg-black/5 dark:bg-white/5 px-1.5 rounded">{shape.name}</code>
                                        <p className="text-[10px] opacity-70 leading-tight">{shape.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cheat Sheet Tab */}
                    {activeTab === 'cheatsheet' && (
                        <div className="grid gap-6 md:grid-cols-2">
                            {CHEAT_SHEETS.map((sheet) => (
                                <div key={sheet.title} className="p-4 rounded-lg border" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-bg-alt)' }}>
                                    <h3 className="font-bold mb-1">{sheet.title}</h3>
                                    <p className="text-xs mb-3 opacity-70">{sheet.description}</p>
                                    <pre
                                        className="p-3 rounded-md text-xs font-mono overflow-x-auto custom-scrollbar"
                                        style={{ background: isDark ? '#020617' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#334155' }}
                                    >
                                        {sheet.code}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
