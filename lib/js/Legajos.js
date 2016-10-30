var legajosMod = angular.module("LegajosModulo", []);




legajosMod.controller("LegajoListaDetalleControlador",
		function CargarLegajos($scope, $http) {
		$scope.GetOK=true;
		$scope.cargando=true;
		$scope.legajoSeleccionado=null;

		$http.get('http://localhost:5000/api/legajos')
		  .success(function (data) {
				$scope.legajos = data;
				$scope.legajoSeleccionado=$scope.legajos[0];
				$scope.GetOK=true;
			})
			.error(function (data) {
				$scope.GetOK=false;
			})
			.finally(function() {
				$scope.cargando=false;
			});

		
		$scope.informarDetalle = function informarDetalle() {
			$scope.cargando=!$scope.cargando;
		}

		$scope.cargarLegajo = function informarDetalle(Legajo) {
			$scope.legajoSeleccionado=Legajo;
		}


		}
)

