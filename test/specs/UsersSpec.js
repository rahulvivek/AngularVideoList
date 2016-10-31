describe("User loginController", function() {
	var scope, createController;

	beforeEach(module('Users.LoginCtrl'));

	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();

		createController = function() {
			return $controller("loginController", {$scope: scope});
		};
	}))

	it("shold not login if form is empty", function() {
		var controller = createController()
		// scope.form = { username:"", password:"" }
		var loginPassed = scope.login();
		expect(loginPassed).toBeFalsy();
	})

	it("if user cannot login if they haven't a valid user name and password", function() {
		var controller = createController()
		scope.form = {username: 'test', password: 'test'};
		var loginPassed = scope.login();
		expect(loginPassed).toBeFalsy();
	})
});