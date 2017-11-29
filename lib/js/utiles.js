var EPSSApp = angular.module('EPSSApp');

EPSSApp.service('UtilService', function () {

	this.elevarAlCuadrado = function (num) {
		return num * num;
	};

	this.meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	this.ordinales=['1er','2do','3er','4to','5to','6to'];

	this.NullToBlanck = function NullToBlanck(data) {
		var respuesta = '';
		if (data !== null)
			respuesta = data;
		return respuesta;
	};

	this.decodificarDatosViejoSistema = function decodificarDatosViejoSistema(jsonElement) {
		var jsonOK = decodeURIComponent(JSON.stringify(jsonElement).replace(/\+/g, ' ').replace(/%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi, function myReplace(cad) { return cad.replace('%', '％'); }));
		jsonOK = JSON.parse(jsonOK.replace(/\t/g, ' '));
		return jsonOK;
	};

	this.stringToLocale = function stringToLocale(str) {
		return str.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ü/g, 'u');
	};


});
