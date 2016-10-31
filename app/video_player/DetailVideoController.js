angular.module('VideoPlayer.DetailVideoController',
								['VideoPlayer.Services',
								 'Utils.RatingStart',
								 'ui.event'])

	.controller('detailVideoController',
				['$scope',
				 'VideoServices',
				 '$stateParams',
				 function($scope,
				 		  VideoServices,
				 		  $stateParams) {
				 	// This variable is used to track the rating.
				 	$scope.app.currentValue = undefined;

				 	$scope.updateRating = function() {
				 		// Method to update the user selected rating.
				 		VideoServices.setVideoRating($scope.app.selectedVideo._id, $scope.app.currentValue)
				 			.success(function(response) {
				 				$scope.app.selectedVideo = response.data;
				 			})
				 			.error(function(error) {

				 			});
				 	};

				 	$scope.app.getRating = function() {
				 		// Method to find average rating of value.
				 		if ($scope.app.currentValue) {
				 			return $scope.app.currentValue;
				 		} else {
				 			var rating = 0;
					 		for (var _i = 0; _i < $scope.app.selectedVideo.ratings.length; _i++) {
					 			rating += $scope.app.selectedVideo.ratings[_i];
					 		}
					 		rating = parseInt(rating / $scope.app.selectedVideo.ratings.length);
					 		return rating;
				 		}
				 		
				 	};

				 	this.findSelectedVideo = function() {
				 		// Method to find the video from the list
				 		// of videos using params
				 		var selectedID = $stateParams.videoID;
				 		var videos = $scope.app.videos;

				 		for (var _i = 0; _i < videos.length; _i++) {
				 			var currentItem = videos[_i];
				 			if (currentItem._id == selectedID) {
				 				$scope.app.selectedVideo = currentItem;
				 			}
				 		}
				 	};

				 	this.findSelectedVideo();


		
}]);