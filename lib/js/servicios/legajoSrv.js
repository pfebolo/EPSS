'use strict';
var legajoMod = angular.module('legajoModulo');

legajoMod.factory('legajoSrv', ['$q', '$http', '$rootScope', '$location', 'UtilService',
	function ($q, $http, $rootScope, $location, UtilService) {
		var baseUrl = $rootScope.config.servidor;
		var legajoService = {};
		legajoService.legajoAEditar = null;
		legajoService.selectedRowEdit = null;
		legajoService.scrollRowEdit = null;
		legajoService.ingresanteMin = $rootScope.config.ingresanteMin;
		legajoService.pinEliminacion = $rootScope.config.PIN;
		var accion = {crear : 0 , editar : 1};
		


		//Obtener legajos
		legajoService.getAll = function () {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/legajos',
				method: 'GET',
				//params: { 'searchText': text },
				cache: false
			}).then(function (response) {
				UtilService.converDate(response.data);
				deferred.resolve(UtilService.decodificarDatosViejoSistema(response.data));
			}).catch(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		legajoService.getAllEstadosEstudiante = function () {
			var deferred = $q.defer();
			$http({
				url: baseUrl + 'api/EstadosEstudiante',
				method: 'GET',
				//params: { 'searchText': text },
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

		//Eliminar un Legajo (BAJA LOGICA DE alumno)
		legajoService.eliminar = function eliminar(alumnoAEliminar) {
			var deferred = $q.defer();
			delete alumnoAEliminar.carrera;
			delete alumnoAEliminar.medioDeContacto;
			delete alumnoAEliminar.modalidad;
			delete alumnoAEliminar.nacionalidad;
			alumnoAEliminar.estaBorrado='true';
			$http({
				url: baseUrl + 'api/alumnos',
				method: 'PUT',
				data: alumnoAEliminar,
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
		

		//Obtener Grupos por Estudiante
		legajoService.getGruposPorEstudiante = function getGruposPorEstudiante(EstudianteId) {
			return UtilService.getApi(baseUrl + 'api/grupos/byAlumno/' + EstudianteId);
		};

		//Obtener interacciones
		legajoService.getInteraccionesPorEstudiante = function getInteraccionesPorEstudiante(EstudianteId) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/Interacciones/byAlumno/' + EstudianteId;
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
		legajoService.agregarInteraccion = function agregarInteraccion(interaccion) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/Interacciones';
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
		legajoService.eliminarInteraccion = function eliminarInteraccion(estudianteId,interaccionId) {
			var deferred = $q.defer();
			var url = baseUrl + 'api/interacciones/' + estudianteId + '/' + interaccionId;
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

		//Obtener informes
		legajoService.getInformesXEstudiante = function getInformesXEstudiante(EstudianteId) {
			return UtilService.getApi(baseUrl + 'api/Informes/byAlumno/' + EstudianteId);
		};

		//Actualizar informes
		legajoService.actualizarInforme = function actualizarInforme(informe) {
			delete informe.coordinador;
			return UtilService.putApi(baseUrl + 'api/informes', informe);
		};

		legajoService.exponerCreacionInforme = function exponerCreacionInforme() {
			//legajoService.accion = accion.crear;
			//legajoService.divisionAEditar = null;
			$location.path('/informeEdicion');
		};

		//Obtener Legajos x Legajo Nro
		legajoService.getLegajoXLegajoNro = function getLegajoXLegajoNro(LegajoNro) {
			return UtilService.getApi(baseUrl + 'api/legajos/byLegajoNro/' + LegajoNro);
		};



		return legajoService;
	}
]);