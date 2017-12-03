describe('Module: legajoModulo', function () {
	describe('Service: legajoSrv', function () {

		var legajoSrv;
		var UtilService;
		var $rootScope;
		var $q;
		var $httpBackend;


		beforeEach(angular.mock.module('EPSSApp'));
		beforeEach(angular.mock.module('legajoModulo'));

		beforeEach(inject(function (_$q_, _$rootScope_, _UtilService_, _$httpBackend_) {
			UtilService = _UtilService_;
			$rootScope = _$rootScope_;
			$rootScope.config = { 'servidor': 'http://localhost:5000/', 'PIN': 10000 };
			$q = _$q_;
			$httpBackend = _$httpBackend_;
		}));

		beforeEach(angular.mock.inject(function (_legajoSrv_) {
			legajoSrv = _legajoSrv_;
		}));

		it('Debería existir el servicio: legajoSrv.', function () {
			expect(legajoSrv).toBeDefined();
		});

		it('Debería la función getAll retornar una promesa.', function () {
			var defered = $q.defer();
			var promise = defered.promise;
			var p = null;

			expect(p).toBeNull();
			p = legajoSrv.getAll();
			expect(p).toBeDefined();
			expect(p).not.toBeNull();
			expect(Object.getPrototypeOf(p)).toEqual(Object.getPrototypeOf(promise));

		});


		it('Debería la función getAll llamar a \api/legajos\' y resolver positivamente.', function () {
			var baseUrl = $rootScope.config.servidor;
			legajoSrv.getAll();

			//"spy (sin ejecución)" 
			spyOn(UtilService, 'converDate');
			spyOn(UtilService, 'decodificarDatosViejoSistema');

			//Define la llamada GET con respuesta positiva.
			$httpBackend
				.expect('GET', baseUrl + 'api/legajos')
				.respond(200, {});

			//Ejecuta la llamada (siumlada) de $http
			expect($httpBackend.flush).not.toThrow();
			//Verifica que efectivamente se ruteo la salida a la resolución positiva
			expect(UtilService.converDate).toHaveBeenCalled();
			expect(UtilService.decodificarDatosViejoSistema).toHaveBeenCalled();
		});

		it('Debería la función getAll llamar a \api/legajos\' y resolver negativamente.', function () {
			var baseUrl = $rootScope.config.servidor;
			legajoSrv.getAll();

			//Define la llamada GET con respuesta negativa.
			$httpBackend
				.expect('GET', baseUrl + 'api/legajos')
				.respond(400, {});

			//Se ejecuta la llamada (siumlada) de $http
			expect($httpBackend.flush).toThrow();
		});




	});
});