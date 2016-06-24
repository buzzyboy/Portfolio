/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";

	angular
		.module('CodyPortfolio')
		.controller('HTML5Controller', HTML5Controller);

	HTML5Controller.$inject = [];

	/* @ngInject */
	function HTML5Controller () {
		/* jshint validthis: true */
		var vm = this;

		vm.activate = activate;
		vm.title = 'HTML5Controller';

		activate();

		////////////////

		function activate () { }
	}
})();

