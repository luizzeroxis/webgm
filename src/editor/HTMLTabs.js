import {$, parent, endparent, add, remove, newElem, newRadioBox, uniqueID} from '../common/H.js'

export default class HTMLTabs {

	constructor() {

		this.html = parent( add( newElem(null, 'div') ) )
			this.tabsDiv = add( newElem(null, 'div') )
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
			
			var radio = add( newRadioBox('tab', name, this.radioGroup, select) )
			$(radio, 'input').addEventListener('click', () => {
				this.showTabContentDiv(contentDiv);
			})

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