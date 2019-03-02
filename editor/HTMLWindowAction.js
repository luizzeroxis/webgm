class HTMLWindowAction extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(action, object) {

		this.action = action;
		this.object = object;

		this.htmlTitle.textContent = action.type.name;

		parent(this.htmlClient)
			add( newElem(null, 'div') )

			this.inputArg = [];
			action.type.args.forEach((arg, i) => {
				if (arg.type == 'string') {
					this.inputArg[i] = add( newTextBox(null, arg.name, action.args[i]) ).$('input');
				}
			})

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => this.editor.deleteWindow(this)
			);
			
			endparent();
	}

	apply() { 
		this.action.args = this.inputArg.map(x => x.value);
	}

	close() {
		this.object.deleteActionWindow(this);
	}
}