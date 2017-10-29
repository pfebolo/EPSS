'use strict';
var divisionMod = angular.module('divisionModulo');


divisionMod.controller('divisionEdicionControlador', ['$rootScope', '$scope', '$http', '$location', '$filter', '$q', 'divisionSrv', 'carreraSrv', 'coordinadorSrv', 'coordinacionSrv', 'dispositivoSrv',
	function cargarDivisiones($rootScope, $scope, $http, $location, $filter, $q, divisionSrv, carreraSrv, coordinadorSrv, coordinacionSrv, dispositivoSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		var accion_crear = 0;
		var accion_editar = 1;
		$scope.msjModal=null;
		$scope.carreras= [];
		$scope.cursoEditando = {};
		$scope.divisionEditando = {};
		$scope.coordinadorSeleccionado = [];
		$scope.coordSeleccionado = {}; //Array Asociativo
		$scope.coordinacionOriginal = [];
		$scope.dispositivos = [];
		$scope.accionLabel='???';
		$scope.esEdicion= function esEdicion(){return divisionSrv.accion===accion_editar;};
		var coordNulo = {
			'coordinadorId': -1,
			'nombre': 'Cordinador de Grupo Operativo',
			'fotoPath': 'img/Persona.png',
		};


		if (divisionSrv.accion===null) {
			divisionSrv.accion= accion_crear;
		}

		$scope.modoLista = [{id:1, descripcion:'Presencial'},
		{id:2, descripcion:'A Distancia'}];
		$scope.setModo = function setModo(index) {
			if (!$scope.esEdicion()) {
				$scope.cursoEditando.modoId = $scope.modoLista[index].descripcion;
				$scope.dispositivosXCarrera = $scope.dispositivos.filter(filtroModo, $scope.cursoEditando.modoId);// Filtrar por Carrera
				if ($scope.cursoEditando.modoId==='A Distancia') 
					$scope.setTurno(2);
				else
					$scope.setTurno(3);
			}
		};

		$scope.turnoLista = [{id:1, descripcion:'Mañana', mostrar:true},
		{id:2, descripcion:'Noche', mostrar:true},
		{id:3, descripcion:'Virtual', mostrar:false}];
		$scope.setTurno = function setTurno(index) {
			if (!$scope.esEdicion())
				if (index>=0 && index<$scope.turnoLista.length)
					$scope.divisionEditando.turnoId = $scope.turnoLista[index].descripcion;
				else
					$scope.divisionEditando.turnoId = null;
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
			if (!$scope.esEdicion())
				$scope.divisionEditando.divisionId = $scope.divisionLista[index].descripcion;
		};

		var ObtenerCarreras = function ObtenerCarreras() {
			var deferred = $q.defer();
			carreraSrv.getAll()
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

		var ObtenerCoordinadores = function ObtenerCoordinadores() {
			var deferred = $q.defer();
			coordinadorSrv.getAll()
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

		var ObtenerDispositivo = function ObtenerDispositivo() {
			var deferred = $q.defer();
			dispositivoSrv.getAll()
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


		var filtroDivision = function filtroDivision(item) {
			var divisionSeleccionado = this;  // this es el valor a comparar enviado via el filtro
			return (item != undefined && divisionSeleccionado != undefined && divisionSeleccionado.carreraId === item.carreraId && divisionSeleccionado.modoId === item.modoId && divisionSeleccionado.anioInicio === item.anioInicio && divisionSeleccionado.mesInicio === item.mesInicio && divisionSeleccionado.anioLectivo === item.anioLectivo && divisionSeleccionado.nmestreLectivo === item.nmestreLectivo && divisionSeleccionado.turnoId === item.turnoId && divisionSeleccionado.divisionId === item.divisionId);
		};		

		var filtroModo = function filtroModo(item) {
			var itemAAnalizar = this;  // this es el valor a comparar enviado via el filtro
			return (item != undefined && itemAAnalizar != undefined && itemAAnalizar === item.modoId);
		};		


		// var obtenerCoordinadoresDeDivision = function obtenerCoordinadoresDeDivision(division) {
		// 	if ($scope.coordinaciones !== undefined) 
		// 		return $scope.coordinaciones.filter(filtroDivision, division);
		// };

		var cargarFormulario = function cargarFormulario() {
			if (divisionSrv.accion===null || divisionSrv.accion === accion_crear) {
				$scope.cursoEditando.carreraId = 0;
				$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
				$scope.cursoEditando.modoId = 'Presencial';
				$scope.cursoEditando.anioInicio = null;
				$scope.cursoEditando.mesInicio = null;
				$scope.cursoEditando.mesFinal = null;
				$scope.cursoEditando.anioLectivo = null;
				$scope.cursoEditando.nmestreLectivo = null;
				$scope.cursoEditando.comentario = null;
				
				$scope.divisionEditando.turnoId = null;
				$scope.divisionEditando.divisionId = 'A';
				$scope.divisionEditando.comentario = null;
				$scope.coordinadorSeleccionado = [coordNulo,coordNulo];
				$scope.dispositivosXCarrera = $scope.dispositivos.filter(filtroModo, $scope.cursoEditando.modoId);// Filtrar por Carrera
				
				
				
				$scope.accionLabel='Crear';
			} else if (divisionSrv.accion === accion_editar) {
				$scope.cursoEditando = angular.copy(divisionSrv.divisionAEditar.curso);
				if ($scope.carreras !== []) //Si se cargó primero $scope.carreras
					$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
				$scope.divisionEditando = angular.copy(divisionSrv.divisionAEditar);
				$scope.coordinacionEditando = $scope.coordinaciones.filter(filtroDivision, $scope.divisionEditando);
				$scope.coordinacionEditando.forEach(function(coordinacion) {
					$scope.coordinadorSeleccionado.push(coordinacion.coordinador);
					$scope.coordinacionOriginal.push(coordinacion.coordinador);
				}, this);
				delete $scope.cursoEditando.curso;
				$scope.accionLabel='Actualizar';
			}
		};


		var cargarPagina = function cargarPagina() {
			$scope.myStyle.cursor = 'wait';
			function finalizarCarga() {
				$scope.myStyle.cursor = 'pointer';
			}
			ObtenerCarreras()
				.then(function (dataResponseOK) {
					$scope.carreras = dataResponseOK;
					if ($scope.cursoEditando.carreraId !== null) //Si se cargó primero $scope.cursoEditando
						$scope.carrera = $scope.carreras[$scope.cursoEditando.carreraId];
					ObtenerCoordinadores()
						.then(function (dataResponseOK) {
							$scope.coordinadores = dataResponseOK;
							ObtenerCoordinaciones()
								.then(function (dataResponseOK) {
									$scope.coordinaciones = dataResponseOK;
									ObtenerDispositivo()
										.then(function (dataResponseOK) {
											$scope.dispositivos = dataResponseOK;
											cargarFormulario();
											$scope.dispositivos.forEach(function(dispositivo) {
												$scope.coordSeleccionado[dispositivo.dispositivoId] = coordNulo;
											}, this);
											finalizarCarga();
										}, finalizarCarga);
								}, finalizarCarga);
						}, finalizarCarga);
				}, finalizarCarga);
		};
		cargarPagina();

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
			var nodoPadre = ev.originalEvent.target.parentNode;
			nodeCopy.id = nodeCopy.id + nodoPadre.id; // Cambiar el ID para que sea unico 
			nodeCopy.title = nodoPadre.id + ': ' + nodeCopy.title;
			var jQueryOldElement = angular.element(nodoPadre.childNodes[1]); // Obtener el elemento a cambiar 
			jQueryOldElement.off('dragstart'); // Eliminar el listener 
			jQueryOldElement.off('drop'); // Eliminar el listener 
			jQueryOldElement.off('dragover'); // Eliminar el listener 
			nodoPadre.replaceChild(nodeCopy, nodoPadre.childNodes[1]); // Reemplazar el elemento original por el nuevo
			var jQueryNewElement = angular.element(nodeCopy); // Convertir en un elemneto de tipo JQuery
			jQueryNewElement.on('dragstart', $scope.dragstart); //Agregar el listener
			jQueryNewElement.on('drop', $scope.drop); //Agregar el listener
			jQueryNewElement.on('dragover', $scope.dragover); //Agregar el listener

			var filtro = {coordinadorId: parseInt(nodeCopy.attributes['coordindex'].value)};
			var coordinadorSeleccionado = $filter('filter')($scope.coordinadores,filtro)[0];
			$scope.coordSeleccionado[nodoPadre.id] = coordinadorSeleccionado;
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

		var completarCoordinacion = function completarDivision(division,coordinador,dispositivoId) {
			var coordinacion={};
			heredarDivision(division,coordinacion);
			coordinacion.coordinadorId= coordinador.coordinadorId;
			coordinacion.division = division;
			coordinacion.coordinador = coordinador;
			coordinacion.dispositivoId = dispositivoId;
			return coordinacion;
		};

		var grabarCoordinacion = function grabarCoordinacion(coordinacion) {
			coordinacionSrv.crear(coordinacion)
				.then(function () {
					$scope.showModal('Creado satisfactoriamente.');
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
				});
		};

		var borrarCoordinacion = function borrarCoordinacion(coordinacion) {
			coordinacionSrv.eliminar(coordinacion.carreraId, coordinacion.modoId, coordinacion.anioInicio, coordinacion.mesInicio, coordinacion.anioLectivo, coordinacion.nmestreLectivo, coordinacion.turnoId, coordinacion.divisionId, coordinacion.coordinadorId)
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
				});
		};		

		var grabarCoordinaciones = function grabarCoordinaciones(coordinaciones) {
			coordinacionSrv.crear(coordinaciones[0])
				.then(function () {
					if (coordinaciones.length===2)
						grabarCoordinacion(coordinaciones[1]);
					else
						$scope.showModal('Actualizado satisfactoriamente.');
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
				});
		};

		var borrarCoordinaciones = function borrarCoordinaciones(coordinaciones) {
			coordinacionSrv.eliminar(coordinaciones[0].carreraId, coordinaciones[0].modoId, coordinaciones[0].anioInicio, coordinaciones[0].mesInicio, coordinaciones[0].anioLectivo, coordinaciones[0].nmestreLectivo, coordinaciones[0].turnoId, coordinaciones[0].divisionId, coordinaciones[0].coordinadorId)
				.then(function () {
					if (coordinaciones[1]!==null)
						borrarCoordinacion(coordinaciones[1]);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
				});
		};



		$scope.grabar = function grabar(fichaCurso, fichaDivision) {
			$scope.error = { hayError: false, errores: {} };
			fichaCurso.carreraId = $scope.carrera.carreraId;
			completarDivision(fichaCurso, fichaDivision);
			var coordinaciones=[];
			$scope.dispositivosXCarrera.forEach(function(dispositivo) {
				if ($scope.coordSeleccionado[dispositivo.dispositivoId].coordinadorId!=-1)
					coordinaciones.push(completarCoordinacion(fichaDivision,$scope.coordSeleccionado[dispositivo.dispositivoId],dispositivo.dispositivoId));
			}, this);

			if (divisionSrv.accion === accion_crear) {
				divisionSrv.crear(fichaDivision)
					.then(function () {
						if (coordinaciones.length>0) 
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
						borrarCoordinaciones($scope.coordinacionOriginal);
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


