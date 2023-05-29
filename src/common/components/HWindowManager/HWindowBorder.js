import {HElement} from "~/common/h";
import {setDraggable} from "~/common/tools";

export default class HWindowBorder extends HElement {
	constructor(win, side) {
		super("div", {class: "border "+side});

		setDraggable(this,
			e => { // mousedown
				const rect = win.html.getBoundingClientRect();
				this.offX = rect.width - (e.clientX - rect.left);
				this.offY = rect.height - (e.clientY - rect.top);

				this.offLeft = e.clientX - rect.left;
				this.offTop = e.clientY - rect.top;
			},
			e => { // mousemove
				let x = win.x;
				let y = win.y;
				let w = win.w;
				let h = win.h;

				const rect = win.html.getBoundingClientRect();

				const windowsAreaRect = win.manager.html.getBoundingClientRect();
				const windowsAreaStyle = window.getComputedStyle(win.manager.html);

				// right
				if (side == "bottom-right" || side == "right" || side == "top-right") {
					w = e.clientX + this.offX - rect.left;
				}
				// bottom
				if (side == "bottom-left" || side == "bottom" || side == "bottom-right") {
					h = e.clientY + this.offY - rect.top;
				}
				// left
				if (side == "bottom-left" || side == "left" || side == "top-left") {
					x = e.clientX - this.offLeft - (windowsAreaRect.left + parseFloat(windowsAreaStyle.borderLeftWidth)) + win.manager.html.scrollLeft;
					if (x < 0) { x = 0; }
					w = win.w + (win.x - x);
				}
				// top
				if (side == "top-left" || side == "top" || side == "top-right") {
					y = e.clientY - this.offTop - (windowsAreaRect.top + parseFloat(windowsAreaStyle.borderTopWidth)) + win.manager.html.scrollTop;
					if (y < 0) { y = 0; }
					h = win.h + (win.y - y);
				}

				win.setSize(w, h);
				win.setPosition(x, y);
			},
		);
	}
}