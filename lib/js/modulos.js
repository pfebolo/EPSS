//Sin dependencias
angular.module('directives', []);
angular.module('carreraModulo', []);
angular.module('cursoModulo', []);
angular.module('grupoModulo', []);
angular.module('coordinadorModulo', []);
angular.module('coordinacionModulo', []);
angular.module('estudianteModulo', []);
angular.module('legajoModulo', []);
angular.module('interesadoEventoModulo', []);
angular.module('lugarModulo', []);
//Con dependencias
angular.module('divisionModulo', ['carreraModulo','coordinadorModulo', 'coordinacionModulo','grupoModulo']);
angular.module('eventoModulo', ['interesadoEventoModulo','lugarModulo']); 
angular.module('interesadoModulo', ['directives','estudianteModulo','interesadoEventoModulo','eventoModulo']);
angular.module('incripcionModulo',['estudianteModulo']);
angular.module('inscriptoModulo', ['estudianteModulo','legajoModulo']);
//Principal
angular.module('EPSSApp', [
	'ngRoute',
	'carreraModulo',
	'cursoModulo',
	'interesadoModulo',
	'eventoModulo',
	'incripcionModulo',
	'inscriptoModulo',
	'legajoModulo',
	'coordinadorModulo',
	'grupoModulo',
	'divisionModulo'
]);
