//
class SoundWindow extends ResourceWindow {

	constructor(/**/) {
		super(...arguments);
	}

	makeResourceClient() {

		this.inputName = add( newTextBox(null, 'Name:') ).$('input');
		this.inputName.addEventListener('input', (e) => {
			this.isModified = true;
			this.changes.name = e.target.value;
		});

		this.makeApplyOkButtons();

	}

	resetChanges() {
		super.resetChanges();
		this.inputName.value = this.resource.name;
	}

}