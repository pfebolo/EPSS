'use strict';
var gruposMod = angular.module('grupoModulo');

gruposMod.controller('grupoRegAsistenciaControlador', ['$scope', '$http', '$q', '$filter', '$location', '$timeout', 'UtilService', 'coordinacionSrv', 'grupoSrv',
	function CargarGrupos($scope, $http, $q, $filter, $location, $timeout, UtilService, coordinacionSrv, grupoSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.getGruposOK = false;
		$scope.cargando = true;
		$scope.error = { hayError: false, errores: {} };
		$scope.grupoEditando = angular.copy(grupoSrv.grupoAEditar);
		$scope.ordinales = UtilService.ordinales;
		$scope.meses = UtilService.meses;
		$scope.profesora = '........................................';
		$scope.fechaActual = new Date();
		$scope.diaActual = $scope.fechaActual.getDate();
		$scope.mesActual = $scope.fechaActual.getMonth() + 1;
		$scope.anioActual = $scope.fechaActual.getFullYear();		
		$scope.fechaINI = $scope.diaActual.toString().padStart(2, '0') + '/' + $scope.mesActual.toString().padStart(2, '0') + '/' + $scope.anioActual.toString();
		$scope.fechaFIN = $scope.fechaINI;
		$scope.diasAAsistir = [];
		$scope.mesesAAsistir = [];
		$scope.grupos = [];
		$scope.gruposeleccionado = [];
		$scope.paginas = null;
		$scope.paginaActiva = 0;
		$scope.lineasXPagina = 33;
		$scope.estudiantesUltimaLinea = 0;
		var FolioNulo =
			{
				'legajo': {
					'dni': null,
					'libroMatriz': null,
					'folio': null,
					'alumno': {
						'nombre': null,
						'apellido': null
					}
				}
			};
		$scope.semana = [{ id: 1, descripcion: 'Lunes' },
		{ id: 2, descripcion: 'Martes' },
		{ id: 3, descripcion: 'Miércoles' },
		{ id: 3, descripcion: 'Jueves' },
		{ id: 3, descripcion: 'Viernes' },
		{ id: 3, descripcion: 'Sábado' }];
		$scope.diasem = $scope.semana[1];
	




		var fillArrayWithNumbers =  function fillArrayWithNumbers(n) {
			var arr = Array.apply(null, Array(n));
			return arr.map(function (x, i) { return i; });
		};

		var ObtenerCoordinaciones = function ObtenerCoordinaciones() {
			var deferred = $q.defer();
			coordinacionSrv.getAll()
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
			ObtenerCoordinaciones()
				.then(function (dataResponseOK) {
					$scope.coordinaciones = dataResponseOK;
					ObtenerGrupos()
						.then(function (dataResponseOK) {
							$scope.grupos = dataResponseOK;
							$scope.grupoSeleccionado = $filter('filter')($scope.grupos,filtroGrupo);
							$scope.grupoSeleccionado = $filter('orderBy')($scope.grupoSeleccionado,orderApellidoYNombre);

							//completar pagina
							var lineasNulas= (Math.ceil($scope.grupoSeleccionado.length/$scope.lineasXPagina) * $scope.lineasXPagina) - $scope.grupoSeleccionado.length;
							$scope.estudiantesUltimaLinea = $scope.lineasXPagina - lineasNulas;
							for (var l=0;l<lineasNulas;l++) 
								$scope.grupoSeleccionado.push(angular.copy(FolioNulo));
							$scope.paginas = fillArrayWithNumbers(Math.ceil($scope.grupoSeleccionado.length/$scope.lineasXPagina));
							finalizarCarga();
						},finalizarCarga);
				},finalizarCarga);
		};
		CargarPagina();




		var orderApellidoYNombre = function orderApellidoYNombre(item) {
			item.apellidoYNombre = UtilService.stringToLocale(item.legajo.alumno.apellido.trim() + ', ' + item.legajo.alumno.nombre.trim());
			return item.apellidoYNombre; //dato a comparar
		};

		var filtroGrupo = function filtroGrupo(item) {
			return (item != undefined && $scope.grupoEditando != undefined  && $scope.grupoEditando.carreraId === item.carreraId && $scope.grupoEditando.modoId === item.modoId && $scope.grupoEditando.anioInicio === item.anioInicio && $scope.grupoEditando.mesInicio === item.mesInicio && $scope.grupoEditando.anioLectivo === item.anioLectivo && $scope.grupoEditando.nmestreLectivo === item.nmestreLectivo && $scope.grupoEditando.turnoId === item.turnoId && $scope.grupoEditando.divisionId === item.divisionId && item.legajo.estadoEstudiante.actaVolante);
		};

		$scope.filtroDivision = function filtroDivision(divisionSeleccionado) {
			return function (item) {
				return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
			};
		};


		$scope.setProfesora = function setProfesora (profesoraSeleccionada) {
			$scope.profesora = profesoraSeleccionada;
		};

		$scope.imprimir = function imprimir(a) {
			window.print();
		};

		$scope.setPaginaActiva = function setPaginaActiva(paginaAActivar){
			$scope.paginaActiva = paginaAActivar;
			//$timeout(true).then(imprimir); //Imprimir luego de actualizar vista (el $timeout ejecuta $apply() y entonces llama a imprimir() )
		};

		$scope.calcularDias = function calcularDias(fechaINI,fechaFIN) {
			var diaINI = new Date(parseInt(fechaINI.substr(6,4),10),parseInt(fechaINI.substr(3,2),10)-1,parseInt(fechaINI.substr(0,2),10));
			var diaFIN = new Date(parseInt(fechaFIN.substr(6,4),10),parseInt(fechaFIN.substr(3,2),10)-1,parseInt(fechaFIN.substr(0,2),10));
			$scope.diasAAsistir = [];
			$scope.mesesAAsistir = [];
			var mesActual={mes:'', dias:0};
			for (var i = diaINI; i <= diaFIN; i = UtilService.addDays(i,7)) {
				$scope.diasAAsistir.push(i);
				if (i.getMonth()!=mesActual.mes) {
					mesActual={mes:i.getMonth(), dias:1};
					$scope.mesesAAsistir.push(mesActual);
				}
				else {
					mesActual.dias += 1;
				}
			}
		};
	}
]);



