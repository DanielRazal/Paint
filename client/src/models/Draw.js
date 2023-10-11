import Point from "./Point";

export default class Draw {

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Point} currentPoint
     * @param {Point | null} prevPoint
     */

    constructor(ctx, currentPoint, prevPoint) {
        this.ctx = ctx;
        this.currentPoint = currentPoint;
        this.prevPoint = prevPoint;
    }
}
