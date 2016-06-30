/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";

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
		},
		//<editor-fold name="Drawable">

		/**
		 * @param {DrawableCanvas.Drawable} drawable
		 * @param {Number} canvasX
		 * @param {Number} canvasY
		 */
		emitDrawableMouseEnterEvent: function (drawable, canvasX, canvasY) {
			var event = $.Event(DrawableCanvas.Events.drawableMouseEnter, {
				drawable: drawable,
				canvasX: canvasX,
				canvasY: canvasY
			});
			this.emitEvent(event);
		},
		/**
		 * @param {DrawableCanvas.Drawable} drawable
		 * @param {Number} canvasX
		 * @param {Number} canvasY
		 */
		emitDrawableMouseLeaveEvent: function (drawable, canvasX, canvasY) {
			var event = $.Event(DrawableCanvas.Events.drawableMouseLeave, {
				drawable: drawable,
				canvasX: canvasX,
				canvasY: canvasY
			});
			this.emitEvent(event);
		},
		//</editor-fold>

		//<editor-fold name="Mouse">

		emitMouseUpEvent: function (canvasX, canvasY, selectedDrawbles) {
			var event = $.Event(DrawableCanvas.Events.mouseUp, {
				canvasX: canvasX,
				canvasY: canvasY,
				drawables: selectedDrawbles
			});
			this.emitEvent(event);
		},
		emitMouseDownEvent: function (canvasX, canvasY, selectedDrawbles) {
			var event = $.Event(DrawableCanvas.Events.mouseDown, {
				canvasX: canvasX,
				canvasY: canvasY,
				drawables: selectedDrawbles
			});
			this.emitEvent(event);
		}

		//</editor-fold>

	};
})();
