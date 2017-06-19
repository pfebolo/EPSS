'use strict';
var eventoMod = angular.module('eventoModulo');

eventoMod.controller('eventoListaControlador', ['$rootScope', '$scope', '$http', '$filter', 'eventoSrv', 'interesadoEventoSrv',
	function CargarEventos($rootScope, $scope, $http, $filter, eventoSrv, interesadoEventoSrv) {
		$scope.GetOK = false;
		$scope.cargando = true;
		$scope.actualizando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.eventos = null;
		$scope.eventoSeleccionado = null;
		$scope.interesadosEventos = null;

		$scope.ObtenerEventos = function ObtenerEventos() {
			$scope.cargando = true;
			eventoSrv.getAll()
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
					$scope.eventos = JSON.parse(x.replace(/\t/g, ' '));
					$scope.GetOK = true;
					if ($scope.eventos.length > 0)
						$scope.reseleccionar('');
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
			if (typeof ins != 'undefined' && ins !== null && ins.length > 0)
				$scope.cargarEvento(ins[0]);
		};


		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};

		$scope.cargarEvento = function cargarEvento(evento) {
			$scope.eventoSeleccionado = evento;
			obtenerInteresadosPorEvento(evento.id);
		};

		$scope.irACrearEvento = function irACrearEvento() {
			eventoSrv.exponerCreacion();
		};

		$scope.irAEdicionEvento = function irAEdicionEvento(eventoAEditar) {
			eventoSrv.exponerEdicion(eventoAEditar);
		};

		$scope.irAEliminarEvento = function irAEdicionEvento(eventoAEditar) {
			$scope.myStyle.cursor = 'wait';
			eventoSrv.eliminar(eventoAEditar.id)
				.then(function () {
					$scope.ObtenerEventos();
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});

		};

		$scope.irAEliminarInteresadoEvento = function irAEdicionEvento(interesadoEventoAEliminar) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.eliminar(interesadoEventoAEliminar.id)
				.then(function () {
					$scope.interesadosEventos.splice($scope.interesadosEventos.indexOf(interesadoEventoAEliminar),1);
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});

		};


		var obtenerInteresadosPorEvento = function obtenerInteresadosPorEvento(eventoId) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.getByEventoId(eventoId)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
					$scope.interesadosEventos = JSON.parse(x.replace(/\t/g, ' '));
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};



	}
]);
