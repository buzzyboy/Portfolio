/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";
	debugger;

	if (typeof(angular) !== "undefined") {
		angular
			.module("DrawableCanvas", []);
		angular
			.module("DrawableCanvas")
			.directive("drawableCanvas", function () {
				return {
					restrict: "A",
					scope: {
						"width": "=",
						"height": "=",
						"onReady": "@"
					},
					link: function (scope, elem) {
						var $el = $(elem);
						var drawableCanvas = new DrawableCanvas($el, {});
						debugger;
						drawableCanvas.setMediaSize(scope.width, scope.height);
					}
				}
			});
	}
})();