var legajosMod = angular.module('legajoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
legajosMod.component('pafLegajoInformes', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'lib/js/componentes/legajoInformesTemp.html',
	bindings: {
		informes : '<pafInformes',
		irACrear :'<pafCrear',
		showModal : '<pafShow',
		showModalEditar : '<pafShowEditar',
		esEditable : '<pafEsEditable'
	}
});