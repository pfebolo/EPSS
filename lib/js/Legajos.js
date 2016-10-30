var legajosMod = angular.module("LegajosModulo", []);




legajosMod.controller("LegajoListaDetalleControlador",
		function CargarLegajos($scope, $http) {
		$scope.GetOK = true;
		$scope.cargando = true;
		$scope.legajoSeleccionado = null;
		$scope.edad = 0;

		//configuracion de datos a informar
		$scope.informaConfigruacion= { 'Basico' : true,
		                               'Estudios' : false};


		$http.get('http://localhost:5000/api/legajos')
			.success(function (data) {
				$scope.legajos = data;
				$scope.GetOK = true;
				$scope.cargarLegajo($scope.legajos[0]);
			})
			.error(function (data) {
				$scope.GetOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});


		$scope.informarDetalle = function informarDetalle() {
			$scope.cargando = !$scope.cargando;
		}

		$scope.cargarLegajo = function cargarLegajo(legajo) {
			$scope.edad = $scope.obtenerEdad(legajo.fechaNacimiento);
			$scope.legajoSeleccionado = legajo;

		}

		$scope.obtenerEdad = function obtenerEdad(fechaNacimientoString) {
			if (typeof fechaNacimientoString != 'undefined') {
				var fechaNacimiento = new Date(fechaNacimientoString);
				var diaNacimiento = fechaNacimiento.getDate();
				var mesNacimiento = fechaNacimiento.getMonth();
				var anioNacimiento = fechaNacimiento.getYear();
				var fechaActual = new Date();
				var diaActual = fechaActual.getDate();
				var mesActual = fechaActual.getMonth();
				var anioActual = fechaActual.getYear();
				var edad = anioActual - anioNacimiento;
				if ((mesActual < mesNacimiento) || ((mesActual == mesNacimiento) & (diaActual < diaNacimiento)))
					edad = edad - 1;
				console.info(edad.toString());
				return edad;
			}
		}

		$scope.cambiarInforme = function cambiarInforme(tipoSeleccionado) {
		  for (var tipo in $scope.informaConfigruacion) {
				$scope.informaConfigruacion[tipo] = (tipo==tipoSeleccionado);
			}
		}

		}
)

