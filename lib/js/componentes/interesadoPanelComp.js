var legajosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
legajosMod.component('pafInteresadoPanel', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'lib/js/componentes/interesadoPanelTemp.html',
	bindings: {
		interesado : '<pafInteresado',
		OnDeleted : '<pafDeleted', //Evento que se dispara al borrar un Interesado
		readOnly : '<pafReadOnly' //Evento que se dispara al borrar un Interesado
	},
	controller: 'interesadoPanelControlador'
});