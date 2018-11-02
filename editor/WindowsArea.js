//
class WindowsArea {

	constructor(editor) {

		this.editor = editor;

		add( html('div', {class: "windows"}) )

		this.editor.dispNewProject.addListener(() => this.onNewProject());
		this.editor.dispOpenProject.addListener(() => this.onOpenProject());

		this.editor.dispNewResource.addListener((...a) => this.onNewResource(...a));
		this.editor.dispDeleteResource.addListener((...a) => this.onDeleteResource(...a));

		this.editor.dispChangeResource.addListener((...a) => this.onChangeResource(...a));

	}

	onNewProject() {

		//Delete all windows
		$(".windows").innerText = '';

	}

	onOpenProject() {
		//For every type of resource...
		Object.keys(this.editor.types).forEach((type, index) => {

			//Loop through the array of that resource in the project
			for (var resource of this.editor.project[(this.editor.types[type].array)] ) {
				this.createUI(type, resource);
			}

		});

	}

	createUI(type, resource, showwindow) {

		//TODO Create window for editing
		parent( $('.windows') )
			parent( add( newElem('window type-'+type+' id-'+resource.id + (showwindow ? '' : ' hidden'), 'div') ) )

				new this.editor.types[type].windowCreator(this.editor, type, resource);

				endparent()
			endparent()
	}

	onNewResource(type, resource, showwindow) {

		this.createUI(type, resource, showwindow);
	}

	openWindow(type, id) {
		//Make window visible
		$('.windows .type-'+type+'.id-'+id).classList.remove('hidden');
	}

	onDeleteResource(type, resource) {
		//Delete window
		var thewindow = $('.windows .type-'+type+'.id-'+resource.id);
		thewindow.parentElement.removeChild(thewindow);

	}

	onChangeResource(type, resource, changes) {
		$('.windows .window.type-'+type+'.id-'+resource.id+' .title').innerText = resource.name;
	}

}