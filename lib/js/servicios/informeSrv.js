'use strict';
var informeMod = angular.module('informeModulo');

informeMod.factory('informeSrv', ['$q', '$http', '$rootScope', '$location', 'UtilService',
	function ($q, $http, $rootScope, $location, UtilService) {
		var baseUrl = $rootScope.config.servidor;
		var informeService = {};
		var acciones = {'crear' : 0, 'editar' : 1};
		informeService.acciones = acciones;
		informeService.accion = acciones.crear;


		//Obtener Informes de un alumno
		informeService.getInfByAlumno = function getInfByAlumno(alumnoId) {
			return UtilService.getApi(baseUrl + 'api/informes/byAlumno/' + alumnoId);
		};

		//Obtener Informe especifico
		informeService.getInforme = function getInforme(alumnoId,coordinadorId,anioLectivo) {
			return UtilService.getApi(baseUrl + 'api/informes/byInforme/' + alumnoId + '/' + coordinadorId + '/' + anioLectivo);
		};

		//Crear un informe
		informeService.crear = function crear(informe) {
			return UtilService.postApi(baseUrl + 'api/informes', informe);
		};

		//Actualizar un informe
		informeService.actualizar = function actualizar(informe) {
			return UtilService.putApi(baseUrl + 'api/informes', informe);
		};

		informeService.exponerCreacion = function exponerCreacion() {
			informeService.accion = acciones.crear;
			informeService.informeAEditar = null;
			$location.path('/informeEdicion');
		};

		informeService.exponerEdicion = function exponerEdicion(informeAEditar) {
			informeService.accion = acciones.editar;
			informeService.informeAEditar = informeAEditar;
			$location.path('/informeEdicion');
		};

		return informeService;
	}]);