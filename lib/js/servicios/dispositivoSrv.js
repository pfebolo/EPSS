'use strict';
var dispositivoMod = angular.module('dispositivoModulo');

dispositivoMod.factory('dispositivoSrv', ['$q', '$http', '$rootScope',
	function ($q, $http, $rootScope) {

		var baseUrl = $rootScope.config.servidor;
		var dispositivoService = {};
		dispositivoService.accion = null;


		//Obtener dispositivos
		dispositivoService.getAll = function getAll() {
			var deferred = $q.defer();
			var url = baseUrl + 'api/dispositivos';
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
					responseError = { mensajes: [{ codigo: 'url' , mensaje: url }] };
					responseError.mensajes.push({ codigo: 'HTTP Status ' + status, mensaje: statusText });
				}
				deferred.reject(responseError);
			});
			return deferred.promise;
		};


		//Crear un dispositivo
		dispositivoService.crear = function crear(dispositivo) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/dispositivos',
				method: 'POST',
				data: dispositivo
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

		//Actualizar datos de un dispositivo
		dispositivoService.actualizar = function actualizar(dispositivo) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/dispositivos',
				method: 'PUT',
				data: dispositivo
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

		//Eliminar un dispositivo
		dispositivoService.eliminar = function eliminar(modoId,dispositivoId) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/dispositivos/' + modoId + '/' + dispositivoId,
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


		return dispositivoService;
	}]);