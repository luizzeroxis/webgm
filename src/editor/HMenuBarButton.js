import {HElement} from "~/common/H.js";

export default class HMenuBarButton extends HElement {
	constructor(menuBar, text, items) {
		super("div", {class: "h-menu-bar-button"}, text);

		this.menuBar = menuBar;
		this.items = items;

		this.menu = null;

		this.html.tabIndex = 0;

		this.setEvent("click", () => {
			this.open();
		});

		this.setEvent("keydown", (e) => {
			if (e.code == "Enter") {
				this.open();
			}
		});
	}

	open() {
		this.menu = this.menuBar.menuManager.openMenu(this.items, {fromElement: this});
		this.menuBar.currentMenu = this.menu;
		this.html.classList.add("selected");

		this.menu.promise.then(() => {
			this.menu = null;
			this.menuBar.currentMenu = null;
			this.html.classList.remove("selected");
		});
	}
}