import {parent, endparent, add, HElement, HTextInput, HColorInput, HCheckBoxInput, HRadioInput, HSelectWithOptions, uniqueID} from '../../common/H.js'
import {ProjectObject} from '../../common/Project.js';
import {parseArrowString, stringifyArrowValues, decimalColorToHexColor, hexColorToDecimalColor} from '../../common/tools.js'
import HResourceSelect from '../HResourceSelect.js';
import HWindow from '../HWindow.js';

export default class HWindowAction extends HWindow {

	constructor(editor, id, action, object) {
		super(editor, id);

		this.action = action;
		this.object = object;

		this.actionType = this.editor.getActionType(action.typeLibrary, action.typeId);

		this.title.html.textContent = this.actionType.description;

		var actionTypeInfo = this.object.getActionTypeInfo();
		var actionTypeInfoItem = actionTypeInfo.find(x => x.kind == this.actionType.kind && x.interfaceKind == this.actionType.interfaceKind);

		parent(this.client)

			this.actionTypeHasApplyTo = this.actionType.hasApplyTo;
			if (this.actionType.hasApplyTo == undefined) {
				this.actionTypeHasApplyTo = actionTypeInfoItem.hasApplyTo;
			}

			if (this.actionTypeHasApplyTo) {

				parent( add( new HElement('fieldset') ) )

					add( new HElement('legend', {}, 'Applies to') )

					var appliesToGroup = '_radio_'+uniqueID();

					this.radioAppliesToSelf = add( new HRadioInput(appliesToGroup, 'Self', (action.appliesTo == -1)) );
					this.radioAppliesToOther = add( new HRadioInput(appliesToGroup, 'Other', (action.appliesTo == -2)) );
					this.radioAppliesToObject = add( new HRadioInput(appliesToGroup, 'Object:', (action.appliesTo >= 0)) );

					this.selectObject = add( new HResourceSelect(this.editor, null, ProjectObject) )

					if (action.appliesTo >= 0)
						this.selectObject.setValue(action.appliesTo);

					endparent()

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
				this.inputRelative = add( new HCheckBoxInput("Relative", action.relative) );
			}

			this.actionTypeIsQuestion = this.actionType.isQuestion;
			if (this.actionTypeIsQuestion == undefined) {
				this.actionTypeIsQuestion = actionTypeInfoItem.isQuestion;
			}

			if (this.actionTypeIsQuestion) {
				this.inputNot = add( new HCheckBoxInput("NOT", action.not) );
			}

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => {
					this.object.deleteActionWindow(this.id);
					this.close();
				},
			);
			
			endparent();
	}

	makeTextInterface(name, value) {
		var input = add( new HTextInput(name, value) );
		return {
			getValue: () => input.getValue(),
		}
	}

	makeDirectionInterface(name, value) {
		var directions = parseArrowString(value);
		var directionNames = ['down left', 'down', 'down right', 'left', 'stop', 'right', 'up left', 'up', 'up right'];

		var inputs = [];

		add( new HElement('span', {}, name) )

		parent( add( new HElement('div', {class: 'arrow-interface'}) ) );

			for (var y=2; y>=0; --y)
			for (var x=0; x<=2; ++x) {
				var i = (3*y)+x;
				inputs[i] = add( new HCheckBoxInput(directionNames[i], directions[i]) );
			}

			endparent();

		return {
			getValue: () => stringifyArrowValues(inputs.map(x => x.getChecked())),
		}
	}

	makeMenuInterface(name, optionNames, value) {

		var options = optionNames.map((text, index) => ({name: text, value: index}));

		var select = add( new HSelectWithOptions(name, options) );
		select.setSelectedIndex(value);

		return {
			getValue: () => parseInt(select.getValue()),
		}
	}

	makeColorInterface(name, value) {
		var input = add( new HColorInput(name, decimalColorToHexColor(value)) );
		return {
			getValue: () => hexColorToDecimalColor(input.getValue()),
		}
	}

	makeResourceInterface(name, resourceTypeName, value) {
		var resourceType = this.object.constructor.actionArgResourceTypes[resourceTypeName];

		var select = add( new HResourceSelect(this.editor, name, resourceType) )
		select.setValue(value);

		return {
			getValue: () => select.getValue(),
		}
	}

	apply() {

		for (var i = 0; i < this.action.args.length; i++) {
			this.action.args[i] = {kind: this.actionTypeArgs[i].kind, value: this.argsInterfaces[i].getValue()};
		}

		if (this.actionTypeHasApplyTo) {
			this.action.appliesTo = (
				this.radioAppliesToSelf.getChecked() ? -1 :
				this.radioAppliesToOther.getChecked() ? -2 :
				this.radioAppliesToObject.getChecked() ? this.selectObject.getValue() :
				null
			);
		}

		if (this.actionTypeHasRelative)
			this.action.relative = this.inputRelative.getChecked();

		if (this.actionTypeIsQuestion)
			this.action.not = this.inputNot.getChecked();

		// Update action in event in object
		this.object.updateSelectActions();

	}

}