import type { Monaco } from '@monaco-editor/react';

/**
 * Register a custom D2 language for Monaco Editor.
 * Provides syntax highlighting for D2 diagram syntax.
 */
export function registerD2Language(monaco: Monaco) {
    // Don't re-register if already registered
    if (monaco.languages.getLanguages().some((l: { id: string }) => l.id === 'd2')) return;

    monaco.languages.register({ id: 'd2' });

    monaco.languages.setMonarchTokensProvider('d2', {
        keywords: [
            'direction', 'shape', 'label', 'style', 'near', 'tooltip',
            'link', 'icon', 'width', 'height', 'constraint', 'description',
        ],
        shapeKeywords: [
            'rectangle', 'square', 'page', 'parallelogram', 'document',
            'cylinder', 'queue', 'package', 'step', 'callout', 'person',
            'diamond', 'oval', 'circle', 'hexagon', 'cloud', 'text',
            'code', 'class', 'sql_table', 'image', 'sequence_diagram',
        ],
        styleKeywords: [
            'fill', 'stroke', 'stroke-width', 'stroke-dash', 'opacity',
            'shadow', 'border-radius', 'font-size', 'font-color', 'bold',
            'italic', 'underline', 'animated', 'multiple', '3d',
        ],
        directionKeywords: ['up', 'down', 'left', 'right'],
        layoutKeywords: ['dagre', 'elk'],

        tokenizer: {
            root: [
                // Comments
                [/#.*$/, 'comment'],

                // Strings
                [/"[^"]*"/, 'string'],
                [/'[^']*'/, 'string'],

                // Arrows / connections
                [/<->/, 'operator.arrow'],
                [/->/, 'operator.arrow'],
                [/<-/, 'operator.arrow'],
                [/--/, 'operator.arrow'],

                // Style properties (style.fill, style.stroke, etc.)
                [/style\.[a-zA-Z-]+/, 'keyword.style'],

                // Constraint
                [/constraint:/, 'keyword'],

                // Braces
                [/[{}]/, 'delimiter.curly'],

                // Colon (key-value separator)
                [/:/, 'delimiter'],

                // Numbers
                [/\b\d+(\.\d+)?\b/, 'number'],

                // Hex colors
                [/#[0-9a-fA-F]{3,8}\b/, 'number.hex'],

                // Boolean
                [/\b(true|false)\b/, 'keyword.boolean'],

                // Direction keywords
                [/\b(up|down|left|right)\b/, {
                    cases: {
                        '@directionKeywords': 'keyword.direction',
                    }
                }],

                // Shape keywords
                [/\b(rectangle|square|page|parallelogram|document|cylinder|queue|package|step|callout|person|diamond|oval|circle|hexagon|cloud|text|code|class|sql_table|image|sequence_diagram)\b/, {
                    cases: {
                        '@shapeKeywords': 'type.shape',
                    }
                }],

                // D2 keywords
                [/\b(direction|shape|label|near|tooltip|link|icon|width|height|constraint|description)\b/, {
                    cases: {
                        '@keywords': 'keyword',
                    }
                }],

                // Identifiers
                [/[a-zA-Z_][\w-]*/, 'identifier'],
            ],
        },
    });

    // Theme for dark mode
    monaco.editor.defineTheme('d2-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
            { token: 'string', foreground: 'a5d6a7' },
            { token: 'keyword', foreground: '818cf8' },
            { token: 'keyword.style', foreground: '22d3ee' },
            { token: 'keyword.boolean', foreground: 'fbbf24' },
            { token: 'keyword.direction', foreground: 'fb7185' },
            { token: 'type.shape', foreground: '34d399' },
            { token: 'operator.arrow', foreground: 'f472b6', fontStyle: 'bold' },
            { token: 'number', foreground: 'fbbf24' },
            { token: 'number.hex', foreground: 'f472b6' },
            { token: 'delimiter.curly', foreground: 'a5b4fc' },
            { token: 'delimiter', foreground: '94a3b8' },
            { token: 'identifier', foreground: 'e2e8f0' },
        ],
        colors: {
            'editor.background': '#0f172a',
            'editor.foreground': '#e2e8f0',
            'editor.lineHighlightBackground': '#1e293b50',
            'editorLineNumber.foreground': '#475569',
            'editorIndentGuide.background': '#1e293b',
            'editor.selectionBackground': '#4f46e540',
        },
    });

    // Theme for light mode
    monaco.editor.defineTheme('d2-light', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '9ca3af', fontStyle: 'italic' },
            { token: 'string', foreground: '16a34a' },
            { token: 'keyword', foreground: '4f46e5' },
            { token: 'keyword.style', foreground: '0891b2' },
            { token: 'keyword.boolean', foreground: 'd97706' },
            { token: 'keyword.direction', foreground: 'e11d48' },
            { token: 'type.shape', foreground: '059669' },
            { token: 'operator.arrow', foreground: 'db2777', fontStyle: 'bold' },
            { token: 'number', foreground: 'd97706' },
            { token: 'number.hex', foreground: 'db2777' },
            { token: 'delimiter.curly', foreground: '4f46e5' },
            { token: 'delimiter', foreground: '64748b' },
            { token: 'identifier', foreground: '334155' },
        ],
        colors: {
            'editor.background': '#ffffff',
            'editor.foreground': '#334155',
            'editor.lineHighlightBackground': '#f1f5f9',
            'editorLineNumber.foreground': '#94a3b8',
            'editorIndentGuide.background': '#e2e8f0',
            'editor.selectionBackground': '#4f46e530',
        },
    });

    // Auto-completion for D2 keywords
    monaco.languages.registerCompletionItemProvider('d2', {
        provideCompletionItems: (_model: unknown, position: { lineNumber: number; column: number }) => {
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
            };

            const keywords = [
                { label: 'direction', detail: 'Layout direction (right, left, up, down)', insertText: 'direction: ' },
                { label: 'shape', detail: 'Shape type', insertText: 'shape: ' },
                { label: 'label', detail: 'Display label', insertText: 'label: ' },
                { label: 'style.fill', detail: 'Background color', insertText: 'style.fill: ' },
                { label: 'style.stroke', detail: 'Border color', insertText: 'style.stroke: ' },
                { label: 'style.stroke-width', detail: 'Border thickness', insertText: 'style.stroke-width: ' },
                { label: 'style.stroke-dash', detail: 'Dashed line', insertText: 'style.stroke-dash: ' },
                { label: 'style.opacity', detail: 'Transparency (0-1)', insertText: 'style.opacity: ' },
                { label: 'style.shadow', detail: 'Drop shadow', insertText: 'style.shadow: ' },
                { label: 'style.border-radius', detail: 'Rounded corners', insertText: 'style.border-radius: ' },
                { label: 'style.font-size', detail: 'Text size', insertText: 'style.font-size: ' },
                { label: 'style.font-color', detail: 'Text color', insertText: 'style.font-color: ' },
                { label: 'style.bold', detail: 'Bold text', insertText: 'style.bold: true' },
                { label: 'style.italic', detail: 'Italic text', insertText: 'style.italic: true' },
                { label: 'style.animated', detail: 'Animated connection', insertText: 'style.animated: true' },
                { label: 'tooltip', detail: 'Hover tooltip', insertText: 'tooltip: ' },
                { label: 'link', detail: 'Clickable URL', insertText: 'link: ' },
                { label: 'icon', detail: 'Icon URL', insertText: 'icon: ' },
                { label: 'width', detail: 'Fixed width', insertText: 'width: ' },
                { label: 'height', detail: 'Fixed height', insertText: 'height: ' },
                { label: 'near', detail: 'Place near another object', insertText: 'near: ' },
                { label: 'constraint', detail: 'SQL table constraint', insertText: 'constraint: ' },
            ];

            const shapes = [
                'rectangle', 'square', 'page', 'parallelogram', 'document',
                'cylinder', 'queue', 'package', 'step', 'callout', 'person',
                'diamond', 'oval', 'circle', 'hexagon', 'cloud', 'text',
                'code', 'class', 'sql_table', 'image', 'sequence_diagram',
            ];

            const suggestions = [
                ...keywords.map(k => ({
                    label: k.label,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    detail: k.detail,
                    insertText: k.insertText,
                    range,
                })),
                ...shapes.map(s => ({
                    label: s,
                    kind: monaco.languages.CompletionItemKind.Enum,
                    detail: `Shape: ${s}`,
                    insertText: s,
                    range,
                })),
            ];

            return { suggestions };
        },
    });
}
