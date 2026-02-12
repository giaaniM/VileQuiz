import { useEffect } from 'react';

/**
 * ScaledContainer - Applies CSS zoom to scale everything proportionally
 * on small-height viewports (e.g., TV at 600px).
 * 
 * Also sets a --screen-h CSS custom property that compensates for zoom,
 * so components can use height: var(--screen-h) instead of h-screen (100vh)
 * and still fill the zoomed viewport correctly.
 *
 * On a 600px viewport with zoom 0.78:
 *   100vh = 600px → displayed at 468px (wrong, gap at bottom!)
 *   var(--screen-h) = 128.2vh (100/0.78) → 769px → displayed at 600px (correct!)
 */
function ScaledContainer({ children, referenceHeight = 768 }) {
    useEffect(() => {
        const updateZoom = () => {
            const vh = window.innerHeight;
            const zoomLevel = Math.min(1, vh / referenceHeight);

            document.documentElement.style.zoom = zoomLevel;
            // Compensate vh units: since zoom shrinks them visually,
            // we need to make them larger so they fill the screen after zoom
            document.documentElement.style.setProperty(
                '--screen-h',
                zoomLevel < 1 ? `${100 / zoomLevel}vh` : '100vh'
            );
        };

        updateZoom();
        window.addEventListener('resize', updateZoom);
        return () => {
            window.removeEventListener('resize', updateZoom);
            document.documentElement.style.zoom = '';
            document.documentElement.style.removeProperty('--screen-h');
        };
    }, [referenceHeight]);

    return children;
}

export default ScaledContainer;
