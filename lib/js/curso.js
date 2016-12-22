var coordinadorMod = angular.module("cursoModulo", []);


coordinadorMod.controller("cursoListaControlador",
		function CargarDivisiones($scope, $http) {
		$scope.getCursosOK=false;
		$scope.getCoordinacionesOK=false;
		$scope.getGruposOK=false;
		$scope.cargando=true;
		$scope.cursoSeleccionado = null;

		$http.get('http://localhost:5000/api/cursos')
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

			$http.get('http://localhost:5000/api/coordinaciones')
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

			$http.get('http://localhost:5000/api/grupos')
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
		}
)