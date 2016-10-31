describe("User Sevices", function() {
	var service, createService;

	beforeEach(module('Users.LoginServices'));

	beforeEach(inject(function($injector) {
		service = $injector.get('UserServices')
	}))

	it("should defined", function() {
		expect(service).toBeDefined()
	})

	it("it's should have a login function and logout function", function() {
		expect(service.login).toBeDefined();
		expect(service.logout).toBeDefined();
	})

	it("it should not login if username or password is wrong", function() {
		service.login({ password: "test", username: "ali" })
			.success(function(response) {
				expect(response.status).toEqual("error");
			})
			.error(function(error) {

			})
	})

	it("it should login if username or password is correct", function() {
		service.login({ password: "password", username: "ali" })
			.success(function(response) {
				expect(response.status).toEqual("success");
			})
			.error(function(error) {

			})
	})

	it("login function will return a sessionId if login success", function() {
		service.login({ password: "password", username: "ali" })
			.success(function(response) {
				expect(response.sessionId).toBeDefined();
			})
			.error(function(error) {

			})
	})

	it("logout function will logout currently logged in user", function() {
		var sessionId;

		service.login({ password: "password", username: "ali" })
			.success(function(response) {
				sessionId = response.sessionId
			})
			.error(function(error) {

			})

		service.logout()
			.success(function() {
				expect(response).toBeDefined()
			})

	})


});