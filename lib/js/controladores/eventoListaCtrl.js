'use strict';
var eventoMod = angular.module('eventoModulo');

eventoMod.controller('eventoListaControlador', ['$rootScope', '$scope', '$http', '$filter', 'eventoSrv', 
	function CargarEventos($rootScope, $scope, $http, $filter, eventoSrv) {
		$scope.GetOK = false;
		$scope.cargando = true;
		$scope.actualizando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.eventoSeleccionado = null;

		$scope.ObtenerEventos = function ObtenerEventos() {
			$scope.cargando = true;
			eventoSrv.getAll()
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
					$scope.eventos = JSON.parse(x.replace(/\t/g, ' '));
					$scope.GetOK = true;
					if ($scope.eventos.length > 0)
						$scope.cargarEvento($scope.eventos[0]);
				})
				.catch(function () {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.ObtenerEventos();

		$scope.reseleccionar = function reseleccionar(filtro) {
			var ins = $filter('filter')($scope.eventos, filtro, false);
			ins = $filter('orderBy')(ins, 'fecha', true); //Order Descendent
			if (typeof ins != 'undefined' && ins.length > 0)
				$scope.cargarEvento(ins[0]);
		};


		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};

		$scope.cargarEvento = function cargarEvento(evento) {
			$scope.eventoSeleccionado = evento;
		};

		$scope.irACrearEvento = function irACrearEvento() {
			eventoSrv.exponerCreacion();
		};

		$scope.irAEdicionInteresado = function irAEdicionEvento(eventoAEditar) {
			eventoSrv.exponerEdicion(eventoAEditar);
		};



	}
]);
