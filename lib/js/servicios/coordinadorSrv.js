'use strict';
var coordinadorMod = angular.module('coordinadorModulo');

coordinadorMod.factory('coordinadorSrv', ['$rootScope', 'UtilService',
	function ($rootScope, UtilService) {

		var baseUrl = $rootScope.config.servidor;
		var coordinadorService = {};

		//Verificar si existe la foto del coordinador
		coordinadorService.existeFoto = function existeFoto(foto) {
			return UtilService.existeArchivo(foto);
		};

		//Obtener coordinadores
		coordinadorService.getAll = function getAll() {
			return UtilService.getApi(baseUrl + 'api/coordinadores');
		};

		//Actualizar datos de un coordinador
		coordinadorService.actualizar = function actualizar(coordinador) {
			return UtilService.putApi(baseUrl + 'api/coordinadores', coordinador);
		};

		//Crear un coordinador
		coordinadorService.crear = function actualizar(coordinador) {
			return UtilService.postApi(baseUrl + 'api/coordinadores', coordinador);
		};

		return coordinadorService;
	}]);