var legajoDigitalMod = angular.module("legajoDigitalModulo", []);

legajoDigitalMod.controller("legajoDigitalModalildadesControlador",
	function CargarModalidadesSimple($scope) {
		$scope.modalidades = [
			{
				'modalidadId': 1,
				'nombre': 'Carrera presencial'
			},
			{
				'modalidadId': 2,
				'nombre': 'Carrera a distancia'
			},
			{
				'modalidadId': 3,
				'nombre': 'Especialización presencial'
			}
		]
	}
)

legajoDigitalMod.controller("modalidadesCControlador",
		function CargarModalidadesC($scope, $http) {

		//$http.defaults.headers.get = {
		//	"Access-Control-Allow-Origin": "*",
		//	"Access-Control-Allow-Headers": "X-Requested-With",
		//	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
		//	"Origin": "*"
		//};

		$http.get('http://localhost:5000/api/modalidad').success(function (data) {
			$scope.modalidades = data;
			//$orderGuitar = 'nombre';
		});
		}
)

