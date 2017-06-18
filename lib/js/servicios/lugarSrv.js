'use strict';
var lugarMod = angular.module('lugarModulo');

lugarMod.factory('lugarSrv', ['$q', '$http', '$rootScope', '$location',
	function ($q, $http, $rootScope, $location) {

		var baseUrl = $rootScope.config.servidor;
		var lugarService = {};
		var accion_crear = 0;
		var accion_editar = 1;
		lugarService.accion = null;

		//Obtener lugares
		lugarService.getAll = function getAll() {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/lugares', 
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
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


		//Crear un lugar
		// lugarService.crear = function crear(lugar) {
		// 	var deferred = $q.defer();
		// 	$http({
		// 		url: baseUrl + 'api/lugares',
		// 		method: 'POST',
		// 		data: lugar
		// 	}).success(function (data) {
		// 		deferred.resolve(data);
		// 	}).error(function (data, status, headers, config, statusText) {
		// 		var responseError;
		// 		if (data !== '' && data !== null) {
		// 			responseError = data;
		// 		} else {
		// 			responseError = { mensajes: [{ codigo: 'HTTP Status ' + status, mensaje: statusText }] };
		// 		}
		// 		deferred.reject(responseError);
		// 	});

		// 	return deferred.promise;
		// };

		//Actualizar datos de un lugar
		// lugarService.actualizar = function actualizar(lugar) {
		// 	var deferred = $q.defer();
		// 	$http({
		// 		url: baseUrl + 'api/lugares',
		// 		method: 'PUT',
		// 		data: lugar
		// 	}).success(function (data) {
		// 		deferred.resolve(data);
		// 	}).error(function (data, status, headers, config, statusText) {
		// 		var responseError;
		// 		if (data !== '' && data !== null) {
		// 			responseError = data;
		// 		} else {
		// 			responseError = { mensajes: [{ codigo: 'HTTP Status ' + status, mensaje: statusText }] };
		// 		}
		// 		deferred.reject(responseError);
		// 	});

		// 	return deferred.promise;
		// };

		// lugarService.exponerCreacion = function exponerCreacion() {
		// 	lugarService.accion = accion_crear;
		// 	lugarService.lugarAEditar = null;
		// 	$location.path('/lugarEdicion');
		// };

		// lugarService.exponerEdicion = function exponerEdicion(lugarAEditar) {
		// 	lugarService.accion = accion_editar;
		// 	lugarService.lugarAEditar = lugarAEditar;
		// 	$location.path('/lugarEdicion');
		// };

		return lugarService;
	}]);