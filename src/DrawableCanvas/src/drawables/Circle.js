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
		if (this.filled === true)
		{
			var collisionRectangle = {
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height
			};
			return ShapeCollisions.rectangleRectangle(rect, collisionRectangle);
		}
		else
		{
			var topRect = {x: this.x, y: this.y, width: this.width, height: 1};
			var bottomRect = {x: this.x, y: this.y + this.height, width: this.width, height: 1};
			var rightRect = {x: this.x + this.width, y: this.y, width: 1, height: this.height};
			var leftRect = {x: this.x, y: this.y, width: 1, height: this.height};
			return ShapeCollisions.rectangleRectangle(rect, topRect)
				|| ShapeCollisions.rectangleRectangle(rect, bottomRect)
				|| ShapeCollisions.rectangleRectangle(rect, leftRect)
				|| ShapeCollisions.rectangleRectangle(rect, rightRect);
		}
	};

	//</editor-fold>
})();