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