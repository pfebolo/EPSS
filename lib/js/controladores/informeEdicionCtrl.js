'use strict';
var informeMod = angular.module('informeModulo');

informeMod.controller('informeEdicionControlador', ['$scope', '$location', '$filter', '$q', '$timeout', 'legajoSrv', 'coordinadorSrv', 'informeSrv',
	function cargarInformes($scope, $location, $filter, $q,$timeout, legajoSrv, coordinadorSrv, informeSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.cargando = true;
		var ahora = function ahora() {return new Date();};
		$scope.esEdicion = function esEdicion() { return informeSrv.accion === informeSrv.acciones.editar; };
		// $scope.tiempoTranscurrido = function tiempoTranscurrido() { return (ahora() - new Date($scope.informeEditando.fechaActualizacion)); };  
		// $scope.fechaActualizacion = function tiempoTranscurrido() { return new Date($scope.informeEditando.fechaActualizacion); };  
		// $scope.fechaactual = function tiempoTranscurrido() { return ahora(); };  
		$scope.esEditable = function esEditable() { return !$scope.esEdicion() || ((ahora() - new Date($scope.informeEditando.fechaActualizacion))<(86400*7*60000)); };  //Editable solo durante una semana (7dias) desde la creación.
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
			'fechaActualizacion': new Date()
		};
		$scope.informeEditando = informeNulo;
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
						$scope.informeEditando.fechaActualizacion = dataResponseOK.fechaActualizacion;
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
				//TODO: Editar un informe que es pasado desde 'algun' lugar (Legajo del estudiante, Gestión de divisiones, etc.)
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
				$scope.obtenerInforme($scope.legajoSeleccionado.alumno.alumnoId,$scope.coordSeleccionado.coordinadorId,$scope.informeEditando.anioLectivo);
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

	}
]);


