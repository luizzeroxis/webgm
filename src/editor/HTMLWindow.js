import {parent, endparent, add, remove, html, newElem, newButton,newSelect} from '../common/tools.js'

export default class HTMLWindow {

	constructor(id, editor) {

		this.id = id;
		this.editor = editor;

		this.html = parent( add( newElem('window', 'div') ) )

			parent( add( newElem('titlebar', 'div') ) )
				this.htmlTitle = add( newElem(null, 'span', '') )
				this.htmlCloseButton = add( newButton('closebutton right', 'Close', () => this.close()) );
				endparent()

			this.htmlClient = parent( add( newElem('client', 'div') ) )
				endparent();
			endparent();
	}

	makeClient(resource) {}

	// TODO change so resourcetype is the actual class, not a name
	makeResourceSelect (classes, labelcontent, resourcetype, nonone) {

		var e = add( newSelect(classes, labelcontent) );

		var selectOptions = {};
		var select = parent(e.$('select'))

			if (!nonone) {
				add( html('option', {value: -1}, null, '<none>') );
			}
			this.editor.project.resources[resourcetype].forEach(resource => {
				selectOptions[resource.id] = add( html('option', {value: resource.id}, null, resource.name) )
			})
			endparent();

		this.editor.dispatcher.listen({
			createResource: i => {
				if (i.constructor.getClassName() != resourcetype) return;
				parent(select)
					selectOptions[i.id] = add( html('option', {value: i.id}, null, i.name) )
					endparent()
			},
			deleteResource: i => {
				if (i.constructor.getClassName() != resourcetype) return;
				remove(selectOptions[i.id])
				delete selectOptions[i.id];
			},
			changeResourceName: i => {
				if (i.constructor.getClassName() != resourcetype) return;
				selectOptions[i.id].textContent = i.name;
			}
		})

		return e;

	}

	makeApplyOkButtons(applyOkFunc, okFunc) {
		parent( add ( html('div') ) )

			add( newButton(null, 'Apply', () => {
				applyOkFunc();
			}) );

			add( newButton(null, 'Ok', () => {
				if (applyOkFunc() != false)
					okFunc();
			}) );

			endparent()
	}

	close() {
		this.editor.deleteWindow(this);
	}

	remove() {
		remove(this.html);
	}

}