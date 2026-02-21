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

/**
 * Reusable hook for pan & zoom interactions on a preview canvas.
 * Encapsulates all mouse event handlers, zoom controls, and state.
 */
export function usePanZoom(): UsePanZoomReturn {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

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
        if (e.button === 1 || e.button === 0) {
            setIsPanning(true);
            panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
        }
    }, [pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isPanning) return;
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
    }, [isPanning]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP;
        setZoom(z => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z + delta)));
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
