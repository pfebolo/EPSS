var legajosMod = angular.module('legajoModulo');

legajosMod.controller('legajoEdicionControlador', ['$scope', '$http', 'UtilService', 'legajoSrv',
	function CargarLegajos($scope, $http, UtilService, legajoSrv) {
		$scope.GetOK = true;
		$scope.cargando = true;
		$scope.legajoSeleccionado = null;
		$scope.edad = 0;
		$scope.error = { hayError: false, errores: {} };
		$scope.filtroDuplicados = true;
		$scope.CuestionarioActivo = 0;
		$scope.CuestionarioActivoText = [];
		$scope.EstadosEstudiante = [];
		$scope.estadoEstudianteNuevo =  {};


		var obtenerEdad = function obtenerEdad(fechaNacimientoString) {
			if (typeof fechaNacimientoString != 'undefined') {
				var fechaNacimiento = new Date(fechaNacimientoString);
				var diaNacimiento = fechaNacimiento.getDate();
				var mesNacimiento = fechaNacimiento.getMonth();
				var anioNacimiento = fechaNacimiento.getFullYear();
				var fechaActual = new Date();
				var diaActual = fechaActual.getDate();
				var mesActual = fechaActual.getMonth();
				var anioActual = fechaActual.getFullYear();
				var edad = anioActual - anioNacimiento;
				if ((mesActual < mesNacimiento) || ((mesActual == mesNacimiento) & (diaActual < diaNacimiento)))
					edad = edad - 1;
				return edad;
			}
		};


		$scope.cargarLegajo = function cargarLegajo(legajo) {
			$scope.edad = obtenerEdad(legajo.fechaNacimiento);
			$scope.legajoSeleccionado = legajo;
			$scope.legajoSeleccionadoCursoActivo = legajo;
			$scope.CuestionarioActivoText[0] = $scope.legajoSeleccionado.historia;
			$scope.CuestionarioActivoText[1] = $scope.legajoSeleccionado.definicion;
			$scope.CuestionarioActivoText[2] = $scope.legajoSeleccionado.situacion;
			$scope.CuestionarioActivoText[3] = $scope.legajoSeleccionado.expectativas;
			$scope.CuestionarioActivo = 0;
		};

		$scope.setSeguimiento = function setSeguimiento() {
			$scope.legajoSeleccionado.seguimiento = !$scope.legajoSeleccionado.seguimiento;
		};

		$scope.ActualizarLegajo = function ActualizarLegajo(legajoAActualizar) {
			$scope.error = { hayError: false, errores: {} };
			var carrera = legajoAActualizar.alumno.carrera;
			delete legajoAActualizar.alumno.carrera;
			delete legajoAActualizar.estadoEstudiante;
			legajoAActualizar.estadoEstudianteId = $scope.estadoEstudianteNuevo.estadoEstudianteId;
			legajoSrv.update(legajoAActualizar)
				.then(function () {
					legajoAActualizar.alumno.carrera= carrera;
					legajoAActualizar.estadoEstudiante = $scope.estadoEstudianteNuevo;
					window.history.back();
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				});
		};

		$scope.cancelarEdicion = function cancelarEdicion() {
			window.history.back();
		};

		function CargarPagina() {
			legajoSrv.getAllEstadosEstudiante()
			.then(function (response) {
				$scope.EstadosEstudiante = response;
				$scope.EstadosEstudiante.forEach(function(item){
					if (item.estadoEstudianteId===legajoSrv.legajoAEditar.estadoEstudiante.estadoEstudianteId)
						$scope.estadoEstudianteNuevo = item;
				});
				$scope.cargarLegajo(legajoSrv.legajoAEditar);
			})
			.catch(function () {
				$scope.EstadosEstudiante = [];
				$scope.GetOK = false;
			})			
			.finally(function () {
				$scope.cargando = false;
			});
		}

		CargarPagina();


	}
]);


