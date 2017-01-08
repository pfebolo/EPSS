var coordinadorMod = angular.module("cursoModulo", []);


coordinadorMod.controller("cursoListaControlador",
	function CargarDivisiones($rootScope, $scope, $http) {
		$scope.getCursosOK = false;
		$scope.getCoordinacionesOK = false;
		$scope.getGruposOK = false;
		$scope.cargando = true;
		$scope.cursoSeleccionado = null;

		$http.get($scope.config.servidor + 'api/cursos')
			.success(function (data) {
				$scope.cursos = data;
				$scope.getCursosOK = true;
			})
			.error(function (data) {
				$scope.getCursosOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

		$http.get($scope.config.servidor + 'api/coordinaciones')
			.success(function (data) {
				$scope.coordinaciones = data;
				$scope.getCoordinacionesOK = true;
			})
			.error(function (data) {
				$scope.getCoordinacionesOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

		$http.get($scope.config.servidor + 'api/grupos')
			.success(function (data) {
				$scope.grupos = data;
				$scope.getGruposOK = true;
			})
			.error(function (data) {
				$scope.getGruposOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});

		$scope.cargarGrupo = function cargarGrupo(curso) {
			$scope.cursoSeleccionado = curso;
		};

		$scope.selectedRow = null;
		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};

		$scope.criteriaMatch = function (cursoSeleccionado) {
			return function (item) {
				//return 1===0;

				return (item != undefined && cursoSeleccionado != undefined && cursoSeleccionado.promocionId === item.promocionId && cursoSeleccionado.cuatrimestreId === item.cuatrimestreId && cursoSeleccionado.modoId === item.modoId && cursoSeleccionado.turnoId === item.turnoId && cursoSeleccionado.cursoId === item.cursoId)
			};
		};

		$scope.indexChar = function (index) {
			return String.fromCharCode(64 + index);
		};

		$scope.obtenerAnioCursado = function obtenerAnioCursado(promocion, cuatrimestre) {
			var anioCursado = "---";
			var fechaActual = new Date(2016,9);
			//var fechaActual = new Date();
			var anioActual = fechaActual.getFullYear();
			var mesActual = fechaActual.getMonth();

			if ((mesActual >= 3 && mesActual < 7) || (mesActual >= 8 && mesActual < 12)) {
				var anioCursado = (anioActual - promocion) + 1;
				if ((mesActual >= 3 && mesActual < 7) && (cuatrimestre = 101))
					anioCursado--;

				if (anioCursado > 3)
					anioCursado = "Carrera completa";
				else if (anioCursado === 1)
					anioCursado = "1er Año";
				else if (anioCursado === 2)
					anioCursado = "2do Año";
				else if (anioCursado === 3)
					anioCursado = "3er Año";
			}
			return anioCursado;
		}

		$scope.obtenerCuatrimestreCursado = function obtenerCuatrimestreCursado(cuatrimestre) {
			var cuatrimestreCursado = "---";
			var fechaActual = new Date(2016,9);
			//var fechaActual = new Date();
			var mesActual = fechaActual.getMonth();

			if ((mesActual >= 3 && mesActual < 7) || (mesActual >= 8 && mesActual < 12)) {
				if ((mesActual >= 3 && mesActual < 7) && (cuatrimestre = 101))
					cuatrimestreCursado = "1er Cuatrimerstre";
				else
					cuatrimestreCursado = "2do Cuatrimerstre";
			}
			return cuatrimestreCursado;
		}

	}
)