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

		//Obtener inscriptos
		estudianteService.getAll = function getAll() {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/inscriptos',
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};


		estudianteService.exponerInscripcion = function exponerInscripcion(estudianteAInscribir) {
			estudianteService.accion = accion_inscribir;
			estudianteService.interesadoAInscribir = estudianteAInscribir;
			$location.path('/inscriptoEdicion');
		};


		estudianteService.exponerEdicion = function exponerEdicion(estudianteAEditar) {
			estudianteService.accion = accion_editar;
			estudianteService.estudianteAEditar = estudianteAEditar;
			$location.path('/inscriptoEdicion');
		};

		//Actualizar un Estudiante
		estudianteService.actualizar = function actualizar(estudiante) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/alumnos',
				method: 'PUT',
				data: estudiante
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

		return estudianteService;
	}]);