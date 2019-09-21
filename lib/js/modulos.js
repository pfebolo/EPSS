//Sin dependencias
angular.module('directives', []);
angular.module('carreraModulo', []);
angular.module('cursoModulo', []);
angular.module('coordinadorModulo', []);
angular.module('coordinacionModulo', []);
angular.module('estudianteModulo', []);
angular.module('legajoModulo', []);
angular.module('interesadoEventoModulo', []);
angular.module('lugarModulo', []);
angular.module('dispositivoModulo', []);
//Con dependencias
angular.module('grupoModulo', ['legajoModulo']);
angular.module('divisionModulo', ['directives', 'carreraModulo','coordinadorModulo', 'coordinacionModulo','grupoModulo','dispositivoModulo']);
angular.module('informeModulo', ['directives','coordinadorModulo','legajoModulo']);
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
	'divisionModulo',
	'informeModulo'
]);
