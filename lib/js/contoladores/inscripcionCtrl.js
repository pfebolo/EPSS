'use strict';
var incripcionMod= angular.module('incripcionModulo');

incripcionMod.controller('inscripcionControlador',['$rootScope', '$scope', '$http', '$location', 'interesadoSrv',
	function cargarInteresados($rootScope, $scope, $http, $location, interesadoSrv) {
		$scope.GetOK = true;
		$scope.cargando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.interesadoSeleccionado = interesadoSrv.interesadoAInscribir;
		$scope.anios = [{ anio: 1, descripcion: '1er año' },
		{ anio: 2, descripcion: '2do año' },
		{ anio: 3, descripcion: '3er año' }];
		$scope.anio = $scope.anios[0];
		$scope.nmestres = [{ nmestre: 1, descripcion: '1er Cuatrimestre' },
		{ nmestre: 2, descripcion: '2do Cuatrimestre' }];
		$scope.nmestre = $scope.nmestres[0];
		$scope.modalidades = [{ id: 1, descripcion: 'Presencial' },
		{ id: 2, descripcion: 'A Distancia' }];
		$scope.modalidad = $scope.modalidades[$scope.interesadoSeleccionado.modalidadId === 1 ? 0: 1];
		$scope.turnos = [{ id: 1, descripcion: 'Mañana' },
		{ id: 2, descripcion: 'Noche' }];
		$scope.turno = null;

		$scope.docAPresentar = {
			'docTitulo': false,
			'docDni': false,
			'docAptoFisico': false,
			'docFoto': false,
			'docCompromiso': false
		};
		$scope.interesadoSeleccionado.situacionEspecial= $scope.interesadoSeleccionado.situacionEspecial === 'Nada' ? null: $scope.interesadoSeleccionado.situacionEspecial;
		$scope.interesadoSeleccionado.situacionInscripcion= $scope.interesadoSeleccionado.situacionInscripcion === 'Nada' ? null: $scope.interesadoSeleccionado.situacionInscripcion;

		$scope.inscribir = function inscribir(fichaIncrispcion) {
			var fechaInscripcion = new Date().toJSON();
			var preAlumno = {
				//Datos provenientes de la ficha de interesado
				'alumnoId': fichaIncrispcion.interesadoId,
				'nombre': fichaIncrispcion.nombre,
				'apellido': fichaIncrispcion.apellido,
				'mail': fichaIncrispcion.mail,
				'mail2': fichaIncrispcion.mail2,
				'telefono': fichaIncrispcion.telefono,
				'celular': fichaIncrispcion.celular,
				'comoConocio': fichaIncrispcion.comoConocio,
				'modalidadId': $scope.modalidad.id,
				'gradoInteres': fichaIncrispcion.gradoInteres,
				'fechaInteresado': fechaInscripcion,  //Se reemplaza por la fecha actual
				'comentario': fichaIncrispcion.comentario,
				'provincia': fichaIncrispcion.provincia,
				'situacionInscripcion': fichaIncrispcion.situacionInscripcion,
				'situacionEspecial': fichaIncrispcion.situacionEspecial,
				
				//Datos específicos de la ficha de Inscripción
				'dni': fichaIncrispcion.dni,
				'domicilio': fichaIncrispcion.domicilio,
				'fechaInteresadoOriginal': fichaIncrispcion.fechaInteresado, //Se conserva la fecha de la ficha de interesado
				'anioAcursar': $scope.anio.anio,
				'nmestreAcursar': $scope.nmestre.nmestre,
				'turno': $scope.modalidad.id===1 ? $scope.turno.descripcion : null,
				'docTitulo': fechaInscripcion,
				'docDni': fechaInscripcion,
				'docAptoFisico': fechaInscripcion,
				'docFoto': fechaInscripcion,
				'docCompromiso': fechaInscripcion
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
			interesadoSrv.inscribir(preAlumno)
				.then(function () {
					$location.path('/inscriptoLista');
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				});
		};
	}
]);


