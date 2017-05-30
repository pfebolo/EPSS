'use strict';
var estudianteMod = angular.module('estudianteModulo');

estudianteMod.factory('estudianteSrv', ['$q', '$http', '$rootScope','$location',
	function ($q, $http, $rootScope, $location) {

		var baseUrl = $rootScope.config.servidor;
		var estudianteService = {};
		var accion_inscribir = 0;
		var accion_editar = 1;
		estudianteService.accion = null;
		estudianteService.interesadoAInscribir = null;
		estudianteService.estudianteAEditar = null;

		//Inscribir a un Estudiante
		estudianteService.inscribir = function inscribir(preEstudiante) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/alumnos',
				method: 'POST',
				data: preEstudiante
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


		estudianteService.exponerInscripcion = function exponerInscripcion(estudianteAInscribir) {
			estudianteService.accion = accion_inscribir;
			estudianteService.interesadoAInscribir = estudianteAInscribir;
			$location.path('/inscripcion');
		};


		estudianteService.exponerEdicion = function exponerEdicion(estudianteAEditar) {
			estudianteService.accion = accion_editar;
			estudianteService.estudianteAEditar = estudianteAEditar;
			$location.path('/inscripcion');
		};

		//Actualizar un Estudiante
		estudianteService.actualizar = function actualizar(estudiante) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/alumnos',
				method: 'PUT',
				data: estudiante
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



		return estudianteService;
	}]);