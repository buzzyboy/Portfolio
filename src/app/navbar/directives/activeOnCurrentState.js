/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";

	angular
		.module("CodyPortfolio")
		.directive("activeOnCurrentState", activeOnCurrentStateDirective);

	activeOnCurrentStateDirective.$inject = ['$state'];

	/**
	 * Will toggle the "active" class if one of the children anchors are the current $state.current.name
	 * @param angularElement
	 * @param currentStateName
	 * @returns {boolean}
	 */
	function shouldBeActive (angularElement, currentStateName) {
		var anchors = angularElement.find("[ui-sref]");
		for (var i = 0; i < anchors.length; i++)
		{
			var anchor = angular.element(anchors[i]);
			var stateName = anchor.attr("ui-sref");
			if (stateName == currentStateName) {
				return true;
			}
		}
		return false;
	}

	function activeOnCurrentStateDirective ($state) {
		return {
			restrict: "A",
			link: function (scope, elem, attrs) {
				elem.toggleClass("active", shouldBeActive(elem, $state.current.name));
			}
		}
	}
})();