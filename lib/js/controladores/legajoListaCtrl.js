var legajosMod = angular.module('legajoModulo');

legajosMod.controller('legajoListaControlador', ['$scope', '$http', '$filter', '$location', '$timeout', '$q', 'UtilService', 'legajoSrv', 'grupoSrv',
	function CargarLegajos($scope, $http, $filter, $location, $timeout, $q, UtilService, legajoSrv, grupoSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.GetOK = true;
		$scope.cargando = true;
		$scope.legajoSeleccionado = null;
		$scope.edad = 0;
		$scope.error = { hayError: false, errores: {} };
		$scope.filtroDuplicados = true;
		$scope.CuestionarioActivo = 0;
		$scope.CuestionarioActivoText = [];
		$scope.procesandoCSV = false;
		$scope.filtrarSeguimiento = false;
		$scope.filtrarCuestionario = false;
		$scope.nombreapellidoFiltro = '';
		$scope.cicloDeVida = [];
		$scope.interacciones = [];
		$scope.ahora = Math.floor(Date.now() / 1000);
		$scope.soloIngresantes = false;
		var filtro = { general: $scope.nombreapellidoFiltro, seguimiento: $scope.filtrarSeguimiento, soloIngresantes: $scope.soloIngresantes, cuestionario: $scope.filtrarCuestionario };
		var legajosFiltradosGeneral = [];
		var grupos = [];


		//configuracion de datos a informar
		$scope.informaConfiguracion = {
			'Basico': true,
			'Estudios': false,
			'Documentacion': false,
			'Inscripcion': false,
			'Cuestionario': false,
			'Trabajo': false
		};

		var ObtenerGrupos = function ObtenerGrupos() {
			var deferred = $q.defer();
			grupoSrv.getAll()
				.then(function (dataResponseOK) {
					deferred.resolve(dataResponseOK);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
					deferred.reject(responseError);
				});
			return deferred.promise;
		};


		var ObtenerIntereaccionesXEstudiante = function ObtenerIntereaccionesXEstudiante(EstudianteId) {
			var deferred = $q.defer();
			legajoSrv.getInteraccionesPorEstudiante(EstudianteId)
				.then(function (dataResponseOK) {
					deferred.resolve(dataResponseOK);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
					deferred.reject(responseError);
				});
			return deferred.promise;
		};



		legajoSrv.getAll()
			.then(function (responseOK) {
				var legOrdenados = $filter('orderBy')(responseOK, orderApellidoYNombre);  //ordena Por Apellido+Nombre para buscar duplicados
				$scope.legajos = legOrdenados;
				seleccionarPP(filtro);
				$scope.GetOK = true;
				if (legajoSrv.legajoAEditar !== null)
					$scope.cargarLegajo(legajoSrv.legajoAEditar);
				ObtenerGrupos()
					.then(function (responseOK) {
						grupos = responseOK;
					});
			})
			.catch(function () {
				$scope.GetOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			});


		$scope.informarDetalle = function informarDetalle() {
			$scope.cargando = !$scope.cargando;
		};

		$scope.setearScroll = function setearScroll() {
			$scope.divscr.scrollTop = legajoSrv.scrollRowEdit;
			return true;
		};

		var getIconoEstado = function getIconoEstado(item) {
			var icono = String.fromCharCode(9676); //circulo punteado (estado no especifico)
			if (item.division.estadoDivisionId === 'Terminado')
				icono = String.fromCharCode(9679); //circulo lleno
			else if (item.division.estadoDivisionId === 'Cursando')
				icono = String.fromCharCode(9680); //Circulo Medio lleno
			else if (item.division.estadoDivisionId === 'En Preparación')
				icono = String.fromCharCode(9675); //Circulo Vacio
			return icono;
		};


		$scope.getCursandoCurso = function getCursandoCurso(cdv, sep) {
			var curso = '';
			if (sep == null)
				sep = ',';
			var salir = false;
			cdv.some(function (item) { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
				if (item.division.estadoDivisionId === 'Cursando') {
					if (curso !== '')
						curso += sep;
					curso += UtilService.ordinales[item.anioLectivo - 1] + ' Año - ' + UtilService.ordinales[item.nmestreLectivo - 1] + ' Cuat' + sep + ' ' + item.modoId + sep + ' Div: ' + item.divisionId;
					curso += sep;
					if (item.turnoId !== 'Virtual')
						curso += item.turnoId;
					salir = true;
				}
				return salir; //El valor true 'break' la iteración de some.
			});
			if (curso == '')
				curso+=sep + sep + sep;
			return curso;
		};

		//&#9473;&#9673;&#9674;&#9675;&#9676;&#9677;&#9678;&#9679;&#9680;
		$scope.getCicloDeVida = function getClicloDeVida(cdv) {
			var ciclo = String.fromCharCode(9674);
			cdv.forEach(function (item) {
				ciclo += String.fromCharCode(9473) + String.fromCharCode(9473) + getIconoEstado(item);
			});
			return ciclo;
		};

		var orderCdeV = function orderCdeV(item) {
			var itemAComparar = (item.carreraId + 1) * 10000000000 + item.anioLectivo * 100000000 + item.nmestreLectivo * 1000000 + item.anioInicio * 100 + item.mesInicio;
			return itemAComparar;
		};


		var cargarInteracciones = function cargarInteracciones(estudianteId) {
			ObtenerIntereaccionesXEstudiante(estudianteId)
				.then(function (response) {
					$scope.interacciones = response;
					$scope.ahora = Math.floor(Date.now() / 1000);
				})
				.catch(function () {
					$scope.interacciones = [];
				});
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
			legajoSrv.getGruposPorEstudiante(legajo.alumnoId)
				.then(function (response) {
					$scope.cicloDeVida = $filter('orderBy')(response, orderCdeV);
				})
				.catch(function () {
					$scope.cicloDeVida = [];
				});
			cargarInteracciones(legajo.alumnoId);
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

		var filtrarIngresante = function filtroIngresante(item) {
			return (item.legajoNro >= legajoSrv.ingresanteMin);
		};

		var filtrarCuestionario = function filtrarCuestionario(item) {
			return (item.cuestionario==null);
		};
		
		//param f = Objeto del tipo {general: [stringFiltro], seguimiento:[boolSeguimiento], soloIngresantes:[boolSoloIngresantes]. cuestionaro : [SfiltroCuestionrios]}
		var seleccionarPP = function seleccionarPP(f) {
			let legajosFiltradoTemp = [];
			//Aplico filtro General
			if (f.general === '' || !f.general.startsWith(filtro.general))
				legajosFiltradosGeneral = $scope.legajos; //Al cambiar el filtro completo se comienza con todos los legajos.
			var leg = $filter('filter')(legajosFiltradosGeneral, UtilService.stringToLocale(f.general), customComparator);
			if (typeof leg != 'undefined' && leg.length > 0) {
				legajosFiltradoTemp = leg;
				legajosFiltradosGeneral = leg;
			} else
				legajosFiltradoTemp = [];
			//Aplico filtro Seguimiento
			if (f.seguimiento)
				legajosFiltradoTemp = $filter('filter')(legajosFiltradoTemp, { seguimiento: true, }); //filtrar por seguimiento
			//Aplico filtro Ingresantes
			if (f.soloIngresantes)
				legajosFiltradoTemp = $filter('filter')(legajosFiltradoTemp, filtrarIngresante); //filtrar por soloIngresantes
			//Aplico filtro Cuestionario
			if (f.cuestionario)
				legajosFiltradoTemp = $filter('filter')(legajosFiltradoTemp, filtrarCuestionario); //filtrar por soloCuestionario
			
			$scope.legajosFiltrados = legajosFiltradoTemp;

			//Si hay al menos un Legajo, lo cargo en la ficha.
			if ($scope.legajosFiltrados.length > 0)
				$scope.cargarLegajo($scope.legajosFiltrados[0]);
			filtro = f;
		};

		$scope.reseleccionar = function reseleccionar(filtroGeneral, filtroSeguimiento, soloIngresantes, filtrarCuestionario) {
			$scope.myStyle.cursor = 'wait'; //Cambia el cursor, pero... al finalizar la función.
			//La función es colocada sin paréntesis 
			//(de otra forma llama a la función esperando que retorne otra función ;))
			//Al usar $timeout (con el 3er parametro en true), ejecutamos la función principal 
			//luego de actualizar la 'vista' (en este ejemplo se actualiza el cursor)
			$timeout(seleccionarPP, 1000, true, { general: filtroGeneral, seguimiento: filtroSeguimiento, soloIngresantes: soloIngresantes, cuestionario: filtrarCuestionario })
				.then(function () {
					//Al finalizar $timeOut actualizamos nuevamente el cursor.
					$scope.myStyle.cursor = 'auto';
				});
		};

		$scope.editarLegajo = function editarLegajo(legajoAEditar) {
			legajoSrv.legajoAEditar = legajoAEditar;
			legajoSrv.selectedRowEdit = $scope.selectedRow;
			$location.path('/legajoEdicion');
		};

		var buscarDivision = function buscarDivision(legajoId, sep) {
			var grupoFiltrado = $filter('filter')(grupos, { alumnoId: legajoId, division: { estadoDivisionId: 'Cursando' } }, true);
			var division = $scope.getCursandoCurso(grupoFiltrado, sep);
			return division;
		};



		$scope.irABajarInteresado = function irABajarInteresado() {
			if (!$scope.procesandoCSV) {
				var sep = 'xSEPx';
				var ret = 'xRETx';
				var BOM = '\ufeff';
				var division = '';
				$scope.procesandoCSV = true;
				var obj = BOM + 'Legajo' + sep + 'Nombre' + sep + 'Apellido' + sep + 'E-Mail' + sep + 'Teléfono' + sep + 'Celular' + sep + 'DNI' + sep + 'Localidad' + sep + 'Cod. Postal' + sep + 'Edad' + sep + 'Sexo' + sep + 'Ocupación' + sep + 'Tít. Secundario' + sep + 'Cuestionario' + sep + 'DNI' + sep + 'Título' + sep + 'Foto' + sep + 'Apto Físico' + sep + 'Compromiso' + sep + 'Medio De Contacto' + sep + 'Estado' + sep + 'Motivo del Estado' + sep + 'Curso' + sep + 'Modo' + sep + 'División' + sep + 'Turno' + sep + 'Nacionalidad' + sep + 'Libro' + sep + 'Folio' ;
				obj += ret;
				$scope.legajosFiltrados.forEach(function (item) {
					obj = obj + UtilService.NullToBlanck(item.legajoNro) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.nombre) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.apellido) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.mail) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.telefono) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.celular) + sep;
					obj = obj + UtilService.NullToBlanck(item.dni) + sep;
					obj = obj + UtilService.NullToBlanck(item.localidadBase) + sep;
					obj = obj + UtilService.NullToBlanck(item.codigoPostalBase) + sep;
					obj = obj + $scope.obtenerEdad(item.fechaNacimiento) + sep;
					obj = obj + UtilService.NullToBlanck(item.sexo) + sep;
					if (item.trabajos.length > 0)
						obj = obj + item.trabajos[item.trabajos.length - 1].razonSocial + sep;
					else
						obj = obj + sep;
					if (item.estudios.length > 0)
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
					if (item.alumno.medioDeContacto !== null)
						obj = obj + UtilService.NullToBlanck(item.alumno.medioDeContacto.nombre) + sep;
					else
						obj = obj + UtilService.NullToBlanck(null) + sep;
					obj = obj + UtilService.NullToBlanck(item.estadoEstudianteId) + sep;
					obj = obj + UtilService.NullToBlanck(item.razonSuspension) + sep;
					division = buscarDivision(item.alumnoId, sep);
					obj = obj + UtilService.NullToBlanck(division) + sep;
					obj = obj + UtilService.NullToBlanck(item.alumno.nacionalidadId) + sep;
					obj = obj + UtilService.NullToBlanck(item.libroMatriz) + sep;
					obj = obj + UtilService.NullToBlanck(item.folio) + sep;
					obj = obj + ret;
				});

				obj = obj.replace(/\n/gi,'↵');
				obj = obj.replace(/;/g, ',');
				obj = obj.replace(/xSEPx/gi, ';');
				obj = obj.replace(/xRETx/gi, '\n');
				var data = 'text/csv;charset=utf-8,' + encodeURIComponent(obj);

				var a = document.getElementById('ancla');
				a.href = 'data:' + data;
				a.download = 'legajos.' + $filter('date')(new Date(), 'yyyyMMdd.HHmmss') + '.csv';
				$timeout(function() {a.click();}, 1);
				$timeout(function () { $scope.procesandoCSV = false; }, 2000);
			}
		};

		//INI-Interacción de un Estudiante.
		//Modal Interacción.
		$scope.interaccionEditando = null;
		//$scope.interaccionEditandoOriginal = null;
		$scope.modalInteraccionOpen = false;
		//$scope.showModalInteraccion = function showModalInteraccion(InteraccionAEditar) {
		$scope.showModalInteraccion = function showModalInteraccion(legajo) {
			//$scope.interesadoEventoEditandoOriginal = interesadoEventoAEditar;
			var fechaId = new Date();
			var InteraccionBase = {
				'alumnoId': legajo.alumnoId,
				'interaccionId': Math.floor(fechaId.getTime() / 1000),
				'fecha': fechaId.toJSON(), //$filter('date')(fechaId, 'yyyy-MM-ddTHH:mm:ss'),
				'comentario': null
			};
			$scope.interaccionEditando = InteraccionBase;
			$scope.modalInteraccionOpen = true;
		};

		$scope.closeModalInteraccion = function closeModalInteraccion() {
			$scope.modalInteraccionOpen = false;
		};
		//Fin Modal Interacción.

		$scope.agregarInteraccion = function agregarInteraccion(InteraccionAAgregar) {
			$scope.myStyle.cursor = 'wait';
			legajoSrv.agregarInteraccion(InteraccionAAgregar)
				.then(function () {
					$scope.interacciones.push(InteraccionAAgregar);
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'auto';
					$scope.modalInteraccionOpen = false;
				});
		};

		$scope.eliminarInteraccion = function eliminarInteraccion(interaccionAEliminar) {
			$scope.myStyle.cursor = 'wait';
			legajoSrv.eliminarInteraccion(interaccionAEliminar.alumnoId, interaccionAEliminar.interaccionId)
				.then(function () {
					cargarInteracciones(interaccionAEliminar.alumnoId);
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'auto';
					$scope.modalInteraccionOpen = false;
				});
		};


		//FIN-Interacción de un Estudiante.



	}
]);


