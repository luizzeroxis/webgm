//The editor class
class Editor {

	constructor() {

		//this.editor = this;
		this.project = new Project();
		this.game = null;
		this.projectName = 'game';

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
				if (!confirm("Clear current project and start anew?")) return;
				editor.newProject();
			}) )

			add ( this.newButtonOpenFile(null, 'Open', file => {
				this.openProjectFromFile(file);
			}, 'application/zip,application/json') )

			add( newButton(null, 'Save', () => {
				editor.saveProject();
			}) )

			this.runButton = add( newButton(null, 'Run', () => {
				editor.runGame();
			}) )

			this.stopButton = add( newButton(null, 'Stop', () => {
				editor.stopGame();
			}) )
			this.stopButton.disabled = true;

			endparent()
	}

	newButtonOpenFile(classes, content, onselectfile, accept, multiple=false) {
		var e = html('button', {class: classes}, {
			click: e => {
				VirtualFileSystem.openDialog(accept)
				.then(file => {
					return onselectfile(file);
				})
			},
			dragover: e => {
				e.preventDefault();
			},
			drop: e => {
				e.preventDefault();

				if (multiple) {
					// flatMap - if item is not file, don't add to list, if it is, get as file
					onselectfile(e.dataTransfer.items.flatMap(item => item.kind != 'file' ? [] : [item.getAsFile()]));
				} else {
					var item = e.dataTransfer.items[0];
					if (item != undefined && item.kind == 'file')
						onselectfile(item.getAsFile());
				}

			},
		}, content);
		return e;
	}

	newProject() {
		this.project = new Project();

		this.updateResourcesArea();
		this.updateWindowsArea();
	}

	openProject() {
		VirtualFileSystem.openDialog('application/zip,application/json')
		.then(file => {
			this.openProjectFromFile(file);
		})
	}

	openProjectFromFile(file) {

		var promise;

		if (file.type == 'application/json') {
			promise = VirtualFileSystem.readEntireFile(file)
			.then(json => ProjectSerializer.unserialize(json))
		} else {
			promise = ProjectSerializer.unserializeZIP(file);
		}

		promise.then(project => {
			if (project) {
				this.project = project;

				this.updateResourcesArea();
				this.updateWindowsArea();

				this.projectName = file.name.substring(0, file.name.lastIndexOf('.'));

			} else {
				alert('Error Loading: File seems to be corrupt.');
				return;
			}
		})
	}

	saveProject() {

		ProjectSerializer.serializeZIP(this.project)
		.then(blob => {
			VirtualFileSystem.save(blob, this.projectName+".zip");
		})
		
	}

	runGame() {

		this.stopGame();

		if (this.project.resources.ProjectRoom.length <= 0) {
			alert('A game must have at least one room to run.');
			return;
		}

		this.runButton.disabled = true;
		this.stopButton.disabled = false;

		this.gameArea.scrollIntoView();
		this.gameCanvas.focus();

		this.game = new Game(this.project, $('.canvas'), $('.canvas'));

		this.game.dispatcher.listen({
			close: e => {

				if (e instanceof WebGMException) {
					alert("An error has ocurred when trying to run the game:\n" + e.message);
				}

				this.runButton.disabled = false;
				this.stopButton.disabled = true;

				// Haxs for cleaning canvas
				var h = this.gameCanvas.height;
				this.gameCanvas.height = 0;
				this.gameCanvas.height = h;

				if (e) {
					throw e;
				}
			}
		})

		this.game.init();
				
	}

	stopGame () {
		if (this.game) {
			this.game.close();
			this.game = null;
		}
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
		var index = this.htmlWindows.findIndex(x => x.id == resource);
		if (index>=0) {
			this.htmlWindows[index].remove();
			this.htmlWindows.splice(index, 1);
		}
	}

	getActionType(...args) {
		var actionTypeLibrary, actionTypeId;

		var [action] = args;
		if (action instanceof ProjectAction) {
			actionTypeLibrary = action.typeLibrary;
			actionTypeId = action.typeId;
		} else {
			[actionTypeLibrary, actionTypeId] = args;
		}

		var library = this.libraries.find(x => x.name == actionTypeLibrary);
		var actionType = library.items.find(x => x.id == actionTypeId);
		return actionType;
	}

/*	getActionType(actionTypeLibrary, actionTypeId) {
		var library = this.libraries.find(x => x.name == actionTypeLibrary);
		var actionType = library.items.find(x => x.id == actionTypeId);
		return actionType;
	}*/

	// Game area
	makeGameArea() {
		this.gameArea = parent( add( html('div', {class: 'game'}) ) )
			this.gameCanvas = add( newCanvas("canvas", 640, 480) )
			this.gameCanvas.setAttribute('tabindex', 0);
			endparent()
	}

}