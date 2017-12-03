describe('Module: app', function () {
	describe('Service: UtilService', function () {
		it('Debería validar 2 + 2 = 4 (dummy test)', function () {
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
			it('Debería existir la función decodificarDatosViejoSistema', function () {
				expect(UtilService.decodificarDatosViejoSistema).toBeDefined();
			});

			it('Debería reemplazar signo \'+\' por blanco', function () {
				var data = UtilService.decodificarDatosViejoSistema('a+a');
				expect('a a').toEqual(data);
			});

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
	});
});