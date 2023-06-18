import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HButton} from "~/common/h";

export default class HWindowExtensionPackages extends HWindow {
	constructor(manager, editor) {
		super(manager);
		this.editor = editor;

		this.modified = false;

		this.setTitle("Extension Packages");

		parent(this.client);

			add( new HButton("OK", () => {
				this.modified = false;
				this.close();
			}) );

			endparent();
	}
}