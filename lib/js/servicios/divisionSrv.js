'use strict';
var divisionMod = angular.module('divisionModulo');

divisionMod.factory('divisionSrv', ['$q', '$http', '$rootScope', '$location', 'UtilService',
	function ($q, $http, $rootScope, $location, UtilService) {

		var baseUrl = $rootScope.config.servidor;
		var divisionService = {};
		var accion_crear = 0;
		var accion_editar = 1;
		divisionService.accion = null;
		divisionService.estadoDivisionMap = { 
			Cursando : 'Cursando',
			EnPreparacion : 'En Preparación',
			Terminado : 'Terminado'
		};


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


		//Promover un division
		divisionService.promover = function eliminar(divisionOrigen, divisionDestino) {
			var deferred = $q.defer();
			var url = encodeURI(baseUrl + 'api/divisiones/' + divisionOrigen.carreraId + '/' + divisionOrigen.modoId + '/' + divisionOrigen.anioInicio + '/' + divisionOrigen.mesInicio + '/' + divisionOrigen.anioLectivo + '/' + divisionOrigen.nmestreLectivo + '/' + divisionOrigen.turnoId + '/' + divisionOrigen.divisionId);
			url = url + '/promocion';
			$http({
				url: url,
				method: 'POST',
				data: divisionDestino,
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

		//Egresar un division
		divisionService.egresar = function egresar(division) {
			var deferred = $q.defer();
			var url = encodeURI(baseUrl + 'api/divisiones/' + division.carreraId + '/' + division.modoId + '/' + division.anioInicio + '/' + division.mesInicio + '/' + division.anioLectivo + '/' + division.nmestreLectivo + '/' + division.turnoId + '/' + division.divisionId);
			url = url + '/egreso';
			$http({
				url: url,
				method: 'POST'
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




		//Obtener modos
		divisionService.getModos = function getModos() {
			var deferred = $q.defer();
			var url = baseUrl + 'api/modos';
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
				deferred.reject(UtilService.getResponseError(response,url));
			});
			return deferred.promise;
		};
		
		//Obtener EstadosDivision
		divisionService.getEstadosDivision = function getEstadosDivision() {
			return UtilService.getApi(baseUrl + 'api/estadosDivision');
		};

		//Obtener Turnos
		divisionService.getTurnos = function getTurnos() {
			return UtilService.getApi(baseUrl + 'api/turnos');
		};

		divisionService.exponerCreacion = function exponerCreacion() {
			divisionService.accion = accion_crear;
			divisionService.divisionAEditar = null;
			$location.path(baseUrl + '/divisionEdicion');
		};

		divisionService.exponerEdicion = function exponerEdicion(divisionAEditar) {
			divisionService.accion = accion_editar;
			divisionService.divisionAEditar = divisionAEditar;
			$location.path(baseUrl + '/divisionEdicion');
		};

		return divisionService;
	}]);