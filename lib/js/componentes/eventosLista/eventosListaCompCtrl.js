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

			// self.ahora = Math.floor(Date.now() / 1000);

			// self.intereacciones =  [];

			//INI-Interacción de un Interesado.
			//Modal Interacción.
			// self.interaccionEditando = null;
			// self.modalInteraccionOpen = false;

			// self.showModalInteraccion = function showModalInteraccion(interesado) {
			// 	var fechaId = new Date();
			// 	var InteraccionBase = {
			// 		'interesadoId': interesado.interesadoId,
			// 		'interaccionInteresadoId': Math.floor(fechaId.getTime() / 1000),
			// 		'fecha': fechaId.toJSON(), 
			// 		'comentario': null
			// 	};
			// 	self.interaccionEditando = InteraccionBase;
			// 	self.modalInteraccionOpen = true;
			// };

			// self.closeModalInteraccion = function closeModalInteraccion() {
			// 	self.modalInteraccionOpen = false;
			// };
			//Fin Modal Interacción.

			// self.eliminar = function eliminar(interaccionAEliminar) {
			// 	//$scope.myStyle.cursor = 'wait';
			// 	interesadoSrv.eliminarInteraccion(interaccionAEliminar.interesadoId, interaccionAEliminar.interaccionInteresadoId)
			// 		.then(function () {
			// 			self.cargar(interaccionAEliminar.interesadoId);
			// 		})
			// 		.catch(function (responseError) {
			// 			//$scope.error.errores = responseError.mensajes;
			// 			//$scope.error.hayError = true;
			// 		})
			// 		.finally(function () {
			// 			//$scope.myStyle.cursor = 'auto';
			// 		});
			// };

			// self.agregar = function agregar(InteraccionAAgregar) {
			// 	//$scope.myStyle.cursor = 'wait';
			// 	interesadoSrv.agregarInteraccion(InteraccionAAgregar)
			// 		.then(function () {
			// 			self.interacciones.push(InteraccionAAgregar);
			// 		})
			// 		.catch(function (responseError) {
			// 			//$scope.error.errores = responseError.mensajes;
			// 			//$scope.error.hayError = true;
			// 		})
			// 		.finally(function () {
			// 			//$scope.myStyle.cursor = 'auto';
			// 			self.modalInteraccionOpen = false;
			// 		});
			// };

		};

		this.$onChanges = function (changesObj) {
			// if (changesObj.interesado.currentValue!=null)
			// 	self.cargar(changesObj.interesado.currentValue.interesadoId);
		};
	}
]);