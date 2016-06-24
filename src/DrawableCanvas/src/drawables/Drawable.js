/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";

	/**
	 * @property {Number} x
	 * @property {Number} y
	 * @constructor
	 * @abstract
	 * @implements DrawableCanvas.IDrawable
	 * @module DrawableCanvas.Drawable
	 */
	DrawableCanvas.Drawable = function () {
	};

	DrawableCanvas.Drawable.prototype.draw = function () {
		console.warn("Not implemented");
	};
})();