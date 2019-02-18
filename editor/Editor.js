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

		//Libraries
		this.libraries = [
			{name: 'main', types: [
				{id: 1, kind: 'code'},
				{id: 2, kind: 'normal', execution: () => {}},
			]}
		];

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

	unserialize(json) {

		var jsonObject;

		try {
			jsonObject = JSON.parse(json);
		} catch (e) {
			return null;
		}

		//convert sprites, from base64 to blobs
		jsonObject.sprites.forEach(sprite => {
			sprite.images.forEach((image, i) => {
				//
				sprite.images[i] = new AbstractImage( URL.createObjectURL( base64ToBlob(image, 'image/png') ) );
			})
		})

		//convert action ids to action type objects
		jsonObject.objects.forEach(object => {
			object.events.forEach(events => {
				events.actions.forEach(action => {
					//action.type = this.libraries.find(x => );
				})
			})
		})

		var project = Object.assign(new Project(), jsonObject);
		return project;

	}

	openProject () {

		vfs.openDialog('application/json', (file) => {
			if (file) {

				vfs.readEntireFile(file, (json) => {

					this.newProject();
					var project = this.unserialize(json);

					if (project == null) {
						alert('This is not a project file.');
						return;
					}

					this.project = project;

					this.dispOpenProject.dispatch();

				});

			}
		});

	}

	serialize(project) {

		var projectObject = Object.assign({}, project);

		var promises = [];

		projectObject.sprites.forEach(sprite => {
			sprite.images.forEach((image, i) => {

				promises.push(
					blobToBase64(image).then(base64 => {
						sprite.images[i] = base64;
					})
				)

			})
		})

		return Promise.all(promises).then(() => {
			var json = JSON.stringify(projectObject, null, '\t');
			return json;
		})

	}

	saveProject () {

		vfs.saveDialog(this.projectName, (file) => {

			this.serialize(this.project).then(json => {
				vfs.writeEntireFile(file, json);
				this.projectName = file.name;
				this.dispSaveProject.dispatch();
			});			

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
			this.game = null;
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