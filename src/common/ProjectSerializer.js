import JSZip from "jszip";

import AbstractAudio from "./AbstractAudio.js"
import AbstractImage from "./AbstractImage.js"
import {UnserializeException} from "./Exceptions.js";
import {
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
} from "./Project.js";
import {base64ToBlob} from "./tools.js"

export default class ProjectSerializer {
	static serializeZIP(project) {
		const zip = new JSZip();
		zip.file("version", "2");

		ProjectSerializer.initClasses();

		const json = JSON.stringify(project, (key, value) => {
			if (value != null) {
				const name = Object.keys(ProjectSerializer.classes).find(x => ProjectSerializer.classes[x] == value.constructor);
				if (name) {
					value = {...value, $class: name};
				}
			}

			return value;
		}, "\t");

		zip.file("project.json", json);

		project.resources.ProjectSprite.forEach(sprite => {
			sprite.images.forEach((image, index) => {
				if (image) {
					zip.file("sprites/"+sprite.id+"/"+index, image.blob);
				}
			})
		})

		project.resources.ProjectSound.forEach(sound => {
			if (sound.sound) {
				zip.file("sounds/"+sound.id, sound.sound.blob);
			}
		})

		project.resources.ProjectBackground.forEach(background => {
			if (background.image) {
				zip.file("backgrounds/"+background.id, background.image.blob);
			}
		})

		return zip.generateAsync({type: "blob"});
	}

	static unserializeZIP(blob) {
		const zip = new JSZip();
		let version;

		return new Promise((resolve, reject) => {
			zip.loadAsync(blob)
			.then(() => resolve())
			.catch(() => reject(new UnserializeException("Not a zip file.")));
		})
		.then(() => {
			const file = zip.file("version");
			if (file == null) throw new UnserializeException("\"version\" file does not exist in zip file.");
			return file.async("string");
		})
		.then(versionString => {
			version = parseInt(versionString);
			console.log("ZIP version:", version);
			if (version < 1 || version > 2) throw new UnserializeException("Unsupported "+version.toString+" version.");
		})
		.then(() => {
			const file = zip.file("project.json");
			if (file == null) throw new UnserializeException("\"project.json\" file does not exist in zip file.");
			return file.async("string");
		})
		.then(json => {
			if (version == 1) {
				return ProjectSerializer.unserializeV1(json);
			}
			if (version == 2) {
				let project;
				const promises = [];

				ProjectSerializer.initClasses();

				try {
					project = JSON.parse(json, (key, value) => {
						if (value != null && value.$class) {
							let obj = new (ProjectSerializer.classes[value.$class])();
							obj = Object.assign(obj, value);
							delete obj.$class;
							return obj;
						}
						return value;
					});
				} catch (e) {
					throw new UnserializeException("Error parsing \"project.json\" file.");
				}

				Project.getTypes().forEach(x => {
					if (project.resources[x.getClassName()] == undefined)
						project.resources[x.getClassName()] = [];
					if (project.counter[x.getClassName()] == undefined)
						project.counter[x.getClassName()] = 0;
				})

				project.resources.ProjectSprite.forEach(sprite => {
					sprite.images.forEach((image, index) => {
						const file = zip.file("sprites/"+sprite.id+"/"+index);
						if (file == null) return;

						promises.push(file.async("blob")
						.then(blob => {
							sprite.images[index] = new AbstractImage(blob);
						}));
					})
				})

				project.resources.ProjectSound.forEach(sound => {
					const file = zip.file("sounds/"+sound.id);
					if (file == null) return;

					promises.push(file.async("blob")
						.then(blob => {
							sound.sound = new AbstractAudio(blob);
						}));
				})

				project.resources.ProjectBackground.forEach(background => {
					const file = zip.file("backgrounds/"+background.id);
					if (file == null) return;

					promises.push(file.async("blob")
						.then(blob => {
							background.image = new AbstractImage(blob);
						}));
				})

				return Promise.all(promises).then(() => {
					return project;
				});
			}

			return null;
		})
	}

	static initClasses() {
		if (ProjectSerializer.classes != undefined) return;

		ProjectSerializer.classes = {
			"Project": Project,
			"ProjectSprite": ProjectSprite,
			"ProjectSound": ProjectSound,
			"ProjectBackground": ProjectBackground,
			"ProjectPath": ProjectPath,
			"ProjectPathPoint": ProjectPathPoint,
			"ProjectScript": ProjectScript,
			"ProjectFont": ProjectFont,
			"ProjectTimeline": ProjectTimeline,
			"ProjectTimelineMoment": ProjectTimelineMoment,
			"ProjectObject": ProjectObject,
			"ProjectEvent": ProjectEvent,
			"ProjectAction": ProjectAction,
			"ProjectActionArg": ProjectActionArg,
			"ProjectRoom": ProjectRoom,
			"ProjectInstance": ProjectInstance,
			"ProjectRoomTile": ProjectRoomTile,
			"ProjectRoomBackground": ProjectRoomBackground,
			"ProjectRoomView": ProjectRoomView,
			"ProjectGameInformation": ProjectGameInformation,
			"ProjectGlobalGameSettings": ProjectGlobalGameSettings,
			"ProjectExtensionPackages": ProjectExtensionPackages,
		}
	}

	static unserializeV1(json) {
		let jsonObject;

		try {
			jsonObject = JSON.parse(json);
		} catch (e) {
			throw new UnserializeException("Error parsing JSON file.");
		}

		if (!jsonObject.resources) return null;

		//convert objects into types
		Project.getTypes().forEach(type => {
			if (!jsonObject.resources[type.getClassName()]) {
				jsonObject.resources[type.getClassName()] = [];
				return;
			}

			jsonObject.resources[type.getClassName()] = jsonObject.resources[type.getClassName()].map(resource => {
				delete resource.classname;

				//convert sprites from base64 to blobs
				if (type == ProjectSprite) {
					resource.images = resource.images.map(image => {
						return new AbstractImage( base64ToBlob(image, "image/png") );
					})
				}

				if (type == ProjectObject) {
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

				if (type == ProjectRoom) {
					resource.instances = resource.instances.map(instance => {
						delete instance.classname;
						return Object.assign(new ProjectInstance(), instance);
					})
				}

				return Object.assign(new type(), resource);
			})
		});

		const project = Object.assign(new Project(), jsonObject);

		return Promise.resolve(project);
	}
}