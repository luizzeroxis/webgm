class HTMLWindowGameInformation extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(gameInformation) {
		this.htmlTitle.textContent = 'Game Information';

		parent(this.htmlClient)

			this.textareaText = add( newElem('code', 'textarea', gameInformation.text) )

			this.makeApplyOkButtons(
				() => {
					gameInformation.text = this.textareaText.value;
					// changes here
				},
				() => this.editor.deleteWindow(this)
			);
			endparent();
	}
}