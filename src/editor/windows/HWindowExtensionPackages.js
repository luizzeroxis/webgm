import {parent, endparent} from "~/common/h";
import HWindow from "~/editor/HWindow.js";

export default class HWindowExtensionPackages extends HWindow {
	constructor(editor, id) {
		super(editor, id);

		this.title.html.textContent = "Extension Packages";

		parent(this.client);

			this.makeApplyOkButtons(
				() => {
					// changes here
				},
				() => this.close(),
			);
			endparent();
	}
}