import React, { useRef, useEffect } from 'react';

const ScrollContainer = ({ children, direction, height }) => {
    const containerRef = useRef();
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

    useEffect(() => {
        // Fetch user list or perform other initialization tasks
        var loginUser = document.cookie.split('; ').find((row) => row.startsWith('LoginUser='));
        loginUser = loginUser.split('=')[1];
    }, []);

    useEffect(() => {
        const container = containerRef.current;

        const handleScroll = (e) => {
            if (container) {
                const scrollStep = 3; // Adjust as needed

                // Calculate the target scroll position
                let targetScroll;

                if (e.deltaY !== undefined) {
                    // Mouse wheel event
                    targetScroll = direction === 'row' ? container.scrollLeft + e.deltaY * scrollStep : container.scrollTop + e.deltaY * scrollStep;
                } else if (e.touches && e.touches.length === 1) {
                    // Touch event
                    const touch = e.touches[0];
                    const delta = direction === 'row' ? touch.clientX - touch.startX : touch.clientY - touch.startY;
                    targetScroll = direction === 'row' ? container.scrollLeft + delta * scrollStep : container.scrollTop + delta * scrollStep;
                }

                // Smooth scroll using requestAnimationFrame
                smoothScroll(container, targetScroll);

                e.preventDefault();
            }
        };

        if (container) {
            container.addEventListener('wheel', handleScroll);
            container.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                touch.startX = touch.clientX;
                touch.startY = touch.clientY;
            });
            container.addEventListener('touchmove', handleScroll, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleScroll);
                container.removeEventListener('touchstart', handleScroll);
                container.removeEventListener('touchmove', handleScroll);
            }
        };
    }, [containerRef, direction]);

    const smoothScroll = (element, targetPosition) => {
        const startTime = performance.now();
        const startPosition = direction === 'row' ? element.scrollLeft : element.scrollTop;
        const duration = 500; // Adjust as needed

        const animation = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            if (direction === 'row') {
                element.scrollLeft = startPosition + (targetPosition - startPosition) * easeInOutCubic(progress);
            } else {
                element.scrollTop = startPosition + (targetPosition - startPosition) * easeInOutCubic(progress);
            }

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    return (
        <div
            className={`flex flex-${direction} ${height} overflow-${direction === 'row' ? 'x' : 'y'}-hidden mb-2 gap-4 items-center justify-start cursor-pointer`}
            ref={containerRef}
        >
            {children}
        </div>
    );
};

export default ScrollContainer;
