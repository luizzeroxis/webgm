//The editor class
class Editor {

	constructor() {

		//this.editor = this;
		this.project = new Project();
		this.game = null;
		this.projectName = 'game.json';

		this.dispatcher = new Dispatcher();

		//Libraries
		// TODO: i guess these must be like... ids? im not sure help

		this.libraries = [
			//Library
			{
				name: 'main',
				items: [
					{
						name: 'Execute Code',
						kind: 'code'
					},
					{
						name: 'Show message',
						kind: 'gmfunction',
						gmfunction: 'show_message',
					}
				]
			}
		];

		//Areas
		parent( add( html('div', {class: 'grid'}) ) )

			this.makeMenuArea();
			this.makeResourcesArea();
			this.makeWindowsArea();
			this.makeGameArea();

			endparent()

		//
		this.dispatcher.listen({
			createResource: i => this.addResourceToResourcesArea(i),
			deleteResource: i => {
				this.deleteResourceFromResourcesArea(i);
				this.deleteResourceWindow(i)
			},
		});

	}

	// Resource management

	createResource (type) {

		var resource = new type();
		resource.id = this.project.counter[type.name];
		resource.name = type.getName() + this.project.counter[type.name];

		this.project.counter[type.name]++;
		this.project.resources[type.name].push( resource );

		this.dispatcher.speak('createResource', resource);

		return resource;

	}

	deleteResource (resource) {

		if (confirm('You are about to delete '+resource.name+'. This will be permanent. Continue?')) {
			var index = this.project.resources[resource.classname].findIndex(x => x == resource);
			this.project.resources[resource.classname].splice(index, 1);

			this.dispatcher.speak('deleteResource', resource);
		}

	}

	changeResourceName(resource, name) {
		resource.name = name;
		this.dispatcher.speak('changeResourceName', resource);
	}
	changeSpriteImages(sprite, images) {
		sprite.images = images;
		this.dispatcher.speak('changeSpriteImages', sprite);
	}
	changeSpriteOrigin(sprite, originx, originy) {
		sprite.originx = originx;
		sprite.originy = originy;
		// TODO update room sprites
	}
	changeObjectSprite(object, sprite) {
		object.sprite_index = sprite;
		this.dispatcher.speak('changeObjectSprite', object);
	}

	// Menu area
	makeMenuArea() {
		parent( add( newElem('menu', 'div') ) )

			add( newButton(null, 'New', () => {
				editor.newProject();
			}) )

			add( newButton(null, 'Open', () => {
				editor.openProject();
			}) )

			add( newButton(null, 'Save', () => {
				editor.saveProject();
			}) )

			add( newButton(null, 'Run', () => {
				editor.runGame();
			}) )

			add( newButton(null, 'Stop', () => {
				editor.stopGame();
			}) )

			endparent()
	}

	newProject () {
		this.project = new Project();

		this.updateResourcesArea();
		this.updateWindowsArea();
	}

	openProject () {

		VirtualFileSystem.openDialog('application/json')
		.then(file => VirtualFileSystem.readEntireFile(file))
		.then(json => {

			var project = ProjectSerializer.unserialize(json);
			if (project) {

				delete this.project;
				this.project = project;

				this.updateResourcesArea();
				this.updateWindowsArea();

			} else {
				alert('This is not a project file.');
				return;
			}

		})
	}

	saveProject () {

		ProjectSerializer.serialize(this.project)
		.then(json => {
			var blob = new Blob([json], {type: 'text/json'});
			VirtualFileSystem.save(blob, this.projectName);
		});
	}

	runGame () {

		if (this.project.resources.ProjectRoom.length <= 0) {
			alert('A game must have at least one room to run.');
			return;
		}

		this.stopGame();
		this.game = new Game(this.project, $('.canvas'), $('.canvas'));
	}

	stopGame () {

		if (this.game) {
			this.game.gameEnd();
			this.game = null;
		}

		// Haxs for cleaning canvas
		var h = this.gameCanvas.height;
		this.gameCanvas.height = 0;
		this.gameCanvas.height = h;
	}

	// Resources area
	makeResourcesArea() {

		this.htmlResources = [];
		this.htmlResourceTypes = {};

		this.resourcesArea = parent( add( html('div', {class: "resources"}) ) )
			parent( add ( newElem(null, 'ul') ) )

				Project.getTypes().forEach(type => {

					parent( add( newElem(null, 'li') ) )
						add ( newElem(null, 'span', type.getScreenGroupName()) )
						add ( newButton('right', 'Create', () => {
							this.createResource(type);
						}) )
						this.htmlResourceTypes[type.name] = add ( newElem("resource", 'ul') )
						endparent()

				})

				endparent()
			endparent()
	}

	updateResourcesArea() {

		Project.getTypes().forEach(type => {

			this.htmlResourceTypes[type.name].textContent = '';
			this.project.resources[type.name].forEach(resource => {
				this.addResourceToResourcesArea(resource);
			})

		})

	}

	addResourceToResourcesArea(resource) {

		parent(this.htmlResourceTypes[resource.classname]);
			var r = new HTMLResource(resource, editor);

			r.htmlEditButton.onclick = () => this.openResourceWindow(resource)
			r.htmlDeleteButton.onclick = () => this.deleteResource(resource)

			this.htmlResources.push(r);
			endparent();

	}

	deleteResourceFromResourcesArea(resource) {

		var index = this.htmlResources.findIndex(x => x.id == resource);
		if (index>=0) {
			this.htmlResources[index].remove();
			this.htmlResources.splice(index, 1);
		}

	}

	getResourceIconSrc(resource) {
		if (resource.classname == "ProjectSprite") {
			if (resource.images.length > 0) {
				return resource.images[0].image.src;
			}
		} else
		if (resource.classname == "ProjectObject") {
			if (resource.sprite_index >= 0) {
				var sprite = this.project.resources.ProjectSprite.find(x => x.id == resource.sprite_index);
				if (sprite) {
					if (sprite.images.length > 0) {
						return sprite.images[0].image.src;
					}
				}
			}
		} else {
			return 'img/default-'+resource.classname+'-icon.png'; //LOL
		}
		return null;
	}

	setImageSrcRemovable(image, src) { //delet this
		setAttributeExceptNull(image, 'src', src);
	}

	// Windows area
	makeWindowsArea() {
		this.htmlWindows = [];
		this.htmlWindowsArea = add( html('div', {class: "windows"}) )
	}

	updateWindowsArea() {
		this.htmlWindowsArea.textContent = '';
		delete this.htmlWindows;
		this.htmlWindows = [];
	}

	makeWindow(id) {
		parent(this.htmlWindowsArea)
			var w = new HTMLWindow(id);
			endparent()

		this.htmlWindows.push(w);
		return w;
	}

	openResourceWindow(resource) {
		if (this.htmlWindows.find(x => x.id == resource)) {
			//
		} else {
			var w = this.makeWindow(resource);
			w.makeClientResource(resource, this);			
		}
	}

	deleteResourceWindow(resource) {
		var index = this.htmlWindows.findIndex(x => x.id == resource);
		if (index>=0) {
			this.htmlWindows[index].remove();
			this.htmlWindows.splice(index, 1);
		}
	}

	// Game area
	makeGameArea() {
		parent( add( html('div', {class: 'game'}) ) )
			this.gameCanvas = add( newCanvas("canvas", 640, 480) )
			this.gameCanvas.setAttribute('tabindex', 0);
			endparent()
	}

}