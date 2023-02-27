import {parent, endparent, add, moveAdd, moveBefore, remove, HElement, HButton, HImage} from "../../common/H.js";
import {Project} from "../../common/Project.js";
import HResourceListItem from "../HResourceListItem.js";
import FolderIcon from "../img/folder-icon.png";
import GameInformationIcon from "../img/game-information-icon.png";
import GameSettingsIcon from "../img/global-game-settings-icon.png";
// import ExtensionPackagesIcon from './img/extension-packages-icon.png';

class HTreeItem extends HElement {
	constructor(icon, name, onOpen, menuManager, menuItems) {
		parent( super("li", {class: "h-tree-item"}) );
			parent( add( new HElement("div", {class: "item"}) ) );
				add( new HElement("div", {class: "expander"}, "–") );
				add( new HImage(icon, "icon") );

				this.nameDiv = add( new HElement("div", {class: "name"}, name) );
				this.nameDiv.html.tabIndex = 0;

				if (onOpen) {
					this.nameDiv.setEvent("click", onOpen);
					this.nameDiv.setEvent("keypress", (e) => {
						if (e.code == "Space" || e.code == "Enter") {
							onOpen();
						}
					});
				}

				if (menuItems) {
					this.menuButton = add( new HButton("▼", () => {
						menuManager.openMenu(menuItems, {fromElement: this.menuButton});
					}) );
				}
				endparent();

			this.childrenDiv = add( new HElement("ul", {class: "children"}) );
			endparent();
	}
}

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

					this.resourceTypes[type.name] = add( new HTreeItem(FolderIcon, type.getScreenGroupName(), null, this.editor.menuManager, [
						{text: "Create " + type.getScreenName(), onClick: () => this.editor.project.createResource(type)},
					]) );
				});

				add( new HTreeItem(GameInformationIcon, "Game Information",
					() => this.editor.windowsArea.openGameInformation()) );

				add( new HTreeItem(GameSettingsIcon, "Global Game Settings",
					() => this.editor.windowsArea.openGlobalGameSettings()) );

				// add( new HTreeItem(ExtensionPackagesIcon, "Extension packages",
				// 	() => this.editor.windowsArea.openExtensionPackages()) );

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
		parent(this.resourceTypes[resource.constructor.name].childrenDiv);
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
			parent(this.resourceTypes[resource.constructor.name].childrenDiv);
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