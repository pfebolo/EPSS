'use strict';
var divisionMod = angular.module('divisionModulo');


divisionMod.controller('divisionEdicionControlador', ['$rootScope', '$scope', '$http', '$location', '$filter',  'divisionSrv', 'carreraSrv', 'coordinadorSrv', 'coordinacionSrv',
	function cargarDivisiones($rootScope, $scope, $http, $location, $filter, divisionSrv, carreraSrv, coordinadorSrv, coordinacionSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		var accion_crear = 0;
		var accion_editar = 1;
		$scope.msjModal=null;
		$scope.carreras= [];
		$scope.cursoEditando = {};
		$scope.divisionEditando = {};
		$scope.coordinadorSeleccionado = [];
		$scope.accionLabel='???';


		if (divisionSrv.accion===null) {
			divisionSrv.accion= accion_crear;
		}

		$scope.modoLista = [{id:1, descripcion:'Presencial'},
		{id:2, descripcion:'A Distancia'}];
		$scope.setModo = function setModo(index) {
			$scope.cursoEditando.modoId = $scope.modoLista[index].descripcion;
		};

		$scope.turnoLista = [{id:1, descripcion:'Mañana'},
		{id:2, descripcion:'Noche'},
		{id:3, descripcion:'Virtual'}];
		$scope.setTurno = function setTurno(index) {
			$scope.divisionEditando.turnoId = $scope.turnoLista[index].descripcion;
		};

		$scope.divisionLista = [{id:1, descripcion:'A'},
		{id:2, descripcion:'B'},
		{id:3, descripcion:'C'},
		{id:4, descripcion:'D'},
		{id:5, descripcion:'E'},
		{id:6, descripcion:'F'},
		{id:7, descripcion:'G'},
		{id:8, descripcion:'H'},
		{id:9, descripcion:'I'},
		{id:10, descripcion:'J'},
		{id:11, descripcion:'K'}];
		$scope.setDivision = function setDivision(index) {
			$scope.divisionEditando.divisionId = $scope.divisionLista[index].descripcion;
		};

		var ObtenerCarreras = function ObtenerCarreras() {
			$scope.myStyle.cursor = 'wait';
			carreraSrv.getAll()
				.then(function (dataResponseOK) {
					$scope.carreras = dataResponseOK;
					if ($scope.cursoEditando.carreraId !== null) //Si se cargó primero $scope.cursoEditando
						$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		var ObtenerCoordinadores = function ObtenerCoordinadores() {
			$scope.myStyle.cursor = 'wait';
			coordinadorSrv.getAll()
				.then(function (dataResponseOK) {
					$scope.coordinadores = dataResponseOK;
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};


		ObtenerCarreras();
		ObtenerCoordinadores();
		if (divisionSrv.accion===null || divisionSrv.accion === accion_crear) {
			$scope.cursoEditando.carreraId = 0;
			$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
			$scope.cursoEditando.modoId = null;
			$scope.cursoEditando.anioInicio = null;
			$scope.cursoEditando.mesInicio = null;
			$scope.cursoEditando.mesFinal = null;
			$scope.cursoEditando.anioLectivo = null;
			$scope.cursoEditando.nmestreLectivo = null;
			$scope.cursoEditando.comentario = null;
			
			$scope.divisionEditando.turnoId = null;
			$scope.divisionEditando.divisionId = 'A';
			$scope.divisionEditando.comentario = null;
			$scope.coordinadorSeleccionado = [null,null];
			
			$scope.accionLabel='Crear';
		} else if (divisionSrv.accion === accion_editar) {
			$scope.cursoEditando = divisionSrv.divisionAEditar;
			if ($scope.carreras !== []) //Si se cargó primero $scope.carreras
				$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
			delete $scope.cursoEditando.curso;
			$scope.accionLabel='Actualizar';
		}
		

		$scope.cancelarEdicion = function cancelarEdicion() {
			$location.path('/divisionLista');
		};

		//Drag & drop
		$scope.dragover = function dragover(ev) {
			return false;
		};
	
		$scope.dragstart= function dragstart(ev) {
			ev.originalEvent.dataTransfer.setData('text/plain', ev.target.id);
		};
	
		$scope.drop=  function drop(ev) {
			ev.originalEvent.preventDefault(); //previene que el evento se propage
			var data = ev.originalEvent.dataTransfer.getData('text/plain');

			var nodeCopy = document.getElementById(data).cloneNode(true); //Copiar el elemento
			nodeCopy.id = nodeCopy.id + ev.originalEvent.target.parentNode.id; // Cambiar el ID para que sea unico 
			var jQueryOldElement = angular.element(ev.originalEvent.target.parentNode.childNodes[1]); // Obtener el elemento a cambiar 
			jQueryOldElement.off('dragstart'); // Eliminar el listener 
			jQueryOldElement.off('drop'); // Eliminar el listener 
			jQueryOldElement.off('dragover'); // Eliminar el listener 
			ev.originalEvent.target.parentNode.replaceChild(nodeCopy, ev.originalEvent.target.parentNode.childNodes[1]); // Reemplazar el elemento original por el nuevo
			var jQueryNewElement = angular.element(nodeCopy); // Convertir en un elemneto de tipo JQuery
			jQueryNewElement.on('dragstart', $scope.dragstart); //Agregar el listener
			jQueryNewElement.on('drop', $scope.drop); //Agregar el listener
			jQueryNewElement.on('dragover', $scope.dragover); //Agregar el listener

			var filtro = {coordinadorId: parseInt(nodeCopy.attributes['coordindex'].value)};
			var coordinadorSeleccionado = $filter('filter')($scope.coordinadores,filtro)[0];
			if (nodeCopy.id.endsWith('GrupoOperativo'))
				$scope.coordinadorSeleccionado[0]= coordinadorSeleccionado;
			else
				$scope.coordinadorSeleccionado[1]= coordinadorSeleccionado;
		};

		//Modal
		$scope.modalOpen=false;
		$scope.showModal = function showModal(mensaje) {
			$scope.msjModal=mensaje;
			$scope.modalOpen=true;
		};

		$scope.closeModal = function closeModal() {
			$location.path('/divisionLista');
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

		var completarDivision = function completarDivision(curso, division) {
			heredarCurso(curso, division);
			division.estadoDivisionId ='Cursando',
			division.curso = curso;
		};

		var completarCoordinacion = function completarDivision(division,coordinador) {
			var coordinacion={};
			heredarDivision(division,coordinacion);
			coordinacion.coordinadorId= coordinador.coordinadorId;
			coordinacion.division = division;
			coordinacion.coordinador = coordinador;
			return coordinacion;
		};

		var grabarCoordinacion = function grabarCoordinacion(coordinacion) {
			if (divisionSrv.accion === accion_crear) {
				coordinacionSrv.crear(coordinacion)
					.then(function () {
						$scope.showModal('Creado satisfactoriamente.');
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			} else {
				coordinacionSrv.actualizar(coordinacion)
					.then(function () {
						$scope.showModal('Actualizado satisfactoriamente.');
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			}
		};

		var grabarCoordinaciones = function grabarCoordinaciones(coordinaciones) {
			if (divisionSrv.accion === accion_crear) {
				coordinacionSrv.crear(coordinaciones[0])
					.then(function () {
						if (coordinaciones[1]!==null)
							grabarCoordinacion(coordinaciones[1]);
						else
							$scope.showModal('Actualizado satisfactoriamente.');
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			} else {
				coordinacionSrv.actualizar(coordinaciones[0])
					.then(function () {
						if (coordinaciones[1]!==null)
							grabarCoordinacion(coordinaciones[1]);
						else
							$scope.showModal('Actualizado satisfactoriamente.');
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			}
		};

		$scope.grabar = function grabar(fichaCurso, fichaDivision) {
			$scope.error = { hayError: false, errores: {} };
			fichaCurso.carreraId = $scope.carrera.carreraId;
			completarDivision(fichaCurso, fichaDivision);
			var coordinaciones=[null,null];
			if ($scope.coordinadorSeleccionado[0]!== null) 
				coordinaciones[0] = completarCoordinacion(fichaDivision,$scope.coordinadorSeleccionado[0]);
			if ($scope.coordinadorSeleccionado[1]!== null) 
				coordinaciones[1] = completarCoordinacion(fichaDivision,$scope.coordinadorSeleccionado[1]);
			//Si se completó solo un coordinador, se asegura que este en el indice 0 (cero)
			if ((coordinaciones[0]=== null) && coordinaciones[1]!== null) {
				coordinaciones[0] = coordinaciones[1];
				coordinaciones[1] = null;
			}
			if (divisionSrv.accion === accion_crear) {
				divisionSrv.crear(fichaDivision)
					.then(function () {
						if (coordinaciones[0]!== null) 
							grabarCoordinaciones(coordinaciones);
						else
							$scope.showModal('Creado satisfactoriamente.');
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			} else {
				divisionSrv.actualizar(fichaDivision)
					.then(function () {
						if (coordinaciones[0]!== null) 
							grabarCoordinaciones(coordinaciones);
						else
							$scope.showModal('Actualizado satisfactoriamente.');
					})
					.catch(function (responseError) {
						Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
						$scope.error.hayError = true;
					});
			}
		};
	}
]);


