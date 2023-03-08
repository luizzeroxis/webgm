import {HElement, add, parent, endparent} from "../common/H.js";

import HMenuBarButton from "./HMenuBarButton.js";

import "./HMenuBar.scss";

export default class HMenuBar extends HElement {
	constructor(menuManager, menus) {
		super("div", {class: "h-menu-bar"});

		this.menuManager = menuManager;

		this.currentMenu = null;

		parent(this);
			this.menuButtons = [];
			for (const menu of menus) {
				this.menuButtons.push( add( new HMenuBarButton(this, menu.text, menu.items) ) );
			}

			endparent();
	}
}