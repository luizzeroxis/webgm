import {parent, endparent, add, HElement, HTextInput} from "~/common/H.js";
import HCodeEditor from "~/editor/HCodeEditor.js";
import HWindow from "~/editor/HWindow.js";

export default class HWindowScript extends HWindow {
	constructor(editor, id, script) {
		super(editor, id);

		this.script = script;

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-script"}) ) );

				const inputName = add( new HTextInput("Name:", script.name) );

				this.codeEditor = add( new HCodeEditor(script.code) );

				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.project.changeResourceName(script, inputName.getValue());
					script.code = this.codeEditor.getValue();

					this.updateTitle();
				},
				() => {
					this.close();
				},
			);

			this.codeEditor.setNextElem(this.applyButton);

			endparent();
	}

	updateTitle() {
		this.title.html.textContent = "Edit Script "+this.script.name;
	}
}