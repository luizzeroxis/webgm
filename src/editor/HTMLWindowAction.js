import HTMLWindow from './HTMLWindow.js';

import {$, parent, endparent, add, newElem, newTextBox, newCheckBox, newSelect, newColorBox} from '../common/H.js'
import {parseArrowString, stringifyArrowValues, hexColorToDecimalColor} from '../common/tools.js'

import HTMLResourceSelect from './HTMLResourceSelect.js';
import {ProjectSprite, ProjectSound, ProjectBackground, ProjectPath, ProjectScript, ProjectObject, ProjectRoom, ProjectFont, ProjectTimeline} from '../common/Project.js';

export default class HTMLWindowAction extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(action, object) {

		this.action = action;
		this.object = object;

		this.actionType = this.editor.getActionType(action.typeLibrary, action.typeId);

		this.htmlTitle.textContent = this.actionType.description;

		var actionTypeInfo = this.object.getActionTypeInfo();
		var actionTypeInfoItem = actionTypeInfo.find(x => x.kind == this.actionType.kind && x.interfaceKind == this.actionType.interfaceKind);

		parent(this.htmlClient)
			add( newElem(null, 'div') )

			this.actionTypeHasApplyTo = this.actionType.hasApplyTo;
			if (this.actionType.hasApplyTo == undefined) {
				this.actionTypeHasApplyTo = actionTypeInfoItem.hasApplyTo;
			}

			if (this.actionTypeHasApplyTo) {
				//
			}

			this.actionTypeArgs = this.actionType.args;
			if (this.actionType.args == undefined) {
				this.actionTypeArgs = actionTypeInfoItem.args;
			}

			this.argsInterfaces = [];

			this.actionTypeArgs.forEach((argType, i) => {

				switch (argType.kind) {
					case 'expression':
					case 'string':
					case 'both':
						if (this.actionType.interfaceKind == 'arrows' && i == 0) {
							this.argsInterfaces[i] = this.makeDirectionInterface(argType.name, action.args[i].value);
						} else {
							this.argsInterfaces[i] = this.makeTextInterface(argType.name, action.args[i].value);
						}
						break;

					case 'boolean':
						this.argsInterfaces[i] = this.makeMenuInterface(argType.name, ['false', 'true'], action.args[i].value);
						break;

					case 'menu':
						this.argsInterfaces[i] = this.makeMenuInterface(argType.name, argType.menu, action.args[i].value);
						break;

					case 'color':
						this.argsInterfaces[i] = this.makeColorInterface(argType.name, action.args[i].value);
						break;

					case 'sprite':
					case 'sound':
					case 'background':
					case 'path':
					case 'script':
					case 'object':
					case 'room':
					case 'font':
					case 'timeline':
						this.argsInterfaces[i] = this.makeResourceInterface(argType.name, argType.kind, action.args[i].value);
						break;
				}

			})

			this.actionTypeHasRelative = this.actionType.hasRelative;
			if (this.actionTypeHasRelative == undefined) {
				this.actionTypeHasRelative = actionTypeInfoItem.hasRelative;
			}

			if (this.actionTypeHasRelative) {
				this.inputRelative = $( add( newCheckBox(null, "Relative", action.relative) ), 'input');
			}

			this.actionTypeIsQuestion = this.actionType.isQuestion;
			if (this.actionTypeIsQuestion == undefined) {
				this.actionTypeIsQuestion = actionTypeInfoItem.isQuestion;
			}

			if (this.actionTypeIsQuestion) {
				this.inputNot = $( add( newCheckBox(null, "NOT", action.not) ), 'input');
			}

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => {
					this.close()
				},
			);
			
			endparent();
	}

	makeTextInterface(name, value) {
		var input = $( add( newTextBox(null, name, value) ), 'input');
		return {
			getValue: () => input.value,
		}
	}

	makeDirectionInterface(name, value) {
		var directions = parseArrowString(value);
		var directionNames = ['down left', 'down', 'down right', 'left', 'stop', 'right', 'up left', 'up', 'up right'];

		var inputs = [];

		add( newElem(null, 'span', name) )

		parent( add( newElem('arrow-interface', 'div') ) );

			for (var y=2; y>=0; --y)
			for (var x=0; x<=2; ++x) {
				var i = (3*y)+x;
				inputs[i] = $( add( newCheckBox(null, directionNames[i], directions[i]) ), 'input');
			}

			endparent();

		return {
			getValue: () => stringifyArrowValues(inputs.map(x => x.checked)),
		}
	}

	makeMenuInterface(name, optionNames, value) {
		var options = optionNames.map((name, value) => ({name, value}));
		var select = $( add( newSelect(null, name, options) ), 'select');
		select.selectedIndex = value;
		return {
			getValue: () => parseInt(select.value),
		}
	}

	makeColorInterface(name, value) {
		var input = $( add( newColorBox(null, name, hexColorToDecimalColor(value)) ), 'input');
		return {
			getValue: () => hexColorToDecimalColor(input.value),
		}
	}

	makeResourceInterface(name, resourceTypeName, value) {
		// TODO I am too lazy, this is garbage
		var resourceType = {
			'sprite': ProjectSprite,
			'sound': ProjectSound,
			'background': ProjectBackground,
			'path': ProjectPath,
			'script': ProjectScript,
			'object': ProjectObject,
			'room': ProjectRoom,
			'font': ProjectFont,
			'timeline': ProjectTimeline,
		}[resourceTypeName];

		var select = new HTMLResourceSelect(this.editor, name, resourceType);
		select.setValue(value);

		return {
			getValue: () => select.getValue(),
		}
	}

	apply() {

		for (var i = 0; i < this.action.args.length; i++) {
			this.action.args[i] = {kind: this.actionTypeArgs[i].kind, value: this.argsInterfaces[i].getValue()};
		}

		if (this.actionTypeHasApplyTo)
			this.action.appliesTo = -1;

		if (this.actionTypeHasRelative)
			this.action.relative = this.inputRelative.checked;

		if (this.actionTypeIsQuestion)
			this.action.not = this.inputNot.checked;

		// Update action in event in object
		this.object.updateSelectActions();

	}

	close() {
		this.object.deleteActionWindow(this);
	}
}