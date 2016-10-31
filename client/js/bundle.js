(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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






},{}],2:[function(require,module,exports){
angular.module('videoApp', ['ui.router',
							'Users.LoginCtrl',
							'VideoPlayer.ListVideoController',
							'VideoPlayer.MainController',
							'VideoPlayer.DetailVideoController'])
	.config(['$urlRouterProvider',
			 '$stateProvider',
			 function($urlRouterProvider,
			 		  $stateProvider) {
			 	// Define url routing using ui-router.
			 	// data : { requireLogin: true } is using for enble that view
			 	// only visibe if user is authenicated.
				$stateProvider
					.state('login', {
						url: '/login',
						templateUrl: '/partials/_login.html',
						controller: 'loginController'
					})
					.state('videos', {
						url: '/videos',
						data: { requireLogin: true },
						abstract: true,
						templateUrl: '/partials/_video_view.html',
						controller: 'videoMainController'
					})
					.state('videos.list', {
						url: '/list',
						data: { requireLogin: true },
						templateUrl: '/partials/_list_videos.html',
						controller: 'listVideoController'
					})
					.state('videos.detail', {
						url: '/detail/:videoID',
						data: { requireLogin: true },
						templateUrl: '/partials/_video_detail.html',
						controller: 'detailVideoController'
					});
				// If the routing url is not found
				// redirect to video listing page.
				$urlRouterProvider.otherwise('/videos/list');
			}])
			.run(['$rootScope', '$state', function($rootScope, $state) {
				$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
					if (toState.data) {
						var requireLogin = toState.data.requireLogin;
						if (requireLogin && !$rootScope.sessionID) {
							// We already have user session ID in rootScope
							// So we are checking if rootscope have this session id
							// if no session ID we are redirecting login page.
							event.preventDefault();
							$state.go('login');
						} else {
							// if user is authenicated user we are allow tranisition
							// we are setting notify false to remove maximum call stack issue.
							$state.go(toState.name, toParams, { notify:false });
						}
					}
					
					
				});
			}]
);
},{}],3:[function(require,module,exports){
angular.module('Users.LoginServices', ['angular-md5'])
	.service('UserServices', ['$http', 'md5', '$rootScope', function($http, md5, $rootScope) {
		this.login = function(userData) {
			// Method to login the user
			// userData : {username: "username", password: "password"}
			// we are converting the raw password to md5 hash and 
			// post to the server.
			var password = md5.createHash(userData.password);
			userData.password = password;
			return $http.post('/user/auth', userData);
		};

		this.logout = function() {
			// method to logout the current session.
			// we are sending active session and sessionID 
			// to logging out
			var params = {params: {activeSession: $rootScope.sessionID, sessionId: $rootScope.sessionID}};
			return $http.get('/user/logout', params);
		};

		return this;
	}]);
},{}],4:[function(require,module,exports){
angular.module('Users.LoginCtrl', ['Users.LoginServices', 'ui.router'])

	.controller('loginController', ['$scope',
									'UserServices',
									'$rootScope',
									'$state',
									function($scope,
											 UserServices,
											 $rootScope,
											 $state) {
		$scope.form = {
			username: "",
			password: "",
		};

		$scope.app = {};

		// Method to login
		$scope.login = function() {
			if ($scope.form.username === "" || $scope.form.password === "") {
				// If password is empty md5 raise length error
				// so we are checking is username and password is entered.
				$scope.app.error = "Please enter a valid username and password.";
				return false;
			}

			UserServices.login($scope.form)
				.success(function(response) {
					if(response.status == "success") {
						// if user is successfully authenicated
						// we get the session id from response and
						// we keep that in the rootscope to further
						// api calls.
						// and we redirect the view to vidoe listing.
						$rootScope.sessionID = response.sessionId;
						$rootScope.userName = response.username;
						$state.go('videos.list');
						$scope.app.error = undefined;
						return true;
					} else {
						// if user authentication fails 
						// it reture response with erro message.
						// so we are clear the form and show the error message.
						$scope.form = {};
						$scope.app.error = response.error;
						return false;
					}
				})
				.error(function(error) {
					return false;
				});
		};
}]);
},{}],5:[function(require,module,exports){
angular.module('Utils.RatingStart', [])
	.directive('starRating', [ '$parse', function($parse) {
		// Directive to show rating stars.
		return {
	        restrict: 'E',
	        require: 'ngModel',
	        template: '<ul class="rating">' +
	            '<li ng-repeat="star in stars" ng-click="selectRating($index)" ng-class="star">' +
	            '\u2605' +
	            '</li>' +
	            '</ul>',
	        replace: true,
	        scope: {
	            ratingValue: '=',
	            max: '=',
	            currentValue: '=',
	            updateparent: '&',
	            canUpdate: "=",
	        },

	        link: function (scope, elem, attrs, ngModel) {
	        	function rederStars(rating) {
	        		scope.stars = [];
		            for (var i = 0; i < scope.max; i++) {
		                scope.stars.push({
		                    filled: i < rating
		                });
		            }
	        	}

	        	rederStars(scope.ratingValue);
	            

	            scope.selectRating = function(index) {
	            	// this method is used to get the user selected 
	            	// rating.

	            	if (scope.canUpdate) {
	            		ngModel.$setViewValue(index + 1);
		            	ngModel.$render();
		            	rederStars(index + 1);
				        scope.updateparent();
	            	}
	            	
	            };
	        }
	    };
	}]);

},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}]},{},[1,2,3,4,5,6,7,8,9]);
