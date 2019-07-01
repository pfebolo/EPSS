describe('Module: app', function () {
	describe('Service: UtilService', function () {
		it('Debería validar 2 + 2 = 4 (dummy test)', function () {
			expect(2 + 2).toEqual(4);
		});

		var UtilService;
		var $rootScope;
		var $q;
		var $httpBackend;

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

		beforeEach(inject(function (_$q_, _$rootScope_, _$httpBackend_) {
			$rootScope = _$rootScope_;
			$rootScope.config = { 'servidor': 'http://localhost:5000/', 'PIN': 10000 };
			$q = _$q_;
			$httpBackend = _$httpBackend_;
		}));

		beforeEach(angular.mock.inject(function (_UtilService_) {
			UtilService = _UtilService_;
		}));

		it('Debería existir el servicio: UtilService ', function () {
			expect(UtilService).toBeDefined();
		});

		it('Debería existir la función UtilService.elevarAlCuadrado', function () {
			expect(UtilService.elevarAlCuadrado).toBeDefined();
		});

		it('Debería al elevar al cuadrado el número 5 y obtenerse el valor 5*5', function () {
			expect(UtilService.elevarAlCuadrado(5)).toEqual(5 * 5);
		});

		it('Debería convertir null a blanco', function () {
			var data = null;
			expect(UtilService.NullToBlanck(data)).toEqual('');
		});

		it('NO debería convertir el dato que no es nulo', function () {
			var data = 'dato';
			expect(UtilService.NullToBlanck(data)).toEqual(data);
		});


		describe('Arrays', function () {
			describe('Meses', function () {
				it('Debería existir el array meses', function () {
					expect(UtilService.meses).toBeDefined();
				});

				it('Debería obtener el string \'Enero\' en la posición 0', function () {
					var data = UtilService.meses[0];
					expect('Enero').toEqual(data);
				});

				it('Debería obtener el string \'Febrero\' en la posición 1', function () {
					var data = UtilService.meses[1];
					expect('Febrero').toEqual(data);
				});

				it('Debería obtener el string \'Marzo\' en la posición 2', function () {
					var data = UtilService.meses[2];
					expect('Marzo').toEqual(data);
				});

				it('Debería obtener el string \'Abril\' en la posición 3', function () {
					var data = UtilService.meses[3];
					expect('Abril').toEqual(data);
				});

				it('Debería obtener el string \'Mayo\' en la posición 4', function () {
					var data = UtilService.meses[4];
					expect('Mayo').toEqual(data);
				});

				it('Debería obtener el string \'Junio\' en la posición 5', function () {
					var data = UtilService.meses[5];
					expect('Junio').toEqual(data);
				});

				it('Debería obtener el string \'Julio\' en la posición 6', function () {
					var data = UtilService.meses[6];
					expect('Julio').toEqual(data);
				});

				it('Debería obtener el string \'Agosto\' en la posición 7', function () {
					var data = UtilService.meses[7];
					expect('Agosto').toEqual(data);
				});

				it('Debería obtener el string \'Septiembre\' en la posición 8', function () {
					var data = UtilService.meses[8];
					expect('Septiembre').toEqual(data);
				});

				it('Debería obtener el string \'Octubre\' en la posición 9', function () {
					var data = UtilService.meses[9];
					expect('Octubre').toEqual(data);
				});

				it('Debería obtener el string \'Noviembre\' en la posición 10', function () {
					var data = UtilService.meses[10];
					expect('Noviembre').toEqual(data);
				});
				it('Debería obtener el string \'Diciembre\' en la posición 11', function () {
					var data = UtilService.meses[11];
					expect('Diciembre').toEqual(data);
				});
			});

			describe('Ordinales', function () {
				it('Debería existir el array ordinales', function () {
					expect(UtilService.ordinales).toBeDefined();
				});

				it('Debería obtener el string \'1er\' en la posición 0', function () {
					var data = UtilService.ordinales[0];
					expect('1er').toEqual(data);
				});

				it('Debería obtener el string \'2do\' en la posición 1', function () {
					var data = UtilService.ordinales[1];
					expect('2do').toEqual(data);
				});

				it('Debería obtener el string \'3ro\' en la posición 2', function () {
					var data = UtilService.ordinales[2];
					expect('3er').toEqual(data);
				});

				it('Debería obtener el string \'4to\' en la posición 3', function () {
					var data = UtilService.ordinales[3];
					expect('4to').toEqual(data);
				});

				it('Debería obtener el string \'5to\' en la posición 4', function () {
					var data = UtilService.ordinales[4];
					expect('5to').toEqual(data);
				});

				it('Debería obtener el string \'6to\' en la posición 5', function () {
					var data = UtilService.ordinales[5];
					expect('6to').toEqual(data);
				});

			});



		});

		describe('Decodificar Datos Viejo Sistema', function () {
			// it('Debería existir la función decodificarDatosViejoSistema', function () {
			// 	expect(UtilService.decodificarDatosViejoSistema).toBeDefined();
			// });

			// it('Debería reemplazar signo \'+\' por blanco', function () {
			// 	var data = UtilService.decodificarDatosViejoSistema('a+a');
			// 	expect('a a').toEqual(data);
			// });

			it('Debería reemplazar signo \'%\' por \'％\'', function () {
				var data = UtilService.decodificarDatosViejoSistema('100%');
				expect('100％').toEqual(data);
			});

			it('Debería aplicar URL Decoder', function () {
				var data = UtilService.decodificarDatosViejoSistema('http%3A%2F%2Flocalhost%3A9877%2F%3Fid%3D16645061');
				expect('http://localhost:9877/?id=16645061').toEqual(data);
			});

			it('Debería reemplazar signo \'%\' por \'％\' en sub-cadenas que comiencen con % pero no son caracteres encodeados, ej: %G', function () {
				var data = UtilService.decodificarDatosViejoSistema('%G');
				expect('％G').toEqual(data);
			});

			it('Debería reemplazar signo \'%\' por \'％\' en sub-cadenas que comiencen con % pero no son caracteres encodeados, ej: %AG', function () {
				var data = UtilService.decodificarDatosViejoSistema('%AG');
				expect('％AG').toEqual(data);
			});
		});

		describe('Normalizar caracteres su comparación insensitiva', function () {
			it('Debería existir la funcion stringToLocale', function () {
				expect(UtilService.stringToLocale).toBeDefined();
			});

			it('Debería convertir a minuscula y eliminar tildes', function () {
				var data = UtilService.stringToLocale('Fenómeno áéíóúü ÁÉÍÓÚÜ ñÑ');
				expect('fenomeno aeiouu aeiouu ññ').toEqual(data);
			});

			it('Debería tratar correctamente el string vacio \'\'', function () {
				var data = UtilService.stringToLocale('');
				expect('').toEqual(data);
			});

			it('Debería tratar correctamente el string null', function () {
				var data = UtilService.stringToLocale(null);
				expect('').toEqual(data);
			});

			it('Debería tratar correctamente el string undefined', function () {
				var data = UtilService.stringToLocale(undefined);
				expect('').toEqual(data);
			});

		});

		describe('Conversiones', function () {
			it('Debería existir la función converDate', function () {
				expect(UtilService.converDate).toBeDefined();
			});

			it('Debería convertir fechas', function () {
				var data = [
					{
						'fechaIngreso': '2017-07-26T00:49:31',
						'numero': 123,
						'cadena': 'aaaaaaaaaaa',
						'innerObj': {
							'fechaIngreso': '2017-07-26T00:49:31',
							'numero': 123,
							'cadena': 'aaaaaaaaaaa',
						}
					}];
				var dataConv = [
					{
						'fechaIngreso': '2017-07-26',
						'numero': 123,
						'cadena': 'aaaaaaaaaaa',
						'innerObj': {
							'fechaIngreso': '2017-07-26',
							'numero': 123,
							'cadena': 'aaaaaaaaaaa',
						}
					}];
				UtilService.converDate(data);
				expect(dataConv).toEqual(data);
			});
		});

		describe('Gestión de Errores', function () {
			it('Debería existir la función getResponseError', function () {
				expect(UtilService.getResponseError).toBeDefined();
			});

			it('Debería obtener un error genérico', function () {
				var url = 'api/recurso';
				var response = 
					{
						'data': null,
						'status': 401,
						'statusText': 'Recurso No encontrado'
					};
				var responseErrorExpected = { mensajes: [{ codigo: 'HTTP Status ' + response.status, mensaje: response.statusText }] };
				responseErrorExpected.mensajes.push({ codigo: 'url', mensaje: url });
				var responseError= UtilService.getResponseError(response,url);
				expect(responseError).toEqual(responseErrorExpected);
			});

			it('Debería obtener un error específico', function () {
				var url = 'api/recurso';
				var responseErrorExpected = { mensajes: [{ codigo: 'e001', mensaje: 'Validación de Estados de Division' }] };
				responseErrorExpected.mensajes.push({ codigo: 'e001-01', mensaje: 'El estado \'Esado\' no está definido' });
				var response = 
					{
						'data': responseErrorExpected,
						'status': 418,
						'statusText': 'Error Funcional'
					};
				var responseError= UtilService.getResponseError(response,url);
				responseErrorExpected.mensajes.push({ codigo: 'url', mensaje: url });
				expect(responseError).toEqual(responseErrorExpected);
			});

		});

		describe('Gestión de APIs', function () {
			it('Debería existir la función getResponseError', function () {
				expect(UtilService.getResponseError).toBeDefined();
			});

			it('Debería la función getApi retornar una promesa.', function () {
				var defered = $q.defer();
				var promise = defered.promise;
				var p = null;
	
				expect(p).toBeNull();
				p = UtilService.getApi('');
				expect(p).toBeDefined();
				expect(p).not.toBeNull();
				expect(Object.getPrototypeOf(p)).toEqual(Object.getPrototypeOf(promise));
			});

			it('Debería la función getApi llamar a \api/recurso\' y resolver positivamente.', function () {
				var baseUrl = $rootScope.config.servidor;
				var api = baseUrl + 'api/recurso';
				UtilService.getApi(api);
	
				//Define la llamada GET con respuesta positiva.
				$httpBackend
					.expect('GET', api)
					.respond(200, {});
	
				//Ejecuta la llamada (simulada) de $http
				expect($httpBackend.flush).not.toThrow();
			});

			it('Debería la función getApi llamar a \api/recurso\' y resolver negativamente.', function () {
				var baseUrl = $rootScope.config.servidor;
				var api = baseUrl + 'api/recurso';
				UtilService.getApi(api);
				expect(UtilService.getResponseError).toBeDefined();

				//"spy (sin ejecución)" 
				spyOn(UtilService, 'getResponseError');
				
	
				//Define la llamada GET con respuesta negativa.
				$httpBackend
					.expect('GET', api)
					.respond(400, {});
	
				//Se ejecuta la llamada (simulada) de $http
				expect($httpBackend.flush).toThrow();
				//Verifica que se envia el error a tratamiento genérico de errores
				expect(UtilService.getResponseError).toHaveBeenCalled();
			});
	

		});

		describe('Gestión de Fechas', function () {
			it('Debería existir la función addDays', function () {
				expect(UtilService.addDays).toBeDefined();
			});

			it('Debería obtener la suma de un día en un mes común', function () {
				var fechaBase = new	Date(2018,6,15);
				var proxFecha = UtilService.addDays(fechaBase,1);
				expect(proxFecha).toEqual(new Date(2018,6,16));
			});

			it('Debería obtener la resta de un día en un mes común', function () {
				var fechaBase = new	Date(2018,6,15);
				var proxFecha = UtilService.addDays(fechaBase,-1);
				expect(proxFecha).toEqual(new Date(2018,6,14));
			});

			it('Debería obtener la suma de un día en final de un mes de 31 días', function () {
				var fechaBase = new	Date(2018,6,31); //=>31/7/2018
				var proxFecha = UtilService.addDays(fechaBase,1);
				expect(proxFecha).toEqual(new Date(2018,7,1)); //=>1/8/2018
			});

			it('Debería obtener la suma de un día en final de un mes de 30 días', function () {
				var fechaBase = new	Date(2018,5,30); //=>30/6/2018
				var proxFecha = UtilService.addDays(fechaBase,1);
				expect(proxFecha).toEqual(new Date(2018,6,1)); //=>1/7/2018
			});

			it('Debería obtener la suma de un día en final de un mes de 28 días, no bisiesto', function () {
				var fechaBase = new	Date(2018,1,28); //=>28/2/2018
				var proxFecha = UtilService.addDays(fechaBase,1);
				expect(proxFecha).toEqual(new Date(2018,2,1)); //=>1/3/2018
			});

			it('Debería obtener la suma de un día en final de un mes de 28 días, bisiesto', function () {
				var fechaBase = new	Date(2016,1,28); //=>28/2/2016
				var proxFecha = UtilService.addDays(fechaBase,1);
				expect(proxFecha).toEqual(new Date(2016,1,29)); //=>29/2/2018
			});

			it('Debería obtener la suma de un día en final del año', function () {
				var fechaBase = new	Date(2018,11,31); //=>31/12/2018
				var proxFecha = UtilService.addDays(fechaBase,1);
				expect(proxFecha).toEqual(new Date(2019,0,1)); //=>01/1/2019
			});


		});


	});
});