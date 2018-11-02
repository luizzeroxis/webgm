//The resources area class
class ResourcesArea {

	constructor(editor) {

		this.editor = editor;

		parent( add( html('div', {class: "resources"}) ) )
			parent( add ( newElem(null, 'ul') ) )

				Object.keys(this.editor.types).forEach((type, index) => {

					parent( add( newElem(null, 'li') ) )
						add ( newElem(null, 'span', this.editor.types[type].plural) )
						add ( newButton('right', 'Create', () => {
							this.editor.createResource(type);
						}) )
						add ( newElem("resource "+type, 'ul') )
						endparent()

				})

				endparent()
			endparent()

		this.editor.dispNewProject.addListener(() => this.onNewProject());
		this.editor.dispOpenProject.addListener(() => this.onOpenProject());

		this.editor.dispNewResource.addListener((...a) => this.onNewResource(...a));
		this.editor.dispDeleteResource.addListener((...a) => this.onDeleteResource(...a));

		this.editor.dispChangeResource.addListener((...a) => this.onChangeResource(...a));

	}

	onNewProject() {

		//Delete all resource tree elements
		Object.keys(this.editor.types).forEach((type, index) => {
			$(".resource."+type).innerText = '';
		});

	}

	onOpenProject() {
		console.log(this);
		//For every type of resource...
		Object.keys(this.editor.types).forEach((type, index) => {

			//Loop through the array of that resource in the project
			for (var resource of this.editor.project[(this.editor.types[type].array)] ) {

				this.createUI(type, resource);

			}

		});
	}

	createUI(type, resource) {
		//Update resource tree
		parent( $('.resource.'+type) )
			parent( add( newElem('type-'+type+' id-'+resource.id, 'li') ) )
				add ( newElem('name', 'span', resource.name) )
				parent( add( newElem('right', 'div') ) )
					add( newButton(null, 'Edit', () => this.editor.windowsArea.openWindow(type, resource.id)) )
					add( newButton(null, 'Delete', () =>
						confirm('You are about to delete '+resource.name+'. This will be permanent. Continue?')
						? this.editor.deleteResource(type, resource)
						: null)
					)
					endparent()
				endparent()
			endparent()
	}

	onNewResource(type, resource) {
		this.createUI(type, resource);
	}

	onDeleteResource(type, resource) {
		//Delete from resource tree
		var theul = $('.resource.'+type+' .id-'+resource.id);
		theul.parentElement.removeChild(theul);
	}

	onChangeResource(type, resource, data) {
		$('.resource.'+type+' .id-'+resource.id+' .name').innerText = resource.name;
		//TODO change icon?????????
	}

}