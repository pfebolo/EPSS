describe('Test Unitarios app', function () {
	it('Cargó Test app', function () {
		expect(3 + 3).toEqual(6);
	});

	var UserService;
	var Sq;
	var SrootScope;
	var Sroute;
	
	beforeEach(angular.mock.module('EPSSApp'));
	
	beforeEach(inject(function($http, _$rootScope_, _$q_, _$route_, _UserService_) {
		UserService = _UserService_;
		Sq = _$q_;
		SrootScope= _$rootScope_;
		Sroute = _$route_;
	}));

	it('Debería estar definido el servicio: UserService ', function () {
		expect(UserService).toBeDefined();
	});

	it('Debería estar definida la función para obtener la configuración.', function () {
		expect(UserService.getConfig).toBeDefined();
	});

	it('Debería obtenerse una promesa (de lectura de archivo de configuración).', function () {
		var defered = Sq.defer();
		var promise = defered.promise;

		var p = null;
		expect(p).toBeNull();
		p = UserService.getConfig();
		expect(p).toBeDefined();
		expect(p).not.toBeNull();
		expect(Object.getPrototypeOf(p)).toEqual(Object.getPrototypeOf(promise));
	});

	it('Debería cargarse la configuración.', function () {
		var configData = {};
		UserService.cargarConfig(configData);
		expect(SrootScope.config).toEqual(configData);
	});

	it('Debería cargarse la configuración por omisión.', function () {
		var configData = { 'servidor': 'http://*:5000/', 'PIN': 10000 };
		UserService.cargarConfigPorOmision(null);
		expect(SrootScope.config).toEqual(configData);
	});

	
	it('Deberían la rutas configuradas aplicar la convención de nombres.', function () {
		//console.log(typeof Sroute.routes.length());
		//console.log(Sroute.routes);
		angular.forEach(Sroute.routes, function (route, key) {
			if (route.hasOwnProperty('templateUrl')) {
				var nameConventionControlador = key.substr(1) + 'Controlador';
				var nameConventiontemplateUrl = 'Partials' + key + '.html';
				expect(route.controller).toBe(nameConventionControlador);
				expect(route.templateUrl).toBe(nameConventiontemplateUrl);
			}
		});

		//expect(Sroute.routes['/interesadoLista'].controller).toBe('interesadoListaControlador');
		//expect(Sroute.routes['/interesadoLista'].templateUrl).toEqual('Partials/interesadoLista.html');

		// expect(Sroute.routes['/home/:PartyID'].controller).toBe('HomeCtrl');
		// expect(Sroute.routes['/home/:PartyID'].templateUrl).toEqual('app/views/home.html');

		// expect(Sroute.routes['/edit/:PartyID'].controller).toBe('EditCtrl');
		// expect(Sroute.routes['/edit/:PartyID'].templateUrl).toEqual('app/views/update_profile.html');

		// expect(Sroute.routes['/route'].controller).toBe('RouteCtrl');
		// expect(Sroute.routes['/route'].templateUrl).toEqual('app/views/route.html');

		// expect(Sroute.routes['/signup'].controller).toBe('SignupCtrl');
		// expect(Sroute.routes['/signup'].templateUrl).toEqual('app/views/signup.html');

		// expect(Sroute.routes['/streamconfigs/:id'].controller).toBe('LoginCtrl');
		// expect(Sroute.routes['/streamconfigs/:id'].templateUrl).toEqual('app/views/login.html');

		// expect(Sroute.routes[null].redirectTo).toEqual('/');
	});	

});