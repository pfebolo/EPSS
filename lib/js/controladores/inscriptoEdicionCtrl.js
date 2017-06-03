'use strict';
var incripcionMod = angular.module('incripcionModulo');

incripcionMod.controller('inscriptoEdicionControlador', ['$rootScope', '$scope', '$http', '$location', 'estudianteSrv',
	function cargarInteresados($rootScope, $scope, $http, $location, estudianteSrv) {
		$scope.GetOK = true;
		$scope.cargando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.anios = [{ anio: 1, descripcion: '1er año' },
		{ anio: 2, descripcion: '2do año' },
		{ anio: 3, descripcion: '3er año' }];
		$scope.nmestres = [{ nmestre: 1, descripcion: '1er Cuatrimestre' },
		{ nmestre: 2, descripcion: '2do Cuatrimestre' }];
		$scope.modalidades = [{ id: 1, descripcion: 'Presencial' },
		{ id: 2, descripcion: 'A Distancia' }];
		$scope.turnos = [{ id: 1, descripcion: 'Mañana' },
		{ id: 2, descripcion: 'Noche' }];
		var accion_inscribir = 0;
		var accion_editar = 1;
		$scope.msjModal=null;


		var fechaInscripcion = new Date().toJSON();
		if (estudianteSrv.accion === accion_inscribir) {
			$scope.interesadoSeleccionado = estudianteSrv.interesadoAInscribir;
			$scope.interesadoSeleccionado.alumnoId = estudianteSrv.interesadoAInscribir.interesadoId;
			$scope.anio = $scope.anios[0];
			$scope.nmestre = $scope.nmestres[0];
			$scope.modalidad = $scope.modalidades[$scope.interesadoSeleccionado.modalidadId === 1 ? 0 : 1];
			$scope.turno = null;
			//Se adecuan las fechas de interes y de inscripción
			$scope.interesadoSeleccionado.fechaInteresadoOriginal = estudianteSrv.interesadoAInscribir.fechaInteresado;
			$scope.interesadoSeleccionado.fechaInteresado = fechaInscripcion;
			//Se inicalizan las fechas de la documentación
			$scope.interesadoSeleccionado.docTitulo = fechaInscripcion;
			$scope.interesadoSeleccionado.docDni = fechaInscripcion;
			$scope.interesadoSeleccionado.docAptoFisico = fechaInscripcion;
			$scope.interesadoSeleccionado.docFoto = fechaInscripcion;
			$scope.interesadoSeleccionado.docCompromiso = fechaInscripcion;
			$scope.docAPresentar = {
				'docTitulo': false,
				'docDni': false,
				'docAptoFisico': false,
				'docFoto': false,
				'docCompromiso': false
			};
			$scope.interesadoSeleccionado.situacionEspecial = $scope.interesadoSeleccionado.situacionEspecial === 'Nada' ? null : $scope.interesadoSeleccionado.situacionEspecial;
			$scope.interesadoSeleccionado.situacionInscripcion = $scope.interesadoSeleccionado.situacionInscripcion === 'Nada' ? null : $scope.interesadoSeleccionado.situacionInscripcion;
		} else if (estudianteSrv.accion === accion_editar) {
			$scope.interesadoSeleccionado = estudianteSrv.estudianteAEditar;

			$scope.anio = $scope.anios[estudianteSrv.estudianteAEditar.anioAcursar - 1];
			$scope.nmestre = $scope.nmestres[estudianteSrv.estudianteAEditar.nmestreAcursar - 1];
			$scope.modalidad = $scope.modalidades[estudianteSrv.estudianteAEditar.modalidad.id === 1 ? 0 : 1];
			$scope.turno = $scope.turnos[estudianteSrv.estudianteAEditar.turno === $scope.turnos[0].descripcion ? 0 : 1];

			$scope.fechaInteresadoOriginal = estudianteSrv.estudianteAEditar.fechaInteresadoOriginal;
			$scope.docAPresentar = {
				'docTitulo': $scope.interesadoSeleccionado.docTitulo !== null,
				'docDni': $scope.interesadoSeleccionado.docDni !== null,
				'docAptoFisico': $scope.interesadoSeleccionado.docAptoFisico !== null,
				'docFoto': $scope.interesadoSeleccionado.docFoto !== null,
				'docCompromiso': $scope.interesadoSeleccionado.docCompromiso !== null
			};
			$scope.interesadoSeleccionado.docTitulo = $scope.interesadoSeleccionado.docTitulo !== null ? $scope.interesadoSeleccionado.docTitulo : fechaInscripcion;
			$scope.interesadoSeleccionado.docDni = $scope.interesadoSeleccionado.docDni !== null ? $scope.interesadoSeleccionado.docDni : fechaInscripcion;
			$scope.interesadoSeleccionado.docAptoFisico = $scope.interesadoSeleccionado.docAptoFisico !== null ? $scope.interesadoSeleccionado.docAptoFisico : fechaInscripcion;
			$scope.interesadoSeleccionado.docFoto = $scope.interesadoSeleccionado.docFoto !== null ? $scope.interesadoSeleccionado.docFoto : fechaInscripcion;
			$scope.interesadoSeleccionado.docCompromiso = $scope.interesadoSeleccionado.docCompromiso !== null ? $scope.interesadoSeleccionado.docCompromiso : fechaInscripcion;
		} else {
			throw 'Acción desconocida';
		}


		$scope.cancelarEdicion = function cancelarEdicion() {
			$location.path('/interesadoLista');
		};


		$scope.modalOpen=false;
		$scope.showModal = function showModal(mensaje) {
			$scope.msjModal=mensaje;
			$scope.modalOpen=true;
		};

		$scope.closeModal = function closeModal() {
			$location.path('/inscriptoLista');
		};


		$scope.inscribir = function inscribir(fichaInscripcion) {
			$scope.error = { hayError: false, errores: {} };
			var preAlumno = {
				//Datos provenientes de la ficha de interesado
				'alumnoId': fichaInscripcion.alumnoId,
				'nombre': fichaInscripcion.nombre,
				'apellido': fichaInscripcion.apellido,
				'mail': fichaInscripcion.mail,
				'mail2': fichaInscripcion.mail2,
				'telefono': fichaInscripcion.telefono,
				'celular': fichaInscripcion.celular,
				'comoConocio': fichaInscripcion.comoConocio,
				'modalidadId': $scope.modalidad.id,
				'gradoInteres': fichaInscripcion.gradoInteres,
				'fechaInteresado': fichaInscripcion.fechaInteresado,
				'comentario': fichaInscripcion.comentario,
				'provincia': fichaInscripcion.provincia,
				'situacionInscripcion': fichaInscripcion.situacionInscripcion,
				'situacionEspecial': fichaInscripcion.situacionEspecial,

				//Datos específicos de la ficha de Inscripción
				'dni': fichaInscripcion.dni,
				'domicilio': fichaInscripcion.domicilio,
				'fechaInteresadoOriginal': fichaInscripcion.fechaInteresadoOriginal,
				'anioAcursar': $scope.anios.anio,
				'nmestreAcursar': $scope.nmestres.nmestre,
				'turno': $scope.modalidad.id === 1 ? $scope.turno.descripcion : null,
				'docTitulo': fichaInscripcion.docTitulo,
				'docDni': fichaInscripcion.docDni,
				'docAptoFisico': fichaInscripcion.docAptoFisico,
				'docFoto': fichaInscripcion.docFoto,
				'docCompromiso': fichaInscripcion.docCompromiso
			};
			if (!$scope.docAPresentar.docTitulo)
				preAlumno.docTitulo = null;
			if (!$scope.docAPresentar.docDni)
				preAlumno.docDni = null;
			if (!$scope.docAPresentar.docAptoFisico)
				preAlumno.docAptoFisico = null;
			if (!$scope.docAPresentar.docFoto)
				preAlumno.docFoto = null;
			if (!$scope.docAPresentar.docCompromiso)
				preAlumno.docCompromiso = null;
			$scope.error = { hayError: false, errores: {} };

			if (estudianteSrv.accion === accion_inscribir) {
				estudianteSrv.inscribir(preAlumno)
					.then(function () {
						$scope.showModal('Inscripto satisfactoriamente.');
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					});
			} else {
				estudianteSrv.actualizar(preAlumno)
					.then(function () {
						$scope.showModal('Actualizada satisfactoriamente.');
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					});

			}
		};
	}
]);


