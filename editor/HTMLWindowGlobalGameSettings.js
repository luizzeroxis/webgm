class HTMLWindowGlobalGameSettings extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(globalGameSettings) {
		this.htmlTitle.textContent = 'Global Game Settings';

		parent(this.htmlClient)

			this.inputColor = add( newColorBox(null, 'Color outside the room region:', globalGameSettings.colorOutsideRoom) ).$('input')

			this.makeApplyOkButtons(
				() => {
					globalGameSettings.colorOutsideRoom = this.inputColor.value;
				},
				() => this.editor.deleteWindow(this)
			);
			endparent();
	}
}