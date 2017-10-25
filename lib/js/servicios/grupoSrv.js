'use strict';
var grupoMod = angular.module('grupoModulo');

grupoMod.factory('grupoSrv', ['$q', '$http', '$rootScope', '$location',
	function ($q, $http, $rootScope, $location) {

		var baseUrl = $rootScope.config.servidor;
		var grupoService = {};
		grupoService.grupoAEditar = null;


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

		//Agregar un Estudiante a un Grupo
		grupoService.crear = function crear(grupo) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/grupos';
			$http({
				url: url,
				method: 'POST',
				data: grupo,
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
		

		//Eliminar un Estudiante de un grupo
		grupoService.eliminar = function eliminar(carreraId, modoId, anioInicio, mesInicio, anioLectivo, nmestreLectivo, turnoId, divisionId, alumnoId) {
			var deferred = $q.defer();
			var url = encodeURI(baseUrl + 'api/grupos/' + carreraId + '/' + modoId + '/' + anioInicio + '/' + mesInicio + '/' + anioLectivo + '/' + nmestreLectivo + '/' + turnoId + '/' + divisionId + '/' +alumnoId);
			$http({
				url: url,
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
					responseError = { mensajes: [{ codigo: 'url', mensaje: url }] };
					responseError.mensajes.push({ codigo: 'HTTP Status ' + status, mensaje: statusText });
				}
				deferred.reject(responseError);
			});

			return deferred.promise;
		};
		

		grupoService.exponerEdicion = function exponerEdicion(grupo) {
			grupoService.grupoAEditar = grupo;
			$location.path('/grupoEdicion');
		};



		return grupoService;
	}]);