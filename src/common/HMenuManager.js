import {HElement, parent, endparent, add} from "./H.js";
import HMenu from "./HMenu.js";

import "./HMenuManager.scss";

export default class HMenuManager extends HElement {
	constructor() {
		super("div", {class: "h-menu-manager"});
	}

	openMenu(items, options) {
		parent(this);
			const menu = add( new HMenu(this, items, options) );
			endparent();

		return menu;
	}
}