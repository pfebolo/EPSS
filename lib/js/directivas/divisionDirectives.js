'use strict';
var divisionMod = angular.module('divisionModulo');

divisionMod.directive('miCoordinadorFoto', [
	function miCoordinadorFotoImp() {
		return {
			restrict: 'E',
			scope: {
				//coordinadorInfo: '=coordinador'
				coordinador: '='
			},
			template: '<img ng-src="{{coordinador.fotoPath}}"  onerror="this.onerror=null;this.src=\'' + 'img/Persona.png' + '\';" class="img-circle img-thumbnail" width="75" height="75" alt="{{coordinador.nombre}}" data-toogle="tooltip" title="{{coordinador.nombre}}" id="{{coordinador.nombre}}" coordindex="{{coordinador.coordinadorId}}">'
		};
	}
]);

divisionMod.directive('draggableThing', [
	function draggableThingImpl() {
		return {
			restrict: 'A', //attribute only
			link: function link(scope, elem) {
				elem.on('dragstart', scope.dragstart);
			}
		};
	}
]);

divisionMod.directive('droppableArea', [
	function droppableAreaImpl() {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				elem.on('drop',scope.drop);
			}
		};
	}
]);

divisionMod.directive('allowDroppableArea', [
	function allowDroppableAreaImpl() {
		return {
			restrict: 'A',
			link: function allowDrop (scope, elem) {
				elem.on('dragover', scope.dragover);
			}
		};
	}
]);