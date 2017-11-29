'use strict';
var lugarMod = angular.module('lugarModulo');

lugarMod.factory('lugarSrv', ['$q', '$http', '$rootScope', '$location', 'UtilService',
	function ($q, $http, $rootScope, $location, UtilService) {

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
			}).then(function (response) {
				deferred.resolve(UtilService.decodificarDatosViejoSistema(response.data));
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


		//Crear un lugar
		// lugarService.crear = function crear(lugar) {
		// 	var deferred = $q.defer();
		// 	$http({
		// 		url: baseUrl + 'api/lugares',
		// 		method: 'POST',
		// 		data: lugar
		// 	}).then(function (response) {
		// 		deferred.resolve(responsedata);
		// 	}).catch(function (response) {
		// 		var data = response.data;
		// 		var status = response.status;
		// 		var statusText = response.statusText;
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
		// 	}).then(function (response) {
		// 		deferred.resolve(response.data);
		// 	}).catch(function (response) {
		// 		var data = response.data;
		// 		var status = response.status;
		// 		var statusText = response.statusText;
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