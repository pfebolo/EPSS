'use strict';
var interesadoMod = angular.module('interesadoModulo');

interesadoMod.factory('interesadoSrv', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

	var baseUrl = $rootScope.config.servidor;
	var interesadoService = {};
	interesadoService.interesadoAInscribir = null;

	//Obtener interesados
	interesadoService.getAll = function getAll(fechaFIN) {
		var deferred = $q.defer();
		$http({
			url: baseUrl + 'api/interesados/' + fechaFIN,
			method: 'GET',
			//params: { 'searchText': text },
			cache: false
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	interesadoService.inscribir = function inscribir(preAlumno) {
		var deferred = $q.defer();
		$http({
			url: baseUrl + 'api/alumnos',
			method: 'POST',
			data: preAlumno
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (data, status, headers, config, statusText) {
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

	return interesadoService;
}]);