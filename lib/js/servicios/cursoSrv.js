'use strict';
var cursoMod = angular.module('cursoModulo');

cursoMod.factory('cursoSrv', ['$q', '$http', '$rootScope',
	function ($q, $http, $rootScope) {

		var baseUrl = $rootScope.config.servidor;
		var cursoService = {};
		// var accion_crear = 0;
		// var accion_editar = 1;
		cursoService.accion = null;


		//Crear un curso
		cursoService.crear = function crear(curso) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/cursos',
				method: 'POST',
				data: curso
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

		//Actualizar datos de un curso
		cursoService.actualizar = function actualizar(curso) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/cursos',
				method: 'PUT',
				data: curso
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

		//Eliminar un curso
		cursoService.eliminar = function eliminar(carreraId,ModoId,anioInicio,mesInicio,anioLectivo,nmestreLectivo) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/carreras/' + carreraId +'/'+ ModoId+'/'+anioInicio+'/'+mesInicio+'/'+anioLectivo+'/'+nmestreLectivo,
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


		return cursoService;
	}]);