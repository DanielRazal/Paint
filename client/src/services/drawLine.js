/**
 * Draw a line on a canvas.
 * @param {Object} props - The drawing properties.
 * @param {CanvasRenderingContext2D} props.ctx - The canvas rendering context.
 * @param {string} props.color - The color of the line.
 * @param {Point} props.currentPoint - The current point.
 * @param {Point | null} props.prevPoint - The previous point, or null.
 */
export const drawLine = ({ prevPoint, currentPoint, ctx, color }) => {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

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
