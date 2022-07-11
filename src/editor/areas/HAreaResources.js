import {parent, endparent, add, remove, HElement, HButton, HImage} from "../../common/H.js";
import {Project} from "../../common/Project.js";
import HResourceListItem from "../HResourceListItem.js";
import FolderIcon from "../img/folder-icon.png";
import GameInformationIcon from "../img/game-information-icon.png";
import GameSettingsIcon from "../img/global-game-settings-icon.png";
// import ExtensionPackagesIcon from './img/extension-packages-icon.png';

export default class HAreaResources extends HElement {
	constructor(editor) {
		super("div", {class: "resources-area"});

		this.editor = editor;
		this.resourceTypes = {};
		this.resources = [];

		parent(this);
			parent( add( new HElement("ul") ) );

				Project.getTypes().forEach(type => {
					parent( add( new HElement("li") ) );

						parent( add( new HElement("div", {class: "item"}) ) );
							// add( new HElement("div", {class: "expander"}, "") );
							add( new HImage(FolderIcon, "icon") );
							add( new HElement("div", {class: "name"}, type.getScreenGroupName()) );

							const menuButton = add( new HButton("▼", () => {
								this.editor.menuManager.openMenu([
									{text: "Create " + type.getScreenName(), onClick: () => this.editor.createResource(type)},
								], {fromElement: menuButton});
							}) );

							endparent();

						this.resourceTypes[type.name] = add( new HElement("ul", {class: "resource"}) );
						endparent();
				});

				parent( add( new HElement("li") ) );

					parent( add( new HElement("div", {class: "item"}) ) );
						// add( new HElement("div", {class: "expander"}, "") );
						add( new HImage(GameInformationIcon, "icon") );
						const gameInformationName = add( new HElement("div", {class: "name"}, "Game Information") );
						gameInformationName.html.addEventListener("click", () => this.editor.windowsArea.openGameInformation());
						endparent();

					endparent();

				parent( add( new HElement("li") ) );
					parent( add( new HElement("div", {class: "item"}) ) );
						// add( new HElement("div", {class: "expander"}, "") );
						add( new HImage(GameSettingsIcon, "icon") );
						const globalGameSettingsName = add( new HElement("div", {class: "name"}, "Global Game Settings") );
						globalGameSettingsName.html.addEventListener("click", () => this.editor.windowsArea.openGlobalGameSettings());
						endparent();

					endparent();

				// parent( add( new HElement('li') ) );
				// 	parent( add( new HElement('div', {class: 'item'}) ) )
				// 		// add( new HElement("div", {class: "expander"}, "") );
				// 		add( new HImage(ExtensionPackagesIcon, 'icon') );
				// 		const extensionPackagesName = add( new HElement('div', {class: 'name'}, 'Extension packages') )
				// 		extensionPackagesName.html.addEventListener("click", () => this.editor.windowsArea.openExtensionPackages());
				// 		endparent();

				endparent();

			endparent();
	}

	onAdd() {
		this.listeners = this.editor.dispatcher.listen({
			createResource: i => {
				this.add(i);
			},
			deleteResource: i => {
				this.delete(i);
			},
		});
	}

	// onRemove() {
	// 	this.editor.dispatcher.stopListening(this.listeners);
	// }

	// Add resource to resources tree in the proper type.
	add(resource) {
		parent(this.resourceTypes[resource.constructor.name]);
			const r = add( new HResourceListItem(resource, this.editor) );
			this.resources.push(r);
			endparent();
	}

	// Delete resource from resources tree.
	delete(resource) {
		const index = this.resources.findIndex(x => x.id == resource);
		if (index>=0) {
			remove(this.resources[index]);
			this.resources.splice(index, 1);
		}
	}

	refresh() {
		for (const resource of this.resources) {
			remove(resource);
		}
		this.resources = [];
		Project.getTypes().forEach(type => {
			this.editor.project.resources[type.getClassName()].forEach(resource => {
				this.add(resource);
			});
		});
	}
}