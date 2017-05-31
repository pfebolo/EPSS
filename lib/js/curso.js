var coordinadorMod = angular.module('cursoModulo');


coordinadorMod.controller('cursoListaControlador',['$rootScope', '$scope', '$http', 'UtilService',
	function CargarDivisiones($rootScope, $scope, $http, UtilService) {
		$scope.getCursosOK = false;
		$scope.getCoordinacionesOK = false;
		$scope.getGruposOK = false;
		var cargandoCursos = true;
		var cargandoCoordinaciones = true;
		var cargandoGrupos = true;
		$scope.cargando = cargandoCursos || cargandoCoordinaciones || cargandoGrupos;
		$scope.cursoSeleccionado = null;

		$http.get($scope.config.servidor + 'api/cursos')
			.success(function (data) {
				$scope.cursos = data;
				$scope.getCursosOK = true;
			})
			.error(function () {
				$scope.getCursosOK = false;
			})
			.finally(function () {
				cargandoCursos = false;
				$scope.cargando = cargandoCursos || cargandoCoordinaciones || cargandoGrupos;
			});

		$http.get($scope.config.servidor + 'api/coordinaciones')
			.success(function (data) {
				$scope.coordinaciones = data;
				$scope.getCoordinacionesOK = true;
			})
			.error(function () {
				$scope.getCoordinacionesOK = false;
			})
			.finally(function () {
				cargandoCoordinaciones = false;
				$scope.cargando = cargandoCursos || cargandoCoordinaciones || cargandoGrupos;
			});

		$http.get($scope.config.servidor + 'api/grupos')
			.success(function (data) {
				$scope.grupos = data;
				$scope.getGruposOK = true;
			})
			.error(function () {
				$scope.getGruposOK = false;
			})
			.finally(function () {
				cargandoGrupos = false;
				$scope.cargando = cargandoCursos || cargandoCoordinaciones || cargandoGrupos;
			});

		$scope.cargarGrupo = function cargarGrupo(curso) {
			$scope.cursoSeleccionado = curso;
		};

		$scope.selectedRow = null;
		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};


		$scope.alumnoPerteneceAlCurso = function filtrarCurso(alumno, cursoSeleccionado) {
			return (alumno != undefined && cursoSeleccionado != undefined && cursoSeleccionado.promocionId === alumno.promocionId && cursoSeleccionado.cuatrimestreId === alumno.cuatrimestreId && cursoSeleccionado.modoId === alumno.modoId && cursoSeleccionado.turnoId === alumno.turnoId && cursoSeleccionado.cursoId === alumno.cursoId);
		};

		$scope.filtrarAlumno = function filtrarAlumno(alumno) {
			var cursoSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return $scope.alumnoPerteneceAlCurso(alumno, cursoSeleccionado);
		};


		$scope.criteriaMatch = function (cursoSeleccionado) {
			return function (item) {
				return (item != undefined && cursoSeleccionado != undefined && cursoSeleccionado.promocionId === item.promocionId && cursoSeleccionado.cuatrimestreId === item.cuatrimestreId && cursoSeleccionado.modoId === item.modoId && cursoSeleccionado.turnoId === item.turnoId && cursoSeleccionado.cursoId === item.cursoId);
			};
		};

		$scope.indexChar = function (index) {
			return String.fromCharCode(64 + index);
		};

		$scope.obtenerCantidadAlumnos = function obtenerCantidadAlumnos(curso) {
			var x = $scope.grupos.filter($scope.filtrarAlumno, curso);
			return x.length;
		};



		$scope.obtenerAnioCursado = UtilService.obtenerAnioCursado;
		$scope.obtenerCuatrimestreCursado = UtilService.obtenerCuatrimestreCursado;
	}
]);