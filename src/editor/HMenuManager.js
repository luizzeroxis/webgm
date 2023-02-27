import {HElement, parent, endparent, add} from "../common/H.js";

import HMenu from "./HMenu.js";

export default class HMenuManager extends HElement {
	constructor() {
		super("div", {class: "h-menu-manager"});
	}

	openMenu(items, options) {
		parent(this);
			const menu = add( new HMenu(items, options) );
			endparent();

		return menu;
	}
}