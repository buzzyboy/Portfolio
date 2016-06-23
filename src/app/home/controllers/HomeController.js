/**
 * Created by cody on 6/22/16.
 */

(function () {
	"use strict";

	angular
		.module('CodyPortfolio')
		.controller('HomeController', HomeController);

	HomeController.$inject = [];

	/* @ngInject */
	function HomeController () {
		/* jshint validthis: true */
		var vm = this;

		vm.activate = activate;

		activate();

		////////////////

		function activate () { }
	}
})();

