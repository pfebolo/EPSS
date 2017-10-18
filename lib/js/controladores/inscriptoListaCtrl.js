'use strict';
var inscriptoMod = angular.module('inscriptoModulo');

inscriptoMod.controller('inscriptoListaControlador', ['$rootScope', '$scope', '$http', '$filter', '$location', 'estudianteSrv', 'legajoSrv', 'interesadoSrv',
	function CargarInscriptos($rootScope, $scope, $http, $filter, $location, estudianteSrv, legajoSrv, interesadoSrv) {
		$scope.GetOK = false;
		$scope.cargando = true;
		$scope.actualizando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.inscriptoSeleccionado = null;

		$scope.ObtenerInscriptos = function ObtenerInscriptos() {
			$scope.cargando = true;
			estudianteSrv.getAll()
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad){return cad.replace('%','％');}));
					$scope.inscriptos = JSON.parse(x.replace(/\t/g, ' '));
					$scope.GetOK = true;
					if ($scope.inscriptos.length > 0)
						$scope.reseleccionar('');
				})
				.catch(function () {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.ObtenerInscriptos();


		$scope.reseleccionar = function reseleccionar(filtro) {
			var ins = $filter('filter')($scope.inscriptos, filtro, false);
			ins = $filter('orderBy')(ins, 'apellido');
			if (typeof ins != 'undefined' && ins.length > 0)
				$scope.cargarInscripto(ins[0]);
		};


		$scope.crearLegajos = function crearLegajos(inscriptos) {
			$scope.error = { hayError: false, errores: {} };
			$scope.actualizando = true;
			$scope.myStyle.cursor = 'wait';
			legajoSrv.crearLegajos(inscriptos)
				.then(function () {
					$scope.ObtenerInscriptos();
				})
				.catch(function (dataResponseError) {
					$scope.error.errores = dataResponseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.actualizando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};

		$scope.cargarInscripto = function cargarInscripto(inscripto) {
			$scope.inscriptoSeleccionado = inscripto;
		};

		$scope.irAEdicion = function irAEdicion(estudianteAEditar) {
			estudianteSrv.exponerEdicion(estudianteAEditar);
		};

		class NotImplemented extends Error{};

		var cancelarInscripto = function cancelarInscripto(inscriptoACancelar) {
			$scope.error = { hayError: false, errores: {} };
			$scope.actualizando = true;
			$scope.myStyle.cursor = 'wait';
			delete inscriptoACancelar.carrera;
			estudianteSrv.eliminar(inscriptoACancelar)
				.then(function () {
					interesadoSrv.interesadoFiltro = inscriptoACancelar.mail;
					$location.path('/interesadoLista');
				})
				.catch(function (dataResponseError) {
					$scope.error.errores = dataResponseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.actualizando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		//Modal Cancelar Inscripto
		var cancelarInscriptoPINSecreto = estudianteSrv.pinCancelacion;
		var inscriptoACancelar = null;
		$scope.cancelarInscriptoPIN = null;
		$scope.cancelarInscriptoPINErroneo = false;
		$scope.modalCancelarInscriptoOpen = false;
		$scope.showModalCancelarInscripto = function showModalCancelarInscripto(inscriptoSeleccionado) {
			inscriptoACancelar = inscriptoSeleccionado;
			$scope.modalCancelarInscriptoOpen = true;
		};

		$scope.closeModalCancelarInscripto = function closeModalCancelarInscripto(cancelarInscriptoPIN) {
			if (cancelarInscriptoPINSecreto === btoa(cancelarInscriptoPIN)) {
				$scope.modalCancelarInscriptoOpen = false;
				cancelarInscripto(inscriptoACancelar);
			} else if (cancelarInscriptoPIN === 'Cancelar')
				$scope.modalCancelarInscriptoOpen = false;
			else
				$scope.cancelarInscriptoPINErroneo = true;
			$scope.cancelarInscriptoPIN = null;
		};
		//Fin Modal Eliminar Interesado
		//Fin Ficha Interesado


	}
]);
