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
			cargandoCarreras = true;
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
			cargandoDivisiones = true;
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
			cargandoCoordinaciones = true;
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
			cargandoGrupos = true;
			grupoSrv.getAll()
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad) { return cad.replace('%', '％'); }));
					$scope.grupos = JSON.parse(x.replace(/\t/g, ' '));;
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


		$scope.itemPerteneceAlDivision = function filtrarDivision(item, divisionSeleccionado) {
			return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
		};

		$scope.filtroAlumno = function filtroAlumno(alumno) {
			var divisionSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return $scope.itemPerteneceAlDivision(alumno, divisionSeleccionado);
		};

		$scope.filtroCoordinador = function filtroCoordinador(coordinador) {
			var divisionSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return $scope.itemPerteneceAlDivision(coordinador, divisionSeleccionado);
		};

		$scope.filtroDivision = function (divisionSeleccionado) {
			return function (item) {
				return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === $scope.carreraSeleccionada.carreraId && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
			};
		};

		$scope.filtroCarrera = function (carreraSeleccionada) {
			return function (item) {
				return (item != undefined && carreraSeleccionada != undefined && carreraSeleccionada.carreraId === item.carreraId);
			};
		};

		$scope.obtenerCantidadAlumnos = function obtenerCantidadAlumnos(division) {
			if ($scope.grupos !== undefined) {
				var x = $scope.grupos.filter($scope.filtroAlumno, division);
				return x.length;
			} else {
				return 0;
			}
		};

		$scope.obtenerCantidadCoordinadores = function obtenerCantidadCoordinadores(division) {
			if ($scope.coordinaciones !== undefined) {
				var x = $scope.coordinaciones.filter($scope.filtroCoordinador, division);
				return x.length;
			} else {
				return 0;
			}
		};



		$scope.irACrearDivision = function irACrearDivision() {
			divisionSrv.exponerCreacion();
		};
		
		$scope.irAEditarGrupo = function irAEditarGrupo() {
			grupoSrv.exponerEdicion($scope.divisionSeleccionado);
		};

		

		$scope.irAEliminarDivision = function irAEliminarDivision(division) {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			$scope.error = { hayError: false, errores: {} };
			divisionSrv.eliminar(division.carreraId, division.modoId, division.anioInicio, division.mesInicio, division.anioLectivo, division.nmestreLectivo, division.turnoId, division.divisionId)
				.then(function () {
					ObtenerDivisiones();
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes); // newArray = [1, 2]
					$scope.error.hayError = true;
					$scope.cargando = false;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		

	}
]);
