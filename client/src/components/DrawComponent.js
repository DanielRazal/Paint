'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDraw } from '../services/useDraw';
import { drawLine } from '../services/drawLine';
import ColorPicker from './ColorPicker';
import Canvas from './Canvas';
import Header from './Header';

const socket = io('http://localhost:3001');

const DrawComponent = () => {
    const [color, setColor] = useState('#000');
    const { canvasRef, onMouseDown, clear, fillCanvas } = useDraw(createLine);
    const [lineWidth, setLineWidth] = useState(5);
    const [fillColorMode, setFillColorMode] = useState(false);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');

        socket.emit('client-ready');

        socket.on('get-canvas-state', () => {
            if (!canvasRef.current?.toDataURL()) return;
            socket.emit('canvas-state', canvasRef.current.toDataURL());
        });

        socket.on('canvas-state-from-server', (state) => {
            const img = new Image();
            img.src = state;
            img.onload = () => {
                ctx?.drawImage(img, 0, 0);
            };
        });

        socket.on('draw-line', ({ prevPoint, currentPoint, color }) => {
            if (!ctx) return;
            drawLine({ prevPoint, currentPoint, ctx, color, lineWidth });
        });

        socket.on('clear', clear);

        socket.on('fill-color', (receivedColor) => {
            fillCanvas(receivedColor);
        });

        socket.on('size-changed', (lineWidth) => {
            setLineWidth(lineWidth);
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

    const handleCanvasClear = () => {
        if (typeof document !== 'undefined') {
            document.body.style.cursor = 'auto';
        }
        socket.emit('clear');
        clear();
    };

    const handleLineWidthChange = (e) => {
        const newValue = parseInt(e.target.value);
        setLineWidth(newValue);
        socket.emit('change-size', newValue);
    };

    const handleFillCanvas = (color) => {
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

    return (
        <div>
            <Header
                handleCanvasClear={handleCanvasClear}
                handleFillCanvas={handleFillCanvas}
                color={color}
                lineWidth={lineWidth}
                handleLineWidthChange={handleLineWidthChange}
            />

            <div className="mt-5 flex items-center">
                <Canvas canvasRef={canvasRef} handleCanvasMouseDown={handleCanvasMouseDown} />
                <ColorPicker color={color} setColor={setColor} />
            </div>
        </div>
    );
};

export default DrawComponent;
