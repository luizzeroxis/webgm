//
class SoundWindow extends Window {

	constructor(/**/) {
		super(...arguments);
	}

	makeClient() {

		this.inputName = add( newTextBox(null, 'Name:') ).$('input');
		this.inputName.addEventListener('input', (e) => {
			this.isModified = true;
			this.changes.name = e.target.value;
		});

	}

	resetChanges() {
		super.resetChanges();
		this.inputName.value = this.resource.name;
	}

}