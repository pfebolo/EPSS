'use strict';
var divisionMod = angular.module('divisionModulo');


divisionMod.controller('preAsignacionDivisionControlador',['$rootScope', '$scope', '$http', '$q', '$filter', 'UtilService', 'carreraSrv', 'coordinacionSrv', 'grupoSrv', 'divisionSrv',
	function CargarPreAsignacionDivision($rootScope, $scope, $http, $q, $filter, UtilService, carreraSrv, coordinacionSrv, grupoSrv, divisionSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.cargando = true;
		$scope.meses = UtilService.meses;
		$scope.ordinales = UtilService.ordinales;
		$scope.divisionSeleccionado = null;
		$scope.carreraSeleccionada = null;
		$scope.modos = [];
		$scope.modoSeleccionado = null;
		$scope.turnos = [];

		$scope.anioLectivoSeleccionado = 1;
		$scope.nmestres = [{ nmestreId: 1, descripcion: '1er Cuatrimestre' },
			{ nmestreId: 2, descripcion: '2do Cuatrimestre' }];
		$scope.nmestreLectivoSeleccionado = $scope.nmestres[0];
		$scope.estadosDivision = [];
		const EN_PREPARACION=1;
		$scope.estadoDivisionSeleccionado = null;
		$scope.estadoDivisionMap = divisionSrv.estadoDivisionMap;
		$scope.turnoSeleccionado = null;


		var ObtenerModos = function ObtenerModos() {
			var deferred = $q.defer();
			divisionSrv.getModos()
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

		var ObtenerEstadosDivision = function ObtenerEstadosDivision() {
			var deferred = $q.defer();
			divisionSrv.getEstadosDivision()
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

		var ObtenerTurnos = function ObtenerTurnos() {
			var deferred = $q.defer();
			divisionSrv.getTurnos()
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

		var ObtenerCarreras = function ObtenerCarreras() {
			var deferred = $q.defer();
			carreraSrv.getAll()
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

		var ObtenerDivisiones = function ObtenerDivisiones() {
			var deferred = $q.defer();
			divisionSrv.getAll()
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

		var ObtenerCoordinaciones = function ObtenerCoordinaciones() {
			var deferred = $q.defer();
			coordinacionSrv.getAll()
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



		var CargarPagina = function CargarPagina() {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			var finalizarCarga = function finalizarCarga() {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			};
			ObtenerCarreras()
				.then(function (dataResponseOK) {
					$scope.carreras = dataResponseOK;
					
					ObtenerModos()
						.then(function (dataResponseOK) {
							$scope.modos = dataResponseOK;
							ObtenerEstadosDivision()
								.then(function (dataResponseOK) {
									$scope.estadosDivision = dataResponseOK;
									ObtenerDivisiones()
										.then(function (dataResponseOK) {
											$scope.divisiones = dataResponseOK;
											ObtenerCoordinaciones()
												.then(function (dataResponseOK) {
													$scope.coordinaciones = dataResponseOK;
													ObtenerTurnos()
														.then(function (dataResponseOK) {
															$scope.turnos = dataResponseOK;
															ObtenerGrupos()
															.then(function (dataResponseOK) {
																$scope.grupos = dataResponseOK;
																$scope.estadoDivisionSeleccionado = $scope.estadosDivision[EN_PREPARACION];
																$scope.modoSeleccionado = $scope.modos[0];
																$scope.turnoSeleccionado = $scope.turnos[0];
																$scope.carreraSeleccionada = $scope.carreras[0];
																finalizarCarga();
															},finalizarCarga());
														},finalizarCarga);
												},finalizarCarga);
										},finalizarCarga);
								},finalizarCarga);
						},finalizarCarga);
				},finalizarCarga);
		};
		CargarPagina();




		$scope.cargarGrupo = function cargarGrupo(division) {
			$scope.divisionSeleccionado = division;
		};

		$scope.selectedRow = null;
		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};


		$scope.itemPerteneceAlDivision = function filtrarDivision(item, divisionSeleccionado) {
			return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
		};

		$scope.filtroAlumno = function filtroAlumno(alumno) {
			var divisionSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return $scope.itemPerteneceAlDivision(alumno, divisionSeleccionado);
		};

		$scope.filtroCoordinador = function filtroCoordinador(coordinador) {
			var divisionSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return $scope.itemPerteneceAlDivision(coordinador, divisionSeleccionado);
		};

		$scope.filtroDivision = function (divisionSeleccionado) {
			return function (item) {
				return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === $scope.carreraSeleccionada.carreraId && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
			};
		};

		$scope.filtroGrupos = function (carrera,modo,estado,turno,anioLectivo,nmestreLectivo) {
			return function (item) {
				return (item != undefined && carrera != null && carrera.carreraId === item.carreraId && estado.estadoDivisionId === item.division.estadoDivisionId && modo.modoId === item.modoId && turno.turnoId === item.turnoId  && anioLectivo === item.anioLectivo && nmestreLectivo === item.nmestreLectivo);
			};
		};

		$scope.filtroDivisiones = function (carrera,modo,estado,turno,anioLectivo,nmestreLectivo) {
			return function (item) {
				return (item != undefined && carrera != null && carrera.carreraId === item.carreraId && estado.estadoDivisionId === item.estadoDivisionId && modo.modoId === item.modoId && turno.turnoId === item.turnoId  && anioLectivo === item.anioLectivo && nmestreLectivo === item.nmestreLectivo);
			};
		};

		$scope.obtenerCantidadAlumnos = function obtenerCantidadAlumnos(division) {
			if ($scope.grupos !== undefined) {
				var x = $scope.grupos.filter($scope.filtroAlumno, division);
				return x.length;
			} else {
				return 0;
			}
		};

		var filtroMujeres = function filtroMujeres(item) {
			return (item != undefined && item.legajo.sexo==='Femenino ');
		};

		$scope.obtenerCantidadMujeres = function obtenerCantidadMujeres(division) {
			if ($scope.grupos !== undefined) {
				var x = $scope.grupos.filter($scope.filtroAlumno, division);
				x = $filter('filter')(x, filtroMujeres);
				return x.length;
			} else {
				return 0;
			}
		};

		var filtroHombres = function filtroHombres(item) {
			return (item != undefined && item.legajo.sexo==='Masculino');
		};

		$scope.obtenerCantidadHombres = function obtenerCantidadHombres(division) {
			if ($scope.grupos !== undefined) {
				var x = $scope.grupos.filter($scope.filtroAlumno, division);
				x = $filter('filter')(x, filtroHombres);
				return x.length;
			} else {
				return 0;
			}
		};



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

		var obtenerRangoEtario = function obtenerRangoEtario(fechaNacimiento) {
			var edad = obtenerEdad(fechaNacimiento);
			var rangoEtario = edad.toString().substr(0,1);
			return rangoEtario;
		};

		var orderSexoYEdad = function orderSexo(item) {
			return item.legajo.sexo + item.legajo.fechaNacimiento; //dato a comparar
		};

		$scope.obtenerAlumnosXDivision = function obtenerAlumnosXDivision(division) {
			if ($scope.grupos !== undefined) {
				var grupoDivBase = $scope.grupos.filter($scope.filtroAlumno, division);
				var grupoDiv  = $filter('orderBy')(grupoDivBase, orderSexoYEdad);
				return grupoDiv;
			} else {
				return [];
			}
		};

		$scope.colorear = function colorear(estudiante) {
			var clase =null;
			var profesional=false;
			if (estudiante.legajo.estudios.length>1) {
				estudiante.legajo.estudios.forEach(function(element){
					profesional = profesional || element.terminado;
				});
			}
			if (estudiante.legajo.sexo==='Masculino')
				clase = 'fa-male';
			else
				clase = 'fa-female';
			clase += ' rangoEtario-' + obtenerRangoEtario(estudiante.legajo.fechaNacimiento);
			if (profesional) 
				clase += ' subrrayado delineado';


			return clase;
		};
		
		$scope.popoverContent = function popoverContent(estudiante) {
			var contenido = null;
			var profesional=null;
			if (estudiante.legajo.estudios.length>1) {
				estudiante.legajo.estudios.forEach(function(element){
					profesional = element.titulo;
					if (element.terminado) 
						profesional = element.titulo + ' (completo)';
					else
						profesional = element.titulo + ' (incompleto)';
				});
			}
			contenido = 'Legajo:' + estudiante.legajo.legajoNro + '<br>';
			contenido += 'Edad:' + obtenerEdad(estudiante.legajo.fechaNacimiento) + '<br>';
			if (profesional!==null)
				contenido += profesional;
			return contenido;
		};

		$scope.obtenerCantidadCoordinadores = function obtenerCantidadCoordinadores(division) {
			if ($scope.coordinaciones !== undefined) {
				var x = $scope.coordinaciones.filter($scope.filtroCoordinador, division);
				return x.length;
			} else {
				return 0;
			}
		};

		$scope.orderApellidoYNombre = function orderApellidoYNombre(item) {
			item.apellidoYNombre = UtilService.stringToLocale(item.legajo.alumno.apellido.trim() + ', ' + item.legajo.alumno.nombre.trim());
			return item.apellidoYNombre; //dato a comparar
		};

		$scope.irACrearDivision = function irACrearDivision() {
			divisionSrv.exponerCreacion();
		};

		$scope.irAEditarDivision = function irACrearDivision(division) {
			divisionSrv.exponerEdicion(division);
		};

		$scope.irAEditarGrupo = function irAEditarGrupo() {
			grupoSrv.exponerEdicion($scope.divisionSeleccionado);
		};

		$scope.irAActaVolanteGrupo = function irAActaVolanteGrupo() {
			grupoSrv.exponerActaVolante($scope.divisionSeleccionado);
		};

		$scope.irARegAsistenciaGrupo = function irARegAsistenciaGrupo() {
			grupoSrv.exponerRegAsistencia($scope.divisionSeleccionado);
		};


		$scope.irAEliminarDivision = function irAEliminarDivision(division) {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			$scope.error = { hayError: false, errores: {} };
			var finalizarCarga = function finalizarCarga(data, sinError = false) {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
				if (sinError)
					$scope.showModal('Eliminado Satisfactoriamente');
			};
			divisionSrv.eliminar(division.carreraId, division.modoId, division.anioInicio, division.mesInicio, division.anioLectivo, division.nmestreLectivo, division.turnoId, division.divisionId)
				.then(function () {
					ObtenerDivisiones()
						.then(function (dataResponseOK) {
							$scope.divisiones = dataResponseOK;
							finalizarCarga(null,true);
						},finalizarCarga);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes); // newArray = [1, 2]
					$scope.error.hayError = true;
					finalizarCarga();
				});
		};

		//Modal
		$scope.modalOpen = false;
		$scope.showModal = function showModal(mensaje) {
			$scope.msjModal = mensaje;
			$scope.modalOpen = true;
		};

		$scope.closeModal = function closeModal() {
			$scope.modalOpen = false;
		};

	}
]);
