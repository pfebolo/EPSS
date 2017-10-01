'use strict';
var divisionMod = angular.module('divisionModulo');


divisionMod.controller('divisionListaControlador',['$rootScope', '$scope', '$http', 'UtilService',
	function CargarDivisiones($rootScope, $scope, $http, UtilService) {
		$scope.meses = UtilService.meses;
		$scope.ordinales = UtilService.ordinales;
		$scope.getDivisionesOK = false;
		$scope.getCoordinacionesOK = false;
		$scope.getGruposOK = false;
		var cargandoDivisiones = true;
		var cargandoCoordinaciones = true;
		var cargandoGrupos = true;
		$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos;
		$scope.divisionSeleccionado = null;

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
				$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos;
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
				$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos;
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
				$scope.cargando = cargandoDivisiones || cargandoCoordinaciones || cargandoGrupos;
			});

		$scope.cargarGrupo = function cargarGrupo(division) {
			$scope.divisionSeleccionado = division;
		};

		$scope.selectedRow = null;
		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};


		$scope.alumnoPerteneceAlDivision = function filtrarDivision(alumno, divisionSeleccionado) {
			return (alumno != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === alumno.carreraId && divisionSeleccionado.modoId === alumno.modoId && divisionSeleccionado.cursoId === alumno.cursoId && divisionSeleccionado.turnoId === alumno.turnoId && divisionSeleccionado.divisionId === alumno.divisionId);
		};

		$scope.filtrarAlumno = function filtrarAlumno(alumno) {
			var divisionSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return $scope.alumnoPerteneceAlDivision(alumno, divisionSeleccionado);
		};


		$scope.criteriaMatch = function (divisionSeleccionado) {
			return function (item) {
				return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.cursoId === item.cursoId && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
			};
		};

		$scope.obtenerCantidadAlumnos = function obtenerCantidadAlumnos(division) {
			var x = $scope.grupos.filter($scope.filtrarAlumno, division);
			return x.length;
			//return 0;
		};


	}
]);
