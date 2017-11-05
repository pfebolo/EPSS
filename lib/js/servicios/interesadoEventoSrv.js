'use strict';
var interesadoEventoMod = angular.module('interesadoEventoModulo');

interesadoEventoMod.factory('interesadoEventoSrv', ['$q', '$http', '$rootScope', '$location', 'UtilService',
	function ($q, $http, $rootScope, $location, UtilService) {

		var baseUrl = $rootScope.config.servidor;
		var interesadoEventoService = {};
		var accion_crear = 0;
		var accion_editar = 1;
		interesadoEventoService.accion = null;

		//Obtener interesadoEventos
		interesadoEventoService.getAll = function getAll() {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesadosEventos', 
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).then(function (response) {
				deferred.resolve(UtilService.decodificarDatosViejoSistema(response.data));
			}).catch(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		//Obtener interesadoEventos de un Evento
		interesadoEventoService.getByEventoId = function getByEventoId(eventoId) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesadosEventos/Eventos/' + eventoId, 
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).then(function (response) {
				deferred.resolve(UtilService.decodificarDatosViejoSistema(response.data));
			}).catch(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		//Obtener interesadoEventos de un Interesado
		interesadoEventoService.getByInteresadoId = function getByInteresadoId(interesadoId) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesadosEventos/interesados/' + interesadoId, 
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).then(function (response) {
				deferred.resolve(UtilService.decodificarDatosViejoSistema(response.data));
			}).catch(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};




		//Eliminar un interesadoEvento
		interesadoEventoService.eliminar = function eliminar(interesadoEventoId) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesadosEventos/' + interesadoEventoId,
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



		//Crear un interesadoEvento
		interesadoEventoService.crear = function crear(interesadoEvento) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesadosEventos',
				method: 'POST',
				data: interesadoEvento
			}).then(function (response) {
				deferred.resolve(UtilService.decodificarDatosViejoSistema(response.data));
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

		//Actualizar datos de un interesadoEvento
		interesadoEventoService.actualizar = function actualizar(interesadoEvento) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesadosEventos',
				method: 'PUT',
				data: interesadoEvento
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

		// interesadoEventoService.exponerCreacion = function exponerCreacion() {
		// 	interesadoEventoService.accion = accion_crear;
		// 	interesadoEventoService.interesadoEventoAEditar = null;
		// 	$location.path('/interesadoEventoEdicion');
		// };

		// interesadoEventoService.exponerEdicion = function exponerEdicion(interesadoEventoAEditar) {
		// 	interesadoEventoService.accion = accion_editar;
		// 	interesadoEventoService.interesadoEventoAEditar = interesadoEventoAEditar;
		// 	$location.path('/interesadoEventoEdicion');
		// };

		return interesadoEventoService;
	}]);