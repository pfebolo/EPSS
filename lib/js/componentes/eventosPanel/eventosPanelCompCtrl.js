var interesadoMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

interesadoMod.controller('eventosPanelControlador', ['$scope', 'interesadoEventoSrv',
	function ($scope,interesadoEventoSrv) {
		var self = this;
		self.altaEvento = false;
		self.refrescarEventosAsignados={};

		self.mostrarEventosFuturos = function mostrarEventosFuturos() {
			self.altaEvento = true;
			self.refrescarEventosAsignados = {}; //Permite forzar el refresco del componenete
		};

		var agregarInteresadoEvento = function agregarInteresadoEvento(interesadoEvento) {
			//$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.crear(interesadoEvento)
				.then(function (dataResponseOK) {
					self.refrescarEventosAsignados = self.interesado ;  //Señal para que el componente de eventosAsignados refresque las lista
				})
				.catch(function (responseError) {
					//$scope.error.errores = responseError.mensajes;
					//$scope.error.hayError = true;
				})
				.finally(function () {
					//$scope.myStyle.cursor = 'auto';
					self.altaEvento = false;
				});
		};

		self.agregar = function agregar(evento) {
			var interesadoEventoAAgregar = {
				'id': 0,
				'interesadoId': self.interesado.interesadoId,
				'eventoId': evento.id,
				'observacion': null,
				'inscripto': false,
				'asistente': false
			};
			agregarInteresadoEvento(interesadoEventoAAgregar);
		};

		this.$onInit = function () {
			// do all your initializations here.
			// create a local scope object for this component only.always update that scope with bindings.and use that in views also.
		};

		this.$onChanges = function (changesObj) {
			//if (changesObj.eventos.currentValue!=null)
				//self.cargar(changesObj.eventos.currentValue.eventosId);
			self.altaEvento = false;
		};
	}
]);	