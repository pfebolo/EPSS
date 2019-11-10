var interesadosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

interesadosMod.controller('interesadoPanelControlador', ['$scope', 'interesadoSrv', 'estudianteSrv', 
	function ($scope, interesadoSrv, estudianteSrv) {
		var self = this;

		this.irAEdicion = function irAEdicion(interesadoAEditar) {
			interesadoSrv.exponerEdicion(interesadoAEditar);
		};

		this.irAinscripcion = function irAinscripcion(interesadoAInscribir) {
			estudianteSrv.exponerInscripcion(interesadoAInscribir);
		};

		var eliminarInteresado = function eliminarInteresado(interesadoAEliminar) {
			//$scope.myStyle.cursor = 'wait';
			//$scope.interesadosFiltradosYOrdenados = null; //Asegura que se recargará la lista base a mostrar
			interesadoSrv.eliminar(interesadoAEliminar.interesadoId)
				.then(function () {
					self.OnDeleted();  //dispara evento para que el contenedor del panel tomo conciencia del borrado
				})
				.catch(function (responseError) {
					//$scope.error.errores = responseError.mensajes;
					//$scope.error.hayError = true;
				})
				.finally(function () {
					//$scope.myStyle.cursor = 'auto';
				});
		};

		//Modal Eliminar Interesado
		var eliminarInteresadoPINSecreto = interesadoSrv.pinEliminacion;
		var interesadoAEliminar = null;
		this.eliminarInteresadoPIN = null;
		this.eliminarInteresadoPINErroneo = false;
		this.modalEliminarInteresadoOpen = false;
		this.showModalEliminarInteresado = function showModalEliminarInteresado(interesadoSeleccionado) {
			interesadoAEliminar = interesadoSeleccionado;
			this.modalEliminarInteresadoOpen = true;
		};

		this.closeModalEliminarInteresado = function closeModalEliminarInteresado(eliminarInteresadoPIN) {
			if (eliminarInteresadoPINSecreto === btoa(eliminarInteresadoPIN)) {
				eliminarInteresado(interesadoAEliminar);
				this.modalEliminarInteresadoOpen = false;
			} else if (eliminarInteresadoPIN === 'Cancelar')
				this.modalEliminarInteresadoOpen = false;
			else
				this.eliminarInteresadoPINErroneo = true;
			this.eliminarInteresadoPIN = null;
		};
		//Fin Modal Eliminar Interesado

		this.$onInit = function () {
			// do all your initializations here.
			// create a local scope object for this component only.always update that scope with bindings.and use that in views also.
			
		};

		this.$onChanges = function (changesObj) {
			//if (changesObj.interesado.currentValue!=null)
				//self.cargar(changesObj.interesado.currentValue.interesadoId);
		};
	}
]);