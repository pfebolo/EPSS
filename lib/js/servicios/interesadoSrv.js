'use strict';
var interesadoMod = angular.module('interesadoModulo');

interesadoMod.factory('interesadoSrv', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

	var baseUrl = $rootScope.config.servidor;
	var interesadoService = {};

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

	return interesadoService;
}]);