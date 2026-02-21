import { useCallback, useRef } from 'react';

interface UseResizerOptions {
    /** Minimum panel width as a percentage (0-100) */
    minWidth?: number;
    /** Maximum panel width as a percentage (0-100) */
    maxWidth?: number;
}

/**
 * Reusable hook for a horizontal panel resizer.
 * Returns a mousedown handler to attach to the resizer element.
 */
export function useResizer(
    width: number,
    setWidth: (w: number) => void,
    options: UseResizerOptions = {},
) {
    const { minWidth = 20, maxWidth = 80 } = options;
    const widthRef = useRef(width);
    widthRef.current = width;

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = widthRef.current;

        function onMove(ev: MouseEvent) {
            const delta = ev.clientX - startX;
            const containerWidth = window.innerWidth;
            const newWidth = startWidth + (delta / containerWidth) * 100;
            setWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
        }

        function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }, [setWidth, minWidth, maxWidth]);

    return { handleMouseDown };
}
