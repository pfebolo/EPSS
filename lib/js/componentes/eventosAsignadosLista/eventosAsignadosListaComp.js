var interesadosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
interesadosMod.component('pafEventosAsignadosLista', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'lib/js/componentes/eventosAsignadosLista/eventosAsignadosListaTemp.html',
	bindings: {
		interesado : '<pafInteresado'
	},
	controller: 'eventosAsignadosListaControlador'
});