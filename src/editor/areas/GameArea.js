import {parent, endparent, add, newElem, newCanvas} from '../../common/H.js'

export default class GameArea {

	constructor() {
		this.html = parent( add( newElem('game', 'div') ) )
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