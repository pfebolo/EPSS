'use strict';
var interesadoMod= angular.module('interesadoModulo'); // se obtiene el modulo interesadoModulo previamente creado (el modulo está creado previamente)


interesadoMod.controller('interesadoListaControlador',['$rootScope', '$scope', '$http', '$filter', 'interesadoSrv', 'estudianteSrv',
	function cargarInteresados($rootScope, $scope, $http, $filter,  interesadoSrv, estudianteSrv) {
		$scope.GetOK = true;
		$scope.cargando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.interesadoSeleccionado = null;



		var serializarFecha = function serializarFecha(fecha) {
			return new Date(fecha.substring(6, 10) + '-' + fecha.substring(3, 5) + '-' + fecha.substring(0, 2));
		};

		var deSerializarFecha = function deSerializarFecha(fecha) {
			var fechaBase = fecha.toJSON().substr(0, 10);
			return fechaBase.substr(8, 2) + '/' + fechaBase.substr(5, 2) + '/' + fechaBase.substr(0, 4);
		};

		$scope.fechaFIN = deSerializarFecha((new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000))));

		$scope.obtenerInteresados = function obtenerInteresados(fechaFIN) {
			$scope.cargando = true;
			var fechaFINSerializado = serializarFecha(fechaFIN).toJSON().substr(0, 10);
			interesadoSrv.getAll(fechaFINSerializado)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ ').replace(/\%"/g, '％ "'));
					$scope.interesados = JSON.parse(x.replace(/\t/g, ' '));
					$scope.GetOK = true;
					if ($scope.interesados.length > 0)
						$scope.cargarInteresado($scope.interesados[0]);
				})
				.catch(function () {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.obtenerInteresados($scope.fechaFIN);


		$scope.reseleccionar = function reseleccionar(filtro) {
			var inte = $filter('filter')($scope.interesados, filtro, false);
			inte = $filter('orderBy')(inte, 'fechaInteresado', true);
			if (typeof inte != 'undefined' && inte.length > 0)
				$scope.cargarInteresado(inte[0]);
		};


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


	}
]);



