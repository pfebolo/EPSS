var GuitarApp = angular.module('GuitarApp', [
  'ngRoute',
  'GuitarraModulo',
  'legajoDigitalModulo'
]);



/*GuitarApp.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Request-With']
}])
*/



GuitarApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
    when('/guitarras', {
      templateUrl: 'partials/guitarras.html',
      controller: 'GuitarrasControlador'
    })
    .when('/menu', {
      templateUrl: 'partials/menu.html',
      controller: 'MenuControlador'
    })
    .when('/guitarraDetalle/:guitarraSeleccionada', {
      templateUrl: 'partials/GuitarraDetalle.html',
      controller: 'GuitarraDetalleControlador'
    })
    .when('/legajoDigital', {
      templateUrl: 'partials/legajoDigitalModalidades.html',
      controller: 'modalidadesCControlador'
    })
    //.otherwise({
    //  redirectTo: '/menu'
    //})
    ;
}]);