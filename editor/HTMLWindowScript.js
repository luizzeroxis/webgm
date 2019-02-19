class HTMLWindowScript extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(script) {
		this.htmlTitle.textContent = 'Edit Script '+script.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-script', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var inputName = add( newTextBox(null, 'Name:', script.name) ).$('input');

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(script, inputName.value);
					// changes here
				},
				() => {
					this.editor.deleteResourceWindow(script);
				}
			);
			endparent();
	}
}