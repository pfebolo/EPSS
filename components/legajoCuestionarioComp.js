var legajosMod = angular.module('legajoModulo');  //Instancia el módulo (o obtiene el módulo anteriormente creado)

// Registrar un componente
legajosMod.component('pafLegajoCuestionario', {  // This name is what AngularJS uses to match to the  element.
	templateUrl: 'components/legajoCuestionarioTemp.html',
	bindings: {
		cuestionario : '<pafCuestionario'
		// indiceActivo : '=pafIndiceActivo'
	},
	controller: function pafLegajoCuestionarioController() { this.indiceActivo = 0; }
});