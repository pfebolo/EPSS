var grupoMod = angular.module('grupoModulo');


grupoMod.controller('grupoListaControlador',['$rootScope', '$scope', '$http',
	function CargarGrupos($rootScope, $scope, $http) {
		$scope.getgruposOK = false;
		$scope.getCoordinacionesOK = false;
		$scope.cargando = true;

		$http.get($scope.config.servidor + 'api/grupos')
			.then(function (response) {
				$scope.grupos = response.data;
				$scope.getgruposOK = true;
			})
			.catch(function () {
				$scope.getgruposOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

		$http.get($scope.config.servidor + 'api/coordinaciones')
			.then(function (response) {
				$scope.coordinaciones = response.data;
				$scope.getCoordinacionesOK = true;
			})
			.catch(function () {
				$scope.getCoordinacionesOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

	}
]);