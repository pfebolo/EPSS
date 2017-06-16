//Sin dependencias
angular.module('directives', []);
angular.module('grupoModulo', []);
angular.module('cursoModulo', []);
angular.module('coordinadorModulo', []);
angular.module('estudianteModulo', []);
angular.module('legajoModulo', []);
angular.module('eventoModulo', []); 
//Con dependencias
angular.module('interesadoModulo', ['directives','estudianteModulo']);
angular.module('incripcionModulo',['estudianteModulo']);
angular.module('inscriptoModulo', ['estudianteModulo','legajoModulo']);
//Principal
angular.module('EPSSApp', [
	'ngRoute',
	'interesadoModulo',
	'eventoModulo',
	'incripcionModulo',
	'inscriptoModulo',
	'legajoModulo',
	'coordinadorModulo',
	'grupoModulo',
	'cursoModulo'
]);