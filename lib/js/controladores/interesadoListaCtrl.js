'use strict';
var interesadoMod = angular.module('interesadoModulo'); // se obtiene el modulo interesadoModulo previamente creado (el modulo está creado previamente)


interesadoMod.controller('interesadoListaControlador', ['$rootScope', '$scope', '$http', '$filter', '$timeout', 'UtilService', 'interesadoSrv', 'estudianteSrv', 'interesadoEventoSrv', 'eventoSrv',
	function cargarInteresados($rootScope, $scope, $http, $filter, $timeout, UtilService, interesadoSrv, estudianteSrv, interesadoEventoSrv, eventoSrv) {
		$scope.GetOK = true;
		$scope.cargando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.interesadoSeleccionado = null;
		$scope.interesadosEventos = null;
		$scope.interesadosFiltradosYOrdenados = null;
		$scope.altaEvento = false;
		$scope.eventosFuturos = null;
		$scope.pagina = 0;
		$scope.paginas = 0;
		$scope.interesadosFiltro = interesadoSrv.interesadoFiltro;
		$scope.filtrarDuplicado = false;
		$scope.filtrarSeguimiento = false;
		$scope.procesandoCSV = false;

		//Lista Interesados
		var fechaIni = null;
		var ultimoFiltro = interesadoSrv.interesadoFiltro;
		var ultimoFiltroDup = $scope.filtrarDuplicado;
		var ultimoFiltroSeg = $scope.filtrarSeguimiento;


		$scope.obtenerInteresados = function obtenerInteresados() {
			$scope.cargando = true;
			fechaIni = performance.now();
			interesadoSrv.getAll()
				.then(function (dataResponseOK) {
					var fechaFin = performance.now();
					var tiempo = fechaFin - fechaIni;
					console.log('load:' + tiempo.toString());
					fechaIni = performance.now();
					$scope.interesados = dataResponseOK;
					fechaFin = performance.now();
					tiempo = fechaFin - fechaIni;
					console.log('Decode:' + tiempo.toString());
					fechaIni = performance.now();
					$scope.reseleccionar(ultimoFiltro);
					fechaFin = performance.now();
					tiempo = fechaFin - fechaIni;
					console.log('FiltrarYOrdenar:' + tiempo.toString());
					$scope.GetOK = true;
				})
				.catch(function () {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};


		var esDuplicado = function esDuplicado(item, indice, interesados) {
			item.nombreYApellido = item.apellido.trim() + ', ' + item.nombre.trim(); //Permite busqueda con Nombre y Apellido según capa de presentación
			item.duplicado = interesadoSrv.esDuplicado(item, indice, interesados);
		};


		var customComparator = function (input, search) {
			var encontrado = false;
			if (angular.isString(input))
				var inputLocale = UtilService.stringToLocale(input);
			if (typeof input === 'string')
				encontrado = input.includes(search) || inputLocale.includes(search);
			else if (typeof input !== 'object')
				encontrado = input.toString().includes(search);
			return encontrado;
		};


		$scope.reseleccionar = function reseleccionar(filtro) {
			var fechaIni = performance.now();
			var inte = null;
			if (($scope.interesadosFiltradosYOrdenados !== null) && ultimoFiltroDup === $scope.filtrarDuplicado && ultimoFiltroSeg === $scope.filtrarSeguimiento && filtro.startsWith(ultimoFiltro)) {
				inte = $scope.interesadosFiltradosYOrdenados;
				console.log('Array origen FiltradosYOrdenados (' + inte.length.toString() + ')');
			} else {
				inte = $scope.interesados;
				console.log('Array origen interesados (' + inte.length.toString() + ')');
			}
			if (filtro !== '' && inte.length > 0) {
				console.log('Filtrar...:' + filtro);
				inte = $filter('filter')(inte, UtilService.stringToLocale(filtro), customComparator);
				console.log('inte...: ' + inte.length.toString());
			}

			var fechaFin = performance.now();
			var tiempo = fechaFin - fechaIni;
			console.log('Filtrar:' + tiempo.toString());
			fechaIni = performance.now();
			inte = $filter('orderBy')(inte, interesadoSrv.orderApellidoYNombre);  //ordena Por Apellido+Nombre para buscar duplicados
			inte.forEach(esDuplicado);
			if ($scope.filtrarDuplicado) {
				inte = $filter('filter')(inte, { duplicado: true });
			}
			if ($scope.filtrarSeguimiento) {
				inte = $filter('filter')(inte, { seguimiento: true });
			}
			inte = $filter('orderBy')(inte, 'fechaInteresado', true);
			fechaFin = performance.now();
			tiempo = fechaFin - fechaIni;
			console.log('Ordenar:' + tiempo.toString());
			fechaIni = performance.now();
			if (typeof inte != 'undefined' && inte.length > 0) {
				$scope.interesadosFiltradosYOrdenados = inte;
				$scope.mostrarPagina(1);
			} else {
				$scope.interesadosFiltradosYOrdenados = [];
				$scope.interesadosFiltradosYOrdenadosPagina = [];
				$scope.cargarInteresado(null);
			}
			ultimoFiltro = filtro;
			ultimoFiltroDup = $scope.filtrarDuplicado;
			ultimoFiltroSeg = $scope.filtrarSeguimiento;
			interesadoSrv.interesadoFiltro = '';
		};

		$scope.mostrarPagina = function mostrarPagina(pagina) {
			var tamañoPagina = 100;
			$scope.paginas = Math.ceil($scope.interesadosFiltradosYOrdenados.length / tamañoPagina);
			if (pagina === 0)
				pagina = 1;
			if (pagina > $scope.paginas)
				pagina = $scope.paginas;
			$scope.pagina = pagina;
			var indiceInicial = (pagina - 1) * tamañoPagina;
			$scope.interesadosFiltradosYOrdenadosPagina = $scope.interesadosFiltradosYOrdenados.slice(indiceInicial, indiceInicial + tamañoPagina - 1);
			//$scope.interesadosFiltradosYOrdenadosPagina.forEach(esDuplicado);
			$scope.selectedRow = 0;
			$scope.cargarInteresado($scope.interesadosFiltradosYOrdenadosPagina[0]);
		};

		$scope.obtenerInteresados();

		$scope.actualizarInteresados = function actualizarInteresados(fechaFINElegida) {
			if (fechaFINElegida !== '') {
				$scope.error = { hayError: false, errores: {} };
				$scope.actualizando = true;
				$scope.myStyle.cursor = 'wait';
				$scope.obtenerInteresados(fechaFINElegida);
			}
			else
				$scope.interesados = null;
		};

		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		};
		//Fin Lista Interesados


		//Ficha Interesado
		$scope.cargarInteresado = function cargarInteresado(interesado) {
			$scope.interesadoSeleccionado = interesado;
			$scope.altaEvento = false;
			if (interesado !== null)
				obtenerEventosPorInteresado(interesado.interesadoId);
			else
				obtenerEventosPorInteresado(-1);
		};

		$scope.irAinscripcion = function irAinscripcion(interesadoAInscribir) {
			estudianteSrv.exponerInscripcion(interesadoAInscribir);
		};

		$scope.irAcrearInteresado = function irAcrearInteresado() {
			interesadoSrv.exponerCreacion($scope.interesados);
		};

		$scope.irAEdicionInteresado = function irAEdicionInteresado(interesadoAEditar) {
			interesadoSrv.exponerEdicion(interesadoAEditar, $scope.interesados);
		};

		$scope.irABajarInteresado = function irABajarInteresado() {
			if (!$scope.procesandoCSV) {
				var sep = 'xSEPx';
				var ret = 'xRETx';
				var BOM = '\ufeff';
				$scope.procesandoCSV = true;
				var obj = BOM + 'Nombre' + sep + 'Apellido' + sep + 'E-Mail' + sep + 'Teléfono' + sep + 'Celular' + sep 
				+ 'Conocio' + sep + 'Modalidad' + sep + 'Interes' + sep + 'Fecha' + sep + 'Comentario' + sep 
				+ 'Provincia' + sep + 'Sit. Inscripción' + sep + 'Sit. Especial' + sep + 'Carrera' + sep + 'Anio' 
				+ sep + 'Cuatrimiestre' + sep + 'Turno' + sep + 'Seguimiento'+ sep + 'Contacto' + ret;
				$scope.interesadosFiltradosYOrdenados.forEach(function (item) {
					obj = obj + UtilService.NullToBlanck(item.nombre) + sep;
					obj = obj + UtilService.NullToBlanck(item.apellido) + sep;
					obj = obj + UtilService.NullToBlanck(item.mail) + sep;
					obj = obj + UtilService.NullToBlanck(item.telefono) + sep;
					obj = obj + UtilService.NullToBlanck(item.celular) + sep;
					obj = obj + UtilService.NullToBlanck(item.comoConocio) + sep;
					if (item.modalidad !== null)
						obj = obj + UtilService.NullToBlanck(item.modalidad.nombre);
					obj = obj + sep;
					obj = obj + UtilService.NullToBlanck(item.gradoInteres) + sep;
					obj = obj + UtilService.NullToBlanck($filter('date')(item.fechaInteresado, 'dd-MM-yyyy')) + sep;
					obj = obj + UtilService.NullToBlanck(item.comentario) + sep;
					obj = obj + UtilService.NullToBlanck(item.provincia) + sep;
					if (item.situacionInscripcion==='Nada')
						item.situacionInscripcion=null;
					obj = obj + UtilService.NullToBlanck(item.situacionInscripcion) + sep;
					if (item.situacionEspecial==='Nada')
						item.situacionEspecial=null;
					obj = obj + UtilService.NullToBlanck(item.situacionEspecial) + sep;
					if (item.carrera !== null)
						obj = obj + UtilService.NullToBlanck(item.carrera.descripcion);
					obj = obj + sep;
					obj = obj + UtilService.NullToBlanck(item.anioAcursar) + sep;
					obj = obj + UtilService.NullToBlanck(item.nmestreAcursar) + sep;
					obj = obj + UtilService.NullToBlanck(item.turno) + sep;
					if (item.seguimiento)
						obj = obj + 'Seguimiento';
					obj = obj + sep;
					if (item.medioDeContacto !== null)
						obj = obj + UtilService.NullToBlanck(item.medioDeContacto.nombre);
					obj = obj + ret;
				});

				obj = obj.replace(/,/g,';');
				obj = obj.replace(/xSEPx/gi,',');
				obj = obj.replace(/xRETx/gi,'\n');
				var data = 'text/csv;charset=utf-8,' + encodeURIComponent(obj);

				var a = document.getElementById('ancla');
				a.href = 'data:' + data;
				a.download = 'interesados.' +  $filter('date')(new Date(), 'yyyyMMdd.HHmmss') +  '.csv';
				a.click();
				$timeout(function (){$scope.procesandoCSV = false;} , 2000);
			}
		};


		var eliminarInteresado = function eliminarInteresado(interesadoAEliminar) {
			$scope.myStyle.cursor = 'wait';
			$scope.interesadosFiltradosYOrdenados = null; //Asegura que se recargará la lista base a mostrar
			interesadoSrv.eliminar(interesadoAEliminar.interesadoId)
				.then(function () {
					$scope.obtenerInteresados();
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		//Modal Eliminar Interesado
		var eliminarInteresadoPINSecreto = interesadoSrv.pinEliminacion;
		var interesadoAEliminar = null;
		$scope.eliminarInteresadoPIN = null;
		$scope.eliminarInteresadoPINErroneo = false;
		$scope.modalEliminarInteresadoOpen = false;
		$scope.showModalEliminarInteresado = function showModalEliminarInteresado(interesadoSeleccionado) {
			interesadoAEliminar = interesadoSeleccionado;
			$scope.modalEliminarInteresadoOpen = true;
		};

		$scope.closeModalEliminarInteresado = function closeModalEliminarInteresado(eliminarInteresadoPIN) {
			if (eliminarInteresadoPINSecreto === btoa(eliminarInteresadoPIN)) {
				eliminarInteresado(interesadoAEliminar);
				$scope.modalEliminarInteresadoOpen = false;
			} else if (eliminarInteresadoPIN === 'Cancelar')
				$scope.modalEliminarInteresadoOpen = false;
			else
				$scope.eliminarInteresadoPINErroneo = true;
			$scope.eliminarInteresadoPIN = null;
		};
		//Fin Modal Eliminar Interesado
		//Fin Ficha Interesado


		//Evento

		var colocarVencimiento = function colocarVencimiento(item) {
			item.evento.estadoFecha = eventoSrv.calcularVencimiento(item.evento.fecha); //positivo=Futuro 0=Hoy negativo=pasado
		};


		var obtenerEventosPorInteresado = function obtenerEventosPorInteresado(interesadoId) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.getByInteresadoId(interesadoId)
				.then(function (dataResponseOK) {
					var intEvt = dataResponseOK;
					if (intEvt.length > 0) {
						intEvt.forEach(colocarVencimiento);
					}
					$scope.interesadosEventos = intEvt;
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		var obtenerEventosFuturos = function obtenerEventosFuturos() {
			$scope.myStyle.cursor = 'wait';
			eventoSrv.getAll()
				.then(function (dataResponseOK) {
					seleccionarEventosFuturos(dataResponseOK);
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
				});
		};

		var seleccionarEventosFuturos = function seleccionarEventosFuturos(eventos) {
			eventos.forEach(eventoSrv.colocarVencimiento);
			$scope.eventosFuturos = $filter('filter')(eventos, function esFuturo(evento) { return evento.estadoFecha >= 0; });
		};

		var agregarInteresadoEvento = function agregarInteresadoEvento(interesadoEvento) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.crear(interesadoEvento)
				.then(function (dataResponseOK) {
					$scope.eventosFuturos = dataResponseOK;
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
					$scope.altaEvento = false;
					obtenerEventosPorInteresado(interesadoEvento.interesadoId);
				});
		};

		$scope.irAMostrarEventoFuturos = function irAMostrarEventoFuturos() {
			$scope.altaEvento = true;
			obtenerEventosFuturos();
		};

		$scope.irAAgregarInteresadoEvento = function irAAgregarInteresadoEvento(evento, interesado) {
			var interesadoEventoAAgregar = {
				'id': 0,
				'interesadoId': interesado.interesadoId,
				'eventoId': evento.id,
				'observacion': null,
				'inscripto': false,
				'asistente': false
			};
			agregarInteresadoEvento(interesadoEventoAAgregar);
		};

		//Observación sobre la invitación a un evento.
		//Modal Observación sobre la invitación a un evento.
		$scope.interesadoEventoEditando = null;
		$scope.interesadoEventoEditandoOriginal = null;
		$scope.modalInvitacionObservacionOpen = false;
		$scope.showModalInvitacionObservacion = function showModalInvitacionObservacion(interesadoEventoAEditar) {
			$scope.interesadoEventoEditandoOriginal = interesadoEventoAEditar;
			var interesadoEventoModificado = {
				'id': interesadoEventoAEditar.id,
				'interesadoId': interesadoEventoAEditar.interesadoId,
				'eventoId': interesadoEventoAEditar.eventoId,
				'observacion': interesadoEventoAEditar.observacion,
				'inscripto': interesadoEventoAEditar.inscripto,
				'asistente': interesadoEventoAEditar.asistente,
				'evento': interesadoEventoAEditar.evento
			};
			$scope.interesadoEventoEditando = interesadoEventoModificado;
			$scope.modalInvitacionObservacionOpen = true;
		};

		$scope.closeModalInvitacionObservacion = function closeModalInvitacionObservacion() {
			$scope.modalInvitacionObservacionOpen = false;
		};
		//Fin Modal Observación sobre la invitación a un evento.

		$scope.actualizarObservacion = function actualizarObservacion(interesadoEventoAActualizar) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.actualizar(interesadoEventoAActualizar)
				.then(function () {
					$scope.interesadoEventoEditandoOriginal.observacion = interesadoEventoAActualizar.observacion;
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'pointer';
					$scope.modalInvitacionObservacionOpen = false;
				});
		};
		//Observación sobre la invitación a un evento.
		//Fin Evento



	}
]);



