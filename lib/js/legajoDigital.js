var legajoDigitalMod = angular.module("legajoDigitalModulo", []);



legajoDigitalMod.controller("legajoDigitalModalildadesControlador",
		function CargarModalidadesC($rootScope, $scope, $http) {
		$http.get($scope.config.servidor + 'api/modalidad').success(function (data) {
			$scope.modalidades = data;
		});
		}
)

