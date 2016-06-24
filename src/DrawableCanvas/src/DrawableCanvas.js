/**
 * Created by cody on 6/22/16.
 */

/**
 * @module DrawableCanvas
 */
var DrawableCanvas;

(function () {
	"use strict";
	
	/**
	 * @param {jQuery} $canvasElement
	 * @param {DrawableCanvas.defaults} optionsIn
	 * @module DrawableCanvas
	 * @constructor
	 */
	DrawableCanvas = function ($canvasElement, optionsIn) {
		
		//<editor-fold name="Variables">
		
		var self = this;
		self.$canvas = $canvasElement;
		/**@type {DrawableCanvas.EventEmitter}*/
		self._eventEmitter = null;
		/**@type {Array<String>}*/
		self._mutedLayerIds = [];
		/**@type {CanvasRenderingContext2D}*/
		self._context = null;
		self._scaleFactor = 1.0;
		self._scalePercent = 1.0;
		/**@type {DrawableCanvas.defaults}*/
		self._options = $.extend(DrawableCanvas.defaults, optionsIn);
		/**@type {DrawableCanvas.InputService}*/
		self._inputService = null;
		/**@type {Array<DrawableCanvas.IDrawable>}*/
		self._drawables = [];
		self._pan = {
			x: 0,
			y: 0
		};
		self.mediaSize = {
			width: 0,
			height: 0
		};
		
		var isPanning = false;
		var lastMousePosition = {x: 0, y: 0};
		
		//</editor-fold>
		
		init();
		
		//<editor-fold name="Initialization">
		
		function init () {
			self._eventEmitter = new DrawableCanvas.EventEmitter($(this));
			self._context = self.$canvas[0].getContext("2d");
			self._inputService = new DrawableCanvas.InputService($canvasElement.parent());
			bindEvents();
		}
		
		function bindEvents () {
			var $inputService = $(self._inputService);
			$inputService.on(DrawableCanvas.InputService.Event.pointerUp, onInputService_PointerUp);
			$inputService.on(DrawableCanvas.InputService.Event.pointerDown, onInputService_PointerDown);
			$inputService.on(DrawableCanvas.InputService.Event.pointerMove, onInputService_PointerMove);
			$inputService.on(DrawableCanvas.InputService.Event.mouseWheel, onInputService_MouseWheel);
		}
		
		//</editor-fold>
		
		//<editor-fold name="Input Service">
		
		function onInputService_PointerDown (event) {
			if (self._scalePercent > 1.0)
			{
				isPanning = true;
			}

			var str = "test";
			str.indexOf();
			lastMousePosition = event.point;
		}
		
		function onInputService_PointerMove (event) {
			if (isPanning === true)
			{
				var translateX = lastMousePosition.x - event.point.x;
				var translateY = lastMousePosition.y - event.point.y;
				self.translatePan(translateX, translateY);
			}
			lastMousePosition = event.point;
		}
		
		function onInputService_PointerUp (event) {
			isPanning = false;
			lastMousePosition = event.point;
		}
		
		function onInputService_MouseWheel (event) {
			var currentScaleFactor = self.getScaleFactor();
			if (event.direction === "up")
			{
				// Zoom in
				self.setScaleFactor(currentScaleFactor + self._options.zoomIncrement)
			}
			else if (event.direction === "down")
			{
				// Zoom out
				self.setScaleFactor(currentScaleFactor - self._options.zoomIncrement)
			}
		}
		
		//</editor-fold>
		
	};
	
	//<editor-fold name="Options">
	
	DrawableCanvas.defaults = {
		minScaleFactor: 0.2,
		maxScaleFactor: 4,
		zoomIncrement: 0.05,
		scaleIsPercentBased: true
	};
	
	//</editor-fold>
	
	//<editor-fold name="Public Methods">
	
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
			left: Math.max(0, ($container.width() - this.$canvas.outerWidth(true)) / 2),
			top: Math.max(0, ($container.height() - this.$canvas.outerHeight(true)) / 2)
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
	
	//</editor-fold>

})();