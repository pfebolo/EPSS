var legajosMod = angular.module("LegajosModulo", []);


legajosMod.factory('LegajoSrv', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

	var baseUrl = $rootScope.config.servidor;
	var legajoService = {};
	//legajoService.legajos = [];
	legajoService.legajoAEditar = null;
	legajoService.selectedRowEdit = null;
	legajoService.scrollRowEdit = null;



	var iso8601RegEx = /(19|20|21)\d\d([-/.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])T(\d\d)([:/.])(\d\d)([:/.])(\d\d)/;

	//Convierte la serialización, de las fechas, por omisión  NET  a una serialización, por omision, de AngularJS
	//TODO: LLevar esta función a UtilService
	function fnConverDate(input) {
		if (typeof input !== "object") return input;

		for (var key in input) {
			if (!input.hasOwnProperty(key)) continue;

			var value = input[key];
			var type = typeof value;
			var match;
			if (type == 'string' && (match = value.match(iso8601RegEx))) {
				input[key] = value.substring(0, 10);
			}
			else if (type === "object") {
				fnConverDate(value);
			}
		}
	}


	//Obtener legajos
	legajoService.getAll = function () {
		var deferred = $q.defer();
		$http({
			url: baseUrl + 'api/legajos',
			method: 'GET',
			//params: { 'searchText': text },
			cache: false
		}).success(function (data) {
			fnConverDate(data);
			deferred.resolve(data);
		}).error(function (error) {
			deferred.reject(error);
		})
		return deferred.promise;
	}

	//Actualizar legajos
	legajoService.update = function (legajo) {
		var deferred = $q.defer();
		$http({
			url: baseUrl + 'api/legajos',
			method: 'PUT',
			data: legajo
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (error) {
			deferred.reject(error);
		})
		return deferred.promise;
	}

	return legajoService;
}]);

legajosMod.controller("LegajoControlador",
	function CargarLegajos($scope, $http, $filter, $location, UtilService, LegajoSrv) {
		$scope.GetOK = true;
		$scope.cargando = true;
		$scope.legajoSeleccionado = null;
		$scope.edad = 0;
		$scope.error = { hayError: false, errores: {} };
		$scope.filtroDuplicados = true;


		//configuracion de datos a informar
		$scope.informaConfiguracion = {
			'Basico': true,
			'Estudios': false,
			'Documentacion': false,
			'Inscripcion': false,
		};


		LegajoSrv.getAll()
			.then(function (responseOK) {
				var x = decodeURIComponent(JSON.stringify(responseOK).replace(/\+/g, " "));
				$scope.legajos = JSON.parse(x.replace(/\t/g, " "));
				$scope.GetOK = true;
				if (LegajoSrv.legajoAEditar == null)
					$scope.cargarLegajo($scope.legajos[0]);
				else
					$scope.cargarLegajo(LegajoSrv.legajoAEditar);
			})
			.catch(function (responseError) {
				$scope.GetOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});


		$scope.informarDetalle = function informarDetalle() {
			$scope.cargando = !$scope.cargando;
		}

		$scope.setearScroll = function setearScroll() {
			$scope.divscr.scrollTop = LegajoSrv.scrollRowEdit;
			return true;
		}

        var numeroMagicoDuplicados=10000;
		$scope.buscarDuplicados = function buscarDuplicados(legajo) {
			// 10000 es número mágico que determina umbral para legajos duplicados
			return (legajo.legajoNro>=numeroMagicoDuplicados) 
		};


		$scope.filtrarDuplicados = function filtrarDuplicados(legajo) {
			// 10000 es número mágico que determina umbral para legajos duplicados
			return (!$scope.filtroDuplicados || legajo.legajoNro<numeroMagicoDuplicados) 
		};

		$scope.cargarLegajo = function cargarLegajo(legajo) {
			$scope.edad = $scope.obtenerEdad(legajo.fechaNacimiento);
			$scope.legajoSeleccionado = legajo;
			$scope.legajoSeleccionadoCursoActivo = legajo;
			$http.get($scope.config.servidor + 'api/cursos/activoporestudiante/' + $scope.legajoSeleccionadoCursoActivo.legajoNro)
				.success(function (data) {
					LegajoSrv.testsrv += 50;
					$scope.legajoSeleccionadoCursoActivo = data;
				})
				.error(function (data) {
					$scope.legajoSeleccionadoCursoActivo = null;
				});

		}

		$scope.obtenerEdad = function obtenerEdad(fechaNacimientoString) {
			if (typeof fechaNacimientoString != 'undefined') {
				var fechaNacimiento = new Date(fechaNacimientoString);
				var diaNacimiento = fechaNacimiento.getDate();
				var mesNacimiento = fechaNacimiento.getMonth();
				var anioNacimiento = fechaNacimiento.getFullYear();
				var fechaActual = new Date();
				var diaActual = fechaActual.getDate();
				var mesActual = fechaActual.getMonth();
				var anioActual = fechaActual.getFullYear();
				var edad = anioActual - anioNacimiento;
				if ((mesActual < mesNacimiento) || ((mesActual == mesNacimiento) & (diaActual < diaNacimiento)))
					edad = edad - 1;
				return edad;
			}
		}

		$scope.cambiarInforme = function cambiarInforme(tipoSeleccionado) {
			for (var tipo in $scope.informaConfiguracion) {
				$scope.informaConfiguracion[tipo] = (tipo == tipoSeleccionado);
			}
		}

		$scope.selectedRow = LegajoSrv.selectedRowEdit;
		$scope.divscr = document.getElementById("lista");
		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
			LegajoSrv.scrollRowEdit = $scope.divscr.scrollTop;
		}

		$scope.reseleccionar = function reseleccionar(filtro) {
			var leg = $filter('filter')($scope.legajos, filtro, false);
			if (typeof leg != 'undefined' && leg.length > 0)
				$scope.cargarLegajo(leg[0]);
			else
				console.log('Vacio');

		}

		$scope.obtenerAnioCursado = UtilService.obtenerAnioCursado;
		$scope.obtenerCuatrimestreCursado = UtilService.obtenerCuatrimestreCursado;


		$scope.editarLegajo = function editarLegajo(legajoAEditar) {
			LegajoSrv.legajoAEditar = legajoAEditar;
			LegajoSrv.selectedRowEdit = $scope.selectedRow;
			$location.path('/LegajoActualizar');
		}


		$scope.ActualizarLegajo = function ActualizarLegajo(legajoAActualizar) {
			$scope.error = { hayError: false, errores: {} };
			LegajoSrv.update(legajoAActualizar)
				.then(function (dataResponseOK) {
					window.history.back();
				})
				.catch(function (dataResponseError) {
					$scope.error.errores = dataResponseError.mensajes;
					$scope.error.hayError = true;
				});
		}
	}
)


