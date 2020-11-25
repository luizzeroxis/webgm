class ProjectSerializer {

	static getClassByName(name) {
		const classes = [ProjectSprite, ProjectSound, ProjectScript, ProjectFont, ProjectObject, ProjectRoom,
			ProjectEvent];

		const classNames = {}
		classes.forEach(_class => {
			classNames[_class.constructor.name] = _class;
		})

		if (classNames[name]) {
			return classNames[name];
		}
		return {};
	}

	static clone(obj) {
		// Deep cloning
		var copy;

		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Array
		if (obj instanceof Array) {
			copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = ProjectSerializer.clone(obj[i]);
			}
			return copy;
		}

		// Handle Blob
		if (obj instanceof Blob) {
			copy = new Blob([obj], {type: obj.type});
			return copy;
		}

		// Handle Function
		if (obj instanceof Function) {
			return obj;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = Object.assign(ProjectSerializer.getClassByName(obj.constructor.name), obj);
			// Object.keys(obj).forEach((attr) => {
			// 	copy[attr] = ProjectSerializer.clone(obj[attr]);
			// })
			console.log(copy);
			for (var attr in obj) {
			    if (obj.hasOwnProperty(attr)) copy[attr] = ProjectSerializer.clone(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	static serialize(project) {
		var projectObject = ProjectSerializer.clone(project);

		console.log(projectObject);

		var promises = [];

		projectObject.resources[ProjectSprite.name].forEach(sprite => {
			sprite.images.forEach((image, i) => {

				console.log(image);

				promises.push(
					blobToBase64(image.blob).then(base64 => {
						sprite.images[i] = base64;
					})
				)

			})
		})

		return Promise.all(promises).then(() => {
			var json = JSON.stringify(projectObject, null, "\t");
			return json;
		})
	}

	static unserialize(json) {
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
							return Object.assign(new ProjectAction(), action);
						})
						return Object.assign(new ProjectEvent(), event);

					})
				}

				return Object.assign(new type(), resource);

			})
		});

		console.log(jsonObject);

		var project = Object.assign(new Project(), jsonObject);
		console.log(project);

		return project;
	}
}