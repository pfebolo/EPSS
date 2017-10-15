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

		return coordinadorService;
	}]);