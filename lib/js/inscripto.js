var inscriptoMod = angular.module('inscriptoModulo', []);


inscriptoMod.factory('InscriptoSrv', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

	var baseUrl = $rootScope.config.servidor;
	var inscriptoService = {};

	//Obtener inscriptos
	inscriptoService.getAll = function getAll() {
		var deferred = $q.defer();
		console.log('getAll');
		$http({
			url: baseUrl + 'api/inscriptos',
			method: 'GET',
			//params: { 'searchText': text },
			cache: false
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	//Actualizar inscriptos
	inscriptoService.update = function update(inscriptos) {
		var deferred = $q.defer();
		$http({
			url: baseUrl + 'api/inscriptos',
			method: 'PUT',
			data: inscriptos
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (data, status, headers, config, statusText) {
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

	return inscriptoService;
}]);


inscriptoMod.controller('inscriptoControlador',
	function CargarInscriptos($rootScope, $scope, $http, InscriptoSrv) {
		$scope.GetOK = false;
		$scope.cargando = true;
		$scope.actualizando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.inscriptoSeleccionado = null;



		// $http.get($scope.config.servidor + 'api/inscriptos')
		//   .success(function (data) {
		// 		$scope.inscriptos = data;
		// 		$scope.GetOK=true;
		// 	})
		// 	.error(function (data) {
		// 		$scope.GetOK=false;
		// 	})
		// 	.finally(function() {
		// 		$scope.cargando=false;
		// 	});

		$scope.ObtenerInscriptos = function ObtenerInscriptos() {
			$scope.cargando = true;
			InscriptoSrv.getAll()
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' '));
					$scope.inscriptos = JSON.parse(x.replace(/\t/g, ' '));
					$scope.GetOK = true;
					if ($scope.inscriptos.length > 0)
						$scope.cargarInscripto($scope.inscriptos[0]);
				})
				.catch(function () {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.ObtenerInscriptos();


		$scope.ActualizarInscriptos = function ActualizarInscriptos(inscriptos) {
			$scope.error = { hayError: false, errores: {} };
			$scope.actualizando = true;
			$scope.myStyle.cursor = 'wait';
			InscriptoSrv.update(inscriptos)
				.then(function () {
					$scope.ObtenerInscriptos();
				})
				.catch(function (dataResponseError) {
					$scope.error.errores = dataResponseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.actualizando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};

		$scope.cargarInscripto = function cargarInscripto(inscripto) {
			$scope.inscriptoSeleccionado = inscripto;
		};

	}
);
