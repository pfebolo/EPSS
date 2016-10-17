var alumnoMod = angular.module("alumnoModulo", []);



alumnoMod.controller("alumnoListaControlador",
		function CargarAlumnos($scope, $http) {
		$http.get('http://localhost:5000/api/alumno').success(function (data) {
			$scope.alumnos = data;
		});
		}
)

