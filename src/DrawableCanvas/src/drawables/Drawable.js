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

	/**
	 * Note: Use 0, 0 as center. DrawableCanvas rendering will automatically translate drawables
	 */
	DrawableCanvas.Drawable.prototype.draw = function () {
		console.warn("Not implemented");
	};
})();