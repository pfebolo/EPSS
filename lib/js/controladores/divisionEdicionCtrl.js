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
		$scope.accionLabel='???';

		if (divisionSrv.accion===null) {
			divisionSrv.accion= accion_crear;
		}

		$scope.modoLista = [{id:1, descripcion:'Presencial'},
		{id:2, descripcion:'A Distancia'}];
		$scope.setModo = function setModo(index) {
			$scope.cursoEditando.modoId = $scope.modoLista[index].descripcion;
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
			$scope.accionLabel='Crear';
		} else if (divisionSrv.accion === accion_editar) {
			$scope.cursoEditando = divisionSrv.divisionAEditar;
			if ($scope.carreras !== []) //Si se cargó primero $scope.carreras
				$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
			delete $scope.cursoEditando.turnoId;
			delete $scope.cursoEditando.divisionId;
			delete $scope.cursoEditando.carrera;
			delete $scope.cursoEditando.modo;
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

		$scope.grabar = function grabar(fichaCurso) {
			$scope.error = { hayError: false, errores: {} };
			$scope.cursoEditando.carreraId = $scope.carrera.id;
			if (divisionSrv.accion === accion_crear) {
				cursoSrv.crear(fichaCurso)
					.then(function () {
						$scope.showModal('Creado satisfactoriamente.');
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					});
			} else {
				cursoSrv.actualizar(fichaCurso)
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

