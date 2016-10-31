angular.module('VideoPlayer.MainController', ['VideoPlayer.Services', 'Users.LoginServices', 'angular-input-stars', 'ui.router'])

	.controller('videoMainController',
				['$scope',
				 'VideoServices',
				 'UserServices',
				 '$state',
				 '$rootScope',
				 function($scope,
				 		  VideoServices,
				 		  UserServices,
				 		  $state,
				 		  $rootScope) {
		$scope.app = {};
		$scope.app.username = $rootScope.userName;

		$scope.logout = function() {
			// Method to logging out.
			UserServices.logout()
				.success(function(response) {
					$state.go('login');
				});
		};

		this.getVideos = function() {
			VideoServices.getLastTenVideos()
				.success(function(response) {
					$scope.app.videos = response.data;
					return true;
				})
				.error(function(error) {
					return false;
				});
				return false;
		};

		this.getVideos();

		$scope.currentlyPlayingVideo = undefined;

		$scope.startPlayMovie = function(event) {
			// This method is used to pause all other videos
			// while click another video.
			if ($scope.currentlyPlayingVideo) {
				$scope.currentlyPlayingVideo.pause();
			}
			var element = angular.element(event.srcElement);
			if ($scope.currentlyPlayingVideo && $scope.currentlyPlayingVideo === element[0]) {
				$scope.currentlyPlayingVideo.pause();
				$scope.currentlyPlayingVideo = undefined;
			} else {
				$scope.currentlyPlayingVideo = element[0];
				$scope.currentlyPlayingVideo.play();
			}
			
		};
}]);