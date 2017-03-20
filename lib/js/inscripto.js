var inscriptoMod = angular.module("inscriptoModulo", []);




inscriptoMod.controller("inscriptoListaControlador",
		function CargarInscriptos($rootScope, $scope, $http) {
		$scope.GetOK=true;
		$scope.cargando=true;

		$http.get($scope.config.servidor + 'api/inscriptos')
		  .success(function (data) {
				$scope.inscriptos = data;
				$scope.GetOK=true;
			})
			.error(function (data) {
				$scope.GetOK=false;
			})
			.finally(function() {
				$scope.cargando=false;
			});
		}
)

