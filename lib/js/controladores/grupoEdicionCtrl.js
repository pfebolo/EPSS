'use strict';
var gruposMod = angular.module('grupoModulo');

gruposMod.controller('grupoEdicionControlador', ['$scope', '$http', '$q', '$filter', '$location', '$timeout', 'UtilService', 'legajoSrv', 'grupoSrv',
	function CargarGrupos($scope, $http, $q, $filter, $location, $timeout, UtilService, legajoSrv, grupoSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.getLegajosOK = false;
		$scope.getGruposOK = false;
		$scope.cargando = true;
		$scope.error = { hayError: false, errores: {} };
		$scope.grupoEditando = angular.copy(grupoSrv.grupoAEditar);
		$scope.ordinales = UtilService.ordinales;
		$scope.meses = UtilService.meses;
		
		var ObtenerLegajos = function ObtenerLegajos() {
			var deferred = $q.defer();
			legajoSrv.getAll()
			.then(function (responseOK) {
				deferred.resolve(responseOK);
			})
			.catch(function (responseError) {
				Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
				$scope.error.hayError = true;
				deferred.reject(responseError);
			});
			return deferred.promise;
		};

		var ObtenerGrupos = function ObtenerGrupos() {
			var deferred = $q.defer();
			grupoSrv.getAll()
				.then(function (dataResponseOK) {
					deferred.resolve(dataResponseOK);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
					deferred.reject(responseError);
				});
			return deferred.promise;
		};


		var CargarPagina = function CargarPagina() {
			$scope.myStyle.cursor = 'wait';
			$scope.cargando = true;
			var finalizarCarga = function finalizarCarga() {
				$scope.cargando = false;
				$scope.myStyle.cursor = 'auto';
			};
			var gruposCargados=null;
			ObtenerGrupos()
				.then(function (dataResponseOK) {
					gruposCargados = dataResponseOK;
					ObtenerLegajos()
						.then(function (dataResponseOK) {
							$scope.legajos = filtrarEgresados(dataResponseOK);
							$scope.legajosFiltrados = [];
							$scope.reseleccionar($scope.legajos, '');
							$scope.grupos = gruposCargados;
							finalizarCarga();
						},finalizarCarga);
				},finalizarCarga);
		};
		CargarPagina();




		$scope.orderApellidoYNombre = function orderApellidoYNombre(item) {
			item.apellidoYNombre = UtilService.stringToLocale(item.legajo.alumno.apellido.trim() + ', ' + item.legajo.alumno.nombre.trim());
			return item.apellidoYNombre; //dato a comparar
		};


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
			//legajoSrv.scrollRowEdit = $scope.divscr.scrollTop;
		};


		var orderApellidoYNombre = function orderApellidoYNombre(item) {
			item.alumno.apellidoYNombre = item.alumno.apellido.trim() + ', ' + item.alumno.nombre.trim();
			return item.alumno.apellidoYNombre;
		};

		var insensitiveComparator = function (input, search) {
			var encontrado = false;
			if (angular.isString(input))
				var inputLocale = UtilService.stringToLocale(input);
			if (typeof input === 'string')
				encontrado = input.includes(search) || inputLocale.includes(search);
			else if (typeof input !== 'object')
				encontrado = input.toString().includes(search);
			return encontrado;
		};

		var setLegajosFiltrados= function setLegajosFiltrados(leg) {
			if (typeof leg != 'undefined' && leg.length > 0) {
				$scope.legajosFiltrados = leg;
			} else
				$scope.legajosFiltrados = [];
		};
			

		$scope.reseleccionar = function reseleccionar(legajos, filtro) {
			$scope.legajosSeleccionados=null; //Borra el filtro de valores masivos
			var leg = $filter('filter')(legajos, UtilService.stringToLocale(filtro), insensitiveComparator);
			setLegajosFiltrados(leg);
		};

		$scope.reseleccionarMasivo= function reseleccionarMasivo(legajos, filtro) {
			$scope.nombreapellidoFiltro=null; //Borra el filtro de valores simples
			var leg = $filter('filter')(legajos, UtilService.stringToLocale(filtro), masiveLegajoComparator);
			setLegajosFiltrados(leg);
		};

		//itera entre todos los valores separados por 'blanco', los valores pueden ser de cualquier tipo, pero se esperan numeros de legajos
		var masiveLegajoComparator = function (input, search) {
			var encontrado = false;
			if (angular.isString(input))
				input = UtilService.stringToLocale(input);
			var nrosDeLegajos = search.split(' ');
			nrosDeLegajos.forEach(function(element) {
				encontrado = encontrado || (element == input); //Or entre todos los valores pasados, si alguno es igual se da por Ok al registro analizado
			}, this);
			return encontrado;
		};

		var  filtrarEgresados = function filtrarEgresados(legajos) {
			var leg = $filter('filter')(legajos,{estadoEstudianteId:'!Egresado'});
			leg = $filter('filter')(leg,{estadoEstudianteId:'!Abandonó'});
			leg = $filter('filter')(leg,{estadoEstudianteId:'!Expulsado'});
			leg = $filter('orderBy')(leg, orderApellidoYNombre);  
			return leg;
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
					$scope.myStyle.cursor = 'auto';
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
					$scope.myStyle.cursor = 'auto';
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



