import { useState, useEffect, useRef } from 'react';

/**
 * ScaledContainer - Wraps content and scales it down to fit the viewport.
 * On small viewports (e.g., TV at 1024x600), the entire UI is scaled down proportionally.
 * On normal/large viewports, no scaling is applied.
 *
 * Key: children should use `h-full` instead of `h-screen` to fill this container.
 */
function ScaledContainer({ children, referenceHeight = 768 }) {
    const [scale, setScale] = useState(1);
    const [dimensions, setDimensions] = useState({ w: '100vw', h: '100vh' });

    useEffect(() => {
        const updateScale = () => {
            const vh = window.innerHeight;
            const vw = window.innerWidth;
            const newScale = Math.min(1, vh / referenceHeight);
            setScale(newScale);

            if (newScale < 1) {
                // Inner div must be larger so that when scaled, it fills the viewport
                setDimensions({
                    w: `${vw / newScale}px`,
                    h: `${vh / newScale}px`
                });
            } else {
                setDimensions({ w: '100vw', h: '100vh' });
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [referenceHeight]);

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <div
                style={{
                    width: dimensions.w,
                    height: dimensions.h,
                    transform: scale < 1 ? `scale(${scale})` : 'none',
                    transformOrigin: 'top left',
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default ScaledContainer;
