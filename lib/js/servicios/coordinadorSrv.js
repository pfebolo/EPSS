'use strict';
var coordinadorMod = angular.module('coordinadorModulo');

coordinadorMod.factory('coordinadorSrv', ['$q', '$http', '$rootScope',
	function ($q, $http, $rootScope) {

		var baseUrl = $rootScope.config.servidor;
		var coordinadorService = {};


		//Obtener coordinadores
		coordinadorService.getAll = function getAll() {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/coordinadores',
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
					responseError = { mensajes: [{ codigo: 'HTTP Status ' + status, mensaje: statusText }] };
				}
				deferred.reject(responseError);
			});
			return deferred.promise;
		};

		//Actualizar datos de un coordinador
		coordinadorService.actualizar = function actualizar(coordinador) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/coordinadores';
			$http({
				url: url,
				method: 'PUT',
				data: coordinador,
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

		return coordinadorService;
	}]);