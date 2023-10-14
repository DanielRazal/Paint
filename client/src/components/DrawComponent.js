'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDraw } from '../services/useDraw';
import { drawLine } from '../services/drawLine';
import ColorPicker from './ColorPicker';
import Canvas from './Canvas';
import Header from './Header';
import Swal from 'sweetalert2';

const socket = io('http://localhost:3001');

const DrawComponent = () => {
    const [color, setColor] = useState('#000');
    const { canvasRef, onMouseDown, clear, fillCanvas, drawText } = useDraw(createLine);
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
            drawLine({ prevPoint, currentPoint, ctx, color, lineWidth });
        });

        socket.on('clear', clear);

        socket.on('fill-color', (receivedColor) => {
            fillCanvas(receivedColor);
        });

        socket.on('size-changed', (lineWidth) => {
            setLineWidth(lineWidth);
        });

        socket.on('draw-text', ({ text, font, color, x, y }) => {
            drawText(text, font, color, x, y);
        });

        return () => {
            socket.off('draw-line');
            socket.off('get-canvas-state');
            socket.off('canvas-state-from-server');
            socket.off('clear');
            socket.off('fill-color');
        };
    }, [canvasRef, clear, fillCanvas]);

    function createLine({ prevPoint, currentPoint, ctx }) {
        socket.emit('draw-line', { prevPoint, currentPoint, color });
        drawLine({ prevPoint, currentPoint, ctx, color, lineWidth });
    }

    // if (typeof document !== 'undefined') {
    //     if (fillColorMode) {
    //         document.body.style.cursor = `url('${cursorIcon}'), auto`;
    //     } else {
    //         document.body.style.cursor = 'auto';
    //     }
    // }

    const handleCanvasClear = () => {
        if (typeof document !== 'undefined') {
            document.body.style.cursor = 'auto';
        }
        // setFillColorMode(false);
        socket.emit('clear');
        clear();
    };

    const handleLineWidthChange = (e) => {
        const newValue = parseInt(e.target.value);
        console.log(newValue);
        setLineWidth(newValue);
        socket.emit('change-size', newValue);
    };

    const handleFillCanvas = (color) => {
        console.log('Filling canvas with color:', color);
        fillCanvas(color);
        socket.emit('fill-color', color);
    };

    const handleCanvasMouseDown = () => {
        if (fillColorMode) {
            fillCanvas(color);
            setFillColorMode(false);
        } else {
            onMouseDown();
        }
    };

    const openCustomTextDialog = () => {
        Swal.fire({
            title: 'Customize Text',
            html: `
            <input type="text" id="text" placeholder="Enter text" class="swal2-input">
            <input type="color" id="color" class="swal2-input" value="#000000">
            <input type="range" id="fontSize" step="2" value="20" class="swal2-input">
            <select id="font" class="swal2-select">
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
            <input type="number" id="x" placeholder="X-coordinate" class="swal2-input">
            <input type="number" id="y" placeholder="Y-coordinate" class="swal2-input">
          `,
            showCancelButton: true,
            confirmButtonText: 'Add Text',
        }).then((result) => {
            if (result.isConfirmed) {
                const inputText = document.getElementById('text').value;
                const color = document.getElementById('color').value;
                const fontSize = document.getElementById('fontSize').value;
                const font = document.getElementById('font').value;
                let x = parseFloat(document.getElementById('x').value);
                let y = parseFloat(document.getElementById('y').value);

                if (isNaN(x)) x = 50;
                if (isNaN(y)) y = 50;

                addTextToCanvas(inputText, x, y, color, fontSize, font);
            }
        });
    };

    const addTextToCanvas = (text, x, y, color, fontSize, font) => {
        const fontStyle = `${fontSize}px ${font}`;

        drawText(text, fontStyle, color, x, y);
        socket.emit('draw-text', { text, fontStyle, color, x, y });
    };

    return (
        <div>
            <Header
                handleCanvasClear={handleCanvasClear}
                handleFillCanvas={handleFillCanvas}
                color={color}
                lineWidth={lineWidth}
                handleLineWidthChange={handleLineWidthChange}
                openCustomTextDialog={openCustomTextDialog}
            />

            <div className="mt-5 flex items-center">
                <Canvas canvasRef={canvasRef} handleCanvasMouseDown={handleCanvasMouseDown} />

                <ColorPicker color={color} setColor={setColor} />
            </div>

            {/* <button onClick={openCustomTextDialog}>Add Text</button> */}
        </div>
    );
};

export default DrawComponent;
