describe("Video Player", function() {
	var scope, createController;

	beforeEach(module('VideoPlayer.MainController'));

	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();

		createController = function() {
			return $controller("videoMainController", {$scope: scope});
		};
	}))

	it("it should defined", function() {
		var controller = createController()
		expect(controller).toBeDefined()
	})

	it("it should have scope app object", function() {
		var controller = createController()
		expect(scope.app).toBeDefined()
	})	
});