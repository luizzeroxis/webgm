import {parent, endparent, add, HElement, HRadioInput, classToAttr, classToArray, uniqueID} from "~/common/h";

import "./HTabControl.scss";

export default class HTabControl extends HElement {
	constructor(_class, side) {
		parent( super("div", {class: classToAttr([...classToArray(_class), "h-tab-control"])}) );
			this.side = side ?? "top";
			if (side == "right") {
				this.html.classList.add("right");
			}

			this.tabButtonsDiv = add( new HElement("div", {class: "buttons"}) );
			this.currentTabContent = null;
			endparent();

		this.radioGroup = "_radio_"+uniqueID();
	}

	addTab(name, isSelected) {
		if (isSelected == null) {
			isSelected = (this.currentTabContent == null);
		}

		const tabContent = new HElement("div", {class: "content"});

		if (isSelected) {
			this.showTabContent(tabContent);
		}

		parent(this.tabButtonsDiv);

			const radio = add( new HRadioInput(this.radioGroup, name, isSelected, "button") );
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