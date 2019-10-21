var legajosMod = angular.module('legajoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
legajosMod.component('pafLegajoDatosBasicos', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'components/legajoDatosBasicosTemp.html',
	bindings: {
		legajo : '<pafLegajo'
	}
});