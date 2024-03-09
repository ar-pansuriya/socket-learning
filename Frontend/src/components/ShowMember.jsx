import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux'



export default function ShowMember({ direction }) {


    const selectedGroup = useSelector(state => state.Chats.selectGdata);
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
                const scrollStep = 2; // Adjust as needed

                // Calculate the target scroll position
                let targetScroll;

                if (direction === 'row') {
                    targetScroll = container.scrollLeft + e.deltaY * scrollStep;
                } else {
                    targetScroll = container.scrollTop + e.deltaY * scrollStep;
                }

                // Smooth scroll using requestAnimationFrame
                smoothScroll(container, targetScroll);

                e.preventDefault();
            }
        };

        if (container) {
            container.addEventListener('wheel', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleScroll);
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
        <>
            <div ref={containerRef} className='absolute z-20 right-0 w-64 h-48 flex flex-wrap gap-3 items-center justify-center p-2 bg-sky-200 shadow-xl rounded top-16 overflow-hidden'>
                {selectedGroup.member.map((user, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer flex flex-col justify-center items-center`}
                    >
                        <img
                            src={user.profilePic}
                            alt="User Profile"
                            className="w-12 h-12 border-2 border-sky-900 rounded-full"
                        />
                        <span className='text-sky-700'>{user.userName}</span>
                    </div>
                ))}
            </div>
        </>
    )
}
