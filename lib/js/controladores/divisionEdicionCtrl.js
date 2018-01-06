'use strict';
var divisionMod = angular.module('divisionModulo');


divisionMod.controller('divisionEdicionControlador', ['$rootScope', '$scope', '$http', '$location', '$filter', '$q', 'UtilService', 'divisionSrv', 'carreraSrv', 'coordinadorSrv', 'coordinacionSrv', 'dispositivoSrv',
	function cargarDivisiones($rootScope, $scope, $http, $location, $filter, $q, UtilService, divisionSrv, carreraSrv, coordinadorSrv, coordinacionSrv, dispositivoSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.cargando = true;
		var accion_crear = 0;
		var accion_editar = 1;
		$scope.ordinales = UtilService.ordinales;
		$scope.meses = UtilService.meses;
		$scope.msjModal = null;
		$scope.carreras = [];
		$scope.cursoEditando = {};
		$scope.divisionEditando = {};
		$scope.coordSeleccionado = {}; //Array Asociativo
		$scope.coordOriginal = [];
		$scope.dispositivos = [];
		$scope.estadosDivision = [];
		$scope.estadoDivisionSeleccionado = null;
		$scope.divisionDestino = null;
		$scope.accionLabel = '???';
		$scope.esEdicion = function esEdicion() { return divisionSrv.accion === accion_editar; };
		var coordNulo = {
			'coordinadorId': -1,
			'nombre': 'Cordinador de Grupo Operativo',
			'fotoPath': 'img/Persona.png',
		};
		$scope.estadoDivisionMap = divisionSrv.estadoDivisionMap;


		if (divisionSrv.accion === null) {
			divisionSrv.accion = accion_crear;
		}

		$scope.modoLista = [{ id: 1, descripcion: 'Presencial' },
		{ id: 2, descripcion: 'A Distancia' }];
		$scope.setModo = function setModo(index) {
			if (!$scope.esEdicion()) {
				$scope.cursoEditando.modoId = $scope.modoLista[index].descripcion;
				$scope.dispositivosXCarrera = $scope.dispositivos.filter(filtroModo, $scope.cursoEditando.modoId);// Filtrar por Carrera
				if ($scope.cursoEditando.modoId === 'A Distancia')
					$scope.setTurno(2);
				else
					$scope.setTurno(3);
			}
		};

		$scope.turnoLista = [{ id: 1, descripcion: 'Mañana', mostrar: true },
		{ id: 2, descripcion: 'Noche', mostrar: true },
		{ id: 3, descripcion: 'Virtual', mostrar: false }];
		$scope.setTurno = function setTurno(index) {
			if (!$scope.esEdicion())
				if (index >= 0 && index < $scope.turnoLista.length)
					$scope.divisionEditando.turnoId = $scope.turnoLista[index].descripcion;
				else
					$scope.divisionEditando.turnoId = null;
		};

		$scope.divisionLista = [{ id: 1, descripcion: 'A' },
		{ id: 2, descripcion: 'B' },
		{ id: 3, descripcion: 'C' },
		{ id: 4, descripcion: 'D' },
		{ id: 5, descripcion: 'E' },
		{ id: 6, descripcion: 'F' },
		{ id: 7, descripcion: 'G' },
		{ id: 8, descripcion: 'H' },
		{ id: 9, descripcion: 'I' }];
		$scope.setDivision = function setDivision(index) {
			if (!$scope.esEdicion())
				$scope.divisionEditando.divisionId = $scope.divisionLista[index].descripcion;
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

		var ObtenerCoordinadores = function ObtenerCoordinadores() {
			var deferred = $q.defer();
			coordinadorSrv.getAll()
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

		var ObtenerDispositivo = function ObtenerDispositivo() {
			var deferred = $q.defer();
			dispositivoSrv.getAll()
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


		var filtroDivision = function filtroDivision(item) {
			var divisionSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
		};

		var filtroModo = function filtroModo(item) {
			var itemAAnalizar = this;  // this es el valor a comparar enviado via el filtro
			return (item != undefined && itemAAnalizar != undefined && itemAAnalizar === item.modoId);
		};

		var cargarFormulario = function cargarFormulario() {
			if (divisionSrv.accion === null || divisionSrv.accion === accion_crear) {
				$scope.cursoEditando.carreraId = 0;
				$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
				$scope.cursoEditando.modoId = 'Presencial';
				$scope.cursoEditando.anioInicio = null;
				$scope.cursoEditando.mesInicio = null;
				$scope.cursoEditando.mesFinal = null;
				$scope.cursoEditando.anioLectivo = null;
				$scope.cursoEditando.nmestreLectivo = null;
				$scope.cursoEditando.comentario = null;
				$scope.estadoDivisionSeleccionado = $scope.estadosDivision[1];
				$scope.divisionEditando.turnoId = null;
				$scope.divisionEditando.divisionId = 'A';
				$scope.divisionEditando.comentario = null;
				$scope.accionLabel = 'Crear';
			} else if (divisionSrv.accion === accion_editar) {
				$scope.cursoEditando = angular.copy(divisionSrv.divisionAEditar.curso);
				$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
				$scope.divisionEditando = angular.copy(divisionSrv.divisionAEditar);
				$scope.estadosDivision.forEach(function (estadoDivision) {
					if (estadoDivision.estadoDivisionId === $scope.divisionEditando.estadoDivisionId) {
						$scope.estadoDivisionSeleccionado = estadoDivision;
					}
				}, this);
				$scope.coordinacionEditando = $scope.coordinaciones.filter(filtroDivision, $scope.divisionEditando);
				$scope.coordinacionEditando.forEach(function (coordinacion) {
					$scope.coordSeleccionado[coordinacion.dispositivoId] = coordinacion.coordinador;
					$scope.coordOriginal.push(coordinacion);
				}, this);
				delete $scope.cursoEditando.carrera;
				delete $scope.divisionEditando.curso;
				$scope.accionLabel = 'Actualizar';
			}
			$scope.dispositivosXCarrera = $scope.dispositivos.filter(filtroModo, $scope.cursoEditando.modoId);
		};


		var cargarPagina = function cargarPagina() {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			function finalizarCarga() {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			}
			ObtenerCarreras()
				.then(function (dataResponseOK) {
					$scope.carreras = dataResponseOK;
					$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
					ObtenerCoordinadores()
						.then(function (dataResponseOK) {
							$scope.coordinadores = dataResponseOK;
							ObtenerCoordinaciones()
								.then(function (dataResponseOK) {
									$scope.coordinaciones = dataResponseOK;
									ObtenerEstadosDivision()
										.then(function (dataResponseOK) {
											$scope.estadosDivision = dataResponseOK;
											ObtenerDispositivo()
												.then(function (dataResponseOK) {
													$scope.dispositivos = dataResponseOK;
													$scope.dispositivos.forEach(function (dispositivo) {
														$scope.coordSeleccionado[dispositivo.dispositivoId] = coordNulo;
													}, this);
													cargarFormulario();
													finalizarCarga();
												}, finalizarCarga);
										}, finalizarCarga);
								}, finalizarCarga);
						}, finalizarCarga);
				}, finalizarCarga);
		};
		cargarPagina();

		$scope.cancelarEdicion = function cancelarEdicion() {
			$location.path('/divisionLista');
		};

		$scope.eliminarCoordinacion = function eliminarCoordinacion(dispositivoId) {
			$scope.coordSeleccionado[dispositivoId] = coordNulo;
		};


		//Drag & drop
		$scope.dragover = function dragover(ev) {
			return false;
		};

		$scope.dragstart = function dragstart(ev) {
			ev.originalEvent.dataTransfer.setData('text/plain', ev.target.id);
		};

		$scope.drop = function drop(ev) {
			ev.originalEvent.preventDefault(); //previene que el evento se propage
			var data = ev.originalEvent.dataTransfer.getData('text/plain');

			var nodeCopy = document.getElementById(data).cloneNode(true); //Copiar el elemento
			var nodoPadre = ev.originalEvent.target.parentNode;
			nodeCopy.id = nodeCopy.id + nodoPadre.id; // Cambiar el ID para que sea unico 
			nodeCopy.title = nodoPadre.id + ': ' + nodeCopy.title;
			var jQueryOldElement = angular.element(nodoPadre.childNodes[1]); // Obtener el elemento a cambiar 
			jQueryOldElement.off('dragstart'); // Eliminar el listener 
			jQueryOldElement.off('drop'); // Eliminar el listener 
			jQueryOldElement.off('dragover'); // Eliminar el listener 
			nodoPadre.replaceChild(nodeCopy, nodoPadre.childNodes[1]); // Reemplazar el elemento original por el nuevo
			var jQueryNewElement = angular.element(nodeCopy); // Convertir en un elemneto de tipo JQuery
			jQueryNewElement.on('dragstart', $scope.dragstart); //Agregar el listener
			jQueryNewElement.on('drop', $scope.drop); //Agregar el listener
			jQueryNewElement.on('dragover', $scope.dragover); //Agregar el listener

			var filtro = { coordinadorId: parseInt(nodeCopy.attributes['coordindex'].value) };
			var coordinadorSeleccionado = $filter('filter')($scope.coordinadores, filtro)[0];
			$scope.coordSeleccionado[nodoPadre.id] = coordinadorSeleccionado;
		};

		//ModalBase
		$scope.modalBaseOpen = false;
		$scope.showModalBase = function showModalBase(mensaje) {
			$scope.msjModalBase = mensaje;
			$scope.modalBaseOpen = true;
		};

		$scope.closeModalBase = function closeModalBase() {
			$location.path('/divisionLista');
		};


		//ModalPomover
		$scope.modalPromoverOpen = false;
		$scope.showModalPromover = function showModalPromover(division) {
			//Mostrar Lista
			$scope.modalPromoverOpen = true;
		};

		$scope.closeModalPromover = function closeModalPromover() {
			$scope.modalPromoverOpen = false;
		};


		//Grabar
		var heredarCurso = function heredarCurso(cursoPadre, cursoHijo) {
			cursoHijo.carreraId = cursoPadre.carreraId;
			cursoHijo.modoId = cursoPadre.modoId;
			cursoHijo.anioInicio = cursoPadre.anioInicio;
			cursoHijo.mesInicio = cursoPadre.mesInicio;
			cursoHijo.anioLectivo = cursoPadre.anioLectivo;
			cursoHijo.nmestreLectivo = cursoPadre.nmestreLectivo;
		};

		var heredarDivision = function heredarDivision(divisionPadre, divisionHijo) {
			heredarCurso(divisionPadre, divisionHijo);
			divisionHijo.turnoId = divisionPadre.turnoId;
			divisionHijo.divisionId = divisionPadre.divisionId;
		};

		var completarDivision = function completarDivision(curso, division) {
			heredarCurso(curso, division);
			division.estadoDivisionId = $scope.estadoDivisionSeleccionado.estadoDivisionId;
			division.curso = curso;
		};

		var completarCoordinacion = function completarDivision(division, coordinador, dispositivoId) {
			var coordinacion = {};
			heredarDivision(division, coordinacion);
			coordinacion.coordinadorId = coordinador.coordinadorId;
			//coordinacion.division = division;
			//coordinacion.coordinador = coordinador;
			coordinacion.dispositivoId = dispositivoId;
			return coordinacion;
		};

		var mensajeSatisfactorio = function mensajeSatisfactorio() {
			if (divisionSrv.accion === accion_crear)
				$scope.showModalBase('Creado satisfactoriamente.');
			else
				$scope.showModalBase('Actualizado satisfactoriamente.');
		};

		var grabarCoordinacion = function grabarCoordinacion(coordinacion) {
			coordinacionSrv.crear(coordinacion)
				.then(function () {
					mensajeSatisfactorio();
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
				});
		};

		var borrarCoordinacion = function borrarCoordinacion(coordinacion) {
			var deferred = $q.defer();
			coordinacionSrv.eliminar(coordinacion.carreraId, coordinacion.modoId, coordinacion.anioInicio, coordinacion.mesInicio, coordinacion.anioLectivo, coordinacion.nmestreLectivo, coordinacion.turnoId, coordinacion.divisionId, coordinacion.coordinadorId)
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


		var grabarCoordinaciones = function grabarCoordinaciones(coordinaciones) {
			if (coordinaciones.length > 0)
				coordinacionSrv.crear(coordinaciones[0])
					.then(function () {
						if (coordinaciones.length === 2)
							grabarCoordinacion(coordinaciones[1]);
						else
							mensajeSatisfactorio();
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			else
				mensajeSatisfactorio();
		};

		$scope.grabar = function grabar(fichaCurso, fichaDivision) {
			$scope.error = { hayError: false, errores: {} };
			fichaCurso.carreraId = $scope.carrera.carreraId;
			completarDivision(fichaCurso, fichaDivision);
			var coordinaciones = [];
			$scope.dispositivosXCarrera.forEach(function (dispositivo) {
				if ($scope.coordSeleccionado[dispositivo.dispositivoId].coordinadorId != -1)
					coordinaciones.push(completarCoordinacion(fichaDivision, $scope.coordSeleccionado[dispositivo.dispositivoId], dispositivo.dispositivoId));
			}, this);

			if (divisionSrv.accion === accion_crear) {
				divisionSrv.crear(fichaDivision)
					.then(function () {
						if (coordinaciones.length > 0)
							grabarCoordinaciones(coordinaciones);
						else
							mensajeSatisfactorio();
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			} else {
				divisionSrv.actualizar(fichaDivision)
					.then(function () {
						if ($scope.coordOriginal.length > 0)
							borrarCoordinacion($scope.coordOriginal[0])
								.then(function () {
									if ($scope.coordOriginal.length > 1)
										borrarCoordinacion($scope.coordOriginal[1])
											.then(function () {
												grabarCoordinaciones(coordinaciones);
											});
									else
										grabarCoordinaciones(coordinaciones);
								});
						else if (coordinaciones.length > 0)
							grabarCoordinaciones(coordinaciones);
						else
							mensajeSatisfactorio();
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			}
		};


		$scope.iniciar = function iniciar(fichaCurso, fichaDivision) {
			$scope.estadoDivisionSeleccionado.estadoDivisionId = divisionSrv.estadoDivisionMap.Cursando;
			$scope.grabar(fichaCurso, fichaDivision);
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

		$scope.filtroDivision = function (divisionSeleccionado) {
			return function (item) {
				return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === $scope.carrera.carreraId && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
			};
		};

		$scope.selectedRow = null;
		$scope.setClickedRow = function setClickedRow(index) {
			if ($scope.selectedRow === index)
				$scope.selectedRow = null;
			else
				$scope.selectedRow = index;
		};


		$scope.seleccionarDivision = function seleccionarDivision() {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			function finalizarCarga() {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			}
			ObtenerDivisiones()
				.then(function (dataResponseOK) {
					$scope.DivisionesDestinoPromocion = $filter('filter')(dataResponseOK, { estadoDivisionId: $scope.estadoDivisionMap.EnPreparacion });
					finalizarCarga();
					$scope.showModalPromover('');
				});
		};

		var promoverPP = function promoverPP(divisionOrigen, divisionDestino) {
			var deferred = $q.defer();
			divisionSrv.promover(divisionOrigen, divisionDestino)
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

		$scope.cargarDivisionDestino = function cargarDivisionDestino(division) {
			$scope.divisionDestino = division;
		};

		$scope.promover = function promover(divisionOrigen, divisionDestino) {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			function finalizarCarga() {
				$scope.closeModalPromover();
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			}
			promoverPP(divisionOrigen, divisionDestino)
				.then(function () {
					finalizarCarga();
					$scope.showModalBase('Promoción realizada satisfactoriamente.');
				}, finalizarCarga);
		};
	}
]);


