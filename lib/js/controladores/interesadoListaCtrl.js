'use strict';
var interesadoMod = angular.module('interesadoModulo'); // se obtiene el modulo interesadoModulo previamente creado (el modulo está creado previamente)


interesadoMod.controller('interesadoListaControlador', ['$rootScope', '$scope', '$http', '$filter', 'interesadoSrv', 'estudianteSrv', 'interesadoEventoSrv', 'eventoSrv',
	function cargarInteresados($rootScope, $scope, $http, $filter, interesadoSrv, estudianteSrv, interesadoEventoSrv, eventoSrv) {
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

		//Lista Interesados
		var fechaIni=null;
		var ultimoFiltro = '';
		$scope.obtenerInteresados = function obtenerInteresados() {
			$scope.cargando = true;
			fechaIni = performance.now();
			interesadoSrv.getAll()
				.then(function (dataResponseOK) {
					var fechaFin = performance.now();
					var tiempo = fechaFin - fechaIni;
					console.log('load:' + tiempo.toString());
					fechaIni = performance.now();
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad){return cad.replace('%','％');}));
					$scope.interesados = JSON.parse(x.replace(/\t/g, ' '));
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

		
		$scope.reseleccionar = function reseleccionar(filtro) {
			var fechaIni = performance.now();
			var inte = null;
			if (($scope.interesadosFiltradosYOrdenados !== null) && filtro.startsWith(ultimoFiltro)) {
				inte = $scope.interesadosFiltradosYOrdenados;
				console.log('Array origen FiltradosYOrdenados (' + inte.length.toString() + ')');
			} else {
				inte = $scope.interesados;
				console.log('Array origen interesados (' + inte.length.toString() + ')');
			}
			if (filtro!=='' && inte.length > 0) {
				console.log('Filtrar...:' + filtro);
				inte= $filter('filter')(inte, filtro);
				console.log('inte...: ' + inte.length.toString());
			}
			var fechaFin = performance.now();
			var tiempo = fechaFin - fechaIni;
			console.log('Filtrar:' + tiempo.toString());
			fechaIni = performance.now();
			inte = $filter('orderBy')(inte, 'fechaInteresado', true);
			var fechaFin = performance.now();
			var tiempo = fechaFin - fechaIni;
			console.log('Ordenar:' + tiempo.toString());
			fechaIni = performance.now();
			if (typeof inte != 'undefined' && inte.length > 0) {
				$scope.interesadosFiltradosYOrdenados=inte;
				$scope.mostrarPagina(1);
			} else {
				$scope.interesadosFiltradosYOrdenados=[];
				$scope.interesadosFiltradosYOrdenadosPagina=[];
			}
			ultimoFiltro = filtro;
		};

		$scope.mostrarPagina = function mostrarPagina(pagina) {
			var tamañoPagina=100;
			$scope.paginas = Math.ceil($scope.interesadosFiltradosYOrdenados.length /tamañoPagina);
			if (pagina===0) 
				pagina=1;
			if (pagina>$scope.paginas) 
				pagina=$scope.paginas;
			$scope.pagina = pagina;
			var indiceInicial = (pagina-1)*tamañoPagina;
			$scope.interesadosFiltradosYOrdenadosPagina= $scope.interesadosFiltradosYOrdenados.slice(indiceInicial,indiceInicial+tamañoPagina-1);
			$scope.selectedRow=0;
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
			obtenerEventosPorInteresado(interesado.interesadoId);
		};

		$scope.irAinscripcion = function irAinscripcion(interesadoAInscribir) {
			estudianteSrv.exponerInscripcion(interesadoAInscribir);
		};

		$scope.irAcrearInteresado = function irAcrearInteresado() {
			interesadoSrv.exponerCreacion();
		};

		$scope.irAEdicionInteresado = function irAEdicionInteresado(interesadoAEditar) {
			interesadoSrv.exponerEdicion(interesadoAEditar);
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
		var eliminarInteresadoPINSecreto=interesadoSrv.pinEliminacion;
		var interesadoAEliminar=null;
		$scope.eliminarInteresadoPIN=null;
		$scope.eliminarInteresadoPINErroneo=false;
		$scope.modalEliminarInteresadoOpen=false;
		$scope.showModalEliminarInteresado = function showModalEliminarInteresado(interesadoSeleccionado) {
			interesadoAEliminar=interesadoSeleccionado;
			$scope.modalEliminarInteresadoOpen=true;
		};

		$scope.closeModalEliminarInteresado = function closeModalEliminarInteresado(eliminarInteresadoPIN) {
			if (eliminarInteresadoPINSecreto===eliminarInteresadoPIN) {
				eliminarInteresado(interesadoAEliminar);
				$scope.modalEliminarInteresadoOpen=false;
			} else if (eliminarInteresadoPIN==='Cancelar')
				$scope.modalEliminarInteresadoOpen=false;
			else
				$scope.eliminarInteresadoPINErroneo=true;
			$scope.eliminarInteresadoPIN=null;
		};
		//Fin Modal Eliminar Interesado
		//Fin Ficha Interesado


		//Evento
		var obtenerEventosPorInteresado = function obtenerEventosPorInteresado(interesadoId) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.getByInteresadoId(interesadoId)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad){return cad.replace('%','％');}));
					$scope.interesadosEventos = JSON.parse(x.replace(/\t/g, ' '));
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
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad){return cad.replace('%','％');}));
					seleccionarEventosFuturos(JSON.parse(x.replace(/\t/g, ' ')));
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
			$scope.eventosFuturos = $filter('filter')(eventos, function esFuturo(evento) {return evento.estadoFecha>=0;});
		};

		var agregarInteresadoEvento = function agregarInteresadoEvento(interesadoEvento) {
			$scope.myStyle.cursor = 'wait';
			interesadoEventoSrv.crear(interesadoEvento)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad){return cad.replace('%','％');}));
					$scope.eventosFuturos = JSON.parse(x.replace(/\t/g, ' '));
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
		$scope.interesadoEventoEditando=null;
		$scope.interesadoEventoEditandoOriginal=null;
		$scope.modalInvitacionObservacionOpen=false;
		$scope.showModalInvitacionObservacion = function showModalInvitacionObservacion(interesadoEventoAEditar) {
			$scope.interesadoEventoEditandoOriginal=interesadoEventoAEditar;
			var interesadoEventoModificado = {
				'id': interesadoEventoAEditar.id,
				'interesadoId': interesadoEventoAEditar.interesadoId,
				'eventoId': interesadoEventoAEditar.eventoId,
				'observacion': interesadoEventoAEditar.observacion,
				'inscripto': interesadoEventoAEditar.inscripto,
				'asistente': interesadoEventoAEditar.asistente,
				'evento': interesadoEventoAEditar.evento
			};
			$scope.interesadoEventoEditando=interesadoEventoModificado;
			$scope.modalInvitacionObservacionOpen=true;
		};

		$scope.closeModalInvitacionObservacion = function closeModalInvitacionObservacion() {
			$scope.modalInvitacionObservacionOpen=false;
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
					$scope.modalInvitacionObservacionOpen=false;
				});
		};
		//Observación sobre la invitación a un evento.
		//Fin Evento



	}
]);



