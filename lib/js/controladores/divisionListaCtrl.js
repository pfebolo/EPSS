'use strict';
var divisionMod = angular.module('divisionModulo');


divisionMod.controller('divisionListaControlador',['$rootScope', '$scope', '$http', 'UtilService', 'divisionSrv',
	function CargarDivisiones($rootScope, $scope, $http, UtilService, divisionSrv) {
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


		$http.get($scope.config.servidor + 'api/carreras')
		.then(function (response) {
			$scope.carreras = response.data;
			$scope.getCarrerasOK = true;
			$scope.carreraSeleccionada = $scope.carreras[0];
		})
		.catch(function () {
			$scope.getCarrerasOK = false;
		})
		.finally(function () {
			cargandoCarreras = false;
			$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos || cargandoCarreras;
		});

		$http.get($scope.config.servidor + 'api/divisiones')
			.then(function (response) {
				$scope.divisiones = response.data;
				$scope.getDivisionesOK = true;
			})
			.catch(function () {
				$scope.getDivisionesOK = false;
			})
			.finally(function () {
				cargandoDivisiones = false;
				$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos || cargandoCarreras;
			});

		$http.get($scope.config.servidor + 'api/coordinaciones')
			.then(function (response) {
				$scope.coordinaciones = response.data;
				$scope.getCoordinacionesOK = true;
			})
			.catch(function () {
				$scope.getCoordinacionesOK = false;
			})
			.finally(function () {
				cargandoCoordinaciones = false;
				$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos || cargandoCarreras;
			});

		$http.get($scope.config.servidor + 'api/grupos')
			.then(function (response) {
				$scope.grupos = response.data;
				$scope.getGruposOK = true;
			})
			.catch(function () {
				$scope.getGruposOK = false;
			})
			.finally(function () {
				cargandoGrupos = false;
				$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos || cargandoCarreras;
			});

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
				return (item != undefined && carreraSeleccionada != undefined && carreraSeleccionada.carreraId === item.cursos.carrera.carreraId);
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
