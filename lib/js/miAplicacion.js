var miApp = angular.module("miAplicacion", []);
var GuitarraMod = angular.module("GuitarraModulo", []);

GuitarraMod.controller("MenuControlador",
	function CargarMenu($scope) {
		$scope.meal = {
			'desayuno': 'Jugo de Naranja',
			'almuerzo': 'Ensalada de frutas',
			'cena': 'Arroz con vegetales'
		}
	}
),

	GuitarraMod.controller("GuitarrasControlador",
		function CargarGuitarra($scope, $http) {
			$http.get('data/guitarras.json').success(function (data) {
				$scope.guitarras = data;
				$orderGuitar = 'nombre';
			});

		}
	)

GuitarraMod.controller("GuitarraDetalleControlador",
	function CargarGuitarraDetalle($scope, $http, $routeParams) {
		$http.get('data/guitarras.json').success(function (data) {
			$scope.guitarras = data;
			$scope.guitarraSeleccionada = $routeParams.guitarraSeleccionada;

			$scope.guitarraAnterior = Number($scope.guitarraSeleccionada) - 1;
			$scope.guitarraPosterior = Number($scope.guitarraSeleccionada) + 1;
			if ($scope.guitarraAnterior < 0)
				$scope.guitarraAnterior = $scope.guitarras.length - 1;
			if ($scope.guitarraPosterior > ($scope.guitarras.length - 1))
				$scope.guitarraPosterior = 0;

		});

	}
)