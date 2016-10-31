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