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

		this.action.args = this.actionType.args.map((argType, i) => {
			return this.inputArgs[i].value;
		})

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