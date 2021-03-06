/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";

	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 * @param {String} [color]
	 * @property {Boolean} [filled]
	 * @property {String} color
	 * @extends DrawableCanvas.Drawable
	 * @implements DrawableCanvas.ICollidable
	 * @constructor
	 * @module DrawableCanvas.Drawable
	 */
	DrawableCanvas.Rectangle = function (x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	};

	DrawableCanvas.Rectangle.inheritsFrom(DrawableCanvas.Drawable);

	//<editor-fold name="Rendering">

	DrawableCanvas.Rectangle.prototype.draw = function (context) {
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
			context.fillRect(0, 0, this.width, this.height);
		}
		else
		{
			context.rect(0, 0, this.width, this.height);
			context.stroke();
		}
		context.closePath();
	};

	//</editor-fold>

	//<editor-fold name="ICollidable">

	DrawableCanvas.Rectangle.prototype.collidesWithRectangle = function (rect) {
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