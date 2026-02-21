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
    fitToView: (containerW: number, containerH: number, contentW: number, contentH: number) => void;
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
    handleMouseUp: () => void;
    handleWheel: (e: React.WheelEvent) => void;
}
const ZOOM_FACTOR_BUTTON = 1.25;   // 25% per button click
const ZOOM_FACTOR_WHEEL = 1.08;    // 8% per scroll tick — smooth and granular
const ZOOM_MIN = 0.05;
const ZOOM_MAX = 8;
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
        setZoom(z => Math.min(ZOOM_MAX, z * ZOOM_FACTOR_BUTTON));
    }, []);

    const zoomOut = useCallback(() => {
        setZoom(z => Math.max(ZOOM_MIN, z / ZOOM_FACTOR_BUTTON));
    }, []);

    const resetView = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    /**
     * Fit the diagram to the container viewport.
     * Calculates optimal zoom (capped at 1x) and centers the content.
     */
    const fitToView = useCallback((containerW: number, containerH: number, contentW: number, contentH: number) => {
        if (contentW <= 0 || contentH <= 0 || containerW <= 0 || containerH <= 0) {
            resetView();
            return;
        }

        const padding = 32; // px padding on each side
        const availW = containerW - padding * 2;
        const availH = containerH - padding * 2;

        // Calculate zoom to fit, but don't zoom beyond 1x (no upscaling small diagrams)
        const fitZoom = Math.min(availW / contentW, availH / contentH, 1);
        const clampedZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, fitZoom));

        // Center the content within the container
        const scaledW = contentW * clampedZoom;
        const scaledH = contentH * clampedZoom;
        const panX = (containerW - scaledW) / 2;
        const panY = (containerH - scaledH) / 2;

        setZoom(clampedZoom);
        setPan({ x: panX, y: panY });
    }, [resetView]);

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

    // Mouse wheel zoom disabled — use +/- buttons instead
    const handleWheel = useCallback((_e: React.WheelEvent) => {
        // Intentionally disabled
    }, []);

    return {
        zoom,
        pan,
        isPanning,
        setZoom,
        zoomIn,
        zoomOut,
        resetView,
        fitToView,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheel,
    };
}
