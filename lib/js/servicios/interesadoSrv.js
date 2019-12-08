'use strict';
var interesadoMod = angular.module('interesadoModulo');

interesadoMod.factory('interesadoSrv', ['$q', '$http', '$rootScope', '$location', '$filter', 'UtilService',
	function ($q, $http, $rootScope, $location, $filter, UtilService) {

		var baseUrl = $rootScope.config.servidor;
		var interesadoService = {};
		var accion_crear = 0;
		var accion_editar = 1;
		interesadoService.accion = null;
		interesadoService.pinEliminacion = $rootScope.config.PIN;
		interesadoService.interesadoFiltro = '';
		interesadoService.interesados = [];


		//Obtener interesados
		interesadoService.getAll = function getAll() {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesados',
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).then(function (response) {
				deferred.resolve(UtilService.decodificarDatosViejoSistema(response.data));
			}).catch(function (response) {
				deferred.reject(response);
			});
			return deferred.promise;
		};


		//Crear un interesado
		interesadoService.crear = function crear(interesado) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesados',
				method: 'POST',
				data: interesado
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

		//Actualizar datos de un interesado
		interesadoService.actualizar = function actualizar(interesado) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesados',
				method: 'PUT',
				data: interesado
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

		//Eliminar un interesado
		interesadoService.eliminar = function eliminar(interesadoId) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/interesados/' + interesadoId,
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

		var reglaDuplicidad = function (item) {
			return UtilService.stringToLocale(item.mail.trim());
		};

		interesadoService.orderEMail = function orderEmail(item) {
			var mailnormalizado = item.mail.trim();
			if (mailnormalizado==='') {
				mailnormalizado= Math.random();
				item.duplicadocomparacion = mailnormalizado;
			} else 
				item.duplicadocomparacion = reglaDuplicidad(item);
			return mailnormalizado;
		};

		interesadoService.orderApellidoYNombre = function orderApellidoYNombre(item) {
			item.apellidoYNombre = item.apellido.trim() + ', ' + item.nombre.trim();
			//item.duplicadocomparacion = reglaDuplicidad(item);
			return item.apellidoYNombre;
		};

		interesadoService.esDuplicado = function esDuplicado(item, indice, interesados) {
			//item.duplicadocomparacion = reglaDuplicidad(item);
			var estaDuplicado = (interesados.length > (indice + 1)
				&& item.duplicadocomparacion === interesados[indice + 1].duplicadocomparacion
			);
			estaDuplicado = (estaDuplicado || (indice > 0
				&& item.duplicadocomparacion === interesados[indice - 1].duplicadocomparacion
			));
			return estaDuplicado;
		};

		interesadoService.esItemDuplicado = function esItemDuplicado(item) {
			var resultado = false;
			if (item.mail !== null) {
				var inte = $filter('filter')(interesadoService.interesados, reglaDuplicidad(item), true);
				resultado = (inte.length > 1 || (inte.length === 1 && interesadoService.accion !== accion_editar));
			}
			return resultado;
		};

		//Obtener interacciones
		interesadoService.getInteraccionesPorInteresado = function getInteraccionesPorInteresado(InteresadoId) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/InteraccionesInteresados/byInteresado/' + InteresadoId;
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

		//Agregar interacciones
		interesadoService.agregarInteraccion = function agregarInteraccion(interaccion) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/InteraccionesInteresados';
			$http({
				url: url, 
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				cache: false,
				data: interaccion
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
				//console.log(responseError);
				deferred.reject(responseError);
			});
			return deferred.promise;
		};

		//Eliminar interaccion
		interesadoService.eliminarInteraccion = function eliminarInteraccion(InteresadoId,interaccionId) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/interaccionesInteresados/' + InteresadoId + '/' + interaccionId;
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
					responseError = { mensajes: [{ codigo: 'url' , mensaje: url }] };
					responseError.mensajes.push({ codigo: 'HTTP Status ' + status, mensaje: statusText });
				}
				//console.log(responseError);
				deferred.reject(responseError);
			});
			return deferred.promise;
		};

		interesadoService.exponerCreacion = function exponerCreacion(interesados) {
			interesadoService.interesados = interesados;
			interesadoService.interesados = $filter('orderBy')(interesadoService.interesados, this.orderApellidoYNombre);  //ordena Por Apellido+Nombre para buscar duplicados
			interesadoService.accion = accion_crear;
			interesadoService.interesadoAEditar = null;
			$location.path('/interesadoEdicion');
		};

		interesadoService.exponerEdicion = function exponerEdicion(interesadoAEditar/*, interesados*/) {
			//interesadoService.interesados = interesados;
			//interesadoService.interesados = $filter('orderBy')(interesadoService.interesados, this.orderApellidoYNombre);  //ordena Por Apellido+Nombre para buscar duplicados
			interesadoService.accion = accion_editar;
			interesadoService.interesadoAEditar = interesadoAEditar;
			$location.path('/interesadoEdicion');
		};

		//Obtener un Interesado
		interesadoService.getByInteresadoId = function getByInteresadoId(InteresadoId) {
			return UtilService.getApi(baseUrl + 'api/interesados/' + InteresadoId);
		};


		return interesadoService;
	}]);