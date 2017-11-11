var EPSSApp = angular.module('EPSSApp');

EPSSApp.service('UtilService', function () {

	this.elevarAlCuadrado = function (num) {
		return num * num;
	};

	this.meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	this.ordinales=['1er','2do','3er','4to','5to','6ro'];

	var obtenerAnioCursadoBase = function obtenerAnioCursadoBase(fechaBase, promocion, cuatrimestre) {
		var anioBase = fechaBase.getFullYear();
		var mesBase = fechaBase.getMonth();
		var anioCursado = (anioBase - promocion) + 1;

		if ((mesBase >= 3 && mesBase < 7) || (mesBase >= 8 && mesBase < 12)) {
			if ((mesBase >= 3 && mesBase < 7) && (cuatrimestre === 101))
				anioCursado--;

			if (anioCursado > 3)
				anioCursado = 'Carrera completa';
			else if (anioCursado === 1)
				anioCursado = '1er Año';
			else if (anioCursado === 2)
				anioCursado = '2do Año';
			else if (anioCursado === 3)
				anioCursado = '3er Año';
		}
		else if (anioCursado >= 4 || (anioCursado === 3 & mesBase === 12 && cuatrimestre === 1))
			anioCursado = 'Carrera completa';

		return anioCursado;
	};

	this.obtenerAnioCursado = function obtenerAnioCursado(promocion, cuatrimestre) {
		var fechaActual = new Date(2016, 9);
		//var fechaActual = new Date();

		return obtenerAnioCursadoBase(fechaActual, promocion, cuatrimestre);
	};

	var obtenerCuatrimestreCursadoBase = function obtenerCuatrimestreCursadoBase(fechaBase, cuatrimestre) {
		var cuatrimestreCursado = '---';
		var mesBase = fechaBase.getMonth();

		if ((mesBase >= 3 && mesBase < 7) || (mesBase >= 8 && mesBase < 12)) {
			if ((mesBase >= 3 && mesBase < 7) && (cuatrimestre === 101))
				cuatrimestreCursado = '1er Cuatrimerstre';
			else
				cuatrimestreCursado = '2do Cuatrimerstre';
		}
		return cuatrimestreCursado;
	};

	this.obtenerCuatrimestreCursado = function obtenerCuatrimestreCursado(cuatrimestre) {
		var fechaActual = new Date(2016, 9);
		//var fechaActual = new Date();

		return obtenerCuatrimestreCursadoBase(fechaActual, cuatrimestre);
	};

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
		return str.toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ü', 'u');
	};


});
