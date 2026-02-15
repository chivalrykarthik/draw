import { useState, useCallback, useRef, useEffect } from 'react';
import { D2 } from '@terrastruct/d2';

interface UseD2Result {
    svg: string;
    error: string | null;
    isCompiling: boolean;
    compile: (code: string, isDark: boolean) => void;
}

export function useD2(): UseD2Result {
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const d2Ref = useRef<D2 | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestRequestRef = useRef<string>('');

    useEffect(() => {
        try {
            d2Ref.current = new D2();
            console.log('[D2] WASM engine initialized');
        } catch (e) {
            console.error('[D2] Failed to initialize:', e);
        }
        return () => {
            d2Ref.current = null;
        };
    }, []);

    const doCompile = useCallback(async (code: string, isDark: boolean, requestId: string) => {
        console.log('[D2] doCompile called, d2Ref exists:', !!d2Ref.current, 'code length:', code.trim().length);
        if (!d2Ref.current || !code.trim()) {
            setSvg('');
            setError(null);
            setIsCompiling(false);
            return;
        }

        setIsCompiling(true);
        try {
            console.log('[D2] Compiling...');
            // Use simple string overload — layout defaults to dagre
            const result = await d2Ref.current.compile(code);
            console.log('[D2] Compiled successfully, rendering...');
            // D2 theme IDs: 0 = default light, 200 = dark
            const svgOutput = await d2Ref.current.render(result.diagram, {
                ...result.renderOptions,
                themeID: isDark ? 200 : 0,
                sketch: false,
                pad: 60,
                noXMLTag: true,
            });
            console.log('[D2] Rendered SVG, length:', svgOutput.length, 'start:', svgOutput.substring(0, 300));
            if (requestId === latestRequestRef.current) {
                setSvg(svgOutput);
                setError(null);
            }
        } catch (err: unknown) {
            console.error('[D2] Compilation/render error:', err);
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

    const compile = useCallback((code: string, isDark: boolean) => {
        const requestId = `${code}::${isDark}`;
        latestRequestRef.current = requestId;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            doCompile(code, isDark, requestId);
        }, 400);
    }, [doCompile]);

    return { svg, error, isCompiling, compile };
}
