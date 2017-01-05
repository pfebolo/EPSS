var alumnoMod = angular.module("alumnoModulo", []);




alumnoMod.controller("alumnoListaControlador",
		function CargarAlumnos($rootScope, $scope, $http) {
		$scope.GetOK=true;
		$scope.cargando=true;

		$http.get($scope.config.servidor + 'api/alumnos')
		  .success(function (data) {
				$scope.alumnos = data;
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

