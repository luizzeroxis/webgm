import {parent, endparent, add, HElement} from "~/common/H.js";

import "./HImageList.scss";

export default class HImageList extends HElement {
	constructor() {
		super("div", {class: "h-image-list"});

		this.setEvent("click", e => {
			if (e.target != this.html) return;
			this.setSelected(null);
		});

		this.selected = null;
		this.items = [];

		this.onSelectedChange = null;
	}

	setItems(items) {
		// [{image, text, element}]
		this.items = [...items];

		this.removeChildren();

		parent(this);

			for (const [index, item] of this.items.entries()) {
				item.element = parent( add( new HElement("div", {class: "item"}) ) );

					item.element.html.tabIndex = 0;
					item.element.setEvent("focus", () => {
						this.setSelected(index);
					});
					item.element.setEvent("click", () => {
						this.setSelected(index);
					});

					add( item.image );
					add( new HElement("div", {}, item.text) );
					endparent();
			}

			endparent();

		this.setSelected(this.selected);
	}

	setSelected(index) {
		this.items[this.selected]?.element.html.classList.remove("selected");

		this.selected = index;
		if (index != null) {
			this.items[index]?.element.html.classList.add("selected");
		}

		this.onSelectedChange?.(index);
	}
}