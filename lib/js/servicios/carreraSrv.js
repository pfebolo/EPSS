'use strict';
var carreraMod = angular.module('carreraModulo');

carreraMod.factory('carreraSrv', ['$q', '$http', '$rootScope', '$location',
	function ($q, $http, $rootScope, $location) {

		var baseUrl = $rootScope.config.servidor;
		var carreraService = {};
		// var accion_crear = 0;
		// var accion_editar = 1;
		carreraService.accion = null;


		//Obtener carreras
		carreraService.getAll = function getAll() {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/carreras', 
				method: 'GET',
				//params: { 'searchText': text },
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


		//Crear un carrera
		carreraService.crear = function crear(carrera) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/carreras',
				method: 'POST',
				data: carrera
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

		//Actualizar datos de un carrera
		carreraService.actualizar = function actualizar(carrera) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/carreras',
				method: 'PUT',
				data: carrera
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

		//Eliminar un carrera
		carreraService.eliminar = function eliminar(carreraId) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/carreras/' + carreraId,
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



		// carreraService.exponerCreacion = function exponerCreacion() {
		// 	carreraService.accion = accion_crear;
		// 	carreraService.carreraAEditar = null;
		// 	$location.path('/carreraEdicion');
		// };

		// carreraService.exponerEdicion = function exponerEdicion(carreraAEditar) {
		// 	carreraService.accion = accion_editar;
		// 	carreraService.carreraAEditar = carreraAEditar;
		// 	$location.path('/carreraEdicion');
		// };

		return carreraService;
	}]);