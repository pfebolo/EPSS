'use strict';
var inscriptoMod = angular.module('inscriptoModulo');

inscriptoMod.controller('inscriptoListaControlador', ['$rootScope', '$scope', '$http', '$filter', 'estudianteSrv', 'legajoSrv',
	function CargarInscriptos($rootScope, $scope, $http, $filter, estudianteSrv, legajoSrv) {
		$scope.GetOK = false;
		$scope.cargando = true;
		$scope.actualizando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.inscriptoSeleccionado = null;

		$scope.ObtenerInscriptos = function ObtenerInscriptos() {
			$scope.cargando = true;
			estudianteSrv.getAll()
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
					$scope.inscriptos = JSON.parse(x.replace(/\t/g, ' '));
					$scope.GetOK = true;
					if ($scope.inscriptos.length > 0)
						$scope.cargarInscripto($scope.inscriptos[0]);
				})
				.catch(function () {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.ObtenerInscriptos();


		$scope.reseleccionar = function reseleccionar(filtro) {
			var ins = $filter('filter')($scope.legajos, filtro, false);
			if (typeof ins != 'undefined' && ins.length > 0)
				$scope.cargarInscripto(ins[0]);
		};


		$scope.crearLegajos = function crearLegajos(inscriptos) {
			$scope.error = { hayError: false, errores: {} };
			$scope.actualizando = true;
			$scope.myStyle.cursor = 'wait';
			legajoSrv.crearLegajos(inscriptos)
				.then(function () {
					$scope.ObtenerInscriptos();
				})
				.catch(function (dataResponseError) {
					$scope.error.errores = dataResponseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.actualizando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};

		$scope.cargarInscripto = function cargarInscripto(inscripto) {
			$scope.inscriptoSeleccionado = inscripto;
		};

		$scope.irAEdicion = function irAEdicion(estudianteAEditar) {
			estudianteSrv.exponerEdicion(estudianteAEditar);
		};



	}
]);
