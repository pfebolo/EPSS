var grupoMod = angular.module('grupoModulo', []);


grupoMod.controller('"grupoListaControlador',
	function CargarGrupos($rootScope, $scope, $http) {
		$scope.getgruposOK = false;
		$scope.getCoordinacionesOK = false;
		$scope.cargando = true;

		$http.get($scope.config.servidor + 'api/grupos')
			.success(function (data) {
				$scope.grupos = data;
				$scope.getgruposOK = true;
			})
			.error(function () {
				$scope.getgruposOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

		$http.get($scope.config.servidor + 'api/coordinaciones')
			.success(function (data) {
				$scope.coordinaciones = data;
				$scope.getCoordinacionesOK = true;
			})
			.error(function () {
				$scope.getCoordinacionesOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

	}
);