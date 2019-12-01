var interesadosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

interesadosMod.controller('eventosAsignadosListaControlador', ['eventoSrv','interesadoEventoSrv',
	function (eventoSrv,interesadoEventoSrv) {
		var self = this;

		self.interesadosEventos = [];

		var colocarVencimiento = function colocarVencimiento(item) {
			item.evento.estadoFecha = eventoSrv.calcularVencimiento(item.evento.fecha); //positivo=Futuro 0=Hoy negativo=pasado
		};


		var obtenerEventos = function obtenerEventos(interesadoId) {
			//$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.getByInteresadoId(interesadoId)
				.then(function (dataResponseOK) {
					var intEvt = dataResponseOK;
					if (intEvt.length > 0) {
						intEvt.forEach(colocarVencimiento);
					}
					self.interesadosEventos = intEvt;
				})
				.catch(function (responseError) {
					//$scope.error.errores = responseError.mensajes;
					//$scope.error.hayError = true;
				})
				.finally(function () {
					//$scope.myStyle.cursor = 'auto';
				});
		};

		//Observación sobre la invitación a un evento.
		//Modal Observación sobre la invitación a un evento.
		self.interesadoEventoEditando = null;
		self.interesadoEventoEditandoOriginal = null;
		self.modalInvitacionObservacionOpen = false;
		self.showModalInvitacionObservacion = function showModalInvitacionObservacion(interesadoEventoAEditar) {
			self.interesadoEventoEditandoOriginal = interesadoEventoAEditar;
			var interesadoEventoModificado = {
				'id': interesadoEventoAEditar.id,
				'interesadoId': interesadoEventoAEditar.interesadoId,
				'eventoId': interesadoEventoAEditar.eventoId,
				'observacion': interesadoEventoAEditar.observacion,
				'inscripto': interesadoEventoAEditar.inscripto,
				'asistente': interesadoEventoAEditar.asistente,
				'evento': interesadoEventoAEditar.evento
			};
			self.interesadoEventoEditando = interesadoEventoModificado;
			self.modalInvitacionObservacionOpen = true;
		};

		self.closeModalInvitacionObservacion = function closeModalInvitacionObservacion() {
			self.modalInvitacionObservacionOpen = false;
		};
		//Fin Modal Observación sobre la invitación a un evento.

		self.actualizarObservacion = function actualizarObservacion(interesadoEventoAActualizar) {
			//$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.actualizar(interesadoEventoAActualizar)
				.then(function () {
					self.interesadoEventoEditandoOriginal.observacion = interesadoEventoAActualizar.observacion;
				})
				.catch(function (responseError) {
					//$scope.error.errores = responseError.mensajes;
					//$scope.error.hayError = true;
				})
				.finally(function () {
					//$scope.myStyle.cursor = 'auto';
					self.modalInvitacionObservacionOpen = false;
				});
		};
		//Observación sobre la invitación a un evento.

		this.$onInit = function () {
			// do all your initializations here.
			// create a local scope object for this component only.always update that scope with bindings.and use that in views also.
			


		};

		this.$onChanges = function (changesObj) {

			if (changesObj.hasOwnProperty('interesado') && changesObj.interesado.currentValue!=null)
				obtenerEventos(changesObj.interesado.currentValue.interesadoId);
			else if (changesObj.hasOwnProperty('refrescar') && changesObj.refrescar.currentValue!=null && changesObj.refrescar.currentValue.hasOwnProperty('interesadoId')) {
				obtenerEventos(changesObj.refrescar.currentValue.interesadoId);
			}
			else
				obtenerEventos(-1);
		};
	}
]);