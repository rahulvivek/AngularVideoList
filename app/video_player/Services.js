angular.module('VideoPlayer.Services', [])
	.service('VideoServices', ['$http', '$rootScope', function($http, $rootScope) {
		this.getLastTenVideos = function() {
			// Method to get last ten videos.
			// we have to pass session ID
			var sessionId = $rootScope.sessionID;
			var params = { params: { sessionId: sessionId }};
			return $http.get('/videos', params);
		};

		this.setVideoRating = function(id, rating) {
			// method to set rating.
			// we have to pass session ID.
			var sessionId = $rootScope.sessionID;
			var params = { params: { sessionId: sessionId }};
			postData = {videoId: id, rating: rating};
			return $http.post('/video/ratings?sessionId=' + sessionId, postData);
		};

		return this;
	}]);