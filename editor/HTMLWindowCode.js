class HTMLWindowCode extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(action, object) {

		this.action = action;
		this.object = object;

		this.htmlTitle.textContent = 'Execute code';

		parent(this.htmlClient)
			add( newElem(null, 'div') )

			var appliesToGroup = '_radio_'+uniqueID();
			this.radioAppliesToSelf = add( newRadioBox(null, 'Self',
				appliesToGroup, (action.appliesTo == -1)) ).$('input')
			this.radioAppliesToOther = add( newRadioBox(null, 'Other',
				appliesToGroup, (action.appliesTo == -2)) ).$('input')
			this.radioAppliesToObject = add( newRadioBox(null, 'Object:',
				appliesToGroup, (action.appliesTo >= 0)) ).$('input')

			this.selectObject = this.makeResourceSelect(null, '', 'ProjectObject').$('select');
			if (action.appliesTo >= 0)
				this.selectObject.value = action.appliesTo;

			this.textareaCode = add( newElem('code', 'textarea', action.args[0]) )

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => this.editor.deleteWindow(this)
			);
			endparent();
	}

	apply() {
		this.action.args[0] = this.textareaCode.value;
		this.action.appliesTo = (
			this.radioAppliesToSelf.checked ? -1 :
			this.radioAppliesToOther.checked ? -2 :
			this.radioAppliesToObject.checked ? this.selectObject.value :
			null
		);
	}

	close() {
		this.object.deleteActionWindow(this);
	}
}