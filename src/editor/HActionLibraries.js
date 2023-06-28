import {parent, endparent, add, HElement, HButton, HImage} from "~/common/h";
import {ProjectAction} from "~/common/project/ProjectProperties.js";
import HTabControl from "~/editor/components/HTabControl/HTabControl.js";

export default class HActionLibraries extends HTabControl {
	constructor(editor, onAddAction) {
		parent( super("libraries-tabs", "right") );

			this.editor = editor;

			this.editor.libraries.forEach(library => {
				parent( this.addTab(library.name, (library.name == this.editor.preferences.get("defaultActionLibraryTab"))) );

					let nextClass = null;

					parent( add( new HElement("div", {class: "action-types"}) ) );

						library.items.forEach(actionType => {
							if (actionType.kind == "label") {
								add( new HElement("div", {class: "label"}, actionType.name) );
							} else if (actionType.kind == "separator") {
								nextClass = "new-row";
							} else {
								const actionTypeButton = add( new HButton(null, () => {
									const action = new ProjectAction();
									action.setType(library, actionType);
									onAddAction(action);
								}, "action-type") );

								if (nextClass) {
									actionTypeButton.html.classList.add(nextClass);
									nextClass = null;
								}

								actionTypeButton.html.title = actionType.description;

								if (actionType.image) {
									actionTypeButton.html.classList.add("image-button");
									parent(actionTypeButton);
										add( new HImage(actionType.image) );
										endparent();
								} else {
									actionTypeButton.html.textContent = actionType.description;
								}
							}
						});

						endparent();

					endparent();
			});

			endparent();
	}
}