import React from 'react'

function Canvas({ canvasRef, handleCanvasMouseDown }) {
    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                width={1000}
                height={500}
                className="border border-black rounded-md"
                
            />
        </div>
    )
}

export default Canvas