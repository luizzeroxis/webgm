import {parent, endparent, add, remove, HRadioInput, newElem, uniqueID} from '../common/H.js'

export default class HTMLTabs {

	constructor(classes) {

		this.html = parent( add( newElem(classes, 'div') ) )
			this.tabsDiv = add( newElem('tabs', 'div') )
			this.contentsDiv = null;
			endparent()

		this.radioGroup = '_radio_'+uniqueID();

	}

	addTab(name, select) {

		if (!select) {
			select = (this.contentsDiv == null);
		}

		var contentDiv = newElem('tab-content', 'div')

		if (select) {
			this.showTabContentDiv(contentDiv);
		}

		parent(this.tabsDiv)

			var radio = add( new HRadioInput(this.radioGroup, name, select, 'tab') )
			radio.setOnClick(() => {
				this.showTabContentDiv(contentDiv);
			});

			endparent()

		return contentDiv;

	}

	showTabContentDiv(contentDiv) {
		if (this.contentsDiv) {
			remove(this.contentsDiv);
		}
		parent(this.html)
			this.contentsDiv = add( contentDiv );
			endparent()
	}

}