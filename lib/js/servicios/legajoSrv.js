'use strict';
var legajoMod = angular.module('legajoModulo');

legajoMod.factory('legajoSrv', ['$q', '$http', '$rootScope', 'UtilService',
	function ($q, $http, $rootScope, UtilService) {

		var baseUrl = $rootScope.config.servidor;
		var legajoService = {};
		//legajoService.legajos = [];
		legajoService.legajoAEditar = null;
		legajoService.selectedRowEdit = null;
		legajoService.scrollRowEdit = null;


		var iso8601RegEx = /(19|20|21)\d\d([-/.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])T(\d\d)([:/.])(\d\d)([:/.])(\d\d)/;

		//Convierte la serialización, de las fechas, por omisión  NET  a una serialización, por omision, de AngularJS
		//TODO: LLevar esta función a UtilService
		function fnConverDate(input) {
			if (typeof input !== 'object') return input;

			for (var key in input) {
				if (!input.hasOwnProperty(key)) continue;

				var value = input[key];
				var type = typeof value;
				var match;
				if (type == 'string' && (match = value.match(iso8601RegEx))) {
					input[key] = value.substring(0, 10);
				}
				else if (type === 'object') {
					fnConverDate(value);
				}
			}
		}


		//Obtener legajos
		legajoService.getAll = function () {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/legajos',
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).then(function (response) {
				fnConverDate(response.data);
				deferred.resolve(UtilService.decodificarDatosViejoSistema(response.data));
			}).catch(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		//Actualizar legajo
		legajoService.update = function (legajo) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/legajos',
				method: 'PUT',
				data: legajo
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


		//data – {string|Object} – The response body transformed with the transform functions.
		//status – {number} – HTTP status code of the response.
		//headers – {function([headerName])} – Header getter function.
		//config – {Object} – The configuration object that was used to generate the request.
		//statusText – {string} – HTTP status text of the response.





		//Crear Legajos a los inscriptos indicados
		legajoService.crearLegajos = function crearLegajos(inscriptos) {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/inscriptos',
				method: 'PUT',
				data: inscriptos
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

		return legajoService;
	}
]);