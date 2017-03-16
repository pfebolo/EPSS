var coordinadorMod = angular.module("coordinadorModulo", []);


coordinadorMod.controller("coordinadorListaControlador",
	function Cargarcoordinadores($rootScope, $scope, $http, $filter) {
		$scope.GetCoordinacionesOK = false;
		$scope.GetCoordinadoresOK = false;
		$scope.cargando = true;

		$http.get($scope.config.servidor + 'api/coordinadores')
			.success(function (data) {
				//$scope.coordinadores = data;
				$scope.coordinadores = $filter('orderBy')(data, 'nombre');
				agruparCoordinadores($scope.coordinadores);
				$scope.GetCoordinadoresOK = true;
			})
			.error(function (data) {
				$scope.GetCoordinadoresOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

		$http.get($scope.config.servidor + 'api/coordinaciones')
			.success(function (data) {
				$scope.coordinaciones = data;
				$scope.GetCoordinacionesOK = true;
			})
			.error(function (data) {
				$scope.GetCoordinacionesOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

		var agruparCoordinadores = function agruparCoordinadores(coordinadores) {
			$scope.coordinadoresAgupados = [];
			for (i = 0; i < coordinadores.length; i = i + 4)
				$scope.coordinadoresAgupados.push(coordinadores.slice(i, i + 4));
		};

	}
)