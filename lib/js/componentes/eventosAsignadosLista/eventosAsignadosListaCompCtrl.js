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

		this.$onInit = function () {
			// do all your initializations here.
			// create a local scope object for this component only.always update that scope with bindings.and use that in views also.
			


		};

		this.$onChanges = function (changesObj) {
			if (changesObj.interesado.currentValue!=null)
				obtenerEventos(changesObj.interesado.currentValue.interesadoId);
			else
				obtenerEventos(-1);
		};
	}
]);