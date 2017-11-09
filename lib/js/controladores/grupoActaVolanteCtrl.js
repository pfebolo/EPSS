'use strict';
var gruposMod = angular.module('grupoModulo');

gruposMod.controller('grupoActaVolanteControlador', ['$scope', '$http', '$q', '$filter', '$location', '$timeout', 'UtilService', 'coordinacionSrv', 'grupoSrv',
	function CargarGrupos($scope, $http, $q, $filter, $location, $timeout, UtilService, coordinacionSrv, grupoSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.getGruposOK = false;
		$scope.cargando = true;
		$scope.error = { hayError: false, errores: {} };
		$scope.grupoEditando = angular.copy(grupoSrv.grupoAEditar);
		$scope.ordinales = UtilService.ordinales;
		$scope.meses = UtilService.meses;
		$scope.profesora = '........................................';
		$scope.hoy = new Date();
		$scope.grupos = [];
		$scope.gruposeleccionado = [];
		$scope.paginas = null;
		$scope.paginaActiva = 0;
		$scope.lineasXPagina = 25;

		var fillArrayWithNumbers =  function fillArrayWithNumbers(n) {
			var arr = Array.apply(null, Array(n));
			return arr.map(function (x, i) { return i; });
		};

		var ObtenerCoordinaciones = function ObtenerCoordinaciones() {
			var deferred = $q.defer();
			coordinacionSrv.getAll()
				.then(function (dataResponseOK) {
					deferred.resolve(dataResponseOK);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
					deferred.reject(responseError);
				});
			return deferred.promise;
		};

		var ObtenerGrupos = function ObtenerGrupos() {
			var deferred = $q.defer();
			grupoSrv.getAll()
				.then(function (dataResponseOK) {
					deferred.resolve(dataResponseOK);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
					deferred.reject(responseError);
				});
			return deferred.promise;
		};


		var CargarPagina = function CargarPagina() {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			var finalizarCarga = function finalizarCarga() {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'pointer';
			};
			ObtenerCoordinaciones()
				.then(function (dataResponseOK) {
					$scope.coordinaciones = dataResponseOK;
					ObtenerGrupos()
						.then(function (dataResponseOK) {
							$scope.grupos = dataResponseOK;
							$scope.grupoSeleccionado = $filter('filter')($scope.grupos,filtroGrupo);
							$scope.grupoSeleccionado = $filter('orderBy')($scope.grupoSeleccionado,orderApellidoYNombre);
							$scope.paginas = fillArrayWithNumbers(Math.ceil($scope.grupoSeleccionado.length/$scope.lineasXPagina));
							finalizarCarga();
						},finalizarCarga);
				},finalizarCarga);
		};
		CargarPagina();




		var orderApellidoYNombre = function orderApellidoYNombre(item) {
			item.apellidoYNombre = UtilService.stringToLocale(item.legajo.alumno.apellido.trim() + ', ' + item.legajo.alumno.nombre.trim());
			return item.apellidoYNombre; //dato a comparar
		};

		var filtroGrupo = function filtroGrupo(item) {
			return (item != undefined && $scope.grupoEditando != undefined  && $scope.grupoEditando.carreraId === item.carreraId && $scope.grupoEditando.modoId === item.modoId && $scope.grupoEditando.anioInicio === item.anioInicio && $scope.grupoEditando.mesInicio === item.mesInicio && $scope.grupoEditando.anioLectivo === item.anioLectivo && $scope.grupoEditando.nmestreLectivo === item.nmestreLectivo && $scope.grupoEditando.turnoId === item.turnoId && $scope.grupoEditando.divisionId === item.divisionId);
		};

		$scope.filtroDivision = function filtroDivision(divisionSeleccionado) {
			return function (item) {
				return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
			};
		};


		$scope.setProfesora = function setProfesora (profesoraSeleccionada) {
			$scope.profesora = profesoraSeleccionada;
		};

		$scope.setPaginaActiva = function setPaginaActiva(paginaAActivar){
			$scope.paginaActiva = paginaAActivar;
		};

	}
]);


