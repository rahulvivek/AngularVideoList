angular.module('VideoPlayer.ListVideoController', ['VideoPlayer.Services', 'infinite-scroll'])

	.controller('listVideoController',
				['$scope',
				 'VideoServices',

				 function($scope,
				 		  VideoServices) {

				 	$scope.app.reloading = false;

					$scope.app.myPagingFunction = function() {
						// Method to update videos from new videos
						// using infinite scrolls.
						if ($scope.app.reloading) return;
						getVideos();
						$scope.app.reloading = true;
					};

					$scope.app.getRating = function(video) {
				 		// Method to find average rating of value.
			 			var rating = 0;
				 		for (var _i = 0; _i < video.ratings.length; _i++) {
				 			rating += video.ratings[_i];
				 		}
				 		rating = parseInt(rating / video.ratings.length);
				 		return rating;
				 	};

					function getVideos() {
						VideoServices.getLastTenVideos()
							.success(function(response) {
								for (var _i = 0; _i < response.data.length; _i++) {
									$scope.app.videos.push(response.data[_i]);
								}
								$scope.app.reloading = false;
							})
							.error(function(error) {
								console.log(error);
								$scope.app.reloading = false;
							});
				}
				
}]);