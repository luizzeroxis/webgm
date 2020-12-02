class ProjectSerializer {

	static serializeZIP(project) {

		var zip = new JSZip();
		zip.file("version", "2");

		ProjectSerializer.initClasses();
		var classes = Object.values(ProjectSerializer.classes);

		var json = JSON.stringify(project, function(key, value) {

			if (value != null) {
				if (classes.includes(value.constructor)) {
					value = {...value, $class: value.constructor.name};
				}
			}

			return value;
		}, "\t");

		zip.file("project.json", json);

		project.resources['ProjectSprite'].forEach(sprite => {
			sprite.images.forEach((image, index) => {
				zip.file("sprites/"+sprite.id+"/"+index, image.blob);
			})
		})

		project.resources['ProjectBackground'].forEach(background => {
			zip.file("backgrounds/"+background.id, background.image.blob);
		})

		return zip.generateAsync({type: 'blob'});

	}

	static unserializeZIP(blob) {

		var zip = new JSZip();
		var version;

		return zip.loadAsync(blob)
		.then(() => zip.file("version").async("string"))
		.then(versionString => {
			version = parseInt(versionString);
			console.log("ZIP version:", version);
			if (version < 1 || version > 2) throw new Error("Unsupported version");
		})
		.then(() => zip.file("project.json").async('string'))
		.then(json => {

			if (version == 1) {
				return ProjectSerializer.unserializeV1(json);
			}
			if (version == 2) {

				var promises = [];

				ProjectSerializer.initClasses();

				var project = JSON.parse(json, function(key, value) {
					if (value != null && value.$class) {
						var obj = new (ProjectSerializer.classes[value.$class])();
						obj = Object.assign(obj, value);
						delete obj.$class;
						return obj;
					}
					return value;
				});

				Project.getTypes().forEach(x => {
					if (project.resources[x.name] == undefined)
						project.resources[x.name] = [];
					if (project.counter[x.name] == undefined)
						project.counter[x.name] = 0;
				})

				project.resources['ProjectSprite'].forEach(sprite => {
					sprite.images.forEach((image, index) => {

						var file = zip.file("sprites/"+sprite.id+"/"+index);
						if (file == null) return;

						promises.push(file.async('blob')
						.then(blob => {
							sprite.images[index] = new AbstractImage(blob);
						}));

					})
				})

				project.resources['ProjectBackground'].forEach(background => {

					var file = zip.file("backgrounds/"+background.id);
					if (file == null) return;

					promises.push(file.async('blob')
						.then(blob => {
							background.image = new AbstractImage(blob);
						}));

				})

				return Promise.all(promises).then(() => {
					return project;
				});
			}

		})

	}

	static initClasses() {

		if (ProjectSerializer.classes != undefined) return;

		var classes = [
			Project,
			ProjectSprite,
			ProjectSound,
			ProjectBackground,
			ProjectPath,
			ProjectPathPoint,
			ProjectScript,
			ProjectFont,
			ProjectTimeline,
			ProjectTimelineMoment,
			ProjectObject,
			ProjectEvent,
			ProjectAction,
			ProjectActionArg,
			ProjectRoom,
			ProjectInstance,
			ProjectRoomTile,
			ProjectRoomBackground,
			ProjectRoomView,
			ProjectGameInformation,
			ProjectGlobalGameSettings,
			ProjectExtensionPackages,
		];

		ProjectSerializer.classes = {};

		for (var cls of classes) {
			ProjectSerializer.classes[cls.name] = cls;
		}

	}

	static unserializeV1(json) {
		var jsonObject;

		try {
			jsonObject = JSON.parse(json);
		} catch (e) {
			return null;
		}

		if (!jsonObject.resources) return null;

		//convert objects into types
		Project.getTypes().forEach(type => {
			if (!jsonObject.resources[type.name]) {
				jsonObject.resources[type.name] = [];
				return;
			}

			jsonObject.resources[type.name] = jsonObject.resources[type.name].map(resource => {

				delete resource.classname;

				//convert sprites from base64 to blobs
				if (type.name == "ProjectSprite") {
					resource.images = resource.images.map(image => {
						return new AbstractImage( base64ToBlob(image, 'image/png') );
					})
				}

				if (type.name == "ProjectObject") {
					resource.events = resource.events.map(event => {
						event.actions = event.actions.map(action => {
							//convert action ids to action type objects???
							delete action.classname;
							return Object.assign(new ProjectAction(), action);
						})
						delete event.classname;
						return Object.assign(new ProjectEvent(), event);

					})
				}

				if (type.name == "ProjectRoom") {
					resource.instances = resource.instances.map(instance => {
						delete instance.classname;
						return Object.assign(new ProjectInstance(), instance);
					})
				}

				return Object.assign(new type(), resource);

			})
		});

		var project = Object.assign(new Project(), jsonObject);

		return Promise.resolve(project);
	}

}