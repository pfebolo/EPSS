var interesadosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

interesadosMod.controller('interesadoInteraccionesControlador', ['$scope', 'interesadoSrv',
	function ($scope,interesadoSrv) {
		var self = this;
		this.$onInit = function () {
			// do all your initializations here.
			// create a local scope object for this component only.always update that scope with bindings.and use that in views also.
			
			self.ahora = Math.floor(Date.now() / 1000); 

			self.eliminar = function eliminar(interaccionAEliminar) {
				//$scope.myStyle.cursor = 'wait';
				interesadoSrv.eliminarInteraccion(interaccionAEliminar.interesadoId, interaccionAEliminar.interaccionInteresadoId)
					.then(function () {
						self.cargar(interaccionAEliminar.interesadoId);
					})
					.catch(function (responseError) {
						//$scope.error.errores = responseError.mensajes;
						//$scope.error.hayError = true;
					})
					.finally(function () {
						//$scope.myStyle.cursor = 'auto';
					});
			};

		};
	}
]);