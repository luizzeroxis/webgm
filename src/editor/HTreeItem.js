import {parent, endparent, add, remove, HElement, HButton, HImage} from "../common/H.js";

export default class HTreeItem extends HElement {
	constructor(icon, name, onOpen, menuManager, menuItems) {
		parent( super("li", {class: "h-tree-item"}) );
			this.open = true;
			this.childItems = [];

			parent( add( new HElement("div", {class: "item"}) ) );
				this.expander = add( new HElement("div", {class: "expander"}) );
				this.expander.setEvent("click", () => {
					this.open = !this.open;

					this.childrenDiv.html.style.display = (this.open ? "block" : "none");
					this.updateExpander();
				});

				this.icon = add( new HImage(icon, "icon") );

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
					this.nameDiv.setEvent("contextmenu", (e) => {
						e.preventDefault();
						menuManager.openMenu(menuItems, {x: e.clientX, y: e.clientY});
					});
					this.menuButton = add( new HButton("▼", () => {
						menuManager.openMenu(menuItems, {fromElement: this.menuButton});
					}) );
				}
				endparent();

			this.childrenDiv = add( new HElement("ul", {class: "children"}) );
			endparent();
	}

	updateExpander() {
		this.expander.html.textContent = (this.childItems.length != 0 ? (this.open ? "-" : "+") : "");
	}

	add(item) {
		parent(this.childrenDiv);
			this.childItems.push(item);
			add(item);
			endparent();

		this.updateExpander();
		return item;
	}

	delete(item) {
		this.childItems.splice(this.childItems.findIndex(x => x == item), 1);
		remove(item);

		this.updateExpander();
	}
}