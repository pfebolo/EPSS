'use strict';
var eventoMod = angular.module('eventoModulo');

eventoMod.factory('eventoSrv', ['$q', '$http', '$rootScope', '$location',
	function ($q, $http, $rootScope, $location) {

		var baseUrl = $rootScope.config.servidor;
		var eventoService = {};
		var accion_crear = 0;
		var accion_editar = 1;
		eventoService.accion = null;
		var ahora = new Date();
		var hoy = new Date(ahora.setHours(0, 0, 0, 0));
		hoy = hoy.getTime();
		// var fechaMasCercana = new Date(9999, 12, 31).getTime;


		eventoService.calcularVencimiento = function colocarVencimiento(fecha) {
			var vencimiento = new Date(fecha).getTime() - hoy;
			return vencimiento; //positivo=Futuro 0=Hoy negativo=pasado
		};

		eventoService.colocarVencimiento = function colocarVencimiento(item) {
			var diferencia = eventoService.calcularVencimiento(item.fecha);
			item.estadoFecha = diferencia; //positivo=Futuro 0=Hoy negativo=pasado
			// if (item.estadoFecha >= 0 && (diferencia < fechaMasCercana)) {
			// 	fechaMasCercana = diferencia;
			// }
		};

		//Obtener eventos
		eventoService.getAll = function getAll() {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/eventos', 
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};


		//Crear un evento
		eventoService.crear = function crear(evento) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/eventos',
				method: 'POST',
				data: evento
			}).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				var data = response.data;
				var status = response.status;
				var statusText = response.statusText;
				var responseError;
				if (data !== '' && data !== null) {
					responseError = data;
				} else {
					responseError = { mensajes: [{ codigo: 'HTTP Status ' + status, mensaje: statusText }] };
				}
				deferred.reject(responseError);
			});

			return deferred.promise;
		};

		//Actualizar datos de un evento
		eventoService.actualizar = function actualizar(evento) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/eventos',
				method: 'PUT',
				data: evento
			}).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				var data = response.data;
				var status = response.status;
				var statusText = response.statusText;
				var responseError;
				if (data !== '' && data !== null) {
					responseError = data;
				} else {
					responseError = { mensajes: [{ codigo: 'HTTP Status ' + status, mensaje: statusText }] };
				}
				deferred.reject(responseError);
			});

			return deferred.promise;
		};

		//Eliminar un evento
		eventoService.eliminar = function eliminar(eventoId) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/eventos/' + eventoId,
				method: 'DELETE',
				cache: false
			}).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				var data = response.data;
				var status = response.status;
				var statusText = response.statusText;
				var responseError;
				if (data !== '' && data !== null) {
					responseError = data;
				} else {
					responseError = { mensajes: [{ codigo: 'HTTP Status ' + status, mensaje: statusText }] };
				}
				deferred.reject(responseError);
			});

			return deferred.promise;
		};



		eventoService.exponerCreacion = function exponerCreacion() {
			eventoService.accion = accion_crear;
			eventoService.eventoAEditar = null;
			$location.path('/eventoEdicion');
		};

		eventoService.exponerEdicion = function exponerEdicion(eventoAEditar) {
			eventoService.accion = accion_editar;
			eventoService.eventoAEditar = eventoAEditar;
			$location.path('/eventoEdicion');
		};

		return eventoService;
	}]);