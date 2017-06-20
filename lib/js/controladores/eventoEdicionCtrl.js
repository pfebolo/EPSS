'use strict';
var eventoMod = angular.module('eventoModulo');

eventoMod.controller('eventoEdicionControlador', ['$rootScope', '$scope', '$http', '$location',  'eventoSrv', 'lugarSrv',
	function cargarEventos($rootScope, $scope, $http, $location, eventoSrv, lugarSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		var accion_crear = 0;
		var accion_editar = 1;
		$scope.msjModal=null;
		$scope.lugares= [];		
		$scope.eventoEditando = {};
		$scope.accionLabel='???';

		if (eventoSrv.accion===null) {
			eventoSrv.accion= accion_crear;
		}

		$scope.tipoEventoLista = [{id:1, descripcion:'Presencial'},
		{id:2, descripcion:'Virtual'}];
		$scope.setTipoEvento = function setTipo(index) {
			$scope.eventoEditando.tipoId = $scope.tipoEventoLista[index].id;
		};

		var ObtenerLugares = function ObtenerLugares() {
			$scope.myStyle.cursor = 'wait';
			lugarSrv.getAll()
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
					$scope.lugares = JSON.parse(x.replace(/\t/g, ' '));
					if ($scope.eventoEditando.lugarId !== null) //Si se cargó primero $scope.eventoEditando
						$scope.lugar = $scope.lugares[$scope.eventoEditando.lugarId-1];
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};


		ObtenerLugares();
		if (eventoSrv.accion===null || eventoSrv.accion === accion_crear) {
			$scope.eventoEditando.eventoId = 0;
			$scope.eventoEditando.fecha = null;
			$scope.eventoEditando.titulo = null;
			$scope.eventoEditando.lugarId = null;
			$scope.lugar = $scope.lugares[0];
			$scope.eventoEditando.tipoId = $scope.tipoEventoLista[0].id;
			$scope.accionLabel='Crear';
		} else if (eventoSrv.accion === accion_editar) {
			$scope.eventoEditando = eventoSrv.eventoAEditar;
			$scope.eventoEditando.fecha = $scope.eventoEditando.fecha.substr(0,10);
			if ($scope.lugares !== []) //Si se cargó primero $scope.lugares
				$scope.lugar = $scope.lugares[eventoSrv.eventoAEditar.lugarId-1];
			delete $scope.eventoEditando.lugar;
			delete $scope.eventoEditando.interesado;
			$scope.accionLabel='Actualizar';
		}
		

		$scope.cancelarEdicion = function cancelarEdicion() {
			$location.path('/eventoLista');
		};

		$scope.modalOpen=false;
		$scope.showModal = function showModal(mensaje) {
			$scope.msjModal=mensaje;
			$scope.modalOpen=true;
		};

		$scope.closeModal = function closeModal() {
			$location.path('/eventoLista');
		};

		$scope.grabar = function grabar(fichaEvento) {
			$scope.error = { hayError: false, errores: {} };
			$scope.eventoEditando.lugarId = $scope.lugar.id;
			if (eventoSrv.accion === accion_crear) {
				eventoSrv.crear(fichaEvento)
					.then(function () {
						$scope.showModal('Creado satisfactoriamente.');
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					});
			} else {
				eventoSrv.actualizar(fichaEvento)
					.then(function () {
						$scope.showModal('Actualizado satisfactoriamente.');
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					});

			}
			//$element('cerrarBoton') .focus;
		};
	}
]);
