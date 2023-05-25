import {parent, endparent, add, HElement, HRadioInput, uniqueID} from "~/common/h";

import "./HTabControl.scss";

export default class HTabControl extends HElement {
	constructor(_class) {
		parent( super("div", {class: _class}) );
			this.tabButtonsDiv = add( new HElement("div", {class: "h-tab-buttons"}) );
			this.currentTabContent = null;
			endparent();

		this.radioGroup = "_radio_"+uniqueID();
	}

	addTab(name, isSelected) {
		if (isSelected == null) {
			isSelected = (this.currentTabContent == null);
		}

		const tabContent = new HElement("div", {class: "h-tab-content"});

		if (isSelected) {
			this.showTabContent(tabContent);
		}

		parent(this.tabButtonsDiv);

			const radio = add( new HRadioInput(this.radioGroup, name, isSelected, "h-tab-button") );
			radio.setOnClick(() => {
				this.showTabContent(tabContent);
			});

			endparent();

		return tabContent;
	}

	showTabContent(tabContent) {
		if (this.currentTabContent) {
			this.currentTabContent.remove();
		}

		parent(this);
			this.currentTabContent = add( tabContent );
			endparent();
	}
}