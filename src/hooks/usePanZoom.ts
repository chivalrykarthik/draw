import { useState, useCallback, useRef } from 'react';

interface PanZoomState {
    zoom: number;
    pan: { x: number; y: number };
    isPanning: boolean;
}

interface UsePanZoomReturn extends PanZoomState {
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseUp: () => void;
    handleWheel: (e: React.WheelEvent) => void;
}

const ZOOM_STEP = 0.2;
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 5;
const WHEEL_ZOOM_STEP = 0.1;
const PAN_DRAG_THRESHOLD = 4; // px — must drag this far before panning activates

/**
 * Reusable hook for pan & zoom interactions on a preview canvas.
 * Uses a drag threshold so left-clicks on SVG links/tooltips still work.
 * Middle-click (button 1) activates panning immediately.
 */
export function usePanZoom(): UsePanZoomReturn {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);

    // Use refs for pan state to avoid stale closures in callbacks
    const panRef = useRef({ x: 0, y: 0 });
    panRef.current = pan;

    const dragState = useRef({
        isDown: false,
        activated: false,  // true once drag threshold exceeded
        startX: 0,
        startY: 0,
        panX: 0,
        panY: 0,
        button: 0,
    });

    const zoomIn = useCallback(() => {
        setZoom(z => Math.min(ZOOM_MAX, z + ZOOM_STEP));
    }, []);

    const zoomOut = useCallback(() => {
        setZoom(z => Math.max(ZOOM_MIN, z - ZOOM_STEP));
    }, []);

    const resetView = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0 && e.button !== 1) return;

        const cur = panRef.current;
        dragState.current = {
            isDown: true,
            activated: e.button === 1, // middle-click activates immediately
            startX: e.clientX,
            startY: e.clientY,
            panX: cur.x,
            panY: cur.y,
            button: e.button,
        };

        if (e.button === 1) {
            e.preventDefault(); // prevent auto-scroll on middle-click
            setIsPanning(true);
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const ds = dragState.current;
        if (!ds.isDown) return;

        const dx = e.clientX - ds.startX;
        const dy = e.clientY - ds.startY;

        // For left-click, require exceeding drag threshold before activating pan
        if (!ds.activated) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < PAN_DRAG_THRESHOLD) return;
            ds.activated = true;
            setIsPanning(true);
        }

        setPan({ x: ds.panX + dx, y: ds.panY + dy });
    }, []);

    const handleMouseUp = useCallback(() => {
        dragState.current.isDown = false;
        dragState.current.activated = false;
        setIsPanning(false);
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP;

        // Zoom towards cursor position
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        setZoom(prevZoom => {
            const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, prevZoom + delta));
            const scale = newZoom / prevZoom;

            // Adjust pan so the point under cursor stays fixed
            setPan(prevPan => ({
                x: cursorX - scale * (cursorX - prevPan.x),
                y: cursorY - scale * (cursorY - prevPan.y),
            }));

            return newZoom;
        });
    }, []);

    return {
        zoom,
        pan,
        isPanning,
        setZoom,
        zoomIn,
        zoomOut,
        resetView,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheel,
    };
}
