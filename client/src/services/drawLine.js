/**
 * Draw a line on a canvas.
 * @param {Object} props
 * @param {CanvasRenderingContext2D} props.ctx
 * @param {string} props.color
 * @param {Point} props.currentPoint
 * @param {Point | null} props.prevPoint
 * @param {number} props.lineWidth
 */
export const drawLine = ({ prevPoint, currentPoint, ctx, color, lineWidth }) => {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
};
