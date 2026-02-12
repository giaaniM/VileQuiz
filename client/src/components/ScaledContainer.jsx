import { useState, useEffect, useRef } from 'react';

/**
 * ScaledContainer - Wraps content and scales it down to fit the viewport.
 * Designed for a reference resolution of 1024x768.
 * On smaller viewports (e.g., TV at 1024x600), it scales the entire UI proportionally.
 * On larger viewports, it does NOT scale up (max scale = 1).
 */
function ScaledContainer({ children, referenceHeight = 768 }) {
    const [scale, setScale] = useState(1);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateScale = () => {
            const vh = window.innerHeight;
            // Only scale DOWN, never up
            const newScale = Math.min(1, vh / referenceHeight);
            setScale(newScale);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [referenceHeight]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <div
                style={{
                    width: scale < 1 ? `${100 / scale}%` : '100%',
                    height: scale < 1 ? `${100 / scale}%` : '100%',
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
