//The editor class
class Editor {

	constructor() {

		//this.editor = this;
		this.project = new Project();
		this.game = null;
		this.projectName = 'game.json';

		this.dispatcher = new Dispatcher();

		//Libraries
		this.libraries = BuiltInLibraries.getList();

		//Areas
		parent( add( html('div', {class: 'grid'}) ) )

			this.makeMenuArea();
			this.makeResourcesArea();
			this.makeWindowsArea();
			this.makeGameArea();

			endparent()

		//
		this.dispatcher.listen({
			createResource: i => {
				this.addResourceToResourcesArea(i);
				this.openResourceWindow(i);
			},
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
		this.dispatcher.speak('changeSpriteOrigin', sprite);
	}
	changeBackgroundImage(background, image) {
		background.image = image;
		this.dispatcher.speak('changeBackgroundImage', background);
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
				alert('Error Loading: File seems to be corrupt.');
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

		this.gameArea.scrollIntoView();
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

				parent( add( newElem(null, 'li') ) );
					add( newImage('icon', 'img/game-information-icon.png') );
					add( newElem('name', 'span', 'Game Information') )

					parent( add( newElem('right', 'div') ) )
						add( newButton(null, 'Edit', () => this.openWindow(HTMLWindowGameInformation,
							'game-information', this.project.gameInformation)) )
						endparent();

					endparent();

				parent( add( newElem(null, 'li') ) );
					add( newImage('icon', 'img/global-game-settings-icon.png') );
					add( newElem('name', 'span', 'Global Game Settings') )

					parent( add( newElem('right', 'div') ) )
						add( newButton(null, 'Edit', () => this.openWindow(HTMLWindowGlobalGameSettings,
							'global-game-settings', this.project.globalGameSettings )) )
						endparent();

					endparent();

				// parent( add( newElem(null, 'li') ) );
				// 	add( newImage('icon', 'img/extension-packages-icon.png') );
				// 	add( newElem('name', 'span', 'Extension packages') )

				// 	parent( add( newElem('right', 'div') ) )
				// 		add( newButton(null, 'Edit', () => this.openWindow(HTMLWindowExtensionPackages,
				// 			'extension-packages', this.project.extensionPackages)) )
				// 		endparent();

				// 	endparent();

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
		if (resource.classname == "ProjectBackground") {
			if (resource.image) {
				return resource.image.image.src;
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

	openWindow(windowclass, id, ...clientargs) {
		if (this.htmlWindows.find(x => x.id == id)) {
			this.focusWindow(id);
			return null;
		} else {

			parent(this.htmlWindowsArea)
				var w = new windowclass(id, this);
				w.makeClient(...clientargs);
				endparent()

			this.htmlWindows.unshift(w);
			this.organizeWindows();
			return w;
		}
	}

	openResourceWindow(resource) {
		var windowMakers = {};
		windowMakers[ProjectSprite.name] = HTMLWindowSprite;
		windowMakers[ProjectSound.name]  = HTMLWindowSound;
		windowMakers[ProjectBackground.name] = HTMLWindowBackground;
		windowMakers[ProjectPath.name] = HTMLWindowPath;
		windowMakers[ProjectScript.name] = HTMLWindowScript;
		windowMakers[ProjectFont.name]   = HTMLWindowFont;
		windowMakers[ProjectTimeline.name]   = HTMLWindowTimeline;
		windowMakers[ProjectObject.name] = HTMLWindowObject;
		windowMakers[ProjectRoom.name]   = HTMLWindowRoom;

		this.openWindow(windowMakers[resource.classname], resource, resource);
	}

	focusWindow(id) {
		var index = this.htmlWindows.findIndex(x => x.id == id);

		// splice returns a array of removed elements
		this.htmlWindows.unshift(this.htmlWindows.splice(index, 1)[0]);

		this.organizeWindows();
	}

	organizeWindows() {
		this.htmlWindows.forEach((window, i) => {
			window.html.style.order = i;
		})
	}

	deleteWindow(w) {
		var index = this.htmlWindows.findIndex(x => x == w);
		if (index>=0) {
			this.htmlWindows[index].remove();
			this.htmlWindows.splice(index, 1);
			return true;
		}
		return false;
	}

	deleteResourceWindow(resource) {
		console.log('del')
		var index = this.htmlWindows.findIndex(x => x.id == resource);
		if (index>=0) {
			this.htmlWindows[index].remove();
			this.htmlWindows.splice(index, 1);
		}
	}

	// Game area
	makeGameArea() {
		this.gameArea = parent( add( html('div', {class: 'game'}) ) )
			this.gameCanvas = add( newCanvas("canvas", 640, 480) )
			this.gameCanvas.setAttribute('tabindex', 0);
			endparent()
	}

}