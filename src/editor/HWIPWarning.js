import {HElement, parent, endparent, add} from "~/common/h";

export default class HWIPWarning extends HElement {
	constructor(editor) {
		super("div");

		this.editor = editor;

		this.message = null;
		this.update();

		this.editor.preferences.dispatcher.listen({
			change: () => this.update(),
		});
	}

	update() {
		if (this.editor.preferences.get("showWIPWarning")) {
			if (!this.message) {
				parent(this);
					this.message = add( new HElement("div", {class: "warning"}, "Work In Progress: Some features may not work as expected, or at all. Work may be lost, use it at your own discretion!") );
					endparent();
			}
		} else {
			if (this.message) {
				this.message.remove();
				this.message = null;
			}
		}
	}
}