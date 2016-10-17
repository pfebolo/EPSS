var EPSSApp = angular.module('EPSSApp', [
  'ngRoute',
  'GuitarraModulo',
  'legajoDigitalModulo',
  'alumnoModulo'
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
    //.otherwise({
    //  redirectTo: '/menu'
    //})
    ;
}]);