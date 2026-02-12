import { useEffect } from 'react';

/**
 * ScaledContainer - Applies CSS zoom to its children so everything
 * scales proportionally on small-height viewports (e.g., TV at 600px).
 * 
 * Uses CSS `zoom` which affects actual layout (unlike CSS transform).
 * Reference height is 768px — anything shorter gets zoomed out.
 */
function ScaledContainer({ children, referenceHeight = 768 }) {
    useEffect(() => {
        const updateZoom = () => {
            const vh = window.innerHeight;
            const zoomLevel = Math.min(1, vh / referenceHeight);
            document.documentElement.style.zoom = zoomLevel;
        };

        updateZoom();
        window.addEventListener('resize', updateZoom);
        return () => {
            window.removeEventListener('resize', updateZoom);
            document.documentElement.style.zoom = '';
        };
    }, [referenceHeight]);

    return children;
}

export default ScaledContainer;
