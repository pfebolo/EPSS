var legajosMod = angular.module('legajoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
legajosMod.component('pafLegajoEstudios', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'lib/js/componentes/legajoEstudiosTemp.html',
	bindings: {
		legajo : '<pafLegajo'
	}
});