import {parent, endparent, add, HElement, newCanvas} from '../../common/H.js'

export default class HAreaGame extends HElement{

	constructor() {
		parent( super('div', {class: 'game'}) )
			this.canvas = add( newCanvas("canvas", 640, 480) )
			this.canvas.setAttribute('tabindex', 0);
			endparent()
	}

	scrollIntoView() {
		this.html.scrollIntoView();
	}

	focus() {
		this.canvas.focus({preventScroll: true});
	}

	clearCanvas() {
		// Haxs for cleaning canvas
		var h = this.canvas.height;
		this.canvas.height = 0;
		this.canvas.height = h;
	}

}