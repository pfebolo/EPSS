var legajosMod = angular.module('legajoModulo');

legajosMod.controller('legajoListaControlador', ['$scope', '$http', '$filter', '$location', '$timeout', 'UtilService', 'legajoSrv',
	function CargarLegajos($scope, $http, $filter, $location, $timeout, UtilService, legajoSrv) {
		$scope.GetOK = true;
		$scope.cargando = true;
		$scope.legajoSeleccionado = null;
		$scope.edad = 0;
		$scope.error = { hayError: false, errores: {} };
		$scope.filtroDuplicados = true;
		$scope.CuestionarioActivo = 0;
		$scope.CuestionarioActivoText = [];
		$scope.procesandoCSV = false;



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
				$scope.legajos = responseOK;
				$scope.legajosFiltrados = [];
				$scope.reseleccionar('');
				$scope.GetOK = true;
				if (legajoSrv.legajoAEditar !== null) 
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
				.then(function (response) {
					legajoSrv.testsrv += 50;
					$scope.legajoSeleccionadoCursoActivo = response.data;
				})
				.catch(function () {
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


		var orderApellidoYNombre = function orderApellidoYNombre(item) {
			item.alumno.apellidoYNombre = item.alumno.apellido.trim() + ', ' + item.alumno.nombre.trim();
			return item.alumno.apellidoYNombre;
		};

		var customComparator = function (input, search) {
			var encontrado = false;
			if (angular.isString(input))
				var inputLocale = UtilService.stringToLocale(input);
			if (typeof input === 'string')
				encontrado = input.includes(search) || inputLocale.includes(search);
			else if (typeof input !== 'object')
				encontrado = input.toString().includes(search);
			return encontrado;
		};

		$scope.reseleccionar = function reseleccionar(filtro) {
			var leg = $filter('filter')($scope.legajos, UtilService.stringToLocale(filtro), customComparator);
			leg = $filter('orderBy')(leg, orderApellidoYNombre);  //ordena Por Apellido+Nombre para buscar duplicados
			if (typeof leg != 'undefined' && leg.length > 0) {
				$scope.cargarLegajo(leg[0]);
				$scope.legajosFiltrados = leg;
			} else
				$scope.legajosFiltrados = [];
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
			var carrera = legajoAActualizar.alumno.carrera;
			delete legajoAActualizar.alumno.carrera;
			legajoSrv.update(legajoAActualizar)
				.then(function () {
					legajoAActualizar.alumno.carrera= carrera;
					window.history.back();
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				});
		};

		$scope.cancelarEdicion = function cancelarEdicion() {
			//$location.path('/legajoLista');
			window.history.back();
		};


		$scope.irABajarInteresado = function irABajarInteresado() {
			if (!$scope.procesandoCSV) {
				var sep = 'xSEPx';
				var ret = 'xRETx';
				var BOM = '\ufeff';
				$scope.procesandoCSV = true;
				var obj = BOM + 'Nombre' + sep + 'Apellido' + sep + 'E-Mail' + sep + 'Teléfono' + sep + 'Celular' + sep + 'DNI' + sep + 'Localidad' + sep + 'Edad' + sep + 'Sexo' + sep + 'Ocupación' + sep + 'Tít. Secundario' + sep + 'Cuestionario' + sep + 'DNI' + sep + 'Título' + sep + 'Foto' + sep + 'Apto Físico' + sep + 'Compromiso' + ret;
				$scope.legajosFiltrados.forEach(function (item) {
					obj = obj + UtilService.NullToBlanck(item.alumno.nombre) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.apellido) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.mail) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.telefono )+ sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.celular) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.dni) + sep;
					obj = obj + UtilService.NullToBlanck(item.localidadBase) + sep;
					obj = obj + $scope.obtenerEdad(item.fechaNacimiento) + sep;
					obj = obj + UtilService.NullToBlanck(item.sexo) + sep;
					if (item.trabajos.length>0) 
						obj = obj + item.trabajos[item.trabajos.length-1].razonSocial + sep;
					else
						obj = obj + sep;
					if (item.estudios.length>0) 
						obj = obj + item.estudios[0].titulo + sep;  
					else
						obj = obj + sep;
					if (item.cuestionario !== null)
						obj = obj + 'Si' + sep;
					else
						obj = obj + 'No' + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.docDni) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.docTitulo) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.docFoto) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.docAptoFisico) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.docCompromiso) + sep;
					obj = obj + ret;
				});

				obj = obj.replace(/,/g,';');
				obj = obj.replace(/xSEPx/gi,',');
				obj = obj.replace(/xRETx/gi,'\n');
				var data = 'text/csv;charset=utf-8,' + encodeURIComponent(obj);

				var a = document.getElementById('ancla');
				a.href = 'data:' + data;
				a.download = 'legajos.' +  $filter('date')(new Date(), 'yyyyMMdd.HHmmss') +  '.csv';
				a.click();
				$timeout(function (){$scope.procesandoCSV = false;} , 2000);
			}
		};

	}
]);


