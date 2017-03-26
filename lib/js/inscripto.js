var inscriptoMod = angular.module("inscriptoModulo", []);


inscriptoMod.factory('InscriptoSrv', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

	var baseUrl = $rootScope.config.servidor;
	var inscriptoService = {};

	//Obtener inscriptos
	inscriptoService.getAll = function getAll() {
		var deferred = $q.defer();
		console.log("getAll");
		return $http({
			url: baseUrl + 'api/inscriptos',
			method: 'GET',
			//params: { 'searchText': text },
			cache: false
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (error) {
			deferred.reject(error);
		})
		return deferred.promise;
	}

	//Actualizar inscriptos
	inscriptoService.update = function update(inscriptos) {
		var deferred = $q.defer();
		return $http({
			url: baseUrl + 'api/inscriptos',
			method: 'PUT',
			data: inscriptos
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (error) {
			deferred.reject(error);
		})
		return deferred.promise;
	}

	return inscriptoService;
}]);


inscriptoMod.controller("inscriptoControlador",
	function CargarInscriptos($rootScope, $scope, $http, InscriptoSrv) {
		$scope.GetOK = true;
		$scope.cargando = true;

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
			InscriptoSrv.getAll()
				.then(function (responseOK) {
					$scope.inscriptos = responseOK.data;
					$scope.GetOK = true;
				})
				.catch(function (data) {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
				});
		}

		$scope.ObtenerInscriptos();

		$scope.ActualizarInscriptos = function ActualizarInscriptos(inscriptos) {
			InscriptoSrv.update(inscriptos)
				.then(function (responseOK) {
					$scope.ObtenerInscriptos();
				})
				.catch(function (responseError) {
					alert("ERROR:" + responseError)
				});
		}
	}
)
