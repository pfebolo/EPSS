'use strict';
var divisionMod = angular.module('divisionModulo');


divisionMod.controller('divisionEdicionControlador', ['$rootScope', '$scope', '$http', '$location',  'divisionSrv', 'carreraSrv', 'cursoSrv', 
	function cargarDivisiones($rootScope, $scope, $http, $location, divisionSrv, carreraSrv, cursoSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		var accion_crear = 0;
		var accion_editar = 1;
		$scope.msjModal=null;
		$scope.carreras= [];
		$scope.cursoEditando = {};
		$scope.divisionEditando = {};
		$scope.accionLabel='???';

		if (divisionSrv.accion===null) {
			divisionSrv.accion= accion_crear;
		}

		$scope.modoLista = [{id:1, descripcion:'Presencial'},
		{id:2, descripcion:'A Distancia'}];
		$scope.setModo = function setModo(index) {
			$scope.cursoEditando.modoId = $scope.modoLista[index].descripcion;
		};

		$scope.turnoLista = [{id:1, descripcion:'Mañana'},
		{id:2, descripcion:'Noche'},
		{id:3, descripcion:'Virtual'}];
		$scope.setTurno = function setTurno(index) {
			$scope.divisionEditando.turnoId = $scope.turnoLista[index].descripcion;
		};

		$scope.divisionLista = [{id:1, descripcion:'A'},
		{id:2, descripcion:'B'},
		{id:3, descripcion:'C'},
		{id:4, descripcion:'D'},
		{id:5, descripcion:'E'},
		{id:6, descripcion:'F'},
		{id:7, descripcion:'G'},
		{id:8, descripcion:'H'},
		{id:9, descripcion:'I'},
		{id:10, descripcion:'J'},
		{id:11, descripcion:'K'},
		{id:12, descripcion:'L'}];
		$scope.setDivision = function setDivision(index) {
			$scope.divisionEditando.divisionId = $scope.divisionLista[index].descripcion;
		};

		var ObtenerCarreras = function ObtenerCarreras() {
			$scope.myStyle.cursor = 'wait';
			carreraSrv.getAll()
				.then(function (dataResponseOK) {
					$scope.carreras = dataResponseOK;
					if ($scope.cursoEditando.carreraId !== null) //Si se cargó primero $scope.cursoEditando
						$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};


		ObtenerCarreras();
		if (divisionSrv.accion===null || divisionSrv.accion === accion_crear) {
			$scope.cursoEditando.carreraId = 0;
			$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
			$scope.cursoEditando.modoId = null;
			$scope.cursoEditando.anioInicio = null;
			$scope.cursoEditando.mesInicio = null;
			$scope.cursoEditando.mesFinal = null;
			$scope.cursoEditando.anioLectivo = null;
			$scope.cursoEditando.nmestreLectivo = null;
			$scope.cursoEditando.comentario = null;
			
			$scope.divisionEditando.turnoId = null;
			$scope.divisionEditando.divisionId = 'A';
			$scope.divisionEditando.comentario = null;
			
			$scope.accionLabel='Crear';
		} else if (divisionSrv.accion === accion_editar) {
			$scope.cursoEditando = divisionSrv.divisionAEditar;
			if ($scope.carreras !== []) //Si se cargó primero $scope.carreras
				$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
			delete $scope.cursoEditando.curso;
			$scope.accionLabel='Actualizar';
		}
		

		$scope.cancelarEdicion = function cancelarEdicion() {
			$location.path('/divisionLista');
		};

		$scope.modalOpen=false;
		$scope.showModal = function showModal(mensaje) {
			$scope.msjModal=mensaje;
			$scope.modalOpen=true;
		};

		$scope.closeModal = function closeModal() {
			$location.path('/divisionLista');
		};

		$scope.grabar = function grabar(fichaCurso, fichaDivision) {
			$scope.error = { hayError: false, errores: {} };
			fichaCurso.carreraId = $scope.carrera.id;
			fichaDivision.carreraId = fichaCurso.carreraId;
			fichaDivision.modoId = fichaCurso.modoId;
			fichaDivision.anioInicio = fichaCurso.anioInicio;
			fichaDivision.mesInicio = fichaCurso.mesInicio;
			fichaDivision.anioLectivo = fichaCurso.anioLectivo;
			fichaDivision.nmestreLectivo = fichaCurso.nmestreLectivo;
			fichaDivision.estadoDivisionId ='Cursando',
			fichaDivision.curso = fichaCurso;

			if (divisionSrv.accion === accion_crear) {
				divisionSrv.crear(fichaDivision)
					.then(function () {
						$scope.showModal('Creado satisfactoriamente.');
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					});
			} else {
				divisionSrv.actualizar(fichaDivision)
					.then(function () {
						$scope.showModal('Actualizado satisfactoriamente.');
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					});

			}
		};
	}
]);


