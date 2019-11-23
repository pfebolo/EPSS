var interesadoMod = angular.module('interesadoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
interesadoMod.component('pafEventosPanel', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'lib/js/componentes/eventosPanel/eventosPanelTemp.html',
	bindings: {
		interesado : '<pafInteresado'
		//,altaEvento: '<pafAltaEvento'
		//,irAMostrarEventoFuturos: '<pafIrAMostrarEventoFuturos'
		//,refrescarEventosAsignados: '<pafRefrescarEventosAsignados'
		//,irAAgregarInteresadoEvento: '<pafIrAAgregarInteresadoEvento'
	},
	controller: 'eventosPanelControlador'
});