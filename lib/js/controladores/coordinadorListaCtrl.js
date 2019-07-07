var coordinadorMod = angular.module('coordinadorModulo');


coordinadorMod.controller('coordinadorListaControlador', ['$rootScope', '$scope', '$http', '$filter', '$q', 'coordinadorSrv',
	function gestionarCoordinadores($rootScope, $scope, $http, $filter, $q, coordinadorSrv) {
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.cargando = true;
		$scope.coordinadores = [];
		$scope.coordinadoresAgupados = [];
		$scope.mostrarActivos = true;
		$scope.mostrarDesactivos = false;

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

		var agruparCoordinadores = function agruparCoordinadores(coordinadores) {
			$scope.coordinadoresAgupados = [];
			for (var i = 0; i < coordinadores.length; i = i + 4)
				$scope.coordinadoresAgupados.push(coordinadores.slice(i, i + 4));
		};

		var verficarFoto = function verficarFoto(coordinador) {
			coordinadorSrv.existeFoto(coordinador.fotoPath)
				.catch(function () {
					coordinador.fotoPath = 'img/Persona.png';
				});
		};

		$scope.filtroSeteado = function filtroSeteado(coordinador) {
			return ((coordinador.activo && $scope.mostrarActivos) || (!coordinador.activo && $scope.mostrarDesactivos));
		};

		var filtarCoordinadores = function filtarCoordinadores(coordinadores) {
			var coordinadoresOrdenados = $filter('orderBy')(coordinadores, 'nombre');
			coordinadoresOrdenados = $filter('filter')(coordinadoresOrdenados, $scope.filtroSeteado);
			coordinadoresOrdenados.forEach(verficarFoto, this);
			return coordinadoresOrdenados;
		};

		$scope.mostrarCoordinadores = function mostrarCoordinadores(coordinadores) {
			$scope.coordinadores = coordinadores;
			agruparCoordinadores(filtarCoordinadores(coordinadores));
		};

		$scope.CargarPagina = function CargarPagina() {
			$scope.myStyle.cursor = 'wait';
			$scope.error.hayError = false;
			$scope.cargando = true;
			ObtenerCoordinadores()
				.then($scope.mostrarCoordinadores)
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'auto';
				});
		};

		$scope.CargarPagina();






		//INI-Edicion de Coordinador.
		//Modal Editar
		$scope.coordinadorEditando = null;
		$scope.modalCoordinadorOpen = false;
		$scope.coordinadorBase = false;
		$scope.editando = true;  //Editando o Agragando

		var copiarCoordinador = function copiarCoordinador(coordinadorOrigen, coordinadorDestino) {
			coordinadorDestino.coordinadorId = coordinadorOrigen.coordinadorId;
			coordinadorDestino.nombre = coordinadorOrigen.nombre;
			coordinadorDestino.fotoPath = coordinadorOrigen.fotoPath;
			coordinadorDestino.telefonoFijo = coordinadorOrigen.telefonoFijo;
			coordinadorDestino.telefonoCelular = coordinadorOrigen.telefonoCelular;
			coordinadorDestino.email = coordinadorOrigen.email;
			coordinadorDestino.comentarios = coordinadorOrigen.comentarios;
			coordinadorDestino.activo = coordinadorOrigen.activo;
		};


		$scope.showModalCoordinador = function showModalCoordinador(coordinador,accion) {
			if (accion==='Agregar')
				showAgregarCoordinador();
			else
				showEditarCoordinador(coordinador);
			$scope.modalCoordinadorOpen = true;
		};

		var showEditarCoordinador = function showEditarCoordinador(coordinador) {
			$scope.coordinadorBase = coordinador;
			$scope.coordinadorEditando={};
			copiarCoordinador(coordinador, $scope.coordinadorEditando);
			$scope.editando = true;
		};

		var showAgregarCoordinador = function showAgregarCoordinador() {
			var coordinadorNuevo = {};
			coordinadorNuevo.nombre = null;
			coordinadorNuevo.fotoPath = 'img/Persona.png';
			coordinadorNuevo.telefonoFijo = null;
			coordinadorNuevo.telefonoCelular = null;
			coordinadorNuevo.email = null;
			coordinadorNuevo.comentarios = null;
			coordinadorNuevo.activo = true;
			$scope.coordinadorEditando=coordinadorNuevo;
			$scope.editando = false;
		};


		$scope.closeModalCoordinador = function closeModalCoordinador() {
			$scope.modalCoordinadorOpen = false;
		};
		//Fin Modal Editar.

		$scope.agregarCoordinador = function agregarCoordinador(CoordinadorAAgregar) {
			$scope.myStyle.cursor = 'wait';
			$scope.error.hayError = false;
			$scope.cargando = true;
			coordinadorSrv.crear(CoordinadorAAgregar)
				.then(function () {
					//$scope.coordinadores.push(CoordinadorAAgregar);
					ObtenerCoordinadores().then($scope.mostrarCoordinadores);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'auto';
					$scope.cargando = false;
					$scope.modalCoordinadorOpen = false;
				});
		};

		$scope.actualizarCoordinador = function actualizarCoordinador(CoordinadorAActualizar) {
			$scope.myStyle.cursor = 'wait';
			$scope.error.hayError = false;
			$scope.cargando = true;
			coordinadorSrv.actualizar(CoordinadorAActualizar)
				.then(function () {
					copiarCoordinador(CoordinadorAActualizar, $scope.coordinadorBase);
					//ObtenerCoordinadores().then(mostrarCoordinadores);
				})
				.catch(function (responseError) {
					Array.prototype.push.apply($scope.error.errores, responseError.mensajes);
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'auto';
					$scope.cargando = false;
					$scope.modalCoordinadorOpen = false;
				});
		};

		$scope.eliminarCoordinador = function eliminarCoordinador(coordinadorAEliminar) {
			$scope.myStyle.cursor = 'wait';
			coordinadorSrv.eliminarCoordinador(coordinadorAEliminar.coordinadorId)
				.then(function () {
					agruparCoordinadores($scope.coordinadores);
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				})
				.finally(function () {
					$scope.myStyle.cursor = 'auto';
					$scope.modalCoordinadorOpen = false;
				});
		};


		//FIN-Edición de Coordinador

	}
]);