import {parent, endparent, add, HElement, HTextInput} from "../../common/H.js";
import HWindow from "../HWindow.js";

export default class HWindowTimeline extends HWindow {
	constructor(editor, id, timeline) {
		super(editor, id);

		this.timeline = timeline;

		this.title.html.textContent = "Edit Time Line "+timeline.name;

		parent(this.client);
			parent( add( new HElement("div", {class: "grid-resource resource-timeline"}) ) );
				parent( add( new HElement("div") ) );

					const inputName = add( new HTextInput("Name:", timeline.name) );

					endparent();
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(timeline, inputName.getValue());
				},
				() => this.close(),
			);
			endparent();
	}
}