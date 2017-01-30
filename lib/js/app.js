var EPSSApp = angular.module('EPSSApp', [
  'ngRoute',
  'GuitarraModulo',
  'legajoDigitalModulo',
  'alumnoModulo',
  'LegajosModulo',
  'coordinadorModulo',
  'grupoModulo',
  'cursoModulo'
]);

EPSSApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
    when('/guitarras', {
      templateUrl: 'Partials/guitarras.html',
      controller: 'GuitarrasControlador'
    })
    .when('/guitarraDetalle/:guitarraSeleccionada', {
      templateUrl: 'Partials/GuitarraDetalle.html',
      controller: 'GuitarraDetalleControlador'
    })
    .when('/legajoDigital', {
      templateUrl: 'Partials/legajoDigitalModalidades.html',
      controller: 'legajoDigitalModalildadesControlador'
    })
    .when('/alumnoLista', {
      templateUrl: 'Partials/alumnoLista.html',
      controller: 'alumnoListaControlador'
    })
    .when('/LegajosListaDetalle', {
      templateUrl: 'Partials/LegajosListaDetalle.html',
      controller: 'LegajoControlador'
    })
    .when('/LegajoActualizar', {
      templateUrl: 'Partials/LegajoActualizar.html',
      controller: 'LegajoControlador'
    })
    .when('/CoordinadorLista', {
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




EPSSApp.service('UserService', function UserService ($http, $q) {  
    return {
        getConfig: getConfig
    }

    function getConfig () {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('data/config.json',{headers: { 'Accept': 'application/json' }})
            .success(function(data) {
                defered.resolve(data);
                console.log(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }
});

EPSSApp.run(['$rootScope', 'UserService', function ($rootScope, UserService) {
  UserService
  .getConfig()
  .then(function(data) {
            $rootScope.config = data;
        })
        .catch(function(err) {
            $rootScope.config = { "servidor": "http://*:5000/" };
        })
}]);