import React, { useState, useEffect } from 'react'

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

function Splash({ isLoading } : { isLoading:boolean }) {
    const [hidden, setHidden] = useState(false);
    if(!isLoading) setTimeout(() => {setHidden(true)}, 1000);

    return (
    <div className={ (hidden ? "invisible ":"visible ") + (isLoading ? "opacity-100" : "opacity-0") + " transition-opacity ease-in-out duration-1000 size-full bg-black absolute top-0 left-0 z-10 flex"}>
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="m-auto fill-transparent" viewBox='40 0 335 450' height="50vh" width="50vw">
            <g transform="scale(1.0,1.0)">
            <path id="check2" stroke="white" strokeWidth="5" className="animate-[move_5s_linear_alternate_forwards_infinite]" 
            d="m194.3,54.59999c-10.3,5 -16.8,16 -16.2,27.2l0.3,4.7l-22.4,9.2l-22.4,9.2l-3.3,-3.9c-7.7,-9 -22.2,-11.8 -33.1,-6.4c-18.6,9.2 -21.5,33.9 -5.6,47.2l4.2,3.5l-4.9,14.1c-2.8,7.7 -6.4,18 -8.1,22.8l-3.1,8.8l-4.2,0c-10.7,0 -21.7,7 -26.1,16.5c-3.4,7.2 -3.3,17.2 0.2,24.3c4.9,9.9 14.2,15.5 25.6,15.5l6.7,0l7.7,17.8l7.6,17.9l-3.5,3.9c-6.1,6.8 -7.2,9.6 -7.2,19.1c0,9.8 1.7,14 8.2,20.2c5.4,5.2 11.5,7.8 18.9,7.8c7.6,0 13.5,-2 18.9,-6.4l4.2,-3.5l20.6,7.7l20.7,7.7l0,4.6c0,7.5 2.6,14.2 7.5,19.7c5.9,6.6 12.1,9.5 20.5,9.5c15.8,0.1 28,-11.8 28.4,-27.7l0.2,-5.9l19.7,-7.3l19.6,-7.4l5.3,5.4c11.5,11.5 29,11.5 40.2,0c5,-5.2 7,-9.9 7.4,-18.2c0.5,-9.2 -1.5,-15 -7.3,-20.8l-4.2,-4.2l10.2,-21.8l10.2,-21.9l7.5,-0.1c8.8,-0.2 14.8,-2.5 20.1,-7.8c5.2,-5.1 7.9,-11 8.5,-18.2c0.9,-11.5 -4.4,-21.1 -14.9,-26.9c-4.5,-2.5 -6.7,-3 -12.8,-3.1l-7.4,-0.2l-9.4,-21.7l-9.4,-21.8l3.3,-2.7c11.4,-9.4 12.7,-28 2.8,-39.3c-11.3,-12.8 -31.6,-13.2 -42.3,-0.7l-3.3,3.9l-22,-9.2l-22.1,-9.1l0,-6.7c0,-12 -7.3,-22.5 -18.3,-26.4c-6.6,-2.3 -15.5,-1.9 -21.7,1.1z"/>
            <path id="check" stroke="white" strokeWidth="5" className="animate-[move_5s_linear_alternate_forwards_infinite]"
            d="m130.3,100.99999zm55.8,-1.5c7.1,7.7 19.5,10.6 30.3,6.9c3,-1 6.5,-3.4 9.6,-6.5l4.8,-4.8l21.9,9l21.8,9l0.1,6.7c0.2,16.1 11,27 27.5,28l7.8,0.4l7.6,17.7c4.3,9.7 8.4,19.3 9.2,21.4l1.6,3.8l-4.1,4.2c-5.9,6 -8.2,11.7 -8.2,20.2c0,8.2 2,13.3 7.4,19.3c2,2.1 3.6,4.4 3.6,4.9c0,0.5 -4.4,10.4 -9.8,21.9l-9.8,20.9l-8.4,0.6c-9.8,0.6 -14.5,2.6 -20.1,8.6c-5.3,5.5 -7.2,9.9 -7.7,17.8l-0.4,7l-20,7.4l-19.9,7.4l-1.5,-2.2c-5.4,-7.7 -13.3,-11.6 -23.4,-11.6c-9,0.1 -14.3,2.4 -20.6,9.1l-4.2,4.4l-19.8,-7.4l-19.9,-7.4l0.3,-8.1c0.3,-6.8 0,-8.8 -2,-13.3c-2.8,-6 -7.5,-11 -13.3,-14.1c-3.2,-1.7 -5.7,-2.2 -12.6,-2.2l-8.7,0l-7.4,-17.5l-7.5,-17.5l3.7,-3.5c5.1,-4.8 8.2,-11.2 8.8,-18.6c0.7,-9 -1.7,-15.3 -8.4,-22c-3,-2.9 -5.4,-5.7 -5.4,-6.1c0,-0.5 3.5,-10.8 7.7,-22.9l7.7,-22.2l6.7,-0.4c15.5,-1.1 26.1,-12.5 26.2,-27.9l0,-6.6l22.1,-9.1c12.2,-5 22.2,-9.1 22.3,-9.2c0.2,0 2.1,2 4.4,4.5z"/>
            </g>
        </svg>
    </div>)
}

export default Splash;