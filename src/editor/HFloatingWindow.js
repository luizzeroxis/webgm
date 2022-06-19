import {parent, endparent, add, remove, HElement, HButton} from '../common/H.js'

export default class HFloatingWindow extends HElement {
	constructor(manager, id) {
		super('div', {class: 'h-floating-window'})

		this.manager = manager;
		this.id = id;

		this.html.addEventListener('focusin', e => {
			this.manager.focusWindow(this);
		})
		this.html.addEventListener('mousedown', e => {
			this.manager.focusWindow(this);
		})

		parent(this)

			this.titleBar = parent( add( new HElement('div', {class: 'h-title-bar'}) ) )
			this.titleBar.html.addEventListener('mousedown', e => this.dragStart(e));

				this.title = add( new HElement('div', {class: 'h-title'}) )

				this.closeButton = add( new HButton('Close', () => this.close(), 'h-close') );
				this.closeButton.html.addEventListener('mousedown', e => e.stopPropagation());

				endparent()

			this.client = add( new HElement('div', {class: 'h-client'}) )

			endparent()
	}
	onRemove() {
		if (this.mouseUpHandler)
			document.removeEventListener('mouseup', this.mouseUpHandler);
		if (this.mouseMoveHandler)
			document.removeEventListener('mousemove', this.mouseMoveHandler);
	}
	setPosition(x, y) {
		if (x < 0) {x = 0;}
		if (y < 0) {y = 0;}
		this.html.style.left = x.toString() + 'px';
		this.html.style.top = y.toString() + 'px';
	}
	dragStart(e) {
		e.preventDefault();

		const rect = this.html.getBoundingClientRect();

		this.offsetX = e.pageX - rect.left - window.scrollX;
		this.offsetY = e.pageY - rect.top - window.scrollY;

		this.dragUpdate(e.pageX, e.pageY)

		this.mouseUpHandler = e => this.dragEnd(e);
		document.addEventListener('mouseup', this.mouseUpHandler);

		this.mouseMoveHandler = e => this.dragUpdate(e.pageX, e.pageY);
		document.addEventListener('mousemove', this.mouseMoveHandler);
	}
	dragUpdate(pageX, pageY) {
		const x = pageX - this.offsetX;
		const y = pageY - this.offsetY;
		this.setPosition(x, y);
	}
	dragEnd(e) {
		if (this.mouseUpHandler)
			document.removeEventListener('mouseup', this.mouseUpHandler);
		if (this.mouseMoveHandler)
			document.removeEventListener('mousemove', this.mouseMoveHandler);
	}
	close() {
		this.manager.closeWindow(this);
	}
}