import {parent, endparent, add, HElement, HCanvas} from '../../common/H.js'

export default class HAreaGame extends HElement{

	constructor() {
		parent( super('div', {class: 'game'}) )
			this.canvas = add( new HCanvas(640, 480) )
			this.canvas.html.setAttribute('tabindex', 0);
			endparent()
	}

	scrollIntoView() {
		this.html.scrollIntoView();
	}

	focus() {
		this.canvas.html.focus({preventScroll: true});
	}

	clearCanvas() {
		this.canvas.clear();
	}

}