import {parent, endparent, add, HElement, HButton, HImage} from "../common/H.js";

import HTreeList from "./HTreeList.js";

export default class HTreeItem extends HElement {
	constructor(icon, name, onOpen, menuManager, menuItems) {
		parent( super("div", {class: "h-tree-item"}) );
			this.open = true;
			this.tree = null;

			parent( add( new HElement("div", {class: "item"}) ) );
				this.expander = add( new HElement("div", {class: "expander"}) );
				this.expander.setEvent("click", () => {
					this.setOpen(!this.open);
				});

				this.icon = add( new HImage(icon, "icon") );

				this.nameDiv = add( new HElement("div", {class: "name"}, name) );
				this.nameDiv.html.tabIndex = 0;

				this.nameDiv.setEvent("focus", () => {
					this.nameDiv.html.classList.add("selected");
					this.tree.setSelected(this);
				});

				if (onOpen) {
					this.nameDiv.setEvent("click", onOpen);
				}

				this.nameDiv.setEvent("keydown", (e) => {
					if (e.code == "Space" || e.code == "Enter") {
						e.preventDefault();
						onOpen?.();
					} else if (e.code == "ArrowRight") {
						this.setOpen(true);
					} else if (e.code == "ArrowLeft") {
						this.setOpen(false);
					}
				});

				if (menuItems) {
					this.nameDiv.setEvent("contextmenu", (e) => {
						e.preventDefault();
						menuManager.openMenu(menuItems, {x: e.clientX, y: e.clientY});
					});
					// this.menuButton = add( new HButton("▼", () => {
					// 	menuManager.openMenu(menuItems, {fromElement: this.menuButton});
					// }) );
				}
				endparent();

			endparent();
	}

	onAdd() {
		// TODO it's hacks
		if (!this.treeList) {
			parent(this);
				this.treeList = add( new HTreeList(this.tree, this, "children") );
				endparent();
		}
	}

	setOpen(value) {
		this.open = value;

		this.treeList.html.classList.toggle("closed", !this.open);
		this.updateExpander();
	}

	updateExpander() {
		this.expander.html.textContent = (this.treeList.items.length != 0 ? (this.open ? "-" : "+") : "");
	}
}