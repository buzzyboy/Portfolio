/**
 * Created by cody on 6/22/16.
 */

(function () {
	"use strict";

	angular
		.module("CodyPortfolio")
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

	/**
	 * @param {ui.router.router.$stateProvider} $stateProvider
	 * @param {ui.router.router.$urlRouterProvider} $urlRouterProvider
	 */
	function routeConfig ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');

		$stateProvider.state({
			name: "home",
			url: "/home",
			views: {
				"main@": {
					templateUrl: "app/home/home.html"
				},
				"navbar@home": {
					templateUrl: "app/navbar/navbar.html"
				}
			}
		});
		$stateProvider.state({
			name: "html5",
			url: "/html5",
			views: {
				"main@": {
					templateUrl: "app/html5/html5.html"
				},
				"navbar@html5": {
					templateUrl: "app/navbar/navbar.html"
				}
			}
		});
	}
})();