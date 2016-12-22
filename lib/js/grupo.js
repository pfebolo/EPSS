var grupoMod = angular.module("grupoModulo", []);


grupoMod.controller("grupoListaControlador",
		function CargarGrupos($scope, $http) {
		$scope.getgruposOK=false;
		$scope.getCoordinacionesOK=false;
		$scope.cargando=true;

		$http.get('http://localhost:5000/api/grupos')
		  .success(function (data) {
				$scope.grupos = data;
				$scope.getgruposOK=true;
			})
			.error(function (data) {
				$scope.getgruposOK=false;
			})
			.finally(function() {
				$scope.cargando=false;
			});

			$http.get('http://localhost:5000/api/coordinaciones')
		  .success(function (data) {
				$scope.coordinaciones = data;
				$scope.getCoordinacionesOK=true;
			})
			.error(function (data) {
				$scope.getCoordinacionesOK=false;
			})
			.finally(function() {
				$scope.cargando=false;
			});
		}
)