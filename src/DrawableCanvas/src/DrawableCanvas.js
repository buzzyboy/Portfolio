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
		/**@type {Array<DrawableCanvas.IDrawable>}*/
		var selectedDrawables = [];
		
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
			var collisionPoint = convertInputServicePointToCanvasPoint(event.point);
			selectedDrawables = getDrawablesCollidingWithPoint(collisionPoint);
			if (selectedDrawables.length > 0)
			{
			}
			else if (self._scalePercent > 1.0)
			{
				isPanning = true;
			}
			lastMousePosition = event.point;
		}
		
		function onInputService_PointerMove (event) {
			var translateX = (lastMousePosition.x - event.point.x);
			var translateY = lastMousePosition.y - event.point.y;
			if (isPanning === true)
			{
				self.translatePan(translateX, translateY);
			}
			else if (selectedDrawables.length > 0)
			{
				selectedDrawables.forEach(function (d) {
					d.x -= translateX / self._scaleFactor;
					d.y -= translateY / self._scaleFactor;
				});
				self.render();
			}
			else
			{
				var collisionPoint = convertInputServicePointToCanvasPoint(event.point);
				var needsRedraw = false;
				var collidingDrawables = getDrawablesCollidingWithPoint(collisionPoint);
				self._drawables
					.filter(function (d) { return d.highlighted === true; })
					.forEach(function (drawable) {
						drawable.highlighted = false;
						needsRedraw = true;
						self._eventEmitter.emitDrawableMouseLeaveEvent(drawable, collisionPoint.x, collisionPoint.y);
					});
				collidingDrawables
					.filter(function (d) { return d.highlighted === false; })
					.forEach(function (drawable) {
						drawable.highlighted = true;
						needsRedraw = true;
						self._eventEmitter.emitDrawableMouseEnterEvent(drawable, collisionPoint.x, collisionPoint.y);
					});

				if (needsRedraw === true)
				{
					self.render();
				}
			}
			lastMousePosition = event.point;
		}
		
		function onInputService_PointerUp (event) {
			var point = convertInputServicePointToCanvasPoint(event.point);
			isPanning = false;
			lastMousePosition = point;
			selectedDrawables.length = 0;
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
				x: point.x,
				y: point.y,
				width: 1,
				height: 1
			};
			for (var i = 0; i < self._drawables.length; i++)
			{
				if (self._drawables[i]["collidesWithRectangle"])
				{
					/**@type {DrawableCanvas.ICollidable}}*/
					var collidable = self._drawables[i];
					if (collidable["collidesWithRectangle"](collisionRectangle))
					{
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