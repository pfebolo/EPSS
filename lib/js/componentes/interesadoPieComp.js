var legajosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
legajosMod.component('pafInteresadoPie', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'lib/js/componentes/interesadoPieTemp.html',
	bindings: {
		interesado : '<pafInteresado'
	}
});