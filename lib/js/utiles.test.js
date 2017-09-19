describe('UtilService Test ', function () {
	it('Debería validad 2 + 2 = 4 (dummy test)', function () {
		expect(2 + 2).toEqual(4);
	});

	var UtilService;

	beforeEach(angular.mock.module('EPSSApp'));

	//https://stackoverflow.com/questions/37736034/angular-jasmine-injecting-a-service-into-the-test
	// var MatchController, SearchService;
	// beforeEach(inject(function($controller, APP_CONFIG, $authUser, $http, $rootScope, $state, $stateParams, _SearchService_) {

	// 			SearchService = _SearchService_;

	// 			MatchController = $controller('MatchController', {
	// 					'APP_CONFIG':APP_CONFIG,
	// 					'$authUser':$authUser,
	// 					'$http':$http,
	// 					'$rootScope':$rootScope,
	// 					'$state':$state,
	// 					'$stateParams':$stateParams,
	// 					'$provide':$provide,
	// 					'SearchService': _SearchService_
	// 			});

	// 	}));



	beforeEach(inject(function (_UtilService_) {
		UtilService = _UtilService_;
	}));


	it('Debería existir el servicio: UtilService ', function () {
		expect(UtilService).toBeDefined();
	});

	it('Debería existir la función UtilService.obtenerAnioCursado', function () {
		expect(UtilService.obtenerAnioCursado).toBeDefined();
	});

	it('Debería existir la función UtilService.elevarAlCuadrado', function () {
		expect(UtilService.elevarAlCuadrado).toBeDefined();
	});

	it('Debería al elevar al cuadro del número 5  obtenerse el valor 5*5', function () {
		expect(UtilService.elevarAlCuadrado(5)).toEqual(5 * 5);
	});


	it('Debería existir la función UtilService.obtenerAnioCursado', function () {
		expect(UtilService.elevarAlCuadrado).toBeDefined();
	});

	it('Debería obtenerse \'1er Año\'', function () {
		expect(UtilService.obtenerAnioCursado(2016, 3)).toEqual('1er Año');
	});

	it('Debería existir la función UtilService.obtenerCuatrimestreCursado', function () {
		expect(UtilService.obtenerCuatrimestreCursado).toBeDefined();
	});

	it('Deberia convertir null a blanco', function () {
		var data = null;
		expect(UtilService.NullToBlanck(data)).toEqual('');
	});

	it('Deberia NO convertir el dato no null', function () {
		var data = 'dato';
		expect(UtilService.NullToBlanck(data)).toEqual(data);
	});


	describe('Calculo de año/cuatrimestre de cursada (secuencial)', function () {
		const PRIMER_CUATRIMESTRE = 1;
		const SEGUNDO_CUATRIMESTRE = 101;

		describe('Calculo de año de cursada (inscripcion 1er Cuatrimestre)', function () {
			it('Debería obtenerse \'1er Año\'', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion, 9); //En Octubre del mismo año de inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, PRIMER_CUATRIMESTRE)).toEqual('1er Año');
			});

			it('Debería obtenerse \'2do Año\'', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion + 1, 5); //En junio del año posterior al inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, PRIMER_CUATRIMESTRE)).toEqual('2do Año');
			});

			it('Debería obtenerse \'3er Año\'', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion + 2, 9); //En octubre, 2 años después al inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, PRIMER_CUATRIMESTRE)).toEqual('3er Año');
			});

			it('Debería obtenerse \'Carrera completa\'', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion + 2, 12); //En diciembre, 2 años después al inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, PRIMER_CUATRIMESTRE)).toEqual('Carrera completa');
			});

		});

		describe('Calculo de año de cursada (inscripcion 2do Cuatrimestre)', function () {
			it('Debería obtenerse \'1er Año\' (octubre, año de inicio)', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion, 9); //En octubre del año de inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, SEGUNDO_CUATRIMESTRE)).toEqual('1er Año');
			});

			it('Debería obtenerse \'1er Año\' (junio, 1 año después)', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion + 1, 5); //En junio del año posterior al inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, SEGUNDO_CUATRIMESTRE)).toEqual('1er Año');
			});

			it('Debería obtenerse \'2do Año\' (octubre, 1 año después)', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion + 1, 9); //En octubre del año posterior al inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, SEGUNDO_CUATRIMESTRE)).toEqual('2do Año');
			});

			it('Debería obtenerse \'2do Año\' (junio, 2 años después)', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion + 2, 5); //En junio, 2 años después al inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, SEGUNDO_CUATRIMESTRE)).toEqual('2do Año');
			});

			it('Debería obtenerse \'3er Año\' (octubre, 2 años después)', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion + 2, 9); //En octubre, 2 años después al inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, SEGUNDO_CUATRIMESTRE)).toEqual('3er Año');
			});

			it('Debería obtenerse \'3er Año\' (junio, 3 años después)', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion + 3, 5);
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, SEGUNDO_CUATRIMESTRE)).toEqual('3er Año');
			});



			it('Debería obtenerse \'Carrera completa\'  (octubre, 3 años después)', function () {
				var promocion = 2016;
				var fechaActual = new Date(promocion + 3, 9); //En diciembre, 2 años después al inicio
				expect(UtilService.obtenerAnioCursadoBase(fechaActual, promocion, SEGUNDO_CUATRIMESTRE)).toEqual('Carrera completa');
			});

		});

	});

});