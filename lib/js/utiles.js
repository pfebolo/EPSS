EPSSApp.service('UtilService', function () {
	var fechaActual = new Date(2016, 9);
	//var fechaActual = new Date();

	this.elevarAlCuadrado = function (num) {
		return num * num;
	};

	this.obtenerAnioCursado = function obtenerAnioCursado(promocion, cuatrimestre) {
		var anioActual = fechaActual.getFullYear();
		var mesActual = fechaActual.getMonth();

		if ((mesActual >= 3 && mesActual < 7) || (mesActual >= 8 && mesActual < 12)) {
			var anioCursado = (anioActual - promocion) + 1;
			if ((mesActual >= 3 && mesActual < 7) && (cuatrimestre === 101))
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
		return anioCursado;
	};

	this.obtenerCuatrimestreCursado = function obtenerCuatrimestreCursado(cuatrimestre) {
		var cuatrimestreCursado = '---';
		var mesActual = fechaActual.getMonth();

		if ((mesActual >= 3 && mesActual < 7) || (mesActual >= 8 && mesActual < 12)) {
			if ((mesActual >= 3 && mesActual < 7) && (cuatrimestre === 101))
				cuatrimestreCursado = '1er Cuatrimerstre';
			else
				cuatrimestreCursado = '2do Cuatrimerstre';
		}
		return cuatrimestreCursado;
	};


});
