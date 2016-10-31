(function () {
   'use strict';
   // Defining main App module
   // Injecting all Controllers and Services
   angular.module('videoApp', [
		'ui.router',
		'angular-input-stars',
		'Users.LoginCtrl',
		'Users.LoginServices',
		'VideoPlayer.ListVideoController',
		'VideoPlayer.MainController',
		'VideoPlayer.Services',
		'VideoPlayer.DetailVideoController',
		'Utils.RatingStart',
		'infinite-scroll',
	]);

   	// Setting slow down the infinite scroll in video listing.
	angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);
 	
}());





