describe('Test Unitarios app', function () {
	it('Cargó Test app', function () {
		expect(3 + 3).toEqual(6);
	});

	var UserService;

	beforeEach(angular.mock.module('EPSSApp'));

	beforeEach(inject(function($http, $rootScope, $q, _UserService_) {
		UserService = _UserService_;
	}));


});