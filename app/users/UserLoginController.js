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