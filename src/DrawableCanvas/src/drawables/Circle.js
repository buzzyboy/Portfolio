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
			context.arc(this.x, this.y, this.radius, 0, 360);
			context.fill();
		}
		else
		{
			context.arc(this.x, this.y, this.radius, 0, 360);
			context.stroke();
		}
		context.closePath();
	};

	//</editor-fold>

	//<editor-fold name="ICollidable">

	DrawableCanvas.Circle.prototype.collidesWithRectangle = function (rect) {
		var collidesWithCircle = ShapeCollisions.pointEllipse(rect, {
			x: this.x + this.radius,
			y: this.y + this.radius,
			width: this.radius * 2,
			height: this.radius * 2
		});
		if (this.filled === true)
		{
			return collidesWithCircle
		}
		else if (collidesWithCircle === true)
		{
			var lineWidth = 10;
			return !ShapeCollisions.pointEllipse(rect, {
				x: this.x + this.radius + lineWidth,
				y: this.y + this.radius + lineWidth,
				width: this.radius * 2 - lineWidth * 2,
				height: this.radius * 2 - lineWidth * 2
			});
		}
	};

	//</editor-fold>
})();