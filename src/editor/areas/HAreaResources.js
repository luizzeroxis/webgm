import {parent, endparent, add, moveAdd, moveBefore, remove, HElement, HButton, HImage} from "../../common/H.js";
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
		this.resourceItemsByType = new Map();

		parent(this);
			parent( add( new HElement("ul") ) );

				Project.resourceTypes.forEach(type => {
					this.resourceItemsByType.set(type.name, []);

					parent( add( new HElement("li") ) );

						parent( add( new HElement("div", {class: "item"}) ) );
							add( new HElement("div", {class: "expander"}, "–") );
							add( new HImage(FolderIcon, "icon") );
							add( new HElement("div", {class: "name"}, type.getScreenGroupName()) );

							const menuButton = add( new HButton("▼", () => {
								this.editor.menuManager.openMenu([
									{text: "Create " + type.getScreenName(), onClick: () => this.editor.project.createResource(type)},
								], {fromElement: menuButton});
							}) );

							endparent();

						this.resourceTypes[type.name] = add( new HElement("ul", {class: "resource"}) );
						endparent();
				});

				parent( add( new HElement("li") ) );

					parent( add( new HElement("div", {class: "item"}) ) );
						add( new HElement("div", {class: "expander"}, "–") );
						add( new HImage(GameInformationIcon, "icon") );
						const gameInformationName = add( new HElement("div", {class: "name"}, "Game Information") );
						gameInformationName.html.addEventListener("click", () => this.editor.windowsArea.openGameInformation());
						endparent();

					endparent();

				parent( add( new HElement("li") ) );
					parent( add( new HElement("div", {class: "item"}) ) );
						add( new HElement("div", {class: "expander"}, "–") );
						add( new HImage(GameSettingsIcon, "icon") );
						const globalGameSettingsName = add( new HElement("div", {class: "name"}, "Global Game Settings") );
						globalGameSettingsName.html.addEventListener("click", () => this.editor.windowsArea.openGlobalGameSettings());
						endparent();

					endparent();

				// parent( add( new HElement('li') ) );
				// 	parent( add( new HElement('div', {class: 'item'}) ) )
				// 		// add( new HElement("div", {class: "expander"}, "–") );
				// 		add( new HImage(ExtensionPackagesIcon, 'icon') );
				// 		const extensionPackagesName = add( new HElement('div', {class: 'name'}, 'Extension packages') )
				// 		extensionPackagesName.html.addEventListener("click", () => this.editor.windowsArea.openExtensionPackages());
				// 		endparent();

				endparent();

			endparent();
	}

	onAdd() {
		this.listeners = this.editor.project.dispatcher.listen({
			createResource: resource => {
				this.add(resource);
			},
			moveResource: (resource, toIndex) => {
				this.move(resource, toIndex);
			},
			deleteResource: resource => {
				this.delete(resource);
			},
		});
	}

	// onRemove() {
	// 	this.editor.project.dispatcher.stopListening(this.listeners);
	// }

	// Add resource to resources tree in the proper type.
	add(resource) {
		parent(this.resourceTypes[resource.constructor.name]);
			const r = add( new HResourceListItem(resource, this.editor) );
			this.resourceItemsByType.get(resource.constructor.name).push(r);
			endparent();
	}

	// Move resource in the resources tree to some index.
	move(resource, toIndex) {
		const list = this.resourceItemsByType.get(resource.constructor.name);
		const fromIndex = list.findIndex(x => x.id == resource);

		// Find which element to put before. If at the end, append to end of list.
		// If element before comes after current element, add 1 to offset the fact we don't remove the item beforehand.
		if (toIndex != list.length - 1) {
			const elementBeforeIndex = (toIndex > fromIndex ? toIndex + 1 : toIndex);
			moveBefore(list[elementBeforeIndex], list[fromIndex]);
		} else {
			parent(this.resourceTypes[resource.constructor.name]);
				moveAdd(list[fromIndex]);
				endparent();
		}

		list.splice(toIndex, 0, ...list.splice(fromIndex, 1));
	}

	// Delete resource from resources tree.
	delete(resource) {
		const list = this.resourceItemsByType.get(resource.constructor.name);
		const index = list.findIndex(x => x.id == resource);
		if (index >= 0) {
			remove(list[index]);
			list.splice(index, 1);
		}
	}

	refresh() {
		for (const [typeName, list] of this.resourceItemsByType.entries()) {
			for (const resource of list) {
				remove(resource);
			}
			this.resourceItemsByType.set(typeName, []);
		}

		Project.resourceTypes.forEach(type => {
			this.editor.project.resources[type.getClassName()].forEach(resource => {
				this.add(resource);
			});
		});
	}
}