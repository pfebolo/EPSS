'use strict';
var interesadoMod = angular.module('interesadoModulo'); // se obtiene el modulo interesadoModulo previamente creado (el modulo está creado previamente)


interesadoMod.controller('interesadoFichaControlador', ['$scope', '$location', 'interesadoSrv',
	function cargarInteresados($scope, $location,  interesadoSrv) {
		$scope.GetOK = true;
		$scope.cargando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.interesadoSeleccionado = null;
		$scope.InteresadoId = $location.search().id;



		$scope.obtenerInteresados = function obtenerInteresados() {
			$scope.cargando = true;
			interesadoSrv.getByInteresadoId($scope.InteresadoId)
				.then(function (dataResponseOK) {
					$scope.interesadoSeleccionado = dataResponseOK;
					$scope.GetOK = true;
				})
				.catch(function () {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'auto';
				});
		};


		$scope.obtenerInteresados();


	}
]);



