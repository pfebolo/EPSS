'use strict';
var eventoMod = angular.module('eventoModulo');

eventoMod.factory('eventoSrv', ['$q', '$http', '$rootScope', '$location',
	function ($q, $http, $rootScope, $location) {

		var baseUrl = $rootScope.config.servidor;
		var eventoService = {};
		var accion_crear = 0;
		var accion_editar = 1;
		eventoService.accion = null;

		//Obtener eventos
		eventoService.getAll = function getAll() {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/eventos', 
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).success(function (data) {
				deferred.resolve(data);
			}).error(function (error) {
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
			}).success(function (data) {
				deferred.resolve(data);
			}).error(function (data, status, headers, config, statusText) {
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
			}).success(function (data) {
				deferred.resolve(data);
			}).error(function (data, status, headers, config, statusText) {
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