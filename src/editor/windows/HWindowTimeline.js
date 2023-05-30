import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HTextInput} from "~/common/h";

export default class HWindowTimeline extends HWindow {
	constructor(manager, editor, timeline) {
		super(manager);
		this.editor = editor;
		this.resource = timeline;
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
		this.title.html.textContent = "Time Line Properties: "+this.timeline.name;
	}
}