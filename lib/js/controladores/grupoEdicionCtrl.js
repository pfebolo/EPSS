'use strict';
var gruposMod = angular.module('grupoModulo');

gruposMod.controller('grupoEdicionControlador', ['$scope', '$http', '$filter', '$location', '$timeout', 'UtilService', 'legajoSrv', 'grupoSrv',
	function CargarGrupos($scope, $http, $filter, $location, $timeout, UtilService, legajoSrv, grupoSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.getLegajosOK = false;
		$scope.getGruposOK = false;
		$scope.cargando = true;
		$scope.error = { hayError: false, errores: {} };
		$scope.grupoEditando = angular.copy(grupoSrv.grupoAEditar);
		$scope.ordinales = UtilService.ordinales;
		$scope.meses = UtilService.meses;
		var cargandoLegajos = true;
		var cargandoGrupos = true;

		

		legajoSrv.getAll()
			.then(function (responseOK) {
				var x = decodeURIComponent(JSON.stringify(responseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad) { return cad.replace('%', '％'); }));
				$scope.legajos = JSON.parse(x.replace(/\t/g, ' '));
				$scope.legajosFiltrados = [];
				$scope.reseleccionar('');
				$scope.getLegajosOK = true;
			})
			.finally(function () {
				cargandoLegajos = false;
				$scope.cargando = cargandoLegajos || cargandoGrupos;
			});


		var ObtenerGrupos = function ObtenerGrupos() {
			$scope.error = { hayError: false, errores: {} };
			$scope.myStyle.cursor = 'wait';
			$scope.getGruposOK = false;
			cargandoGrupos = true;
			grupoSrv.getAll()
				.then(function (dataResponseOK) {
					$scope.grupos = dataResponseOK;
					$scope.getGruposOK = true;
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
					$scope.getGruposOK = false;
				})
				.finally(function () {
					cargandoGrupos = false;
					$scope.cargando = cargandoLegajos || cargandoGrupos; 
					$scope.myStyle.cursor = 'pointer';
				});
		};
		ObtenerGrupos();



		$scope.informarDetalle = function informarDetalle() {
			$scope.cargando = !$scope.cargando;
		};

		$scope.setearScroll = function setearScroll() {
			$scope.divscr.scrollTop = legajoSrv.scrollRowEdit;
			return true;
		};

		$scope.selectedRow = legajoSrv.selectedRowEdit;
		$scope.divscr = document.getElementById('lista');
		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
			legajoSrv.scrollRowEdit = $scope.divscr.scrollTop;
		};


		var orderApellidoYNombre = function orderApellidoYNombre(item) {
			item.alumno.apellidoYNombre = item.alumno.apellido.trim() + ', ' + item.alumno.nombre.trim();
			return item.alumno.apellidoYNombre;
		};

		var insensitiveComparator = function (input, search) {
			var encontrado = false;
			if (angular.isString(input))
				var inputLocale = stringToLocale(input);
			if (typeof input === 'string')
				encontrado = input.includes(search) || inputLocale.includes(search);
			else if (typeof input !== 'object')
				encontrado = input.toString().includes(search);
			return encontrado;
		};

		var stringToLocale = function (str) {
			return str = str.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ü', 'u');
		};


		var ordenar= function ordenar(leg) {
			leg = $filter('orderBy')(leg, orderApellidoYNombre);  //ordena Por Apellido+Nombre para buscar duplicados
			if (typeof leg != 'undefined' && leg.length > 0) {
				$scope.legajosFiltrados = leg;
			} else
				$scope.legajosFiltrados = [];
		};
			

		$scope.reseleccionar = function reseleccionar(filtro) {
			$scope.legajosSeleccionados=null; //Borra el filtro de valores masivos
			var leg = $filter('filter')($scope.legajos, stringToLocale(filtro), insensitiveComparator);
			ordenar(leg);
		};

		$scope.reseleccionarMasivo= function reseleccionarMasivo(filtro) {
			$scope.nombreapellidoFiltro=null; //Borra el filtro de valores simples
			var leg = $filter('filter')($scope.legajos, stringToLocale(filtro), masiveLegajoComparator);
			ordenar(leg);
		};

		//itera entre todos los valores separados por 'blanco', los valores pueden ser de cualquier tipo, pero se esperan numeros de legajos
		var masiveLegajoComparator = function (input, search) {
			var encontrado = false;
			if (angular.isString(input))
				input = stringToLocale(input);
			var nrosDeLegajos = search.split(' ');
			nrosDeLegajos.forEach(function(element) {
				encontrado = encontrado || (element == input); //Or entre todos los valores pasados, si alguno es igual se da por Ok al registro analizado
			}, this);
			return encontrado;
		};




		$scope.filtroGrupo = function (grupoSeleccionado) {
			return function (item) {
				return (item != undefined && grupoSeleccionado != undefined  && grupoSeleccionado.carreraId === item.carreraId && grupoSeleccionado.modoId === item.modoId && grupoSeleccionado.anioInicio === item.anioInicio && grupoSeleccionado.mesInicio === item.mesInicio && grupoSeleccionado.anioLectivo === item.anioLectivo && grupoSeleccionado.nmestreLectivo === item.nmestreLectivo && grupoSeleccionado.turnoId === item.turnoId && grupoSeleccionado.divisionId === item.divisionId);
			};
		};

		//Grabar
		var heredarCurso = function heredarCurso(cursoPadre, cursoHijo) {
			cursoHijo.carreraId = cursoPadre.carreraId;
			cursoHijo.modoId = cursoPadre.modoId;
			cursoHijo.anioInicio = cursoPadre.anioInicio;
			cursoHijo.mesInicio = cursoPadre.mesInicio;
			cursoHijo.anioLectivo = cursoPadre.anioLectivo;
			cursoHijo.nmestreLectivo = cursoPadre.nmestreLectivo;
		};

		var heredarDivision = function heredarDivision(divisionPadre, divisionHijo) {
			heredarCurso(divisionPadre, divisionHijo);
			divisionHijo.turnoId = divisionPadre.turnoId;
			divisionHijo.divisionId = divisionPadre.divisionId;
		};



		var buscarGrupo = function buscarGrupo () {
			grupoSrv.getAll()
			.then(function (dataResponseOK) {
				$scope.grupos = dataResponseOK;
			})
			.catch(function (responseError) {
				Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
				$scope.error.hayError = true;
			});
		};

		var agregarEstudiante = function agregarEstudiante(grupo) {
			$scope.error = { hayError: false, errores: {} };
			$scope.myStyle.cursor = 'wait';
			grupoSrv.crear(grupo)
				.then(function () {
					buscarGrupo();
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		var eliminarEstudiante = function eliminarEstudiante(grupo) {
			$scope.error = { hayError: false, errores: {} };
			$scope.myStyle.cursor = 'wait';
			grupoSrv.eliminar(grupo.carreraId, grupo.modoId, grupo.anioInicio, grupo.mesInicio, grupo.anioLectivo, grupo.nmestreLectivo, grupo.turnoId, grupo.divisionId, grupo.alumnoId)
				.then(function () {
					buscarGrupo();
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		var crearGrupoDesdeLegajo = function crearGrupoDesdeLegajo(division,legajo){
			var grupo = {};
			heredarDivision(division,grupo);
			grupo.alumnoId = legajo.alumnoId;
			grupo.comentario = null;
			return grupo;
		}

		$scope.agregarEstudianteAGrupo = function agregarEstudianteAGrupo(division,legajo) {
			agregarEstudiante(crearGrupoDesdeLegajo(division,legajo));
		};

		$scope.eliminarEstudianteDeGrupo = function eliminarEstudianteDeGrupo (division,legajo) {
			eliminarEstudiante(crearGrupoDesdeLegajo(division,legajo));
		};

	}
]);


