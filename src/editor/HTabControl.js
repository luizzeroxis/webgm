import {parent, endparent, add, remove, HElement, HRadioInput, uniqueID} from '../common/H.js'

export default class HTabControl extends HElement {

	constructor() {
		parent( super('div') )
			this.tabButtonsDiv = add( new HElement('div', {class: 'tab-buttons'}) )
			this.currentTabContent = null;
			endparent()

		this.radioGroup = '_radio_'+uniqueID();
	}

	addTab(name, isSelected) {

		if (isSelected == null) {
			isSelected = (this.currentTabContent == null);
		}

		var tabContent = new HElement('div', {class: 'tab-content'})

		if (isSelected) {
			this.showTabContent(tabContent);
		}

		parent(this.tabButtonsDiv)

			var radio = add( new HRadioInput(this.radioGroup, name, isSelected, 'tab-button') )
			radio.setOnClick(() => {
				this.showTabContent(tabContent);
			});

			endparent()

		return tabContent;

	}

	showTabContent(tabContent) {

		if (this.currentTabContent) {
			remove(this.currentTabContent);
		}

		parent(this)
			this.currentTabContent = add( tabContent );
			endparent()

	}

}