var interesadosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

interesadosMod.controller('eventosListaControlador', ['$filter','eventoSrv',
	function ($filter,eventoSrv) {
		var self = this;

		self.eventosFuturos = null;

		var obtenerEventosFuturos = function obtenerEventosFuturos() {
			//$scope.myStyle.cursor = 'wait';
			eventoSrv.getAll()
				.then(function (dataResponseOK) {
					seleccionarEventosFuturos(dataResponseOK);
				})
				.catch(function (responseError) {
					//$scope.error.errores = responseError.mensajes;
					//$scope.error.hayError = true;
				})
				.finally(function () {
					//$scope.myStyle.cursor = 'auto';
				});
		};

		var seleccionarEventosFuturos = function seleccionarEventosFuturos(eventos) {
			eventos.forEach(eventoSrv.colocarVencimiento);
			self.eventosFuturos = $filter('filter')(eventos, function esFuturo(evento) { return evento.estadoFecha >= 0; });
		};

		this.$onInit = function () {
			// do all your initializations here.
			// create a local scope object for this component only.always update that scope with bindings.and use that in views also.
			
			obtenerEventosFuturos();

		};

	}
]);