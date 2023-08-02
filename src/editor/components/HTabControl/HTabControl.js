import {parent, endparent, add, HElement, classToAttr, classToArray} from "~/common/h";

import "./HTabControl.scss";

export default class HTabControl extends HElement {
	constructor(_class, side) {
		parent( super("div", {class: classToAttr([...classToArray(_class), "h-tab-control"])}) );
			this.side = side ?? "top";
			if (side == "right") {
				this.html.classList.add("right");
			}

			this.buttonsDiv = add( new HElement("div", {class: "buttons"}) );
			this.bodyDiv = add( new HElement("div", {class: "body"}) );
			endparent();

		this.currentTab = null;
		this.tabs = [];
	}

	addTab(name) {
		parent(this.bodyDiv);
			const content = add(new HElement("div", {class: "content"}));
			endparent();

		parent(this.buttonsDiv);
			const button = add( new HElement("div", {class: "button"}, name) );
			button.html.tabIndex = 0;
			button.setEvent("click", () => {
				this.setSelectedTab({button, content});
			});
			button.setEvent("keydown", e => {
				if (e.code == "Enter") {
					this.setSelectedTab({button, content});
				}
			});
			endparent();

		this.tabs.push({button, content});

		return content;
	}

	setSelectedTab(tab) {
		this.currentTab?.content.html.classList.remove("selected");
		this.currentTab?.button.html.classList.remove("selected");

		tab.content.html.classList.add("selected");
		tab.button.html.classList.add("selected");

		this.currentTab = tab;
	}

	setSelectedContent(content) {
		const {button} = this.tabs.find(tab => tab.content == content);
		this.setSelectedTab({button, content});
	}
}