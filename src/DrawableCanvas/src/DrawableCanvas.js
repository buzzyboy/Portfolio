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

		/**
		 * @param {{x:Number, y:Number}} point
		 */
		function convertInputServicePointToCanvasPoint (point) {
			return {
				x: ((point.x + self._pan.x) / self._scaleFactor),
				y: ((point.y + self._pan.y) / self._scaleFactor)
			};
		}
		
		function onInputService_PointerDown (event) {
			var point = convertInputServicePointToCanvasPoint(event.point);
			if (self._scalePercent > 1.0)
			{
				isPanning = true;
			}
			lastMousePosition = point;
		}
		
		function onInputService_PointerMove (event) {
			var point = convertInputServicePointToCanvasPoint(event.point);
			if (isPanning === true)
			{
				var translateX = lastMousePosition.x - point.x;
				var translateY = lastMousePosition.y - point.y;
				self.translatePan(translateX, translateY);
			}
			else {
				var needsRedraw = false;
				var collidingDrawables = getDrawablesCollidingWithPoint(point);
				self._drawables.filter(function (d) { return d.highlighted === true; }).forEach(function (drawable) {
					drawable.highlighted = false;
					needsRedraw = true;
				});
				collidingDrawables.forEach(function (drawable) {
					drawable.highlighted = true;
					needsRedraw = true;
				});

				if (needsRedraw === true) {
					self.render();
				}
			}
			lastMousePosition = point;
		}
		
		function onInputService_PointerUp (event) {
			var point = convertInputServicePointToCanvasPoint(event.point);
			isPanning = false;
			lastMousePosition = point;
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

		//<editor-fold name="Collisions">

		/**
		 * @param {{x:Number, y:Number}} point
		 */
		function getDrawablesCollidingWithPoint (point) {
			/**@type {Array<DrawableCanvas.ICollidable>}*/
			var drawables = [];
			var collisionRectangle = {
				x: point.x - 5,
				y: point.y - 5,
				width: 10,
				height: 10
			};
			for (var i = 0; i < self._drawables.length; i++)
			{
				if (self._drawables[i]["collidesWithRectangle"]) {
					/**@type {DrawableCanvas.ICollidable}}*/
					var collidable = self._drawables[i];
					if (collidable["collidesWithRectangle"](collisionRectangle)) {
						drawables.push(collidable);
					}
				}

			}
			return drawables;
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
})();