describe('Test Unitarios app', function () {
	it('Cargó Test app', function () {
		expect(3 + 3).toEqual(6);
	});

	beforeEach(angular.mock.module('EPSSApp'));

	beforeEach(inject(function($http, $rootScope, $q, _UserService_) {
	}));

});