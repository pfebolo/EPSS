'use strict';
var estudianteMod = angular.module('estudianteModulo');

estudianteMod.factory('estudianteSrv', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

	var baseUrl = $rootScope.config.servidor;
	var estudianteService = {};

	//Obtener inscriptos
	estudianteService.getAll = function getAll() {
		var deferred = $q.defer();
		$http({
			url: baseUrl + 'api/inscriptos',
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

	return estudianteService;
}]);