'use strict';
var eventoMod = angular.module('eventoModulo');

eventoMod.controller('eventoListaControlador', ['$rootScope', '$scope', '$http', '$filter', 'eventoSrv', 'interesadoEventoSrv',
	function CargarEventos($rootScope, $scope, $http, $filter, eventoSrv, interesadoEventoSrv) {
		$scope.GetOK = false;
		$scope.cargando = true;
		$scope.actualizando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.eventos = null;
		$scope.eventoSeleccionado = null;
		$scope.interesadosEventos = null;
		$scope.eventosFiltradosYOrdenados = null;
		$scope.alertClass = 'fade';


		$scope.ObtenerEventos = function ObtenerEventos() {
			$scope.cargando = true;
			eventoSrv.getAll()
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad) { return cad.replace('%', '％'); }));
					$scope.eventos = JSON.parse(x.replace(/\t/g, ' '));
					$scope.GetOK = true;
					if ($scope.eventos.length > 0) {
						$scope.eventos.forEach(eventoSrv.colocarVencimiento);
						$scope.reseleccionar('');
					}
				})
				.catch(function () {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.ObtenerEventos();

		var customComparator = function (input, search) {
			if (angular.isString(input))
				var inputLocale = stringToLocale(input);
			return typeof input !== 'string' ? false : input.includes(search) || inputLocale.includes(search);
		};

		var stringToLocale = function (str) {
			return str = str.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ü', 'u');
		};


		$scope.reseleccionar = function reseleccionar(filtro) {
			//var ins = $filter('filter')($scope.eventos, filtro);
			var ins = $filter('filter')($scope.eventos, stringToLocale(filtro), customComparator);

			ins = $filter('orderBy')(ins, 'fecha', true); //true=Order Descendent
			if (typeof ins != 'undefined' && ins !== null && ins.length > 0)
				$scope.cargarEvento(ins[0]);
			$scope.eventosFiltradosYOrdenados = ins; //Actualiza la lista mostrada, luego del fitrado y ordenado
		};


		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};

		$scope.cargarEvento = function cargarEvento(evento) {
			$scope.eventoSeleccionado = evento;
			obtenerInteresadosPorEvento(evento.id);
		};

		$scope.irACrearEvento = function irACrearEvento() {
			eventoSrv.exponerCreacion();
		};

		$scope.irAEdicionEvento = function irAEdicionEvento(eventoAEditar) {
			eventoSrv.exponerEdicion(eventoAEditar);
		};

		$scope.irAEliminarEvento = function irAEliminarEvento(eventoAEliminar) {
			$scope.myStyle.cursor = 'wait';
			eventoSrv.eliminar(eventoAEliminar.id)
				.then(function () {
					$scope.ObtenerEventos();
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.irAEliminarInteresadoEvento = function irAEliminarInteresadoEvento(interesadoEventoAEliminar) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.eliminar(interesadoEventoAEliminar.id)
				.then(function () {
					$scope.interesadosEventos.splice($scope.interesadosEventos.indexOf(interesadoEventoAEliminar), 1);
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});

		};


		var obtenerInteresadosPorEvento = function obtenerInteresadosPorEvento(eventoId) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.getByEventoId(eventoId)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad) { return cad.replace('%', '％'); }));
					$scope.interesadosEventos = JSON.parse(x.replace(/\t/g, ' '));
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.irASwapAsistenteInteresadoEvento = function irASwapAsistenteInteresadoEvento(interesadoEventoASwapearAsistente, vencimiento) {
			//Si el cambio es dentro de los 7 próximos días pasados a la fecha del evento, se acepta 
			if (vencimiento > (-86400000 * 7) & (vencimiento <= 0)) {
				$scope.myStyle.cursor = 'wait';
				var index = $scope.interesadosEventos.indexOf(interesadoEventoASwapearAsistente);
				var interesadoEventoModificado = {
					'id': interesadoEventoASwapearAsistente.id,
					'interesadoId': interesadoEventoASwapearAsistente.interesadoId,
					'eventoId': interesadoEventoASwapearAsistente.eventoId,
					'observacion': interesadoEventoASwapearAsistente.observacion,
					'inscripto': interesadoEventoASwapearAsistente.inscripto,
					'asistente': !interesadoEventoASwapearAsistente.asistente
				};
				interesadoEventoSrv.actualizar(interesadoEventoModificado)
					.then(function () {
						$scope.interesadosEventos[index].asistente = interesadoEventoModificado.asistente;
					})
					.catch(function (responseError) {
						$scope.error.errores = responseError.mensajes;
						$scope.error.hayError = true;
					})
					.finally(function () {
						$scope.myStyle.cursor = 'pointer';
					});
			} else
				$scope.alertClass = 'in';
		};

		$scope.closeAlert = function closeAlert() {
			$scope.alertClass = 'fade';
		};



	}
]);
