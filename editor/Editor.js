//The editor class
class Editor {

	constructor() {

		this.project = new Project();
		this.game = null;
		this.projectName = '.json';

		// Types of resources
		this.types = {};
		this.types['sprite'] = {
			name: 'Sprite',
			plural: 'Sprites',
			class: ProjectSprite,
			array: 'sprites',
			windowCreator: SpriteWindow
		};
		this.types['sound'] = {
			name: 'Sound',
			plural: 'Sounds',
			class: ProjectSound,
			array: 'sounds',
			windowCreator: SoundWindow
		}
		this.types['font'] = {
			name: 'Font',
			plural: 'Fonts',
			class: ProjectFont,
			array: 'fonts',
			windowCreator: FontWindow
		}
		this.types['object'] = {
			name: 'Object',
			plural: 'Objects',
			class: ProjectObject,
			array: 'objects',
			windowCreator: ObjectWindow
		}
		this.types['room'] = {
			name: 'Room',
			plural: 'Rooms',
			class: ProjectRoom,
			array: 'rooms',
			windowCreator: RoomWindow
		}

		//Dispatchers
		this.dispNewProject = new Dispatcher();
		this.dispOpenProject = new Dispatcher();
		this.dispSaveProject = new Dispatcher();
		this.dispRunGame = new Dispatcher();
		this.dispStopGame = new Dispatcher();

		this.dispNewResource = new Dispatcher();
		//this.dispNewResource.dispatch(type, res, showwindow);

		this.dispDeleteResource = new Dispatcher();
		//this.dispDeleteResource.dispatch(type, id);

		this.dispChangeResource = new Dispatcher();
		//this.dispChangeResource.dispatch(type, resource, changes);

		this.imageLoader = new ImageLoader(this);

		//Areas
		parent( add( html('div', {class: 'grid'}) ) )

			this.menuArea = new MenuArea(this);

			this.resourcesArea = new ResourcesArea(this);
			this.windowsArea = new WindowsArea(this);

			this.gameArea = new GameArea(this);

			endparent()

	}

	newProject () {

		//Delete project itself (TODO can it be null?)
		this.project = new Project();

		this.dispNewProject.dispatch();

	}

	openProject () {

		vfs.openDialog('application/json', (file) => {
			if (file) {

				console.log('Loading...');

				vfs.readEntireFile(file, (json) => {

					try {
						var parsed = JSON.parse(json);
					} catch (e) {
						alert('This is not a project file.');
						return;
					}

					//convert sprites, from base64 to blobs
					for (var i = 0; i < parsed.sprites.length; i++) {
						
						//console.log('OPEN, base64 = ', parsed.sprites[i].sprite)
						if (!(parsed.sprites[i].sprite == null)) {
							parsed.sprites[i].sprite = base64ToBlob(parsed.sprites[i].sprite, 'image/png');
						}
						//console.log('blob = ', parsed.sprites[i].sprite)

					}

					this.newProject();

					this.project = Object.assign(new Project(), parsed);
					console.log(this.project);

					this.dispOpenProject.dispatch();

				});

			}
		});

	}

	saveProject () {

		vfs.saveDialog(this.projectName, (file) => {

			var deparsed = Object.assign({}, this.project);
			console.log(deparsed);

			//convert images into sprites?

			var convertToBase64 = (i) => {

				console.log(i);

				if (i<deparsed.sprites.length) {

					//console.log('SAVE, blob = ', deparsed.sprites[i].sprite)

					if (deparsed.sprites[i].sprite instanceof Blob) {
						blobToBase64(deparsed.sprites[i].sprite, (r) => {

							deparsed.sprites[i].sprite = r;
							convertToBase64(i+1);

						});
					} else {
						//deparsed.sprites[i].sprite = null;
						convertToBase64(i+1);
					}

				} else {

					//console.log('terminou',i);

					var data = JSON.stringify(deparsed, null, '\t');
					vfs.writeEntireFile(file, data);
					this.projectName = file.name;

					this.dispSaveProject.dispatch();

				}

			}

			convertToBase64(0);

		});

	}

	runGame () {

		if (this.project.rooms.length <= 0) {
			alert('A game must have at least one room to run.');
			return;
		}

		this.stopGame();
		this.game = new Game(this.project, $('.canvas'), $('.canvas'), extensions);

		this.dispRunGame.dispatch();
	}

	stopGame () {

		if (this.game) {
			this.game.gameEnd();
		}

		// Haxs for cleaning canvas
		var h = $('.canvas').height;
		$('.canvas').height = 0;
		$('.canvas').height = h;

		this.dispStopGame.dispatch();

	}

	createResource (type) {

		//Make new resource and add it to project
		var res = new this.types[type].class();
		res.id = this.project.counter[type];
		res.name = type + this.project.counter[type];
		this.project.counter[type]++;
		this.project[this.types[type].array].push(res);

		this.dispNewResource.dispatch(type, res, true);

	}

	changeResource(type, resource, changes) {

		var thearray = this.project[this.types[type].array];
		var i = thearray.findIndex((x) => x.id == resource.id);

		thearray[i] = Object.assign(resource, changes);

		this.dispChangeResource.dispatch(type, resource, changes);
	}

	deleteResource (type, resource) {

		//Call before deleting
		this.dispDeleteResource.dispatch(type, resource);

		//Remove from project
		var thearray = this.project[this.types[type].array];
		thearray.splice(thearray.findIndex((x) => x.id == resource.id), 1);

	}

}