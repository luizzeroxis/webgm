//
class ObjectWindow extends ResourceWindow {

	constructor(/**/) {
		super(...arguments);
	}

	makeResourceClient() {

		parent( add( newElem('grid-object', 'div') ) )
			parent( add( newElem(null, 'div') ) )

				this.inputName = add( newTextBox(null, 'Name:') ).$('input');
				this.inputName.addEventListener('input', (e) => { this.isModified = true;
					this.changes.name = e.target.value;
				});

				this.selectSpriteIndex = add( newResourceSelect(null, 'Sprite:', 'sprite', this.editor) )
				this.selectSpriteIndex.$('select').addEventListener('input', (e) => { this.isModified = true;
					this.changes.sprite_index = e.target.value;
				});

				this.inputVisible = add( newCheckBox(null, 'Visible') ).$('input')
				this.inputVisible.addEventListener('input', (e) => { this.isModified = true;
					this.changes.visible = e.target.checked;
				});

				this.inputDepth = add( newNumberBox(null, 'Depth:', null, 1) ).$('input');
				this.inputDepth.addEventListener('input', (e) => { this.isModified = true;
					this.changes.depth = e.target.value;
				});

				endparent()

			parent( add( newElem(null, 'div') ) )

				add( newElem(null, 'div', 'Events:') )

				this.selectEvents = parent( add( html('select', {class: 'events', size: 2}) ) )
					//add( html('option', {value: 'create'}, null, 'Create') )
					endparent()

				parent( add( newElem(null, 'div') ) )
					add( newButton(null, 'Add Event', () => {

						var m = new Modal();
						parent( m.client )
							add( newButton(null, 'Create', () => {this.addEvent('create'); m.close();}) )
							add( newButton(null, 'Step', () => {

								var c = new ContextMenu([
									{id: 'beginstep', text: 'Begin Step',
										click: () => { this.addEvent('step', 'beginstep'); m.close(); }},
									{id: 'step', text: 'Step',
										click: () => { this.addEvent('step', 'step'); m.close(); }},
									{id: 'endstep', text: 'End Step',
										click: () => { this.addEvent('step', 'endstep'); m.close(); }},
								]);

							}) )
							add( newButton(null, 'Draw', () => {this.addEvent('draw'); m.close();}) )
							endparent()

					}) )
					endparent()

				parent( add( newElem(null, 'div') ) )
					add( newButton(null, 'Delete', () => {}) )
					add( newButton(null, 'Change', () => {}) )
					endparent()

				endparent()

			parent( add( newElem(null, 'div') ) )

				add( newElem(null, 'div', 'Actions:') )

				endparent()

			parent( add( newElem(null, 'div') ) )

				endparent()

			endparent()

		this.makeApplyOkButtons();

	}

	resetChanges() {
		super.resetChanges();

		this.inputName.value = this.resource.name;

		if (this.resource.sprite_index >= 0) {
			this.selectSpriteIndex.$('select').value = this.resource.sprite_index;
		} else {
			this.selectSpriteIndex.$('select').selectedIndex = 0;
		}
		this.inputVisible.checked = this.resource.visible;
		this.inputDepth.value = this.resource.depth;

		this.events = this.resource.events;
	}

	addEvent(type, subtype) {
		parent(this.selectEvents)
			add( html('option', {value: type+''+subtype }, null, 'Create') )
			endparent()
	}

}