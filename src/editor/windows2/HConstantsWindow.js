import {parent, endparent, add, HElement} from "~/common/h";
import HWindow from "~/common/components/HWindowManager/HWindow.js";

export default class HConstantsWindow extends HWindow {
	constructor(manager) {
		super(manager);

		this.title.html.textContent = "User-Defined Constants";

		parent(this.client);
			add( new HElement("div", {}, "This a constant window (toby fox bit)") );
			endparent();
	}
}