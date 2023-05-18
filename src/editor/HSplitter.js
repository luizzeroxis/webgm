import {HElement, parent, add} from "../common/H.js";

import "./HSplitter.scss";

class HSplitterSeparator extends HElement {
	constructor(splitter) {
		super("div", {class: "h-splitter-separator"});

		this.setEvent("mousedown", e => {
			if (e.button != 0) return;

			document.removeEventListener("mousemove", this.mouseMoveHandler);
			document.removeEventListener("mouseup", this.mouseUpHandler);

			this.offX = e.offsetX;

			this.mouseMoveHandler = e => {
				const w = e.clientX - splitter.left.html.offsetLeft - this.offX;
				splitter.left.html.style.width = w + "px";
			};

			document.addEventListener("mousemove", this.mouseMoveHandler);

			this.mouseUpHandler = () => {
				document.removeEventListener("mousemove", this.mouseMoveHandler);
				document.removeEventListener("mouseup", this.mouseUpHandler);
			};

			document.addEventListener("mouseup", this.mouseUpHandler);
		});
	}
}

export default class HSplitter extends HElement {
	constructor(left, right) {
		parent( super("div", {class: "h-splitter"}), _ => {
			this.left = add(left);
			this.separator = add(new HSplitterSeparator(this));
			this.right = add(right);
		});
	}
}