'use strict';
var gruposMod = angular.module('grupoModulo');

gruposMod.controller('grupoEdicionControlador', ['$scope', '$http', '$filter', '$location', '$timeout', 'UtilService', 'legajoSrv',
	function CargarGrupos($scope, $http, $filter, $location, $timeout, UtilService, legajoSrv) {
		$scope.GetOK = true;
		$scope.cargando = true;
		$scope.error = { hayError: false, errores: {} };
		

		legajoSrv.getAll()
			.then(function (responseOK) {
				var x = decodeURIComponent(JSON.stringify(responseOK).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad) { return cad.replace('%', '％'); }));
				$scope.legajos = JSON.parse(x.replace(/\t/g, ' '));
				$scope.legajosFiltrados = [];
				$scope.reseleccionar('');
				$scope.GetOK = true;
			})
			.catch(function () {
				$scope.GetOK = false;
			})
			.finally(function () {
				$scope.cargando = false;
			});


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
			legajoSrv.scrollRowEdit = $scope.divscr.scrollTop;
		};


		var orderApellidoYNombre = function orderApellidoYNombre(item) {
			item.alumno.apellidoYNombre = item.alumno.apellido.trim() + ', ' + item.alumno.nombre.trim();
			return item.alumno.apellidoYNombre;
		};

		var customComparator = function (input, search) {
			var encontrado = false;
			if (angular.isString(input))
				var inputLocale = stringToLocale(input);
			if (typeof input === 'string')
				encontrado = input.includes(search) || inputLocale.includes(search);
			else if (typeof input !== 'object')
				encontrado = input.toString().includes(search);
			return encontrado;
		};

		var stringToLocale = function (str) {
			return str = str.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ü', 'u');
		};



		$scope.reseleccionar = function reseleccionar(filtro) {
			var leg = $filter('filter')($scope.legajos, stringToLocale(filtro), customComparator);
			leg = $filter('orderBy')(leg, orderApellidoYNombre);  //ordena Por Apellido+Nombre para buscar duplicados
			if (typeof leg != 'undefined' && leg.length > 0) {
				$scope.legajosFiltrados = leg;
			} else
				$scope.legajosFiltrados = [];
		};


	}
]);


