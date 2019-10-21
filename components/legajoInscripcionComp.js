var legajosMod = angular.module('legajoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
legajosMod.component('pafLegajoInscripcion', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'components/legajoInscripcionTemp.html',
	bindings: {
		legajo : '<pafLegajo'
	}
});