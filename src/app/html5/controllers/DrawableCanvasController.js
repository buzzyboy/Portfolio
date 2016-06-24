/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";
	
	angular
		.module('CodyPortfolio')
		.controller('DrawableCanvasController', DrawableCanvasController);
	
	DrawableCanvasController.$inject = [];
	
	/* @ngInject */
	function DrawableCanvasController () {
		/* jshint validthis: true */
		var vm = this;
		
		vm.activate = activate;
		vm.title = 'DrawableCanvasController';
		vm.onDrawableCanvasReady = onDrawableCanvasReady;
		
		activate();
		
		////////////////
		
		function activate () { }

		/**
		 * @param {DrawableCanvas} drawableCanvas
		 */
		function onDrawableCanvasReady (drawableCanvas) {
			var rect = new DrawableCanvas.Rectangle(5, 5, 240, 240, "red");
			var circle = new DrawableCanvas.Circle(25, 25, 25, "blue");
			circle.filled = true;
			drawableCanvas.setDrawables([rect, circle]);
		}
	}
})();

