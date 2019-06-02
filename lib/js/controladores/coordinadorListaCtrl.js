var coordinadorMod = angular.module('coordinadorModulo');


coordinadorMod.controller('coordinadorListaControlador',['$rootScope', '$scope', '$http', '$filter', 'coordinadorSrv',
	function gestionarCoordinadores($rootScope, $scope, $http, $filter,coordinadorSrv) {
		$scope.GetCoordinadoresOK = false;
		$scope.cargando = true;

		$http.get($scope.config.servidor + 'api/coordinadores')
			.then(function (response) {
				//$scope.coordinadores = data;
				$scope.coordinadores = $filter('orderBy')(response.data, 'nombre');
				$scope.coordinadores = $filter('filter')($scope.coordinadores,{comentarios:'!Desactivo'});
				agruparCoordinadores($scope.coordinadores);
				$scope.GetCoordinadoresOK = true;
			})
			.catch(function () {
				$scope.GetCoordinadoresOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

		var agruparCoordinadores = function agruparCoordinadores(coordinadores) {
			$scope.coordinadoresAgupados = [];
			for (var i = 0; i < coordinadores.length; i = i + 4)
				$scope.coordinadoresAgupados.push(coordinadores.slice(i, i + 4));
		};


		//INI-Edicion de Coordinador.
		//Modal Editar
		$scope.coordinadorEditando = null;
		$scope.modalCoordinadorOpen = false;
		$scope.showModalCoordinador = function showModalCoordinador(coordinador) {
			var CoordinadorBase = {
				'coordinadorId': coordinador.coordinadorId,
				'nombre': coordinador.nombre,
				'fotoPath': coordinador.fotoPath,
				'telefonoFijo': coordinador.telefonoFijo,
				'telefonoCelular': coordinador.telefonoCelular,
				'email': coordinador.email,
				'comentarios': coordinador.comentarios,
				'activo': coordinador.activo
			};
			$scope.coordinadorEditando = CoordinadorBase;
			$scope.modalCoordinadorOpen = true;
		};

		$scope.closeModalCoordinador = function closeModalCoordinador() {
			$scope.modalCoordinadorOpen = false;
		};
		//Fin Modal Editar.

		$scope.agregarCoordinador = function agregarCoordinador(CoordinadorAAgregar) {
			$scope.myStyle.cursor = 'wait';
			coordinadorSrv.agregarCoordinador(CoordinadorAAgregar)
				.then(function () {
					$scope.coordinadores.push(CoordinadorAAgregar);
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'auto';
					$scope.modalCoordinadorOpen = false;
				});
		};

		$scope.actualizarCoordinador = function actualizarCoordinador(CoordinadorAActualizar) {
			$scope.myStyle.cursor = 'wait';
			coordinadorSrv.agregarCoordinador(CoordinadorAActualizar)
				.then(function () {
					$scope.coordinadores.push(CoordinadorAActualizar);
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'auto';
					$scope.modalCoordinadorOpen = false;
				});
		};		

		$scope.eliminarCoordinador = function eliminarCoordinador(coordinadorAEliminar) {
			$scope.myStyle.cursor = 'wait';
			coordinadorSrv.eliminarCoordinador(coordinadorAEliminar.coordinadorId, coordinadorAEliminar.coordinadorInteresadoId)
				.then(function () {
					cargarCoordinadores(coordinadorAEliminar.coordinadorId);
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'auto';
					$scope.modalCoordinadorOpen = false;
				});
		};


		//FIN-Edición de Coordinador

	}
]);