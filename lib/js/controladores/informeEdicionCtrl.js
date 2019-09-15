'use strict';
var informeMod = angular.module('informeModulo');


informeMod.controller('informeEdicionControlador', ['$rootScope', '$scope', '$http', '$location', '$filter', '$q', 'UtilService', 'informeSrv', 'carreraSrv', 'coordinadorSrv', 'coordinacionSrv', 'dispositivoSrv',
	function cargarInformes($rootScope, $scope, $http, $location, $filter, $q, UtilService, informeSrv, carreraSrv, coordinadorSrv, coordinacionSrv, dispositivoSrv) {
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
		$scope.informeEditando = {};
		$scope.coordSeleccionado = {}; //Array Asociativo
		$scope.coordOriginal = [];
		$scope.dispositivos = [];
		$scope.estadosInforme = [];
		$scope.estadoInformeSeleccionado = null;
		$scope.informeDestino = null;
		$scope.accionLabel = '???';
		$scope.esEdicion = function esEdicion() { return informeSrv.accion === accion_editar; };
		var coordNulo = {
			'coordinadorId': -1,
			'nombre': 'Cordinador de Grupo Operativo',
			'fotoPath': 'img/Persona.png',
		};
		$scope.estadoInformeMap = informeSrv.estadoInformeMap;


		if (informeSrv.accion === null) {
			informeSrv.accion = accion_crear;
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
					$scope.informeEditando.turnoId = $scope.turnoLista[index].descripcion;
				else
					$scope.informeEditando.turnoId = null;
		};

		$scope.informeLista = [{ id: 1, descripcion: 'A' },
		{ id: 2, descripcion: 'B' },
		{ id: 3, descripcion: 'C' },
		{ id: 4, descripcion: 'D' },
		{ id: 5, descripcion: 'E' },
		{ id: 6, descripcion: 'F' },
		{ id: 7, descripcion: 'G' },
		{ id: 8, descripcion: 'H' },
		{ id: 9, descripcion: 'I' }];
		$scope.setInforme = function setInforme(index) {
			if (!$scope.esEdicion())
				$scope.informeEditando.informeId = $scope.informeLista[index].descripcion;
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

		var ObtenerEstadosInforme = function ObtenerEstadosInforme() {
			var deferred = $q.defer();
			informeSrv.getEstadosInforme()
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


		var filtroInforme = function filtroInforme(item) {
			var informeSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return (item != undefined && informeSeleccionado != undefined && informeSeleccionado.carreraId === item.carreraId && informeSeleccionado.modoId === item.modoId && informeSeleccionado.anioInicio === item.anioInicio && informeSeleccionado.mesInicio === item.mesInicio && informeSeleccionado.anioLectivo === item.anioLectivo && informeSeleccionado.nmestreLectivo === item.nmestreLectivo && informeSeleccionado.turnoId === item.turnoId && informeSeleccionado.informeId === item.informeId);
		};

		var filtroModo = function filtroModo(item) {
			var itemAAnalizar = this;  // this es el valor a comparar enviado via el filtro
			return (item != undefined && itemAAnalizar != undefined && itemAAnalizar === item.modoId);
		};

		var cargarFormulario = function cargarFormulario() {
			if (informeSrv.accion === null || informeSrv.accion === accion_crear) {
				$scope.cursoEditando.carreraId = 0;
				$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
				$scope.cursoEditando.modoId = 'Presencial';
				$scope.cursoEditando.anioInicio = null;
				$scope.cursoEditando.mesInicio = null;
				$scope.cursoEditando.mesFinal = null;
				$scope.cursoEditando.anioLectivo = null;
				$scope.cursoEditando.nmestreLectivo = null;
				$scope.cursoEditando.comentario = null;
				$scope.estadoInformeSeleccionado = $scope.estadosInforme[1];
				$scope.informeEditando.turnoId = null;
				$scope.informeEditando.informeId = 'A';
				$scope.informeEditando.comentario = null;
				$scope.accionLabel = 'Crear';
			} else if (informeSrv.accion === accion_editar) {
				$scope.cursoEditando = angular.copy(informeSrv.informeAEditar.curso);
				$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
				$scope.informeEditando = angular.copy(informeSrv.informeAEditar);
				$scope.estadosInforme.forEach(function (estadoInforme) {
					if (estadoInforme.estadoInformeId === $scope.informeEditando.estadoInformeId) {
						$scope.estadoInformeSeleccionado = estadoInforme;
					}
				}, this);
				$scope.coordinacionEditando = $scope.coordinaciones.filter(filtroInforme, $scope.informeEditando);
				$scope.coordinacionEditando.forEach(function (coordinacion) {
					$scope.coordSeleccionado[coordinacion.dispositivoId] = coordinacion.coordinador;
					$scope.coordOriginal.push(coordinacion);
				}, this);
				delete $scope.cursoEditando.carrera;
				delete $scope.informeEditando.curso;
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
							$scope.coordinadores = $filter('filter')(dataResponseOK,{comentarios:'!Desactivo'});
							ObtenerCoordinaciones()
								.then(function (dataResponseOK) {
									$scope.coordinaciones = dataResponseOK;
									ObtenerEstadosInforme()
										.then(function (dataResponseOK) {
											$scope.estadosInforme = dataResponseOK;
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
			$location.path('/informeLista');
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
			$location.path('/informeLista');
		};


		//ModalPomover
		$scope.modalPromoverOpen = false;
		$scope.showModalPromover = function showModalPromover(informe) {
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

		var heredarInforme = function heredarInforme(informePadre, informeHijo) {
			heredarCurso(informePadre, informeHijo);
			informeHijo.turnoId = informePadre.turnoId;
			informeHijo.informeId = informePadre.informeId;
		};

		var completarInforme = function completarInforme(curso, informe) {
			heredarCurso(curso, informe);
			informe.estadoInformeId = $scope.estadoInformeSeleccionado.estadoInformeId;
			informe.curso = curso;
		};

		var completarCoordinacion = function completarInforme(informe, coordinador, dispositivoId) {
			var coordinacion = {};
			heredarInforme(informe, coordinacion);
			coordinacion.coordinadorId = coordinador.coordinadorId;
			//coordinacion.informe = informe;
			//coordinacion.coordinador = coordinador;
			coordinacion.dispositivoId = dispositivoId;
			return coordinacion;
		};

		var mensajeSatisfactorio = function mensajeSatisfactorio() {
			if (informeSrv.accion === accion_crear)
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
			coordinacionSrv.eliminar(coordinacion.carreraId, coordinacion.modoId, coordinacion.anioInicio, coordinacion.mesInicio, coordinacion.anioLectivo, coordinacion.nmestreLectivo, coordinacion.turnoId, coordinacion.informeId, coordinacion.coordinadorId)
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

		$scope.grabar = function grabar(fichaCurso, fichaInforme) {
			$scope.error = { hayError: false, errores: {} };
			fichaCurso.carreraId = $scope.carrera.carreraId;
			completarInforme(fichaCurso, fichaInforme);
			var coordinaciones = [];
			$scope.dispositivosXCarrera.forEach(function (dispositivo) {
				if ($scope.coordSeleccionado[dispositivo.dispositivoId].coordinadorId != -1)
					coordinaciones.push(completarCoordinacion(fichaInforme, $scope.coordSeleccionado[dispositivo.dispositivoId], dispositivo.dispositivoId));
			}, this);

			if (informeSrv.accion === accion_crear) {
				informeSrv.crear(fichaInforme)
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
				informeSrv.actualizar(fichaInforme)
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


		$scope.iniciar = function iniciar(fichaCurso, fichaInforme) {
			$scope.estadoInformeSeleccionado.estadoInformeId = informeSrv.estadoInformeMap.Cursando;
			$scope.grabar(fichaCurso, fichaInforme);
		};



		var ObtenerInformes = function ObtenerInformes() {
			var deferred = $q.defer();
			informeSrv.getAll()
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

		$scope.filtroInforme = function (informeSeleccionado) {
			return function (item) {
				return (item != undefined && informeSeleccionado != undefined && informeSeleccionado.carreraId === $scope.carrera.carreraId && informeSeleccionado.carreraId === item.carreraId && informeSeleccionado.modoId === item.modoId && informeSeleccionado.anioInicio === item.anioInicio && informeSeleccionado.mesInicio === item.mesInicio && informeSeleccionado.anioLectivo === item.anioLectivo && informeSeleccionado.nmestreLectivo === item.nmestreLectivo && informeSeleccionado.turnoId === item.turnoId && informeSeleccionado.informeId === item.informeId);
			};
		};

		$scope.selectedRow = null;
		$scope.setClickedRow = function setClickedRow(index) {
			if ($scope.selectedRow === index)
				$scope.selectedRow = null;
			else
				$scope.selectedRow = index;
		};


		$scope.seleccionarInforme = function seleccionarInforme() {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			function finalizarCarga() {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			}
			ObtenerInformes()
				.then(function (dataResponseOK) {
					$scope.InformesDestinoPromocion = $filter('filter')(dataResponseOK, { estadoInformeId: $scope.estadoInformeMap.EnPreparacion });
					finalizarCarga();
					$scope.showModalPromover('');
				});
		};

		var promoverPP = function promoverPP(informeOrigen, informeDestino) {
			var deferred = $q.defer();
			informeSrv.promover(informeOrigen, informeDestino)
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

		$scope.cargarInformeDestino = function cargarInformeDestino(informe) {
			$scope.informeDestino = informe;
		};

		$scope.promover = function promover(informeOrigen, informeDestino) {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			function finalizarCarga() {
				$scope.closeModalPromover();
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			}
			promoverPP(informeOrigen, informeDestino)
				.then(function () {
					finalizarCarga();
					$scope.showModalBase('Promoción realizada satisfactoriamente.');
				}, finalizarCarga);
		};


		var egresarPP = function promoverPP(informe) {
			var deferred = $q.defer();
			informeSrv.egresar(informe)
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

		$scope.egresar = function egresar(informe) {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			function finalizarCarga() {
				$scope.closeModalPromover();
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			}
			egresarPP(informe)
				.then(function () {
					finalizarCarga();
					$scope.showModalBase('Promoción egresada satisfactoriamente.');
				}, finalizarCarga);
		};


	}
]);


