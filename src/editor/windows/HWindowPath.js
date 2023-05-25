import {parent, endparent, add, HElement, HTextInput} from "~/common/h";
import HWindow from "~/editor/HWindow.js";

export default class HWindowPath extends HWindow {
	constructor(editor, id, path) {
		super(editor, id);

		this.path = path;

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-path"}) ) );
				parent( add( new HElement("div") ) );

					const inputName = add( new HTextInput("Name:", path.name) );

					endparent();
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.project.changeResourceName(path, inputName.getValue());

					this.updateTitle();
				},
				() => this.close(),
			);
			endparent();
	}

	updateTitle() {
		this.title.html.textContent = "Path Properties: "+this.path.name;
	}
}