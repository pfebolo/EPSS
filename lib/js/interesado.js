var interesadoMod = angular.module("interesadoModulo", []);


interesadoMod.factory('interesadoSrv', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

	var baseUrl = $rootScope.config.servidor;
	var interesadoService = {};

	//Obtener interesados
	interesadoService.getAll = function getAll(fechaFIN) {
		var deferred = $q.defer();
		console.log("getAll");
		$http({
			url: baseUrl + 'api/interesados/' + fechaFIN,
			method: 'GET',
			//params: { 'searchText': text },
			cache: false
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function (error) {
			deferred.reject(error);
		})
		return deferred.promise;
	}

	//Actualizar interesados
	// interesadoService.update = function update(interesados) {
	// 	var deferred = $q.defer();
	// 	$http({
	// 		url: baseUrl + 'api/interesados',
	// 		method: 'PUT',
	// 		data: interesados
	// 	}).success(function (data) {
	// 		deferred.resolve(data);
	// 	}).error(function (error) {
	// 		deferred.reject(error);
	// 	})
	// 	return deferred.promise;
	// }

	return interesadoService;
}]);


interesadoMod.controller("interesadoControlador",
	function cargarInteresados($rootScope, $scope, $http, interesadoSrv) {
		$scope.GetOK = true;
		$scope.cargando = false;
		$scope.myStyle = { cursor: 'wait' };
		$scope.error = { hayError: false, errores: {} };
		$scope.selectedRow = 0;
		$scope.interesadoSeleccionado = null;
		

		var serializarFecha = function serializarFecha(fecha) {
			return new Date(fecha.substring(6, 10) + "-" + fecha.substring(3, 5) + "-" + fecha.substring(0, 2));
		}

		var deSerializarFecha = function deSerializarFecha(fecha) {
			fechaBase = fecha.toJSON().substr(0, 10);
			return fechaBase.substr(8, 2) + "/" + fechaBase.substr(5, 2) + "/" + fechaBase.substr(0, 4);
		}

		$scope.fechaFIN = deSerializarFecha(new Date());
		
		$scope.obtenerInteresados = function obtenerInteresados(fechaFIN) {
			$scope.cargando = true;
			fechaFINSerializado = serializarFecha(fechaFIN).toJSON().substr(0, 10);
			interesadoSrv.getAll(fechaFINSerializado)
				.then(function (dataResponseOK) {
					var x = decodeURIComponent(JSON.stringify(dataResponseOK).replace(/\+/g, " ").replace(/\% /g, "％ "));
					$scope.interesados = JSON.parse(x.replace(/\t/g, " "));
					$scope.GetOK = true;
					if ($scope.interesados.length > 0)
						$scope.cargarInteresado($scope.interesados[0]);
				})
				.catch(function (dataError) {
					$scope.GetOK = false;
				})
				.finally(function () {
					$scope.cargando = false;
					$scope.myStyle.cursor = 'pointer';
				});
		}

		$scope.obtenerInteresados($scope.fechaFIN);
		
		$scope.actualizarInteresados = function actualizarInteresados(fechaFINElegida) {
			if (fechaFINElegida !== "") {
				$scope.error = { hayError: false, errores: {} };
				$scope.actualizando = true;
				$scope.myStyle.cursor = 'wait';
				$scope.obtenerInteresados(fechaFINElegida);
			}
			else
				$scope.interesados =  null;
		}

		$scope.setClickedRow = function setClickedRow(index) {
			$scope.selectedRow = index;
		}

		$scope.cargarInteresado = function cargarInteresado(interesado) {
			$scope.interesadoSeleccionado = interesado;
		}

	}
)