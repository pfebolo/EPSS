'use strict';
var divisionMod = angular.module('divisionModulo');


divisionMod.controller('divisionListaControlador',['$rootScope', '$scope', '$http', 'UtilService', 'carreraSrv', 'coordinacionSrv', 'grupoSrv', 'divisionSrv',
	function CargarDivisiones($rootScope, $scope, $http, UtilService, carreraSrv, coordinacionSrv, grupoSrv, divisionSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.meses = UtilService.meses;
		$scope.ordinales = UtilService.ordinales;
		$scope.getCarrerasOK = false;
		$scope.getDivisionesOK = false;
		$scope.getCoordinacionesOK = false;
		$scope.getGruposOK = false;
		var cargandoCarreras =true;
		var cargandoDivisiones = true;
		var cargandoCoordinaciones = true;
		var cargandoGrupos = true;
		$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos;
		$scope.divisionSeleccionado = null;
		$scope.carreraSeleccionada = null;


		var ObtenerCarreras = function ObtenerCarreras() {
			$scope.myStyle.cursor = 'wait';
			carreraSrv.getAll()
				.then(function (dataResponseOK) {
					$scope.carreras = dataResponseOK;
					$scope.getCarrerasOK = true;
					$scope.carreraSeleccionada = $scope.carreras[0];
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes); // newArray = [1, 2]
					$scope.error.hayError = true;
					$scope.getCarrerasOK = false;
				})
				.finally(function () {
					cargandoCarreras = false;
					$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos || cargandoCarreras;
					$scope.myStyle.cursor = 'pointer';
				});
		};
		ObtenerCarreras();

		var ObtenerDivisiones = function ObtenerDivisiones() {
			$scope.myStyle.cursor = 'wait';
			divisionSrv.getAll()
				.then(function (dataResponseOK) {
					$scope.divisiones = dataResponseOK;
					$scope.getDivisionesOK = true;
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes); // newArray = [1, 2]
					$scope.error.hayError = true;
					$scope.getDivisionesOK = false;
				})
				.finally(function () {
					cargandoDivisiones = false;
					$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos || cargandoCarreras;
					$scope.myStyle.cursor = 'pointer';
				});
		};
		ObtenerDivisiones();

		var ObtenerCoordinaciones = function ObtenerCoordinaciones() {
			$scope.myStyle.cursor = 'wait';
			coordinacionSrv.getAll()
				.then(function (dataResponseOK) {
					$scope.coordinaciones = dataResponseOK;
					$scope.getCoordinacionesOK = true;
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes); // newArray = [1, 2]
					$scope.error.hayError = true;
					$scope.getCoordinacionesOK = false;
				})
				.finally(function () {
					cargandoCoordinaciones = false;
					$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos || cargandoCarreras;
					$scope.myStyle.cursor = 'pointer';
				});
		};
		ObtenerCoordinaciones();

		var ObtenerGrupos = function ObtenerGrupos() {
			$scope.myStyle.cursor = 'wait';
			grupoSrv.getAll()
				.then(function (dataResponseOK) {
					$scope.grupos = dataResponseOK;
					$scope.getGruposOK = true;
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes); // newArray = [1, 2]
					$scope.error.hayError = true;
					$scope.getGruposOK = false;
				})
				.finally(function () {
					cargandoGrupos = false;
					$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos || cargandoCarreras;
					$scope.myStyle.cursor = 'pointer';
				});
		};
		ObtenerGrupos();


		$scope.cargarGrupo = function cargarGrupo(division) {
			$scope.divisionSeleccionado = division;
		};

		$scope.selectedRow = null;
		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};


		$scope.alumnoPerteneceAlDivision = function filtrarDivision(alumno, divisionSeleccionado) {
			return (alumno != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === alumno.carreraId && divisionSeleccionado.modoId === alumno.modoId && divisionSeleccionado.anioInicio === alumno.anioInicio && divisionSeleccionado.mesInicio === alumno.mesInicio && divisionSeleccionado.anioLectivo === alumno.anioLectivo && divisionSeleccionado.nmestreLectivo === alumno.nmestreLectivo && divisionSeleccionado.turnoId === alumno.turnoId && divisionSeleccionado.divisionId === alumno.divisionId);
		};

		$scope.filtrarAlumno = function filtrarAlumno(alumno) {
			var divisionSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return $scope.alumnoPerteneceAlDivision(alumno, divisionSeleccionado);
		};


		$scope.filtroDivision = function (divisionSeleccionado) {
			return function (item) {
				return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === $scope.carreraSeleccionada.carreraId && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
			};
		};

		$scope.filtroCarrera = function (carreraSeleccionada) {
			return function (item) {
				return (item != undefined && carreraSeleccionada != undefined && carreraSeleccionada.carreraId === item.curso.carrera.carreraId);
			};
		};

		$scope.obtenerCantidadAlumnos = function obtenerCantidadAlumnos(division) {
			if ($scope.grupos !== undefined) {
				var x = $scope.grupos.filter($scope.filtrarAlumno, division);
				return x.length;
			} else {
				return 0;
			}
		};

		$scope.irACrearDivision = function irACrearDivision() {
			divisionSrv.exponerCreacion();
		};


	}
]);
