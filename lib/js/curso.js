var coordinadorMod = angular.module("cursoModulo", []);


coordinadorMod.controller("cursoListaControlador",
		function CargarDivisiones($rootScope, $scope, $http) {
		$scope.getCursosOK=false;
		$scope.getCoordinacionesOK=false;
		$scope.getGruposOK=false;
		$scope.cargando=true;
		$scope.cursoSeleccionado = null;

		$http.get($scope.config.servidor + 'api/cursos')
		  .success(function (data) {
				$scope.cursos = data;
				$scope.getCursosOK=true;
			})
			.error(function (data) {
				$scope.getCursosOK=false;
			})
			.finally(function() {
				$scope.cargando=false;
			});

			$http.get($scope.config.servidor + 'api/coordinaciones')
		  .success(function (data) {
				$scope.coordinaciones = data;
				$scope.getCoordinacionesOK=true;
			})
			.error(function (data) {
				$scope.getCoordinacionesOK=false;
			})
			.finally(function() {
				$scope.cargando=false;
			});

			$http.get($scope.config.servidor + 'api/grupos')
		  .success(function (data) {
				$scope.grupos = data;
				$scope.getGruposOK=true;
			})
			.error(function (data) {
				$scope.getGruposOK=false;
			})
			.finally(function() {
				$scope.cargando=false;
			});
			
			$scope.cargarGrupo = function cargarGrupo(curso) {
				$scope.cursoSeleccionado = curso;
			};

			$scope.selectedRow = null;
			$scope.setClickedRow = function setClickedRow(index) {
				$scope.selectedRow= index; 
			};
			
			$scope.criteriaMatch = function( cursoSeleccionado ) {
				return function( item ) {
					//return 1===0;
					
					return (item != undefined && cursoSeleccionado != undefined && cursoSeleccionado.promocionId===item.promocionId && cursoSeleccionado.cuatrimestreId===item.cuatrimestreId &&  cursoSeleccionado.modoId===item.modoId && cursoSeleccionado.turnoId===item.turnoId && cursoSeleccionado.cursoId===item.cursoId)
				};
			};
			
			$scope.indexChar = function (index) {
				return String.fromCharCode(64 + index);
};
		}
)