class HTMLWindowAction extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(action, object) {

		this.action = action;
		this.object = object;

		this.actionType = this.editor.getActionType(action.typeLibrary, action.typeId);

		this.htmlTitle.textContent = this.actionType.description;

		parent(this.htmlClient)
			add( newElem(null, 'div') )

			if (this.actionType.hasApplyTo) {
				//
			}

			if (this.actionType.kind == 'normal') {
				if (this.actionType.interfaceKind == 'normal') {

					this.inputArgs = [];

					this.actionType.args.forEach((argType, i) => {

						if (['expression', 'string', 'both'].includes(argType.kind)) {
							this.inputArgs[i] = add( newTextBox(null, argType.name, action.args[i]) ).$('input');
						// } else if (['boolean'].includes(argType.kind)) {
						// 	//
						// } else if (['menu'].includes(argType.kind)) {
						// 	// argType.menu
						} else if (['color'].includes(argType.kind)) {
							this.inputArgs[i] = add( newColorBox(null, argType.name,
								decimalColorToRGB(action.args[i])) ).$('input');
						}

					})
				} else if (this.actionType.interfaceKind == 'arrows') {

					this.inputArgs = [];

					var directions = parseArrowString(action.args[0]);
					var speed = action.args[1];

					var directionNames = ['down left', 'down', 'down right', 'left', 'stop', 'right', 'up left', 'up', 'up right'];

					this.inputDirections = [];

					parent( add( newElem('arrow-interface', 'div') ) );

						for (var y=2; y>=0; --y)
						for (var x=0; x<=2; ++x) {
							var i = (3*y)+x;
							this.inputDirections[i] = add( newCheckBox(null, directionNames[i], directions[i]) ).$('input');
						}

						endparent();

					this.inputArgs[1] = add( newTextBox(null, "Speed:", speed) ).$('input');

				} else if (actionType.kind == 'repeat') {
					// TODO repeat interface
				} else if (actionType.kind == 'variable') {
					// TODO variable set interface
				}
			}

			if (this.actionType.hasRelative) {
				this.inputRelative = add( newCheckBox(null, "Relative", action.relative) ).$('input');
			}

			if (this.actionType.isQuestion) {
				this.inputNot = add( newCheckBox(null, "NOT", action.not) ).$('input');
			}

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => this.editor.deleteWindow(this)
			);
			
			endparent();
	}

	apply() {

		var args = [];
		if (this.actionType.interfaceKind == 'normal') {
			args = this.actionType.args;
		} else if (this.actionType.interfaceKind == 'arrows') {
			args = [ {type: 'string'}, {type: 'expression'} ];
		} else if (this.actionType.interfaceKind == 'repeat') {
			args = [ {type: 'expression'} ];
		} else if (this.actionType.interfaceKind == 'variable') {
			args = [ {type: 'string'}, {type: 'expression'} ];
		}

		if (this.actionType.interfaceKind == 'arrows') {

			var values = this.inputDirections.map(x => x.checked);

			this.action.args[0] = stringifyArrowValues(values);
			this.action.args[1] = this.inputArgs[1].value;

		} else {
			this.action.args = args.map((argType, i) => {
				return this.inputArgs[i].value;
			});
		}

		if (this.actionType.hasApplyTo)
			this.action.appliesTo = -1;

		if (this.actionType.hasRelative)
			this.action.relative = this.inputRelative.checked;

		if (this.actionType.isQuestion)
			this.action.not = this.inputNot.checked;

	}

	close() {
		this.object.deleteActionWindow(this);
	}
}