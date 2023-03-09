import {parent, endparent, add, HElement, HButton, HImage} from "../common/H.js";

import HTree from "./HTree.js";

export default class HTreeItem extends HElement {
	constructor(icon, name, onOpen, menuManager, menuItems) {
		parent( super("div", {class: "h-tree-item"}) );
			this.open = true;

			parent( add( new HElement("div", {class: "item"}) ) );
				this.expander = add( new HElement("div", {class: "expander"}) );
				this.expander.setEvent("click", () => {
					this.setOpen(!this.open);
				});

				this.icon = add( new HImage(icon, "icon") );

				this.nameDiv = add( new HElement("div", {class: "name"}, name) );
				this.nameDiv.html.tabIndex = 0;

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
					this.menuButton = add( new HButton("▼", () => {
						menuManager.openMenu(menuItems, {fromElement: this.menuButton});
					}) );
				}
				endparent();

			this.childTree = add( new HTree(this, "children") );
			endparent();
	}

	setOpen(value) {
		this.open = value;

		this.childTree.html.classList.toggle("closed", !this.open);
		this.updateExpander();
	}

	updateExpander() {
		this.expander.html.textContent = (this.childTree.items.length != 0 ? (this.open ? "-" : "+") : "");
	}
}