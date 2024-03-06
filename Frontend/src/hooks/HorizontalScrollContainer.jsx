import React, { useRef, useEffect } from 'react';

const HorizontalScrollContainer = ({ children }) => {
    const containerRef = useRef();
    // Easing function for smooth scrolling
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

    // useEffect for fetching userslist
    useEffect(() => {
        // get login user's username from cookies
        var LoginUser = document.cookie.split('; ').find((row) => row.startsWith('LoginUser='));
        LoginUser = LoginUser.split('=')[1];

        // Add the missing empty dependency array
    }, []);

    // useEffect for horizontal scroll
    useEffect(() => {
        const container = containerRef.current;

        const handleWheel = (e) => {
            if (container) {
                const scrollStep = 1; // Adjust as needed

                // Calculate the target scroll position
                const targetScrollLeft = container.scrollLeft + e.deltaY * scrollStep;

                // Smooth scroll using requestAnimationFrame
                smoothScroll(container, targetScrollLeft);

                e.preventDefault();
            }
        };

        if (container) {
            container.addEventListener('wheel', handleWheel);
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [containerRef]);

    // Function for smooth scrolling
    const smoothScroll = (element, targetPosition) => {
        const startTime = performance.now();
        const startPosition = element.scrollLeft;
        const duration = 500; // Adjust as needed

        const animation = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            element.scrollLeft = startPosition + (targetPosition - startPosition) * easeInOutCubic(progress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    return (
        <div
            className="flex overflow-x-hidden mb-2 cursor-pointer"
            ref={containerRef}
        >
            {children}
        </div>
    );
};

export default HorizontalScrollContainer;
