var legajosMod = angular.module('legajoModulo');

legajosMod.controller('legajoListaControlador',['$scope', '$http', '$filter', '$location', 'UtilService', 'legajoSrv',
	function CargarLegajos($scope, $http, $filter, $location, UtilService, legajoSrv) {
		$scope.GetOK = true;
		$scope.cargando = true;
		$scope.legajoSeleccionado = null;
		$scope.edad = 0;
		$scope.error = { hayError: false, errores: {} };
		$scope.filtroDuplicados = true;
		$scope.CuestionarioActivo = 0;
		$scope.CuestionarioActivoText = [];


		//configuracion de datos a informar
		$scope.informaConfiguracion = {
			'Basico': true,
			'Estudios': false,
			'Documentacion': false,
			'Inscripcion': false,
			'Cuestionario': false,
			'Trabajo': false
		};


		legajoSrv.getAll()
			.then(function (responseOK) {
				var x = decodeURIComponent(JSON.stringify(responseOK).replace(/\+/g, ' ').replace(/\% /g, '％ '));
				$scope.legajos = JSON.parse(x.replace(/\t/g, ' '));
				$scope.GetOK = true;
				if (legajoSrv.legajoAEditar == null)
					$scope.cargarLegajo($scope.legajos[0]);
				else
					$scope.cargarLegajo(legajoSrv.legajoAEditar);
			})
			.catch(function () {
				$scope.GetOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});


		$scope.informarDetalle = function informarDetalle() {
			$scope.cargando = !$scope.cargando;
		};

		$scope.setearScroll = function setearScroll() {
			$scope.divscr.scrollTop = legajoSrv.scrollRowEdit;
			return true;
		};

		$scope.cargarLegajo = function cargarLegajo(legajo) {
			$scope.edad = $scope.obtenerEdad(legajo.fechaNacimiento);
			$scope.legajoSeleccionado = legajo;
			$scope.legajoSeleccionadoCursoActivo = legajo;
			$scope.CuestionarioActivoText[0] = $scope.legajoSeleccionado.historia;
			$scope.CuestionarioActivoText[1] = $scope.legajoSeleccionado.definicion;
			$scope.CuestionarioActivoText[2] = $scope.legajoSeleccionado.situacion;
			$scope.CuestionarioActivoText[3] = $scope.legajoSeleccionado.expectativas;
			$scope.CuestionarioActivo = 0;
			$http.get($scope.config.servidor + 'api/cursos/activoporestudiante/' + $scope.legajoSeleccionadoCursoActivo.legajoNro)
				.success(function (data) {
					legajoSrv.testsrv += 50;
					$scope.legajoSeleccionadoCursoActivo = data;
				})
				.error(function () {
					$scope.legajoSeleccionadoCursoActivo = null;
				});

		};

		$scope.obtenerEdad = function obtenerEdad(fechaNacimientoString) {
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

		$scope.cambiarInforme = function cambiarInforme(tipoSeleccionado) {
			for (var tipo in $scope.informaConfiguracion) {
				$scope.informaConfiguracion[tipo] = (tipo == tipoSeleccionado);
			}
		};

		$scope.selectedRow = legajoSrv.selectedRowEdit;
		$scope.divscr = document.getElementById('lista');
		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
			legajoSrv.scrollRowEdit = $scope.divscr.scrollTop;
		};

		$scope.reseleccionar = function reseleccionar(filtro) {
			var leg = $filter('filter')($scope.legajos, filtro, false);
			if (typeof leg != 'undefined' && leg.length > 0)
				$scope.cargarLegajo(leg[0]);
			else
				console.log('Vacio');

		};

		$scope.obtenerAnioCursado = UtilService.obtenerAnioCursado;
		$scope.obtenerCuatrimestreCursado = UtilService.obtenerCuatrimestreCursado;


		$scope.editarLegajo = function editarLegajo(legajoAEditar) {
			legajoSrv.legajoAEditar = legajoAEditar;
			legajoSrv.selectedRowEdit = $scope.selectedRow;
			$location.path('/legajoEdicion');
		};


		$scope.ActualizarLegajo = function ActualizarLegajo(legajoAActualizar) {
			$scope.error = { hayError: false, errores: {} };
			legajoSrv.update(legajoAActualizar)
				.then(function () {
					window.history.back();
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				});
		};
	}
]);


