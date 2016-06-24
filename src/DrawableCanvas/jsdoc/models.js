/**
 * Created by cody on 6/22/16.
 */

/**
 * Anything that you want to be drawn in DrawableCanvas must implement all these methods
 * @interface
 * @property {Boolean} highlighted
 * @property {Number} x
 * @property {Number} y
 */
DrawableCanvas.IDrawable = function () {};
/**
 * @param {CanvasRenderingContext2D} context
 */
DrawableCanvas.IDrawable.prototype.draw = function (context) {};

/**
 * @interface
 */
DrawableCanvas.ICollidable = function () {};

/**
 * @param {{x:Number, y:Number, width:Number, height:Number}} rect
 */
DrawableCanvas.ICollidable.prototype.collidesWithRectangle = function (rect) {};