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
		}
	};
})();
