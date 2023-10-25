import React from 'react'

function Canvas({ canvasRef, handleCanvasMouseDown }) {
    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            width={1000}
            height={500}
            className="border border-black rounded-md"
        />
    )
}

export default Canvas