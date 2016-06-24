/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";

	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {String} [color]
	 * @property {Boolean} [filled]
	 * @property {String} color
	 * @extends DrawableCanvas.Drawable
	 * @implements DrawableCanvas.ICollidable
	 * @constructor
	 * @module DrawableCanvas.Drawable
	 */
	DrawableCanvas.Circle = function (x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	};

	DrawableCanvas.Circle.inheritsFrom(DrawableCanvas.Drawable);

	//<editor-fold name="Rendering">

	DrawableCanvas.Circle.prototype.draw = function (context) {
		context.beginPath();
		context.fillStyle = this.color;
		context.strokeStyle = this.color;

		if (this.highlighted === true)
		{
			context.strokeStyle = "gold";
			context.fillStyle = "gold";
		}

		if (this.filled === true)
		{
			context.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
			context.fill();
		}
		else
		{
			context.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
			context.stroke();
		}
		context.closePath();
	};

	//</editor-fold>

	//<editor-fold name="ICollidable">

	DrawableCanvas.Circle.prototype.collidesWithRectangle = function (rect) {
		var collidesWithCircle = ShapeCollisions.rectangleCircle(rect, {
			x: this.x,
			y: this.y,
			radius: this.radius
		});
		return collidesWithCircle;
	};

	//</editor-fold>
})();