/**
 * Created by cody on 6/22/16.
 */

(function () {
	"use strict";
	
	DrawableCanvas.InputService = function ($inputElement) {

		//<editor-fold name="Variables">
		
		var self = this;
		self._$inputElement = $inputElement;
		/**@type {DrawableCanvas.InputService.EventEmitter}*/
		self._eventEmitter = null;
		
		//<//editor-fold>

		init();
		
		//<editor-fold name="Initialization">
		
		function init () {
			var $self = $(self);
			self._eventEmitter = new DrawableCanvas.InputService.EventEmitter($self);
			bindEvents();
		}

		function bindEvents() {
			self._$inputElement.on("mousedown", onInputElement_MouseDown);
			self._$inputElement.on("mouseup", onInputElement_MouseUp);
			self._$inputElement.on("mousemove", onInputElement_MouseMove);
			self._$inputElement.on("mousewheel", onInputElement_MouseWheel);
		}

		//</editor-fold>

		//<editor-fold name="Events">

		function onInputElement_MouseDown (event) {
			self._eventEmitter.emitPointerDownEvent(event);
		}

		function onInputElement_MouseUp (event) {
			self._eventEmitter.emitPointerUpEvent(event);
		}

		function onInputElement_MouseMove (event) {
			self._eventEmitter.emitPointerMoveEvent(event);
		}

		function onInputElement_MouseWheel (event) {
			var delta = (event.originalEvent.wheelDelta || -event.originalEvent.detail || -event.originalEvent.deltaY);
			var direction = delta > 0 ? "up" : "down";
			self._eventEmitter.emitMouseWheelEvent(direction);
		}

		//</editor-fold>

	};

	DrawableCanvas.InputService.Event = {
		pointerDown: "pointerDown",
		pointerUp: "pointerUp",
		pointerMove: "pointerMove",
		mouseWheel: "mouseWheel"
	};

	//<editor-fold name="Helper Methods">

	function isLeftButtonPressed (event) {
		return (event.buttons != null && event.buttons == 1) || (event.buttons == null && event.which == 1);
	}

	function createInputEvent (eventName, event) {
		if (event.offsetX)
			return $.Event(eventName, {
				point: {x: event.offsetX, y: event.offsetY},
				leftButtonDown: isLeftButtonPressed(event)
			});
		else
			return $.Event(eventName, {
				point: {
					x: event.pageX - $(event.currentTarget).offset().left,
					y: event.pageY - $(event.currentTarget).offset().top
				},
				leftButtonDown: isLeftButtonPressed(event)
			});
	}

	//</editor-fold>

	DrawableCanvas.InputService.EventEmitter = function ($triggerElement) {
		//<editor-fold name="Variables">

		var self = this;
		self.$triggerElement = $triggerElement;
		
		//</editor-fold>
	};
	
	DrawableCanvas.InputService.EventEmitter.prototype = {
		emitEvent: function (event) {
			this.$triggerElement.trigger(event);
		},
		emitPointerDownEvent: function (jQueryPointerDownEvent) {
			var event = createInputEvent(DrawableCanvas.InputService.Event.pointerDown, jQueryPointerDownEvent);
			this.emitEvent(event);
		},
		emitPointerUpEvent: function (jQueryPointerUpEvent) {
			var event = createInputEvent(DrawableCanvas.InputService.Event.pointerUp, jQueryPointerUpEvent);
			this.emitEvent(event);
		},
		emitPointerMoveEvent: function (jQueryPointerMoveEvent) {
			var event = createInputEvent(DrawableCanvas.InputService.Event.pointerMove, jQueryPointerMoveEvent);
			this.emitEvent(event);
		},
		emitMouseWheelEvent: function (direction) {
			var event = $.Event(DrawableCanvas.InputService.Event.mouseWheel, {
				direction: direction
			});
			this.emitEvent(event);
		}
	};
})();