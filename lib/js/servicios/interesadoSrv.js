'use strict';
var interesadoMod = angular.module('interesadoModulo');

interesadoMod.factory('interesadoSrv', ['$q', '$http', '$rootScope', '$location',
	function ($q, $http, $rootScope, $location) {

		var baseUrl = $rootScope.config.servidor;
		var interesadoService = {};
		var accion_crear = 0;
		var accion_editar = 1;
		interesadoService.accion = null;




		//Obtener interesados
		interesadoService.getAll = function getAll() {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesados',
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


		//Crear un interesado
		interesadoService.crear = function crear(interesado) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesados',
				method: 'POST',
				data: interesado
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

		//Actualizar datos de un interesado
		interesadoService.actualizar = function actualizar(interesado) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesados',
				method: 'PUT',
				data: interesado
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


		interesadoService.exponerCreacion = function exponerCreacion() {
			interesadoService.accion = accion_crear;
			interesadoService.interesadoAEditar = null;
			$location.path('/interesadoEdicion');
		};

		interesadoService.exponerEdicion = function exponerEdicion(interesadoAEditar) {
			interesadoService.accion = accion_editar;
			interesadoService.interesadoAEditar = interesadoAEditar;
			$location.path('/interesadoEdicion');
		};



		return interesadoService;
	}]);