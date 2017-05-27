var interesadoMod = angular.module('interesadoModulo', ['directives']);


interesadoMod.factory('interesadoSrv', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

	var baseUrl = $rootScope.config.servidor;
	var interesadoService = {};
	interesadoService.interesadoAInscribir = null;

	//Obtener interesados
	interesadoService.getAll = function getAll(fechaFIN) {
		var deferred = $q.defer();
		$http({
			url: baseUrl + 'api/interesados/' + fechaFIN,
			method: 'GET',
			//params: { 'searchText': text },
			cache: false
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	interesadoService.inscribir = function update(preAlumno) {
		var deferred = $q.defer();
		$http({
			url: baseUrl + 'api/alumnos',
			method: 'POST',
			data: preAlumno
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (data, status, headers, config, statusText) {
			var responseError;
			if (data !== '' && data !== null) {
				responseError = data;
			} else {
				responseError = { mensajes: [{ codigo: 'HTTP Status ' + status, mensaje: statusText }] };
			}
			deferred.reject(responseError);
		});

		return deferred.promise;
	};

	return interesadoService;
}]);


interesadoMod.controller('interesadoControlador',
	function cargarInteresados($rootScope, $scope, $http, $location, interesadoSrv) {
		$scope.GetOK = true;
		$scope.cargando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.interesadoSeleccionado = null;



		var serializarFecha = function serializarFecha(fecha) {
			return new Date(fecha.substring(6, 10) + '-' + fecha.substring(3, 5) + '-' + fecha.substring(0, 2));
		};

		var deSerializarFecha = function deSerializarFecha(fecha) {
			var fechaBase = fecha.toJSON().substr(0, 10);
			return fechaBase.substr(8, 2) + '/' + fechaBase.substr(5, 2) + '/' + fechaBase.substr(0, 4);
		};

		$scope.fechaFIN = deSerializarFecha(new Date());
		//$scope.fechaFIN = '01/10/2016';

		$scope.obtenerInteresados = function obtenerInteresados(fechaFIN) {
			$scope.cargando = true;
			var fechaFINSerializado = serializarFecha(fechaFIN).toJSON().substr(0, 10);
			interesadoSrv.getAll(fechaFINSerializado)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, ' ').replace(/\% /g, '％ '));
					$scope.interesados = JSON.parse(x.replace(/\t/g, ' '));
					$scope.GetOK = true;
					if ($scope.interesados.length > 0)
						$scope.cargarInteresado($scope.interesados[0]);
				})
				.catch(function () {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		};

		$scope.obtenerInteresados($scope.fechaFIN);

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

		$scope.cargarInteresado = function cargarInteresado(interesado) {
			$scope.interesadoSeleccionado = interesado;
		};

		$scope.irAinscripcion = function irAinscripcion(interesadoAInscribir) {
			interesadoSrv.interesadoAInscribir = interesadoAInscribir;
			$location.path('/inscripcion');
		};
	}
);


interesadoMod.controller('inscripcionControlador',
	function cargarInteresados($rootScope, $scope, $http, $location, interesadoSrv) {
		$scope.GetOK = true;
		$scope.cargando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.interesadoSeleccionado = interesadoSrv.interesadoAInscribir;
		$scope.anios = [{ anio: 1, descripcion: '1er año' },
		{ anio: 2, descripcion: '2do año' },
		{ anio: 3, descripcion: '3er año' }];
		$scope.anio = $scope.anios[0];
		$scope.nmestres = [{ nmestre: 1, descripcion: '1er Cuatrimestre' },
		{ nmestre: 2, descripcion: '2do Cuatrimestre' }];
		$scope.nmestre = $scope.nmestres[0];
		$scope.modalidades = [{ id: 1, descripcion: 'Presencial' },
		{ id: 2, descripcion: 'A Distancia' }];
		$scope.modalidad = $scope.modalidades[$scope.interesadoSeleccionado.modalidadId === 1 ? 0: 1];
		$scope.turnos = [{ id: 1, descripcion: 'Mañana' },
		{ id: 2, descripcion: 'Tarde' }];
		$scope.turno = null;

		$scope.docAPresentar = {
			'docTitulo': false,
			'docDni': false,
			'docAptoFisico': false,
			'docFoto': false,
			'docCompromiso': false
		};
		$scope.interesadoSeleccionado.situacionEspecial= $scope.interesadoSeleccionado.situacionEspecial === 'Nada' ? null: $scope.interesadoSeleccionado.situacionEspecial;
		$scope.interesadoSeleccionado.situacionInscripcion= $scope.interesadoSeleccionado.situacionInscripcion === 'Nada' ? null: $scope.interesadoSeleccionado.situacionInscripcion;

		$scope.inscribir = function inscribir(fichaIncrispcion) {
			var fechaInscripcion = new Date().toJSON();
			var preAlumno = {
				//Datos provenientes de la ficha de interesado
				'alumnoId': fichaIncrispcion.interesadoId,
				'nombre': fichaIncrispcion.nombre,
				'apellido': fichaIncrispcion.apellido,
				'mail': fichaIncrispcion.mail,
				'mail2': fichaIncrispcion.mail2,
				'telefono': fichaIncrispcion.telefono,
				'celular': fichaIncrispcion.celular,
				'comoConocio': fichaIncrispcion.comoConocio,
				'modalidadId': $scope.modalidad.id,
				'gradoInteres': fichaIncrispcion.gradoInteres,
				'fechaInteresado': fechaInscripcion,  //Se reemplaza por la fecha actual
				'comentario': fichaIncrispcion.comentario,
				'provincia': fichaIncrispcion.provincia,
				'situacionInscripcion': fichaIncrispcion.situacionInscripcion,
				'situacionEspecial': fichaIncrispcion.situacionEspecial,
				
				//Datos específicos de la ficha de Inscripción
				'dni': fichaIncrispcion.dni,
				'domicilio': fichaIncrispcion.domicilio,
				'fechaInteresadoOriginal': fichaIncrispcion.fechaInteresado, //Se conserva la fecha de la ficha de interesado
				'anioAcursar': $scope.anio.anio,
				'nmestreAcursar': $scope.nmestre.nmestre,
				'turno': $scope.modalidad.id===1 ? $scope.turno.descripcion : null,
				'docTitulo': fechaInscripcion,
				'docDni': fechaInscripcion,
				'docAptoFisico': fechaInscripcion,
				'docFoto': fechaInscripcion,
				'docCompromiso': fechaInscripcion
			};
			if (!$scope.docAPresentar.docTitulo)
				preAlumno.docTitulo = null;
			if (!$scope.docAPresentar.docDni)
				preAlumno.docDni = null;
			if (!$scope.docAPresentar.docAptoFisico)
				preAlumno.docAptoFisico = null;
			if (!$scope.docAPresentar.docFoto)
				preAlumno.docFoto = null;
			if (!$scope.docAPresentar.docCompromiso)
				preAlumno.docCompromiso = null;
			$scope.error = { hayError: false, errores: {} };
			interesadoSrv.inscribir(preAlumno)
				.then(function () {
					$location.path('/inscriptoLista');
				})
				.catch(function (responseError) {
					$scope.error.errores = responseError.mensajes;
					$scope.error.hayError = true;
				});
		};
	}
);


