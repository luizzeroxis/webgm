import HWindow from "~/common/components/HWindowManager/HWindow.js";
import Events from "~/common/Events.js";
import {parent, endparent, add, HElement, HButton, HNumberInput, HSelectWithOptions} from "~/common/h";
import {ProjectObject} from "~/common/project/ProjectProperties.js";
import HResourceSelect from "~/editor/HResourceSelect.js";

export default class HEventChooserWindow extends HWindow {
	constructor(manager, editor) {
		super(manager);
		this.editor = editor;

		this.promise = new Promise(resolve => {
			this.resolveFunction = resolve;
		});

		this.setResizable(false);
		this.setMinimizeButton(false);
		this.setMaximizeButton(false);
		this.escCloses = true;

		this.setTitle("Choose the Event to Add");

		parent(this.client);
			// Event type select
			this.selectEventType = add( new HSelectWithOptions("Event type:", Events.listEventTypes) );

			this.selectEventType.setOnChange(() => {
				this.updateDivEventSubtype();
			});

			// Event subtype div
			this.selectCollisionObject = null;
			this.divEventSubtype = add( new HElement("div") );

			add( new HButton("Ok", () => {
				const eventType = this.selectEventType.getValue();
				const eventSubtype = this.subtypeValueFunction?.() ?? 0;

				this.close({type: eventType, subtype: eventSubtype});
			}) );
			endparent();
	}

	updateDivEventSubtype() {
		this.divEventSubtype.removeChildren();

		const eventType = this.selectEventType.getValue();

		parent(this.divEventSubtype);

			this.subtypeValueFunction = null;

			if (eventType == "step") {
				const subtypeElement = add( new HSelectWithOptions("Step:", Events.listStepSubtypes));
				this.subtypeValueFunction = () => subtypeElement.getValue();
			} else

			if (eventType == "alarm") {
				const subtypeElement = add( new HNumberInput("Alarm:", 0, 1, 0, 11) );
				this.subtypeValueFunction = () => (parseInt(subtypeElement.getValue()));
			} else

			if (eventType == "keyboard" || eventType == "keypress" || eventType == "keyrelease") {
				const subtypeElement = add( new HSelectWithOptions("Key:", Events.listKeyboardSubtypes) );
				this.subtypeValueFunction = () => (parseInt(subtypeElement.getValue()));
			} else

			if (eventType == "mouse") {
				const subtypeElement = add( new HSelectWithOptions("Mouse:", Events.listMouseSubtypes));
				this.subtypeValueFunction = () => (parseInt(subtypeElement.getValue()));
			} else

			if (eventType == "collision") {
				this.selectCollisionObject = add( new HResourceSelect(this.editor, "Object:", ProjectObject, true) );
				this.subtypeValueFunction = () => (parseInt(this.selectCollisionObject.getValue()));
			} else

			if (eventType == "other") {
				const subtypeElement = add( new HSelectWithOptions("Other:", Events.listOtherSubtypes));
				this.subtypeValueFunction = () => (parseInt(subtypeElement.getValue()));
			}

			endparent();
	}

	close(result) {
		super.close();
		this.resolveFunction(result);
	}
}