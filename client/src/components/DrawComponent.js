'use client';

import React, { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { BiColorFill } from 'react-icons/bi';
import { AiOutlineClear } from 'react-icons/ai';
import { io } from 'socket.io-client';
import { useDraw } from '../services/useDraw';
import { drawLine } from '../services/drawLine';

const socket = io('http://localhost:3001');

const DrawComponent = () => {
    const [color, setColor] = useState('#000');
    const { canvasRef, onMouseDown, clear, fillCanvas } = useDraw(createLine);
    const [lineWidth, setLineWidth] = useState(5);
    const [fillColorMode, setFillColorMode] = useState(false);
    // const svgString = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2635 11.646L11.1924 4.57492L9.44588 6.32143L16.5169 13.3925L18.2635 11.646ZM3.41421 12.3531L8.03167 7.73565L15.1027 14.8067L10.4853 19.4242L3.41421 12.3531ZM17.2241 15.5138L19.3941 13.3438L19.4404 13.4385L20.0558 14.6984C19.831 15.6632 19.5913 16.3048 19.3973 16.8243C19.1664 17.4427 19 17.8882 19 18.5C19 19.6734 19.5 20.5 20.5 20.5C21.5 20.5 22 20 22 18.5C22 17.8882 21.8336 17.4427 21.6027 16.8243C21.4522 16.4215 21.2744 15.9453 21.0973 15.3019L21.3332 13.1064C21.4987 11.5654 21.4334 9.99227 20.4314 8.84284C19.9406 8.27981 19.5579 8.06042 19.0274 7.75634L19.0273 7.7563C18.8504 7.65487 18.657 7.54401 18.4376 7.40784C17.4574 6.79921 15.6368 5.54617 11.8306 2.39085C11.4332 2.06139 10.8503 2.08858 10.4853 2.4536L7.32456 5.61433L1.29289 11.646C0.902369 12.0365 0.902369 12.6697 1.29289 13.0602L9.77817 21.5455C10.1687 21.936 10.8019 21.936 11.1924 21.5455L17.2241 15.5138Z" fill="#000000"></path> </g></svg>`;

    // const cursorIcon = `data:image/svg+xml;base64,${btoa(svgString)}`;

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');

        socket.emit('client-ready');

        socket.on('get-canvas-state', () => {
            if (!canvasRef.current?.toDataURL()) return;
            console.log('sending canvas state');
            socket.emit('canvas-state', canvasRef.current.toDataURL());
        });

        socket.on('canvas-state-from-server', (state) => {
            console.log('I received the state');
            const img = new Image();
            img.src = state;
            img.onload = () => {
                ctx?.drawImage(img, 0, 0);
            };
        });

        socket.on('draw-line', ({ prevPoint, currentPoint, color }) => {
            if (!ctx) return console.log('no ctx here');
            drawLine({ prevPoint, currentPoint, ctx, color });
        });

        socket.on('clear', clear);

        socket.on('fill-color', (receivedColor) => {
            console.log('Received color from server:', receivedColor);
            fillCanvas(receivedColor);
        });

        return () => {
            socket.off('draw-line');
            socket.off('get-canvas-state');
            socket.off('canvas-state-from-server');
            socket.off('clear');
            socket.off('fill-color');
        };
    }, [canvasRef]);

    function createLine({ prevPoint, currentPoint, ctx }) {
        socket.emit('draw-line', { prevPoint, currentPoint, color });
        drawLine({ prevPoint, currentPoint, ctx, color });
    }

    const handleFillCanvas = (color) => {
        console.log('Filling canvas with color:', color);
        fillCanvas(color);
        socket.emit('fill-color', color);
    };

    if (typeof document !== 'undefined') {
        // if (fillColorMode) {
        // document.body.style.cursor = `url('${cursorIcon}'), auto`;
        // } else {
        //   document.body.style.cursor = 'auto';
        // }
    }

    const handleCanvasClear = () => {
        if (typeof document !== 'undefined') {
            document.body.style.cursor = 'auto';
        }
        setFillColorMode(false);
        socket.emit('clear');
        clear();
    };

    const handleLineWidthChange = (e) => {
        setLineWidth(parseInt(e.target.value));
    };

    const handleCanvasMouseDown = () => {
        if (fillColorMode) {
            // fillCanvas(color);
            setFillColorMode(false);
        } else {
            onMouseDown();
        }
    };

    return (
        <div>
            {/* <Header1 /> */}
            <nav className="bg-white dark:bg-gray-900 border border-black">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <button
                        data-collapse-toggle="navbar-default"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <button
                                    onClick={handleCanvasClear}
                                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                >
                                    <AiOutlineClear size={25} />
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleFillCanvas(color)}
                                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor"
                                >
                                    <BiColorFill size={25} />
                                </button>
                            </li>

                            <li className="relative group">
                                <select
                                    value={lineWidth}
                                    onChange={(e) => handleLineWidthChange(e)}
                                    className="block py-2 pl-3 pr-4 text-gray-900 rounded-md md:p-0 dark:text-white"
                                >
                                    <option value={3}>3px</option>
                                    <option value={5}>5px</option>
                                    <option value={8}>8px</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-600 dark:text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                    </svg>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="mt-5 flex items-center">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    width={1000}
                    height={500}
                    className="border border-black rounded-md"
                />
                <ChromePicker
                    className="ml-10"
                    color={color}
                    onChange={(e) => setColor(e.hex)}
                />
            </div>
        </div>
    );
};

export default DrawComponent;
