'use strict';
var coordinacionMod = angular.module('coordinacionModulo');

coordinacionMod.factory('coordinacionSrv', ['$q', '$http', '$rootScope', 
	function ($q, $http, $rootScope) {

		var baseUrl = $rootScope.config.servidor;
		var coordinacionService = {};


		//Obtener coordinaciones
		coordinacionService.getAll = function getAll() {
			var deferred = $q.defer();
			var url = baseUrl + 'api/coordinaciones';
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

		return coordinacionService;
	}]);