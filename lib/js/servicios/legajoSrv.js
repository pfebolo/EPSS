'use strict';
var legajoMod = angular.module('legajoModulo');

legajoMod.factory('legajoSrv', ['$q', '$http', '$rootScope', 'UtilService',
	function ($q, $http, $rootScope, UtilService) {
		var baseUrl = $rootScope.config.servidor;
		var legajoService = {};
		legajoService.legajoAEditar = null;
		legajoService.selectedRowEdit = null;
		legajoService.scrollRowEdit = null;

		//Obtener legajos
		legajoService.getAll = function () {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/legajos',
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).then(function (response) {
				UtilService.converDate(response.data);
				deferred.resolve(UtilService.decodificarDatosViejoSistema(response.data));
			}).catch(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		legajoService.getAllEstadosEstudiante = function () {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/EstadosEstudiante',
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


		//Actualizar legajo
		legajoService.update = function (legajo) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/legajos',
				method: 'PUT',
				data: legajo
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


		//data – {string|Object} – The response body transformed with the transform functions.
		//status – {number} – HTTP status code of the response.
		//headers – {function([headerName])} – Header getter function.
		//config – {Object} – The configuration object that was used to generate the request.
		//statusText – {string} – HTTP status text of the response.





		//Crear Legajos a los inscriptos indicados
		legajoService.crearLegajos = function crearLegajos(inscriptos) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/inscriptos',
				method: 'PUT',
				data: inscriptos
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

		return legajoService;
	}
]);