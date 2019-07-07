var EPSSApp = angular.module('EPSSApp');

EPSSApp.service('UtilService', function ($q, $http) {

	this.elevarAlCuadrado = function (num) {
		return num * num;
	};

	this.meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	this.ordinales=['1er','2do','3er','4to','5to','6to'];

	//PickLists
	this.turnos = [{descripcion: 'Mañana' },{descripcion: 'Noche' }];
	this.modalidades = [{ id: 1, descripcion: 'Presencial' },{ id: 2, descripcion: 'A Distancia' }];
	this.anios = [{ anio: 1, descripcion: '1er año' },{ anio: 2, descripcion: '2do año' },{ anio: 3, descripcion: '3er año' }];
	this.cuatrimestres = [{ nmestre: 1, descripcion: '1er Cuatrimestre' },{ nmestre: 2, descripcion: '2do Cuatrimestre' }];

	this.NullToBlanck = function NullToBlanck(data) {
		var respuesta = '';
		if (data !== null)
			respuesta = data;
		return respuesta;
	};

	this.decodificarDatosViejoSistema = function decodificarDatosViejoSistema(jsonElement) {
		try {
			//var jsonOK = decodeURIComponent(JSON.stringify(jsonElement).replace(/\+/g, ' ').replace(/%([^A-F2-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad) { return cad.replace('%', '％'); }));
			var jsonOK = decodeURIComponent(JSON.stringify(jsonElement).replace(/%([^A-F2-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad) { return cad.replace('%', '％'); }));
			jsonOK = JSON.parse(jsonOK.replace(/\t/g, ' '));
			return jsonOK;
		}
		catch (e)  {
			console.error(e);
			throw e;
		}
	};

	this.stringToLocale = function stringToLocale(str) {
		if (str===undefined || str===null )
			str='';
		return str.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ü/g, 'u');
	};


	var iso8601RegEx = /(19|20|21)\d\d([-/.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])T(\d\d)([:/.])(\d\d)([:/.])(\d\d)/;
	
	//Convierte la serialización, de las fechas, por omisión  NET  a una serialización, por omision, de AngularJS
	this.converDate = function converDate(input) {
		if (typeof input !== 'object') return input;

		for (var key in input) {
			if (!input.hasOwnProperty(key)) continue;

			var value = input[key];
			var type = typeof value;
			if (type == 'string' && (value.match(iso8601RegEx)) !== null) {
				input[key] = value.substring(0, 10);
			}
			else if (type === 'object') {
				converDate(value);
			}
		}
	};

	this.getResponseError = function getResponseError(response,url,verbo) {
		var data = response.data;
		var status = response.status;
		var statusText = response.statusText;
		var responseError = { mensajes: [] };
		if (JSON.stringify(data) != '{}' && data !== null && data!==undefined) 
			responseError = data;
		responseError.mensajes.push({ codigo: 'HTTP Status ' + status, mensaje: statusText });
		responseError.mensajes.push({ codigo: 'url', mensaje: url });
		responseError.mensajes.push({ codigo: 'verb', mensaje: verbo });
		return responseError;
	};


	this.getApi = function getApi(api) {
		var deferred = $q.defer();
		var url = api;
		var errorTratado =null;
		var _this = this; //Muy importante para poder referenciar a funciones externas
		var verbo ='GET';
		$http({
			url: url,
			method: verbo,
			headers: {
				'Accept': 'application/json'
			},
			cache: false
		}).then(function (response) {
			deferred.resolve(response.data);
		}).catch(function (response) {
			errorTratado = _this.getResponseError(response,url,verbo); 
			deferred.reject(errorTratado);
		});
		
		return deferred.promise;
	};

	this.putApi = function putApi(api,playload) {
		var deferred = $q.defer();
		var url = api;
		var errorTratado =null;
		var _this = this; //Muy importante para poder referenciar a funciones externas
		var verbo ='PUT';
		$http({
			url: url,
			method: verbo,
			data: playload,
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			cache: false
		}).then(function (response) {
			deferred.resolve(response.data);
		}).catch(function (response) {
			errorTratado = _this.getResponseError(response,url,verbo); 
			deferred.reject(errorTratado);
		});
		
		return deferred.promise;
	};

	this.postApi = function putApi(api,playload) {
		var deferred = $q.defer();
		var url = api;
		var errorTratado =null;
		var _this = this; //Muy importante para poder referenciar a funciones externas
		var verbo ='POST';
		$http({
			url: url,
			method: verbo,
			data: playload,
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			cache: false
		}).then(function (response) {
			deferred.resolve(response.data);
		}).catch(function (response) {
			errorTratado = _this.getResponseError(response,url,verbo); 
			deferred.reject(errorTratado);
		});
		
		return deferred.promise;
	};


	//Verificar la existencia de un archivo
	this.existeArchivo = function existeArchivo(archivo) {
		return $http({
			url: archivo,
			method: 'HEAD',
			cache: false
		});
	};

	this.addDays = function addDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	};

});
