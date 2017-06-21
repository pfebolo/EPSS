'use strict';
var interesadoMod = angular.module('interesadoModulo'); // se obtiene el modulo interesadoModulo previamente creado (el modulo está creado previamente)


interesadoMod.controller('interesadoListaControlador', ['$rootScope', '$scope', '$http', '$filter', 'interesadoSrv', 'estudianteSrv', 'interesadoEventoSrv', 'eventoSrv',
	function cargarInteresados($rootScope, $scope, $http, $filter, interesadoSrv, estudianteSrv, interesadoEventoSrv, eventoSrv) {
		$scope.GetOK = true;
		$scope.cargando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.interesadoSeleccionado = null;
		$scope.interesadosEventos = null;
		$scope.altaEvento = false;
		$scope.eventosFuturos = null;



		var serializarFecha = function serializarFecha(fecha) {
			return new Date(fecha.substring(6, 10) + '-' + fecha.substring(3, 5) + '-' + fecha.substring(0, 2));
		};

		var deSerializarFecha = function deSerializarFecha(fecha) {
			var fechaBase = fecha.toJSON().substr(0, 10);
			return fechaBase.substr(8, 2) + '/' + fechaBase.substr(5, 2) + '/' + fechaBase.substr(0, 4);
		};

		$scope.fechaFIN = deSerializarFecha((new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60 * 1000))));

		$scope.obtenerInteresados = function obtenerInteresados(fechaFIN) {
			$scope.cargando = true;
			var fechaFINSerializado = serializarFecha(fechaFIN).toJSON().substr(0, 10);
			interesadoSrv.getAll(fechaFINSerializado)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
					$scope.interesados = JSON.parse(x.replace(/\t/g, ' '));
					$scope.GetOK = true;
					if ($scope.interesados.length > 0)
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

		$scope.reseleccionar = function reseleccionar(filtro) {
			var inte = $filter('filter')($scope.interesados, filtro, false);
			inte = $filter('orderBy')(inte, 'fechaInteresado', true);
			if (typeof inte != 'undefined' && inte.length > 0)
				$scope.cargarInteresado(inte[0]);
		};

		$scope.obtenerInteresados($scope.fechaFIN);

		$scope.actualizarInteresados = function actualizarInteresados(fechaFINElegida) {
			if (fechaFINElegida !== '') {
				$scope.error = { hayError: false, errores: {} };
				$scope.actualizando = true;
				$scope.myStyle.cursor = 'wait';
				$scope.obtenerInteresados(fechaFINElegida);
			}
			else
				$scope.interesados = null;
		};

		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};

		$scope.cargarInteresado = function cargarInteresado(interesado) {
			$scope.interesadoSeleccionado = interesado;
			$scope.altaEvento = false;
			obtenerEventosPorInteresado(interesado.interesadoId);
		};

		$scope.irAinscripcion = function irAinscripcion(interesadoAInscribir) {
			estudianteSrv.exponerInscripcion(interesadoAInscribir);
		};

		$scope.irAcrearInteresado = function irAcrearInteresado() {
			interesadoSrv.exponerCreacion();
		};

		$scope.irAEdicionInteresado = function irAEdicionInteresado(interesadoAEditar) {
			interesadoSrv.exponerEdicion(interesadoAEditar);
		};

		var obtenerEventosPorInteresado = function obtenerEventosPorInteresado(interesadoId) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.getByInteresadoId(interesadoId)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
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

		var obtenerEventosFuturos = function obtenerEventosFuturos() {
			$scope.myStyle.cursor = 'wait';
			eventoSrv.getAll()
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
					seleccionarEventosFuturos(JSON.parse(x.replace(/\t/g, ' ')));
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		var seleccionarEventosFuturos = function seleccionarEventosFuturos(eventos) {
			eventos.forEach(eventoSrv.colocarVencimiento);
			$scope.eventosFuturos = $filter('filter')(eventos, function esFuturo(evento) {return evento.estadoFecha>=0;});
		};





		var agregarInteresadoEvento = function agregarInteresadoEvento(interesadoEvento) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.crear(interesadoEvento)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
					$scope.eventosFuturos = JSON.parse(x.replace(/\t/g, ' '));
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
					$scope.altaEvento = false;
					obtenerEventosPorInteresado(interesadoEvento.interesadoId);
				});
		};

		$scope.irAMostrarEventoFuturos = function irAMostrarEventoFuturos() {
			$scope.altaEvento = true;
			obtenerEventosFuturos();
		};

		$scope.irAAgregarInteresadoEvento = function irAAgregarInteresadoEvento(evento, interesado) {
			var interesadoEventoAAgregar = {
				'id': 0,
				'interesadoId': interesado.interesadoId,
				'eventoId': evento.id,
				'observacion': null,
				'inscripto': false,
				'asistente': false
			};
			agregarInteresadoEvento(interesadoEventoAAgregar);
		};

		$scope.interesadoEventoEditando=null;
		$scope.interesadoEventoEditandoOriginal=null;
		$scope.modalOpen=false;
		$scope.showModal = function showModal(interesadoEventoAEditar) {
			$scope.interesadoEventoEditandoOriginal=interesadoEventoAEditar;
			var interesadoEventoModificado = {
				'id': interesadoEventoAEditar.id,
				'interesadoId': interesadoEventoAEditar.interesadoId,
				'eventoId': interesadoEventoAEditar.eventoId,
				'observacion': interesadoEventoAEditar.observacion,
				'inscripto': interesadoEventoAEditar.inscripto,
				'asistente': interesadoEventoAEditar.asistente
			};
			$scope.interesadoEventoEditando=interesadoEventoModificado;
			$scope.modalOpen=true;
		};

		$scope.closeModal = function closeModal() {
			$scope.modalOpen=false;
		};

		$scope.actualizarObservacion = function actualizarObservacion(interesadoEventoAActualizar) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.actualizar(interesadoEventoAActualizar)
				.then(function () {
					$scope.interesadoEventoEditandoOriginal.observacion = interesadoEventoAActualizar.observacion;
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
					$scope.modalOpen=false;
				});
		};



	}
]);



