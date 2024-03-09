import React, { useEffect, useState } from 'react';

const AnimatedHeader = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    const welcomeText = 'Begin your chat journey by selecting users or groups.';
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= welcomeText.length) {
        setText(welcomeText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className='flex flex-col text-sky-900 items-center justify-center h-screen font-semibold text-center'>
        <img src="wavetalk.png" alt="" className='shadow-xl rounded-full' />
        <h1 style={{ fontSize: '2rem' }}>Welcome to WaveTalk.</h1>
        <h1
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '1rem',
            overflow: 'hidden', // Simulating a cursor
            animation: 'typing-animation 1s steps(30) infinite',
            display: 'inline-block', // Ensures that the border-right does not take up the full width
          }}
        >
          {text}
          <span className='bg-sky-900'
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              width: '2px',
              height: '1em', // Adjust the color as needed
              animation: 'cursor-blink 1s infinite step-start',
            }}
          ></span>
        </h1>
      </div>
    </>
  );
};

export default AnimatedHeader;
