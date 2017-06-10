var EPSSApp = angular.module('EPSSApp');

EPSSApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/interesadoLista', {
			templateUrl: 'Partials/interesadoLista.html',
			controller: 'interesadoListaControlador'
		})
		.when('/interesadoEdicion', {
			templateUrl: 'Partials/interesadoEdicion.html',
			controller: 'interesadoEdicionControlador'
		})
		.when('/inscriptoEdicion', {
			templateUrl: 'Partials/inscriptoEdicion.html',
			controller: 'inscriptoEdicionControlador'
		})
		.when('/inscriptoLista', {
			templateUrl: 'Partials/inscriptoLista.html',
			controller: 'inscriptoListaControlador'
		})
		.when('/legajoLista', {
			templateUrl: 'Partials/legajoLista.html',
			controller: 'legajoListaControlador'
		})
		.when('/legajoEdicion', {
			templateUrl: 'Partials/legajoEdicion.html',
			controller: 'legajoListaControlador'
		})
		.when('/coordinadorLista', {
			templateUrl: 'Partials/coordinadorLista.html',
			controller: 'coordinadorListaControlador'
		})
		.when('/cursoLista', {
			templateUrl: 'Partials/cursoLista.html',
			controller: 'cursoListaControlador'
		})
		.when('/grupoLista', {
			templateUrl: 'Partials/grupoLista.html',
			controller: 'grupoListaControlador'
		})
		//.otherwise({
		//  redirectTo: '/menu'
		//})
		;
}]);




EPSSApp.service('UserService', function UserService($http, $q) {
	return {
		getConfig: getConfig
	};

	function getConfig() {
		var defered = $q.defer();
		var promise = defered.promise;

		$http.get('data/config.json', { headers: { 'Accept': 'application/json' } })
			.success(function (data) {
				defered.resolve(data);
				console.log(data);
			})
			.error(function (err) {
				defered.reject(err);
			});

		return promise;
	}
});

EPSSApp.run(['$rootScope', 'UserService', function ($rootScope, UserService) {
	UserService
		.getConfig()
		.then(function (data) {
			$rootScope.config = data;
		})
		.catch(function () {
			$rootScope.config = { 'servidor': 'http://*:5000/' };
		});
}]);