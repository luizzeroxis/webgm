//
class WindowsArea {

	constructor(editor) {

		this.editor = editor;

		this.windowOrder = 1;

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
		this.windowOrder = 1;

	}

	onOpenProject() {
		//For every type of resource...
		Object.keys(this.editor.types).forEach((type, index) => {

			//Loop through the array of that resource in the project
			for (var resource of this.editor.project[(this.editor.types[type].array)] ) {
				this.createUI(type, resource, false);
			}

		});

	}

	createUI(type, resource, showwindow) {

		//TODO Create window for editing
		parent( $('.windows') )
			var w = new this.editor.types[type].windowCreator(this.editor, type, resource);

			w.window.style.order = this.windowOrder;
			this.windowOrder++;

			if (showwindow) {
				this.moveWindowToTop(w.window);
			} else {
				w.window.classList.add('hidden');
			}

			endparent()

	}

	onNewResource(type, resource, showwindow) {

		this.createUI(type, resource, showwindow);

	}

	openWindow(type, id) {
		var win = $('.windows .type-'+type+'.id-'+id);

		//Make window visible
		win.classList.remove('hidden');

		this.moveWindowToTop(win);
	}

	moveWindowToTop(win) {
		// Change all window orders
		var wins = document.querySelectorAll('.window');

		for (var i = 0; i < wins.length; i++) {
			//In case this item is above the item to move up, make it lower
			//console.log(wins[i].style.order, win.style.order);
			if (parseInt(wins[i].style.order) < parseInt(win.style.order)) {
				wins[i].style.order++;
			}
		}
		
		//Make it first
		win.style.order = 1;
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