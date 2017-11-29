'use strict';
var divisionMod = angular.module('divisionModulo');


divisionMod.controller('divisionListaControlador',['$rootScope', '$scope', '$http', '$q', 'UtilService', 'carreraSrv', 'coordinacionSrv', 'grupoSrv', 'divisionSrv',
	function CargarDivisiones($rootScope, $scope, $http, $q, UtilService, carreraSrv, coordinacionSrv, grupoSrv, divisionSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.cargando = true;
		$scope.meses = UtilService.meses;
		$scope.ordinales = UtilService.ordinales;
		$scope.divisionSeleccionado = null;
		$scope.carreraSeleccionada = null;


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
				$scope.myStyle.cursor = 'pointer';
			};
			ObtenerCarreras()
				.then(function (dataResponseOK) {
					$scope.carreras = dataResponseOK;
					$scope.carreraSeleccionada = $scope.carreras[0];
					ObtenerDivisiones()
						.then(function (dataResponseOK) {
							$scope.divisiones = dataResponseOK;
							ObtenerCoordinaciones()
								.then(function (dataResponseOK) {
									$scope.coordinaciones = dataResponseOK;
									ObtenerGrupos()
										.then(function (dataResponseOK) {
											$scope.grupos = dataResponseOK;
											finalizarCarga();
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

		$scope.filtroCarrera = function (carreraSeleccionada) {
			return function (item) {
				return (item != undefined && carreraSeleccionada != undefined && carreraSeleccionada.carreraId === item.carreraId);
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

		$scope.irAEliminarDivision = function irAEliminarDivision(division) {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			$scope.error = { hayError: false, errores: {} };
			var finalizarCarga = function finalizarCarga(data, sinError = false) {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'pointer';
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
