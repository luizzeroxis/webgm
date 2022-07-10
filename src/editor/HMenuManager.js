import {parent, endparent, add, remove, HElement} from "../common/H.js";

export default class HMenuManager extends HElement {
	constructor() {
		super("div");

		this.selectedIndex = null;
	}

	openMenu(items, options) {
		return new Promise(resolve => {
			let x = options.x;
			let y = options.y;

			if (options.fromElement) {
				const rect = options.fromElement.html.getBoundingClientRect();
				x = rect.left + document.documentElement.scrollLeft;
				y = rect.bottom + document.documentElement.scrollTop;
			}

			this.selectedIndex = null;

			parent(this);
				const menu = add( new HElement("div", {class: "menu"}) );
				menu.html.tabIndex = 0;
				menu.html.style.left = x.toString() + "px";
				menu.html.style.top = y.toString() + "px";

				const focusedBefore = document.activeElement;
				menu.html.focus();

				const close = (resolveValue=null) => {
					this.selectedIndex = resolveValue;
					if (focusedBefore) {
						focusedBefore.focus();
					} else {
						menu.html.blur(); // This calls the event below
					}
				};

				menu.html.addEventListener("blur", () => {
					remove(menu);
					resolve(this.selectedIndex);
				});

				menu.html.addEventListener("keydown", e => {
					if (e.code == "Escape") {
						close(null);
					} else if (e.code == "Enter") {
						if (this.selectedIndex != null) {
							items[this.selectedIndex].onClick?.();
							close(this.selectedIndex);
						} else {
							close(null);
						}
						e.preventDefault();
					} else if (e.code == "ArrowDown") {
						e.preventDefault();
						items[this.selectedIndex]?.menuItemElement.html.classList.remove("selected");

						if (this.selectedIndex != null && this.selectedIndex != items.length - 1) {
							this.selectedIndex += 1;
						} else {
							this.selectedIndex = 0;
						}

						items[this.selectedIndex].menuItemElement.html.classList.add("selected");
					} else if (e.code == "ArrowUp") {
						e.preventDefault();
						items[this.selectedIndex]?.menuItemElement.html.classList.remove("selected");

						if (this.selectedIndex != null && this.selectedIndex != 0) {
							this.selectedIndex -= 1;
						} else {
							this.selectedIndex = items.length - 1;
						}

						items[this.selectedIndex].menuItemElement.html.classList.add("selected");
					}
				});

				parent(menu);
					for (const [index, item] of items.entries()) {
						const menuItem = add( new HElement("div", {class: "menu-item"}, item.text) );

						menuItem.html.addEventListener("click", () => {
							item.onClick?.();
							close(index);
						});

						menuItem.html.addEventListener("mouseleave", () => {
							items[this.selectedIndex]?.menuItemElement.html.classList.remove("selected");
							this.selectedIndex = null;
							menuItem.html.classList.remove("selected");
						});

						menuItem.html.addEventListener("mousemove", () => {
							items[this.selectedIndex]?.menuItemElement.html.classList.remove("selected");
							this.selectedIndex = index;
							menuItem.html.classList.add("selected");
						});

						item.menuItemElement = menuItem;
					}
					endparent();

				endparent();
		});
	}
}