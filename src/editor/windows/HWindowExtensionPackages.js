import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent} from "~/common/h";

export default class HWindowExtensionPackages extends HWindow {
	constructor(manager, editor) {
		super(manager);
		this.editor = editor;
		this.setTitle("Extension Packages");

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