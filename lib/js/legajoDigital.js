var legajoDigitalMod = angular.module("legajoDigitalModulo", []);



legajoDigitalMod.controller("legajoDigitalModalildadesControlador",
		function CargarModalidadesC($scope, $http) {
		$http.get('http://localhost:5000/api/modalidad').success(function (data) {
			$scope.modalidades = data;
		});
		}
)

