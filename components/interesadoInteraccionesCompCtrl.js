var interesadosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

interesadosMod.controller('interesadoInteraccionesControlador', ['$scope',
	function ($scope) {
		var self = this;
		this.$onInit = function () {
			// do all your initializations here.
			// create a local scope object for this component only.always update that scope with bindings.and use that in views also.
			
			self.ahora = Math.floor(Date.now() / 1000); 



		};
	}
]);