'use strict';
var informeMod = angular.module('informeModulo');

informeMod.controller('informeEdicionControlador', ['$scope', '$location', '$filter', '$q', '$timeout', 'legajoSrv', 'coordinadorSrv', 'informeSrv',
	function cargarInformes($scope, $location, $filter, $q,$timeout, legajoSrv, coordinadorSrv, informeSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.cargando = true;
		$scope.msjModal = null;
		$scope.coordOriginal = [];
		$scope.estadosInforme = [];
		$scope.estadoInformeSeleccionado = null;
		$scope.informeDestino = null;
		$scope.esEdicion = function esEdicion() { return informeSrv.accion === informeSrv.acciones.editar; };
		var legajoNulo = {
			'alumno': {
				'alumnoId' : null,
				'nombre': '',
				'apellido': '',
				'apellidoYNombre': ''
			},
		};
		$scope.legajoSeleccionado =legajoNulo;
		var coordNulo = {
			'coordinadorId': -1,
			'nombre': null,
			'fotoPath': 'img/Persona.png',
		};
		$scope.coordSeleccionado = coordNulo;
		var informeNulo = {
			'alumnoId': null,
			'informeId': null,
			'anioLectivo': null,
			'coordinadorId': null,
			'informe': '',
			'fechaCreacion': null,
			'fechaActualizacion': null
		};
		$scope.informeEditando = informeNulo;
		$scope.estadoInformeMap = informeSrv.estadoInformeMap;
		$scope.legajoNro = null;
		$scope.informes = {
			'inf': '',
			'id': '',
			'apellidoYNombre': ''
		};
		$scope.grabarYSeguir = true;

		if (informeSrv.accion === null) {
			informeSrv.accion = informeSrv.acciones.crear;
		}

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

		$scope.obtenerInforme = function obtenerinforme(alumnoId,coordinadorId,anioLectivo) {
			if (alumnoId != null && coordinadorId !=null && anioLectivo!=null) {
				informeSrv.getInforme(alumnoId,coordinadorId,anioLectivo)
					.then(function (dataResponseOK) {
						$scope.informeEditando.informeId = dataResponseOK.informeId;
						$scope.informeEditando.informe = dataResponseOK.informe;
						$scope.informeEditando.fechaCreacion = dataResponseOK.fechaCreacion;
						informeSrv.accion = informeSrv.acciones.editar;
					})
					.catch(function () {
						$scope.informeEditando.informeId = null;
						$scope.informeEditando.informe = '';
						informeSrv.accion = informeSrv.acciones.crear;
					});
			}
			else {
				$scope.informeEditando.informe = '';
				informeSrv.accion = informeSrv.acciones.crear;
			}
		};

		$scope.obtenerLegajo = function obtenerLegajo(legajoNro) {
			if (legajoNro != null) {
				legajoSrv.getLegajoXLegajoNro(legajoNro)
					.then(function (dataResponseOK) {
						$scope.legajoSeleccionado = dataResponseOK;
						$scope.legajoSeleccionado.alumno.apellidoYNombre = $scope.legajoSeleccionado.alumno.apellido.trim() + ', ' + $scope.legajoSeleccionado.alumno.nombre.trim();
					})
					.catch(function () {
						$scope.legajoSeleccionado = legajoNulo;
						
					})
					.finally(function() {
						$scope.obtenerInforme($scope.legajoSeleccionado.alumno.alumnoId,$scope.coordSeleccionado.coordinadorId,$scope.informeEditando.anioLectivo);
					});
			}
		};


		var cargarFormulario = function cargarFormulario() {
			if (informeSrv.accion === null || informeSrv.accion === informeSrv.acciones.crear) {
				$scope.informeEditando = informeNulo;
			} else if (informeSrv.accion === informeSrv.acciones.editar) {
				// $scope.cursoEditando = angular.copy(informeSrv.informeAEditar.curso);
				// $scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
				// $scope.informeEditando = angular.copy(informeSrv.informeAEditar);
				// $scope.estadosInforme.forEach(function (estadoInforme) {
				// 	if (estadoInforme.estadoInformeId === $scope.informeEditando.estadoInformeId) {
				// 		$scope.estadoInformeSeleccionado = estadoInforme;
				// 	}
				// }, this);
				// $scope.coordinacionEditando = $scope.coordinaciones.filter(filtroInforme, $scope.informeEditando);
				// $scope.coordinacionEditando.forEach(function (coordinacion) {
				// 	$scope.coordSeleccionado[coordinacion.dispositivoId] = coordinacion.coordinador;
				// 	$scope.coordOriginal.push(coordinacion);
				// }, this);
				// delete $scope.cursoEditando.carrera;
				// delete $scope.informeEditando.curso;
				// $scope.accionLabel = 'Actualizar';
			}
		};


		var cargarPagina = function cargarPagina() {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			function finalizarCarga() {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			}

			ObtenerCoordinadores()
				.then(function (dataResponseOK) {
					$scope.coordinadores = $filter('filter')(dataResponseOK, { comentarios: '!Desactivo' });
					$scope.coordSeleccionado = coordNulo;
					cargarFormulario();
					finalizarCarga();
				}, finalizarCarga);

		};
		cargarPagina();

		$scope.cancelarEdicion = function cancelarEdicion() {
			$location.path('/informeLista');
		};

		$scope.eliminarCoordinacion = function eliminarCoordinacion() {
			$scope.coordSeleccionado = coordNulo;
		};


		//Drag & drop
		// eslint-disable-next-line no-unused-vars
		$scope.dragover = function dragover(ev) {
			return false;
		};

		$scope.dragstart = function dragstart(ev) {
			ev.originalEvent.dataTransfer.setData('text/plain', ev.target.id);
		};

		$scope.drop = function drop(ev) {
			ev.originalEvent.preventDefault(); //previene que el evento se propage
			var data = ev.originalEvent.dataTransfer.getData('text/plain');

			var nodeOrigen = document.getElementById(data); //Copiar el elemento

			var filtro = { coordinadorId: parseInt(nodeOrigen.attributes['coordindex'].value) };
			var coordinadorSeleccionado = $filter('filter')($scope.coordinadores, filtro)[0];
			$scope.coordSeleccionado = coordinadorSeleccionado;
			$scope.obtenerInforme($scope.legajoSeleccionado.alumno.alumnoId,$scope.coordSeleccionado.coordinadorId,$scope.informeEditando.anioLectivo);
			$scope.$digest();
		};


		//ModalBase
		$scope.modalBaseOpen = false;
		$scope.showModalBase = function showModalBase(title,mensaje,grabarYSeguir) {
			$scope.titleModalBase = title;
			$scope.messageModalBase = mensaje;
			$scope.modalBaseOpen = true;
			$scope.grabarYSeguir = grabarYSeguir;
			if ($scope.grabarYSeguir)
				$timeout(function() {document.getElementById('closeButton').click();}, 750);
		};

		$scope.closeModalBase = function closeModalBase() {
			if (!$scope.grabarYSeguir)
				$location.path('/');
			else {
				$scope.legajoNro = null;
				$scope.legajoSeleccionado =legajoNulo;
				$scope.informeEditando.informe = '';
				$scope.informeEditando.alumnoId=null;
				$scope.modalBaseOpen = false;
				document.getElementById('legajoNro').focus();
			}
		};

		//Grabar
		var mensajeSatisfactorio = function mensajeSatisfactorio(grabarYSeguir) {
			var title = 'Ficha de Informe de Estudiante';
			if (informeSrv.accion === informeSrv.acciones.crear)
				$scope.showModalBase(title,'Creado satisfactoriamente.',grabarYSeguir);
			else
				$scope.showModalBase(title,'Actualizado satisfactoriamente.',grabarYSeguir);
		};

		$scope.grabar =  function grabar(InformeEditando,coordSeleccionado,legajoSeleccionado, grabarYSeguir) {
			var informeProximoId = null;
			$scope.error = { hayError: false, errores: {} };
			if (InformeEditando.informeId == null)
				informeProximoId = (legajoSeleccionado.alumnoId*1000+coordSeleccionado.coordinadorId)*10+InformeEditando.anioLectivo;  //Se genera una PK (subrogada) basada en la clave natural
			else
				informeProximoId = InformeEditando.informeId;
			grabarPP(InformeEditando,coordSeleccionado,legajoSeleccionado,informeProximoId,grabarYSeguir);
		};

		var grabarPP = function grabarPP(InformeEditando,coordSeleccionado,legajoSeleccionado,informeProximoId,grabarYSeguir) {
			var fechaId = new Date();
			InformeEditando.alumnoId= legajoSeleccionado.alumnoId;
			InformeEditando.informeId= informeProximoId;
			//InformeEditando.anioLectivo -- Ya viene asignado
			InformeEditando.coordinadorId= coordSeleccionado.coordinadorId;
			//InformeEditando.informe=  -- Ya viene asignado
			InformeEditando.fechaActualizacion= fechaId.toJSON();
			

			if (informeSrv.accion === informeSrv.acciones.crear) {
				InformeEditando.fechaCreacion= fechaId.toJSON();
				informeSrv.crear(InformeEditando)
					.then(function () {
						mensajeSatisfactorio(grabarYSeguir);
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			} else {
				informeSrv.actualizar(InformeEditando)
					.then(function () {
						mensajeSatisfactorio(grabarYSeguir);
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			}
		};		
		//Fin Grabar

		// $scope.iniciar = function iniciar(fichaCurso, fichaInforme) {
		// 	$scope.estadoInformeSeleccionado.estadoInformeId = informeSrv.estadoInformeMap.Cursando;
		// 	$scope.grabar(fichaCurso, fichaInforme);
		// };

		// var ObtenerInformes = function ObtenerInformes() {
		// 	var deferred = $q.defer();
		// 	informeSrv.getAll()
		// 		.then(function (dataResponseOK) {
		// 			deferred.resolve(dataResponseOK);
		// 		})
		// 		.catch(function (responseError) {
		// 			Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
		// 			$scope.error.hayError = true;
		// 			deferred.reject(responseError);
		// 		});
		// 	return deferred.promise;
		// };

		// $scope.filtroInforme = function (informeSeleccionado) {
		// 	return function (item) {
		// 		return (item != undefined && informeSeleccionado != undefined && informeSeleccionado.carreraId === $scope.carrera.carreraId && informeSeleccionado.carreraId === item.carreraId && informeSeleccionado.modoId === item.modoId && informeSeleccionado.anioInicio === item.anioInicio && informeSeleccionado.mesInicio === item.mesInicio && informeSeleccionado.anioLectivo === item.anioLectivo && informeSeleccionado.nmestreLectivo === item.nmestreLectivo && informeSeleccionado.turnoId === item.turnoId && informeSeleccionado.informeId === item.informeId);
		// 	};
		// };

		// $scope.selectedRow = null;
		// $scope.setClickedRow = function setClickedRow(index) {
		// 	if ($scope.selectedRow === index)
		// 		$scope.selectedRow = null;
		// 	else
		// 		$scope.selectedRow = index;
		// };

		// $scope.seleccionarInforme = function seleccionarInforme() {
		// 	$scope.myStyle.cursor = 'wait';
		// 	$scope.cargando = true;
		// 	function finalizarCarga() {
		// 		$scope.cargando = false;
		// 		$scope.myStyle.cursor = 'auto';
		// 	}
		// 	ObtenerInformes()
		// 		.then(function (dataResponseOK) {
		// 			$scope.InformesDestinoPromocion = $filter('filter')(dataResponseOK, { estadoInformeId: $scope.estadoInformeMap.EnPreparacion });
		// 			finalizarCarga();
		// 			$scope.showModalPromover('');
		// 		});
		// };

		// $scope.cargarInformeDestino = function cargarInformeDestino(informe) {
		// 	$scope.informeDestino = informe;
		// };
	}
]);


