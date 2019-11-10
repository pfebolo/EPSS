var legajosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
legajosMod.component('pafInteresadoBase', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'components/interesadoBaseTemp.html',
	bindings: {
		interesado : '<pafInteresado'
	}
});