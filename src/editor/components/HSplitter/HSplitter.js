import {HElement, parent, add, endparent} from "~/common/h";
import {setDraggable} from "~/common/tools.js";

import "./HSplitter.scss";

class HSplitterSeparator extends HElement {
	constructor(splitter) {
		super("div", {class: "h-splitter-separator"});

		setDraggable(this,
			e => { // mousedown
				this.offX = e.offsetX;
			},
			e => { // mousemove
				const w = e.clientX - splitter.left.html.offsetLeft - this.offX;
				splitter.left.html.style.width = w + "px";
			},
		);
	}
}

export default class HSplitter extends HElement {
	constructor(left, right) {
		parent( super("div", {class: "h-splitter"}) );
			this.left = add(left);
			this.separator = add(new HSplitterSeparator(this));
			this.right = add(right);
			endparent();
	}
}