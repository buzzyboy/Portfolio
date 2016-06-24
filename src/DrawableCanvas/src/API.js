/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";

	//<editor-fold name="Muting">

	/**
	 * @param {String} layerId
	 * @returns {boolean}
	 */
	DrawableCanvas.isLayerIdMuted = function (layerId) {
		return this._mutedLayerIds.indexOf(layerId) >= 0;
	};

	/**
	 * @param {String} layerId
	 */
	DrawableCanvas.addMutedLayerId = function (layerId) {
		if (this._mutedLayerIds.indexOf(layerId) >= 0)
		{
			console.warn("Not adding duplicate layerId", layerId);
		}
		else
		{
			this._mutedLayerIds.push(layerId);
		}
	};

	/**
	 * @param {String} layerId
	 */
	DrawableCanvas.removeMutedLayerId = function (layerId) {
		var index = this._mutedLayerIds.indexOf(layerId);
		if (index >= 0)
		{
			this._mutedLayerIds.splice(index, 1);
		}
	};

	//</editor-fold>

	//<editor-fold name="Sizing and Scaling">

	/**
	 * @returns {{x: number, y: number}}
	 */
	DrawableCanvas.prototype.getMaxPan = function () {
		var containerSize = this.getViewportByPercent(1.0);
		var displayedCanvasSize = this.getViewport(this._scaleFactor);
		var maxPan = {
			x: Math.max(0, displayedCanvasSize.width - containerSize.width),
			y: Math.max(0, displayedCanvasSize.height - containerSize.height)
		};
		return maxPan;
	};

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	DrawableCanvas.prototype.setPan = function (x, y) {
		this._pan.x = x;
		this._pan.y = y;
		this.render();
	};

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	DrawableCanvas.prototype.translatePan = function (x, y) {
		this.setPan(this._pan.x + x, this._pan.y + y);
	};

	/**
	 * @param {Number} scalePercent
	 * @returns {Number}
	 */
	DrawableCanvas.prototype.calculatorScaleFactorWithPercent = function (scalePercent) {
		var basedOnWidth = this.isZoomPercentageBasedOnWidth();
		var viewport = this.getViewportByPercent(1);
		var property = basedOnWidth ? "width" : "height";
		var nonScaledSize = this.mediaSize[property];
		var desiredSize = viewport[property] * scalePercent;
		return parseFloat((desiredSize / nonScaledSize).toFixed(2));
	};

	/**
	 * @returns {{width: Number, height: Number}}
	 */
	DrawableCanvas.prototype.getMaximumCanvasSize = function () {
		var $parent = this.$canvas.parent();
		var width = $parent.width();
		var height = $parent.height();
		return {
			width: width,
			height: height
		}
	};

	/**
	 * @param {Number} width
	 * @param {Number} height
	 */
	DrawableCanvas.prototype.setCanvasSize = function (width, height) {
		var maxSize = this.getMaximumCanvasSize();
		this.$canvas[0].width = Math.min(maxSize.width, width);
		this.$canvas[0].height = Math.min(maxSize.height, height);
		this.centerCanvasInContainer();
	};

	/**
	 * @param {Number} scalePercent
	 * @returns {{width: number, height: number}}
	 */
	DrawableCanvas.prototype.getViewportByPercent = function (scalePercent) {
		var $container = this.$canvas.parent();
		var containerWidth = $container.innerWidth();
		var containerHeight = $container.innerHeight();
		return {
			width: containerWidth * scalePercent,
			height: containerHeight * scalePercent
		};
	};

	/**
	 * @param {Number} scaleFactor
	 * @returns {{width: number, height: number}}
	 */
	DrawableCanvas.prototype.getViewport = function (scaleFactor) {
		return {
			width: this.mediaSize.width * scaleFactor,
			height: this.mediaSize.height * scaleFactor
		};
	};

	/**
	 * @param {Number} width
	 * @param {Number} height
	 */
	DrawableCanvas.prototype.setMediaSize = function (width, height) {
		this.mediaSize.width = width;
		this.mediaSize.height = height;
		this.setScaleFactor(this.getScaleFactor());
		this.resize();
	};

	/**
	 * @returns {boolean}
	 */
	DrawableCanvas.prototype.isZoomPercentageBasedOnWidth = function () {
		var viewport = this.getViewportByPercent(1.0);
		var scaleFactorToFitWidth = viewport.width / this.mediaSize.width;
		var isWidthBased = this.mediaSize.height * scaleFactorToFitWidth < viewport.height;
		return isWidthBased;
	};

	/**
	 * Centers the canvas in its parent container
	 */
	DrawableCanvas.prototype.centerCanvasInContainer = function () {
		var $container = this.$canvas.parent();
		this.$canvas.css({
			left: Math.max(0, ($container.innerWidth() - this.$canvas.outerWidth(true)) / 2),
			top: Math.max(0, ($container.innerHeight() - this.$canvas.outerHeight(true)) / 2)
		});
	};

	/**
	 * @param {Number} scaleFactor
	 */
	DrawableCanvas.prototype.setScaleFactor = function (scaleFactor) {
		scaleFactor = parseFloat(Math.min(this._options.maxScaleFactor, Math.max(this._options.minScaleFactor, scaleFactor)).toFixed(2));
		if (this._options.scaleIsPercentBased)
		{
			this._scalePercent = scaleFactor;
			scaleFactor = this.calculatorScaleFactorWithPercent(scaleFactor);
		}
		this._scaleFactor = scaleFactor;
		this.resize();
	};

	/**
	 * @returns {Number}
	 */
	DrawableCanvas.prototype.getScaleFactor = function () {
		if (this._options.scaleIsPercentBased)
		{
			return this._scalePercent;
		}
		else
		{
			return this._scaleFactor;
		}
	};

	/**
	 * To be called when the window or parent container size changes
	 */
	DrawableCanvas.prototype.resize = function () {
		if (this._options.scaleIsPercentBased)
		{
			this._scaleFactor = this.calculatorScaleFactorWithPercent(this._scalePercent);
		}
		this.setCanvasSize(this.mediaSize.width * this._scaleFactor, this.mediaSize.height * this._scaleFactor);
		this.render();
	};

	//</editor-fold>

	//<editor-fold name="Rendering">

	/**
	 * @param {Array<DrawableCanvas.IDrawable>} drawables
	 */
	DrawableCanvas.prototype.setDrawables = function (drawables) {
		this._drawables = drawables;
	};

	/**
	 * Renders all the current drawables
	 */
	DrawableCanvas.prototype.render = function () {
		var $canvas = this.$canvas;
		var context = this._context;
		var scaleFactor = this._scaleFactor;
		var maxPan = this.getMaxPan();

		this._pan.x = Math.max(0, Math.min(maxPan.x, this._pan.x));
		this._pan.y = Math.max(0, Math.min(maxPan.y, this._pan.y));

		context.save();
		context.translate(-this._pan.x, -this._pan.y);
		context.clearRect(0, 0, $canvas[0].width + maxPan.x, $canvas[0].height + maxPan.y);
		context.scale(scaleFactor, scaleFactor);

		this._drawables.forEach(function (drawable) {
			context.save();
			context.translate(drawable.x, drawable.y);
			drawable.draw(context);
			context.restore();
		});
		context.restore();

		this._eventEmitter.emitRenderedEvent();
	};

	//</editor-fold>

})();