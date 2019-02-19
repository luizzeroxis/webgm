class HTMLWindowSound extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(sound) {
		this.htmlTitle.textContent = 'Edit Sound '+sound.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-sound', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var inputName = add( newTextBox(null, 'Name:', sound.name) ).$('input');

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(sound, inputName.value);
					//
				},
				() => {
					this.editor.deleteResourceWindow(sound);
				}
			);
			endparent();

	}
}