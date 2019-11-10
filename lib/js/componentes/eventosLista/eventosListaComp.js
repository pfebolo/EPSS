var interesadosMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
interesadosMod.component('pafEventosLista', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'lib/js/componentes/eventosLista/eventosListaTemp.html',
	bindings: {
		//eventosFuturos : '<pafEventosFuturos',
		OnEventoSeleccionado : '<pafEventoSeleccionado'
	},
	controller: 'eventosListaControlador'
});