'use strict';
var grupoMod = angular.module('grupoModulo');

grupoMod.factory('grupoSrv', ['$q', '$http', '$rootScope', '$location',
	function ($q, $http, $rootScope, $location) {

		var baseUrl = $rootScope.config.servidor;
		var grupoService = {};


		//Obtener grupos
		grupoService.getAll = function getAll() {
			var deferred = $q.defer();
			var url = baseUrl + 'api/grupos';
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

		grupoService.exponerEdicion = function exponerEdicion() {
			$location.path('/grupoEdicion');
		};



		return grupoService;
	}]);