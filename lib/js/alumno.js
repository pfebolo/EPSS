var alumnoMod = angular.module("alumnoModulo", []);




alumnoMod.controller("alumnoListaControlador",
		function CargarAlumnos($scope, $http) {
		$scope.GetOK=true;
		$scope.cargando=true;

		$http.get('http://localhost:5000/api/alumnos')
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

