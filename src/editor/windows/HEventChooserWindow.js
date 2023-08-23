import HModalWindow from "~/common/components/HWindowManager/HModalWindow.js";
import Events from "~/common/Events.js";
import {parent, endparent, add, HElement, HButton} from "~/common/h";

export default class HEventChooserWindow extends HModalWindow {
	constructor(manager, editor) {
		super(manager);
		this.editor = editor;

		this.setResizable(false);
		this.setMinimizeButton(false);
		this.setMaximizeButton(false);
		this.escCloses = true;

		this.setTitle("Choose the Event to Add");

		parent(this.client);
			this.client.html.classList.add("window-event-chooser");

			parent( add( new HElement("div", {class: "events"}) ) );

				for (const eventType of Events.listEventTypes) {
					add( new HButton(eventType.name, async e => {
						const menuLists = {
							[Events.STEP]: Events.listStepSubtypes,
							[Events.ALARM]: Array.from(new Array(12), (_, i) => ({name: `Alarm ${i}`, value: i})),
							[Events.KEYBOARD]: Events.listKeyboardSubtypes,
							[Events.MOUSE]: Events.listMouseSubtypes,
							[Events.COLLISION]: this.editor.project.resources.ProjectObject.map(resource => ({name: resource.name, value: resource.id})),
							[Events.OTHER]: Events.listOtherSubtypes,
							[Events.KEYPRESS]: Events.listKeyboardSubtypes,
							[Events.KEYRELEASE]: Events.listKeyboardSubtypes,
						};

						const list = menuLists[eventType.id];
						if (list) {
							const index = await this.editor.menuManager.openMenu(
								list.map(subtype => ({
									text: subtype.name,
								})), {x: e.clientX, y: e.clientY}).promise;
							if (index != null) {
								const eventSubtype = list[index];
								this.close({type: eventType.value, subtype: eventSubtype.value});
							}
						} else {
							// Create, destroy and draw
							this.close({type: eventType.value, subtype: 0});
						}
					}) );
				}
				endparent();

			parent( add( new HElement("div") ) );
				add( new HButton("Cancel", () => {
					this.close();
				}) );
				endparent();
	}
}