import { useState, useCallback, useRef, useEffect } from 'react';
import { D2 } from '@terrastruct/d2';
import type { LayoutEngine } from '../types';

interface UseD2Result {
    svg: string;
    error: string | null;
    isCompiling: boolean;
    isWasmReady: boolean;
    compile: (code: string, isDark: boolean, layout?: LayoutEngine) => void;
}

const DEBOUNCE_MS = 400;
const DARK_THEME_ID = 200;
const LIGHT_THEME_ID = 0;
const DEFAULT_LAYOUT: LayoutEngine = 'elk';

/**
 * Hook for compiling and rendering D2 diagrams via WASM.
 * Handles initialization, debounced compilation, and request deduplication.
 */
export function useD2(): UseD2Result {
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isWasmReady, setIsWasmReady] = useState(false);
    const d2Ref = useRef<D2 | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestRequestRef = useRef<string>('');

    // Initialize D2 WASM engine once
    useEffect(() => {
        try {
            d2Ref.current = new D2();
            setIsWasmReady(true);
        } catch (e) {
            console.error('[D2] Failed to initialize:', e);
        }
        return () => {
            d2Ref.current = null;
        };
    }, []);

    const doCompile = useCallback(async (
        code: string,
        isDark: boolean,
        layout: LayoutEngine,
        requestId: string,
    ) => {
        if (!d2Ref.current || !code.trim()) {
            setSvg('');
            setError(null);
            setIsCompiling(false);
            return;
        }

        setIsCompiling(true);
        try {
            const result = await d2Ref.current.compile({
                fs: { 'input.d2': code },
                inputPath: 'input.d2',
                options: { layout },
            });

            const svgOutput = await d2Ref.current.render(result.diagram, {
                ...result.renderOptions,
                themeID: isDark ? DARK_THEME_ID : LIGHT_THEME_ID,
                sketch: false,
                pad: 60,
                center: true,
                noXMLTag: true,
            });

            if (requestId === latestRequestRef.current) {
                setSvg(svgOutput);
                setError(null);
            }
        } catch (err: unknown) {
            if (requestId === latestRequestRef.current) {
                const msg = err instanceof Error ? err.message : String(err);
                setError(msg);
            }
        } finally {
            if (requestId === latestRequestRef.current) {
                setIsCompiling(false);
            }
        }
    }, []);

    const compile = useCallback((
        code: string,
        isDark: boolean,
        layout: LayoutEngine = DEFAULT_LAYOUT,
    ) => {
        const requestId = `${code}::${isDark}::${layout}`;
        latestRequestRef.current = requestId;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            doCompile(code, isDark, layout, requestId);
        }, DEBOUNCE_MS);
    }, [doCompile]);

    return { svg, error, isCompiling, isWasmReady, compile };
}
