import {parent, endparent, add, HElement} from "~/common/h";
import Project from "~/common/project/Project.js";
import HTreeItem from "~/editor/components/HTreeList/HTreeItem.js";
import HTreeList from "~/editor/components/HTreeList/HTreeList.js";
import HResourceListItem from "~/editor/HResourceListItem.js";
import FolderIcon from "~/editor/img/folder-icon.png";
import GameInformationIcon from "~/editor/img/game-information-icon.png";
import GameSettingsIcon from "~/editor/img/global-game-settings-icon.png";
// import ExtensionPackagesIcon from '~/editor/img/extension-packages-icon.png';

export default class HAreaResources extends HElement {
	constructor(editor) {
		super("div", {class: "resources-area"});

		this.editor = editor;

		this.resourceTypesTreeItems = {};

		parent(this);

			this.tree = add( new HTreeList(this) ); // TODO temp arg
			this.selected = null;

			Project.resourceTypes.forEach(type => {
				this.resourceTypesTreeItems[type.name] = this.tree.add( new HTreeItem(FolderIcon, type.getScreenGroupName(), null, this.editor.menuManager, [
						{text: "Create " + type.getScreenName(), onClick: () => this.editor.project.createResource(type)},
					]) );
			});

			this.tree.add( new HTreeItem(GameInformationIcon, "Game Information",
				() => this.editor.windowsArea.openGameInformation()) );

			this.tree.add( new HTreeItem(GameSettingsIcon, "Global Game Settings",
				() => this.editor.windowsArea.openGlobalGameSettings()) );

			// this.tree.add( new HTreeItem(ExtensionPackagesIcon, "Extension packages",
			// 	() => this.editor.windowsArea.openExtensionPackages()) );

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
		const tree = this.resourceTypesTreeItems[resource.constructor.name].treeList;
		tree.add(new HResourceListItem(resource, this.editor));
	}

	// Move resource in the resources tree to some index.
	move(resource, toIndex) {
		const tree = this.resourceTypesTreeItems[resource.constructor.name].treeList;
		const item = tree.find(x => x.resource == resource);
		tree.move(item, toIndex);
	}

	// Delete resource from resources tree.
	delete(resource) {
		const tree = this.resourceTypesTreeItems[resource.constructor.name].treeList;
		const item = tree.find(x => x.resource == resource);
		tree.delete(item);
	}

	refresh() {
		Project.resourceTypes.forEach(type => {
			this.resourceTypesTreeItems[type.name].treeList.clear();

			this.editor.project.resources[type.getClassName()].forEach(resource => {
				this.add(resource);
			});
		});
	}

	setSelected(item) {
		if (this.selected) {
			this.selected.itemDiv.html.classList.remove("selected");
		}
		this.selected = item;
		if (item) {
			item.itemDiv.html.classList.add("selected");
		}
	}
}