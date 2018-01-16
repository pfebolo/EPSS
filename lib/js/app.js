var EPSSApp = angular.module('EPSSApp');

EPSSApp.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');
	$routeProvider
		.when('/interesadoLista', {
			templateUrl: 'Partials/interesadoLista.html',
			controller: 'interesadoListaControlador'
		})
		.when('/interesadoEdicion', {
			templateUrl: 'Partials/interesadoEdicion.html',
			controller: 'interesadoEdicionControlador'
		})
		.when('/eventoLista', {
			templateUrl: 'Partials/eventoLista.html',
			controller: 'eventoListaControlador'
		})
		.when('/eventoEdicion', {
			templateUrl: 'Partials/eventoEdicion.html',
			controller: 'eventoEdicionControlador'
		})
		.when('/inscriptoLista', {
			templateUrl: 'Partials/inscriptoLista.html',
			controller: 'inscriptoListaControlador'
		})
		.when('/inscriptoEdicion', {
			templateUrl: 'Partials/inscriptoEdicion.html',
			controller: 'inscriptoEdicionControlador'
		})
		.when('/legajoLista', {
			templateUrl: 'Partials/legajoLista.html',
			controller: 'legajoListaControlador'
		})
		.when('/legajoEdicion', {
			templateUrl: 'Partials/legajoEdicion.html',
			controller: 'legajoEdicionControlador'
		})
		.when('/coordinadorLista', {
			templateUrl: 'Partials/coordinadorLista.html',
			controller: 'coordinadorListaControlador'
		})
		.when('/cursoLista', {
			templateUrl: 'Partials/cursoLista.html',
			controller: 'cursoListaControlador'
		})
		.when('/divisionLista', {
			templateUrl: 'Partials/divisionLista.html',
			controller: 'divisionListaControlador'
		})
		.when('/divisionEdicion', {
			templateUrl: 'Partials/divisionEdicion.html',
			controller: 'divisionEdicionControlador'
		})
		.when('/grupoEdicion', {
			templateUrl: 'Partials/grupoEdicion.html',
			controller: 'grupoEdicionControlador'
		})
		.when('/grupoActaVolante', {
			templateUrl: 'Partials/grupoActaVolante.html',
			controller: 'grupoActaVolanteControlador'
		})
		.when('/grupoRegAsistencia', {
			templateUrl: 'Partials/grupoRegAsistencia.html',
			controller: 'grupoRegAsistenciaControlador'
		})
		//.otherwise({
		//  redirectTo: '/menu'
		//})
		;
}]);




EPSSApp.service('UserService', function UserService($http, $q, $rootScope) {
	var UserService = {};
	
	UserService.getConfig = function getConfig() {
		var defered = $q.defer();
		var promise = defered.promise;

		$http.get('data/config.json', { headers: { 'Accept': 'application/json' } })
			.then(function (response) {
				defered.resolve(response.data);
			})
			.catch(function (response) {
				defered.reject(response);
			});

		return promise;
	};

	UserService.cargarConfig = function cargarConfig(data) {
		$rootScope.config = data;
	};
	
	UserService.cargarConfigPorOmision = function cargarConfigPorOmision(data) {
		$rootScope.config = { 'servidor': 'http://*:5000/', 'PIN': 10000 };
	};

	return UserService;

});

EPSSApp.run(['UserService', function (UserService) {

	UserService
		.getConfig()
			.then(UserService.cargarConfig)
			.catch(UserService.cargarConfigPorOmision);
}]);