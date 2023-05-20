import {parent, endparent, add, HElement, HTextInput} from "~/common/H.js";
import HWindow from "~/editor/HWindow.js";

export default class HWindowTimeline extends HWindow {
	constructor(editor, id, timeline) {
		super(editor, id);

		this.timeline = timeline;

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-timeline"}) ) );
				parent( add( new HElement("div") ) );

					const inputName = add( new HTextInput("Name:", timeline.name) );

					endparent();
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.project.changeResourceName(timeline, inputName.getValue());

					this.updateTitle();
				},
				() => this.close(),
			);
			endparent();
	}

	updateTitle() {
		this.title.html.textContent = "Edit Time Line "+this.timeline.name;
	}
}