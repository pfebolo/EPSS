var interesadosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

interesadosMod.controller('interesadoInteraccionesControlador', ['$scope', '$q', 'interesadoSrv',
	function ($scope,$q, interesadoSrv) {
		var self = this;

		var ObtenerIntereaccionesXInteresado = function ObtenerIntereaccionesXInteresado(InteresadoId) {
			var deferred = $q.defer();
			interesadoSrv.getInteraccionesPorInteresado(InteresadoId)
				.then(function (dataResponseOK) {
					deferred.resolve(dataResponseOK);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
					deferred.reject(responseError);
				});
			return deferred.promise;
		};

		this.cargar = function cargar(interesadoId) {
			ObtenerIntereaccionesXInteresado(interesadoId)
				.then(function (response) {
					self.interacciones = response;
				})
				.catch(function () {
					self.interacciones = [];
				});
		};

		this.$onInit = function () {
			// do all your initializations here.
			// create a local scope object for this component only.always update that scope with bindings.and use that in views also.
			
			self.ahora = Math.floor(Date.now() / 1000);

			self.intereacciones =  [];

			//INI-Interacción de un Interesado.
			//Modal Interacción.
			self.interaccionEditando = null;
			self.modalInteraccionOpen = false;

			self.showModalInteraccion = function showModalInteraccion(interesado) {
				var fechaId = new Date();
				var InteraccionBase = {
					'interesadoId': interesado.interesadoId,
					'interaccionInteresadoId': Math.floor(fechaId.getTime() / 1000),
					'fecha': fechaId.toJSON(), 
					'comentario': null
				};
				self.interaccionEditando = InteraccionBase;
				self.modalInteraccionOpen = true;
			};

			self.closeModalInteraccion = function closeModalInteraccion() {
				self.modalInteraccionOpen = false;
			};
			//Fin Modal Interacción.

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

			self.agregar = function agregar(InteraccionAAgregar) {
				//$scope.myStyle.cursor = 'wait';
				interesadoSrv.agregarInteraccion(InteraccionAAgregar)
					.then(function () {
						self.interacciones.push(InteraccionAAgregar);
					})
					.catch(function (responseError) {
						//$scope.error.errores = responseError.mensajes;
						//$scope.error.hayError = true;
					})
					.finally(function () {
						//$scope.myStyle.cursor = 'auto';
						self.modalInteraccionOpen = false;
					});
			};

		};

		this.$onChanges = function (changesObj) {
			if (changesObj.interesado.currentValue!=null)
				self.cargar(changesObj.interesado.currentValue.interesadoId);
		};
	}
]);