'use strict';
var interesadoMod = angular.module('interesadoModulo');

interesadoMod.controller('interesadoEdicionControlador', ['$rootScope', '$scope', '$http', '$location',  'interesadoSrv',
	function cargarInteresados($rootScope, $scope, $http, $location, interesadoSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		var accion_crear = 0;
		var accion_editar = 1;
		$scope.msjModal=null;
		$scope.interesadoEditando = {};
		$scope.accionLabel='???';
		$scope.itemDuplicado=false;

		if (interesadoSrv.accion===null) {
			interesadoSrv.accion= accion_crear;
		}

		$scope.esItemDuplicado = function esItemDuplicado(item) {
			$scope.itemDuplicado = interesadoSrv.esItemDuplicado(item);
		};

		$scope.conocioOrigenes = [{id:0, descripcion:'Referido'},
		{id:1, descripcion:'Web'},
		{id:2, descripcion:'FaceBook'},
		{id:3, descripcion:'Cartel en calle'},
		{id:4, descripcion:'BuscoUniversidad'},
		{id:5, descripcion:'Otro'}];
		$scope.setConocio = function setConocio(index) {
			$scope.interesadoEditando.comoConocio = $scope.conocioOrigenes[index].descripcion;
		};

		$scope.carreras = [{id:0, descripcion:'Principal'},
		{id:1, descripcion:'Equivalencia'}];
		$scope.setCarrera = function setCarrera(index) {
			$scope.interesadoEditando.carreraId = $scope.carreras[index].id;
		};

		$scope.modalidades = [{ id: 1, descripcion: 'Presencial' },
		{ id: 2, descripcion: 'A Distancia' }];
		$scope.setModalidad = function setModalidad(index) {
			if ($scope.interesadoEditando.modalidadId === $scope.modalidades[index].id) 
				$scope.interesadoEditando.modalidadId = null;
			else 
				$scope.interesadoEditando.modalidadId = $scope.modalidades[index].id;
		},

		$scope.turnos = [{ id: 0, descripcion: 'Mañana' },
		{ id: 1, descripcion: 'Noche' }];
		$scope.setTurno = function setTurno(index) {
			if ($scope.interesadoEditando.turno === $scope.turnos[index].descripcion) 
				$scope.interesadoEditando.turno = null;
			else 
				$scope.interesadoEditando.turno = $scope.turnos[index].descripcion;
		};

		$scope.anios = [{ id: 1, descripcion: '1er año' },
		{ id: 2, descripcion: '2do año' },
		{ id: 3, descripcion: '3er año' }];
		$scope.setAnio = function setAnio(index) {
			$scope.interesadoEditando.anioAcursar = $scope.anios[index].id;
		};

		$scope.nmestres = [{ id: 1, descripcion: '1er Cuatrimestre' },
		{ id: 2, descripcion: '2do Cuatrimestre' }];
		$scope.setNmestre = function setMestre(index) {
			$scope.interesadoEditando.nmestreAcursar = $scope.nmestres[index].id;
		};

		$scope.gradosDeInteres = [{ id: 0, descripcion: 'Muy Alto' },
		{ id: 1, descripcion: 'Alto' },
		{ id: 2, descripcion: 'Medio' },
		{ id: 3, descripcion: 'Bajo' }];
		$scope.setGradoInteres = function setGradoInteres(index) {
			$scope.interesadoEditando.gradoInteres = $scope.gradosDeInteres[index].descripcion;
		};

		$scope.situacionInscripciones = [{ id: 0, descripcion: 'Pase X Equivalencia' },
		{ id: 1, descripcion: 'Reinscripción' }];
		$scope.setsituacionInscripcion = function setsituacionInscripcion(index) {
			if ($scope.interesadoEditando.situacionInscripcion === $scope.situacionInscripciones[index].descripcion) 
				$scope.interesadoEditando.situacionInscripcion = null;
			else 
				$scope.interesadoEditando.situacionInscripcion = $scope.situacionInscripciones[index].descripcion;
		};

		$scope.situacionesEspeciales = [{ id: 0, descripcion: 'De las fuerzas' },
		{ id: 1, descripcion: 'Grupo' },
		{ id: 2, descripcion: 'Familia' },
		{ id: 3, descripcion: 'Jubilado' },
		{ id: 4, descripcion: 'Docente' },
		{ id: 5, descripcion: 'Egresado' }];
		$scope.setSituacionEspecial = function setSituacionEspecial(index) {
			if ($scope.interesadoEditando.situacionEspecial === $scope.situacionesEspeciales[index].descripcion) 
				$scope.interesadoEditando.situacionEspecial = null;
			else 
				$scope.interesadoEditando.situacionEspecial = $scope.situacionesEspeciales[index].descripcion;
		};

		$scope.mediosDeContacto = [{id:1, descripcion:'Acaula'},
		{id:2, descripcion:'BuscoUniversidad'},
		{id:3, descripcion:'Zopin'},
		{id:4, descripcion:'E-Mail'},
		{id:5, descripcion:'FaceBook'},
		{id:6, descripcion:'Web'},
		{id:7, descripcion:'Guía del Estudiante'},
		{id:8, descripcion:'Goolge+'},
		{id:9, descripcion:'Presencial'},
		{id:10, descripcion:'Teléfono'},
		{id:11, descripcion:'Whastapp'},
		{id:12, descripcion:'Otro'}];
		$scope.setMediosDeContacto = function setMediosDeContacto(index) {
			if ($scope.interesadoEditando.medioDeContactoId === $scope.mediosDeContacto[index].id) 
				$scope.interesadoEditando.medioDeContactoId = null;
			else 
				$scope.interesadoEditando.medioDeContactoId = $scope.mediosDeContacto[index].id;
		};





		$scope.setConocio = function setConocio(index) {
			$scope.interesadoEditando.comoConocio = $scope.conocioOrigenes[index].descripcion;
		};

		$scope.setSeguimiento = function setSeguimiento() {
			$scope.interesadoEditando.seguimiento = !$scope.interesadoEditando.seguimiento;
		};
		
		if (interesadoSrv.accion===null || interesadoSrv.accion === accion_crear) {
			$scope.interesadoEditando.interesadoId = 0;
			$scope.interesadoEditando.nombre = null;
			$scope.interesadoEditando.apellido = null;
			$scope.interesadoEditando.mail = null;
			$scope.interesadoEditando.mail2 = null;
			$scope.interesadoEditando.telefono = null;
			$scope.interesadoEditando.celular = null;
			$scope.interesadoEditando.comoConocio = null;
			$scope.interesadoEditando.modalidadId = null;
			$scope.interesadoEditando.gradoInteres=null;
			$scope.interesadoEditando.fechaInteresado = (new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000))).toJSON();
			$scope.interesadoEditando.comentario = null;
			$scope.interesadoEditando.provincia = null;
			$scope.interesadoEditando.situacionInscripcion=null;
			$scope.interesadoEditando.situacionEspecial=null;
			$scope.interesadoEditando.carreraId = $scope.carreras[0].id;
			$scope.interesadoEditando.anioAcursar=$scope.anios[0].id;
			$scope.interesadoEditando.nmestreAcursar=$scope.nmestres[0].id;
			$scope.interesadoEditando.turno = null;
			$scope.interesadoEditando.seguimiento=false;
			$scope.interesadoEditando.medioDeContactoId=null;
			$scope.accionLabel='Crear';
			$scope.myStyle.cursor= 'auto';
		} else if (interesadoSrv.accion === accion_editar) {
			$scope.interesadoEditando = angular.copy(interesadoSrv.interesadoAEditar);
			delete $scope.interesadoEditando.carrera;
			delete $scope.interesadoEditando.modalidad;
			delete $scope.interesadoEditando.medioDeContacto;
			$scope.esItemDuplicado($scope.interesadoEditando);
			$scope.accionLabel='Actualizar';
			$scope.myStyle.cursor= 'auto';
		}


		$scope.cancelarEdicion = function cancelarEdicion() {
			interesadoSrv.interesados = null;
			interesadoSrv.interesadoFiltro = $scope.interesadoEditando.mail;
			$location.path('/interesadoLista');
		};


		$scope.modalOpen=false;
		$scope.showModal = function showModal(mensaje) {
			$scope.msjModal=mensaje;
			$scope.modalOpen=true;
		};

		$scope.closeModal = function closeModal() {
			interesadoSrv.interesados = null;
			if (interesadoSrv.accion === accion_editar)
				interesadoSrv.interesadoFiltro = $scope.interesadoEditando.mail;
			$location.path('/interesadoLista');
		};


		$scope.grabar = function grabar(fichaInteresado) {
			$scope.error = { hayError: false, errores: {} };

			if (interesadoSrv.accion === accion_crear) {
				interesadoSrv.crear(fichaInteresado)
					.then(function () {
						$scope.showModal('Creado satisfactoriamente.');
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					});
			} else {
				interesadoSrv.actualizar(fichaInteresado)
					.then(function () {
						$scope.showModal('Actualizada satisfactoriamente.');
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					});

			}
			//$element('cerrarBoton') .focus;
		};
	}
]);
