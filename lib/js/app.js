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
      templateUrl: 'partials/guitarras.html',
      controller: 'GuitarrasControlador'
    })
    .when('/guitarraDetalle/:guitarraSeleccionada', {
      templateUrl: 'partials/GuitarraDetalle.html',
      controller: 'GuitarraDetalleControlador'
    })
    .when('/legajoDigital', {
      templateUrl: 'partials/legajoDigitalModalidades.html',
      controller: 'legajoDigitalModalildadesControlador'
    })
    .when('/alumnoLista', {
      templateUrl: 'partials/alumnoLista.html',
      controller: 'alumnoListaControlador'
    })
    .when('/LegajosListaDetalle', {
      templateUrl: 'partials/LegajosListaDetalle.html',
      controller: 'LegajoListaDetalleControlador'
    })
    .when('/CoordinadorLista', {
      templateUrl: 'partials/coordinadorLista.html',
      controller: 'coordinadorListaControlador'
    })
    .when('/cursoLista', {
      templateUrl: 'partials/cursoLista.html',
      controller: 'cursoListaControlador'
    })
    .when('/grupoLista', {
      templateUrl: 'partials/grupoLista.html',
      controller: 'grupoListaControlador'
    })
    //.otherwise({
    //  redirectTo: '/menu'
    //})
    ;
}]);