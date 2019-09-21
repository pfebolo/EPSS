'use strict';
var informeMod = angular.module('informeModulo');

informeMod.factory('informeSrv', ['$q', '$http', '$rootScope', '$location', 'UtilService',
	function ($q, $http, $rootScope, $location, UtilService) {
		var baseUrl = $rootScope.config.servidor;
		var informeService = {};
		var accion_crear = 0;
		var accion_editar = 1;
		informeService.accion = accion_crear;


		//Obtener Informes de un alumno
		informeService.getInfByAlumno = function getInfByAlumno(alumnoId) {
			return UtilService.getApi(baseUrl + 'api/informes/byAlumno/' + alumnoId);
		};

		//Crear un informe
		informeService.crear = function crear(informe) {
			return UtilService.postApi(baseUrl + 'api/informes', informe);
		};



		// //Obtener informes
		// informeService.getAll = function getAll() {
		// 	var deferred = $q.defer();
		// 	var url = baseUrl + 'api/informes';
		// 	$http({
		// 		url: url,
		// 		method: 'GET',
		// 		headers: {
		// 			'Accept': 'application/json'
		// 		},
		// 		cache: false
		// 	}).then(function (response) {
		// 		deferred.resolve(response.data);
		// 	}).catch(function (response) {
		// 		var data = response.data;
		// 		var status = response.status;
		// 		var statusText = response.statusText;
		// 		var responseError;
		// 		if (data !== '' && data !== null) {
		// 			responseError = data;
		// 		} else {
		// 			responseError = { mensajes: [{ codigo: 'url', mensaje: url }] };
		// 			responseError.mensajes.push({ codigo: 'HTTP Status ' + status, mensaje: statusText });
		// 		}
		// 		deferred.reject(responseError);
		// 	});
		// 	return deferred.promise;
		// };


		


		//Actualizar datos de un informe
		informeService.actualizar = function actualizar(informe) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/informes';
			$http({
				url: url,
				method: 'PUT',
				data: informe,
				headers: {
					'Content-Type': 'application/json'
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

		//Eliminar un informe
		informeService.eliminar = function eliminar(carreraId, modoId, anioInicio, mesInicio, anioLectivo, nmestreLectivo, turnoId, informeId) {
			var deferred = $q.defer();
			var url = encodeURI(baseUrl + 'api/informes/' + carreraId + '/' + modoId + '/' + anioInicio + '/' + mesInicio + '/' + anioLectivo + '/' + nmestreLectivo + '/' + turnoId + '/' + informeId);
			$http({
				url: url,
				method: 'DELETE',
				cache: false,
				headers: {
					'Content-Type': 'application/json'
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


		//Promover un informe
		informeService.promover = function eliminar(informeOrigen, informeDestino) {
			var deferred = $q.defer();
			var url = encodeURI(baseUrl + 'api/informes/' + informeOrigen.carreraId + '/' + informeOrigen.modoId + '/' + informeOrigen.anioInicio + '/' + informeOrigen.mesInicio + '/' + informeOrigen.anioLectivo + '/' + informeOrigen.nmestreLectivo + '/' + informeOrigen.turnoId + '/' + informeOrigen.informeId);
			url = url + '/promocion';
			$http({
				url: url,
				method: 'POST',
				data: informeDestino,
				headers: {
					'Content-Type': 'application/json'
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

		//Egresar un informe
		informeService.egresar = function egresar(informe) {
			var deferred = $q.defer();
			var url = encodeURI(baseUrl + 'api/informes/' + informe.carreraId + '/' + informe.modoId + '/' + informe.anioInicio + '/' + informe.mesInicio + '/' + informe.anioLectivo + '/' + informe.nmestreLectivo + '/' + informe.turnoId + '/' + informe.informeId);
			url = url + '/egreso';
			$http({
				url: url,
				method: 'POST'
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




		//Obtener modos
		informeService.getModos = function getModos() {
			var deferred = $q.defer();
			var url = baseUrl + 'api/modos';
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
				deferred.reject(UtilService.getResponseError(response,url));
			});
			return deferred.promise;
		};
		
		//Obtener EstadosInforme
		informeService.getEstadosInforme = function getEstadosInforme() {
			return UtilService.getApi(baseUrl + 'api/estadosDivision');
		};

		//Obtener Turnos
		informeService.getTurnos = function getTurnos() {
			return UtilService.getApi(baseUrl + 'api/turnos');
		};

		informeService.exponerCreacion = function exponerCreacion() {
			informeService.accion = accion_crear;
			informeService.informeAEditar = null;
			$location.path('/informeEdicion');
		};

		informeService.exponerEdicion = function exponerEdicion(informeAEditar) {
			informeService.accion = accion_editar;
			informeService.informeAEditar = informeAEditar;
			$location.path('/informeEdicion');
		};

		return informeService;
	}]);