'use strict';
var divisionMod = angular.module('divisionModulo');

divisionMod.factory('divisionSrv', ['$q', '$http', '$rootScope', '$location',
	function ($q, $http, $rootScope, $location) {

		var baseUrl = $rootScope.config.servidor;
		var divisionService = {};
		var accion_crear = 0;
		var accion_editar = 1;
		divisionService.accion = null;

		//Obtener divisiones
		divisionService.getAll = function getAll() {
			var deferred = $q.defer();
			var url = baseUrl + 'api/divisiones';
			$http({
				url: url,
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				},
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
					responseError = { mensajes: [{ codigo: 'url', mensaje: url }] };
					responseError.mensajes.push({ codigo: 'HTTP Status ' + status, mensaje: statusText });
				}
				deferred.reject(responseError);
			});
			return deferred.promise;
		};


		//Crear un division
		divisionService.crear = function crear(division) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/divisiones';
			$http({
				url: url,
				method: 'POST',
				data: division,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
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
					responseError = { mensajes: [{ codigo: 'url', mensaje: url }] };
					responseError.mensajes.push({ codigo: 'HTTP Status ' + status, mensaje: statusText });
				}
				deferred.reject(responseError);
			});

			return deferred.promise;
		};

		//Actualizar datos de un division
		divisionService.actualizar = function actualizar(division) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/divisiones';
			$http({
				url: url,
				method: 'PUT',
				data: division,
				headers: {
					'Content-Type': 'application/json'
				}
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
					responseError = { mensajes: [{ codigo: 'url', mensaje: url }] };
					responseError.mensajes.push({ codigo: 'HTTP Status ' + status, mensaje: statusText });
				}
				deferred.reject(responseError);
			});

			return deferred.promise;
		};

		//Eliminar un division
		divisionService.eliminar = function eliminar(carreraId, modoId, anioInicio, mesInicio, anioLectivo, nmestreLectivo, turnoId, divisionId) {
			var deferred = $q.defer();
			var url = encodeURI(baseUrl + 'api/divisiones/' + carreraId + '/' + modoId + '/' + anioInicio + '/' + mesInicio + '/' + anioLectivo + '/' + nmestreLectivo + '/' + turnoId + '/' + divisionId);
			$http({
				url: url,
				method: 'DELETE',
				cache: false,
				headers: {
					'Content-Type': 'application/json'
				}
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
					responseError = { mensajes: [{ codigo: 'url', mensaje: url }] };
					responseError.mensajes.push({ codigo: 'HTTP Status ' + status, mensaje: statusText });
				}
				deferred.reject(responseError);
			});

			return deferred.promise;
		};



		divisionService.exponerCreacion = function exponerCreacion() {
			divisionService.accion = accion_crear;
			divisionService.divisionAEditar = null;
			$location.path('/divisionEdicion');
		};

		divisionService.exponerEdicion = function exponerEdicion(divisionAEditar) {
			divisionService.accion = accion_editar;
			divisionService.divisionAEditar = divisionAEditar;
			$location.path('/divisionEdicion');
		};

		return divisionService;
	}]);