/**
 * Created by cody on 6/22/16.
 */

var DrawableCanvas;

(function () {
	"use strict";
	
	/**
	 * @param {jQuery} $canvasElement
	 * @param {DrawableCanvas.defaults} optionsIn
	 * @constructor
	 */
	DrawableCanvas = function ($canvasElement, optionsIn) {
		
		//<editor-fold name="Variables">
		
		var self = this;
		self.$canvas = $canvasElement;
		/**@type {DrawableCanvas.EventEmitter}*/
		self._eventEmitter = null;
		self._mutedLayerIds = [];
		/**@type {CanvasRenderingContext2D}*/
		self._context = null;
		self._scaleFactor = 1.0;
		self._scalePercent = 1.0;
		/**@type {DrawableCanvas.defaults}*/
		self._options = $.extend(DrawableCanvas.defaults, optionsIn);
		/**@type {DrawableCanvas.InputService}*/
		self._inputService = null;
		/**@type {Array<DrawableCanvas.Drawable>}*/
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
		var lastMousePosition = {x:0, y:0};
		
		//</editor-fold>
		
		init();
		
		//<editor-fold name="Initialization">
		
		function init () {
			self._eventEmitter = new DrawableCanvas.EventEmitter($(this));
			self._context = self.$canvas[0].getContext("2d");
			self._inputService = new DrawableCanvas.InputService($canvasElement);
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
			if (isPanning === true) {
				var translateX = event.point.x - lastMousePosition.x;
				var translateY = event.point.y - lastMousePosition.y;
				self.translatePan(translateX, translateY);
			}
			lastMousePosition = event.point;
		}
		
		function onInputService_PointerUp (event) {
			console.log("Pointer up");
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
	 * @param {TabeebAnnotation} annotation
	 * @returns {boolean}
	 */
	DrawableCanvas.isAnnotationMuted = function (annotation) {
		return this._mutedLayerIds.indexOf(annotation.layerId) >= 0;
	};
	
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
	
	DrawableCanvas.removeMutedLayerId = function (layerId) {
		var index = this._mutedLayerIds.indexOf(layerId);
		if (index >= 0)
		{
			this._mutedLayerIds.splice(index, 1);
		}
	};
	
	//</editor-fold>
	
	//<editor-fold name="Sizing and Scaling">
	
	DrawableCanvas.prototype.setPan = function (x, y) {
		this._pan.x = x;
		this._pan.y = y;
		console.log("Setting Pan", this._pan.x, this._pan.y);
		this.render();
	};
	
	DrawableCanvas.prototype.translatePan = function (x, y) {
		this.setPan(this._pan.x + x ,this._pan.y + y);
	};
	
	DrawableCanvas.prototype.calculatorScaleFactorWithPercent = function (scalePercent) {
		var basedOnWidth = this.isZoomPercentageBasedOnWidth();
		var viewport = this.getViewport(1);
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
	
	DrawableCanvas.prototype.getViewport = function (scalePercent) {
		return {
			width: this.$canvas.parent().width() * scalePercent,
			height: this.$canvas.parent().height() * scalePercent
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
	
	DrawableCanvas.prototype.isZoomPercentageBasedOnWidth = function () {
		var viewport = this.getViewport(1.0);
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
	 * @param {Number} [scaleFactor]
	 */
	DrawableCanvas.prototype.setScaleFactor = function (scaleFactor) {
		scaleFactor = parseFloat(Math.min(this._options.maxScaleFactor, Math.max(this._options.minScaleFactor, scaleFactor)).toFixed(2));
		if (this._options.scaleIsPercentBased)
		{
			this._scalePercent = scaleFactor;
			console.log("Scale", this._scalePercent*100 + "%");
			scaleFactor = this.calculatorScaleFactorWithPercent(scaleFactor);
		}
		this._scaleFactor = scaleFactor;
		this.resize();
	};
	
	/**
	 * @returns {Number|*}
	 */
	DrawableCanvas.prototype.getScaleFactor = function () {
		if (this._options.scaleIsPercentBased) {
			return this._scalePercent;
		}
		else
		{
			return this._scaleFactor;
		}
	};
	
	/**
	 * @param {Number} [scaleFactor]
	 */
	DrawableCanvas.prototype.coordinateScale = function (scaleFactor) {
		if (scaleFactor)
		{
			this._coordinateScale = scaleFactor;
		}
		else
		{
			return this._coordinateScale;
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
		this.centerCanvasInContainer();
		this.render();
	};
	
	//</editor-fold>
	
	//<editor-fold name="Rendering">
	
	DrawableCanvas.prototype.setDrawables = function (drawables) {
		this._drawables = drawables;
	};
	
	DrawableCanvas.prototype.render = function () {
		var $canvas = this.$canvas;
		var context = this._context;
		var scaleFactor = this._scaleFactor;
		var drawnWidth = parseInt(this.mediaSize.width * scaleFactor);
		var drawnHeight = parseInt(this.mediaSize.height * scaleFactor);
		var maxPanX = drawnWidth - $canvas.width();
		var maxPanY = drawnHeight - $canvas.innerHeight();

		var panX = Math.max(0, Math.min(maxPanX, this._pan.x));
		var panY = Math.max(0, Math.min(maxPanY, this._pan.y));

		context.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
		context.save();
		context.translate(panX, panY);
		context.scale(scaleFactor, scaleFactor);

		this._drawables.forEach(function (drawable) {
			//context.translate(drawable.x, drawable.y);
			drawable.draw(context);
		});
		context.restore();

		this._eventEmitter.emitRenderedEvent();
	};
	
	//</editor-fold>
	
	//</editor-fold>
	
	//<editor-fold name="Events">
	
	DrawableCanvas.Events = {
		rendered: "rendered"
	};
	
	DrawableCanvas.EventEmitter = function ($triggerElement) {
		//<editor-fold name="Variables">
		
		var self = this;
		self.$triggerElement = $triggerElement;
		
		//</editor-fold>
	};
	
	DrawableCanvas.EventEmitter.prototype = {
		emitEvent: function (event) {
			this.$triggerElement.trigger(event);
		},
		emitRenderedEvent: function () {
			this.emitEvent(DrawableCanvas.Events.rendered);
		}
	};
	
	//</editor-fold>
	
})();