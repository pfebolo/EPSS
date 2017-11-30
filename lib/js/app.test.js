describe('Test Unitarios app', function () {
	it('Cargó Test app', function () {
		expect(3 + 3).toEqual(6);
	});

	var UserService;
	var $q;

	beforeEach(angular.mock.module('EPSSApp'));

	beforeEach(inject(function($http, $rootScope, _$q_, _UserService_) {
		UserService = _UserService_;
		$q = _$q_;
	}));

	it('Debería existir el servicio: UserService ', function () {
		expect(UserService).toBeDefined();
	});

	it('Debería existir la función UserService.getConfig', function () {
		expect(UserService.getConfig).toBeDefined();
	});

	it('Debería obtenerse una promesa (de lectura de archivo de configuración)', function () {
		var defered = $q.defer();
		var promise = defered.promise;

		var p = null;
		expect(p).toBeNull();
		p = UserService.getConfig();
		expect(p).toBeDefined();
		expect(p).not.toBeNull();
		expect(Object.getPrototypeOf(p)).toEqual(Object.getPrototypeOf(promise));
	});

});