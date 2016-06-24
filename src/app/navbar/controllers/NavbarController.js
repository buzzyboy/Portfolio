/**
 * Created by cody on 6/23/16.
 */

(function () {
	"use strict";
	
	angular
		.module('CodyPortfolio')
		.controller('NavbarController', NavbarController);
	
	NavbarController.$inject = ['$rootScope', '$state'];
	
	/* @ngInject */
	function NavbarController ($rootScope, $state) {
		/* jshint validthis: true */
		var vm = this;
		
		vm.activate = activate;
		vm.title = 'NavbarController';
		vm.state = $state.current.name;
		activate();
		
		////////////////
		
		function activate () {
		}
	}
})();

