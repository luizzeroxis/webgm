import JSZip from "jszip";

import AudioWrapper from "~/common/AudioWrapper.js";
import ImageWrapper from "~/common/ImageWrapper.js";
import Serializer from "~/common/Serializer.js";
import WebGMException from "~/common/WebGMException.js";

import Project from "./Project.js";

export class UnserializeException extends WebGMException {}

export default class ProjectSerializer {
	static serializeZIP(project) {
		const zip = new JSZip();
		zip.file("version", "2");

		const json = Serializer.serializeToJSON(project);

		zip.file("project.json", json);

		project.resources.ProjectSprite.forEach(sprite => {
			sprite.images.forEach((image, index) => {
				if (image) {
					zip.file("sprites/"+sprite.id+"/"+index, image.blob);
				}
			});
		});

		project.resources.ProjectSound.forEach(sound => {
			if (sound.sound) {
				zip.file("sounds/"+sound.id, sound.sound.blob);
			}
		});

		project.resources.ProjectBackground.forEach(background => {
			if (background.image) {
				zip.file("backgrounds/"+background.id, background.image.blob);
			}
		});

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
			if (version < 2) throw new UnserializeException("Unsupported "+version.toString()+" version.");
		})
		.then(() => {
			const file = zip.file("project.json");
			if (file == null) throw new UnserializeException("\"project.json\" file does not exist in zip file.");
			return file.async("string");
		})
		.then(json => {
			if (version == 2) {
				const promises = [];

				// const project = Serializer.unserializeFromJSON(json);
				const project = Serializer.unserializeFromJSON(json, {kind: "object", objectType: Project});

				project.resources.ProjectSprite.forEach(sprite => {
					sprite.images.forEach((image, index) => {
						const file = zip.file("sprites/"+sprite.id+"/"+index);
						if (file == null) return;

						promises.push(file.async("blob")
						.then(blob => {
							sprite.images[index] = new ImageWrapper(blob);
						}));
					});
				});

				project.resources.ProjectSound.forEach(sound => {
					const file = zip.file("sounds/"+sound.id);
					if (file == null) return;

					promises.push(file.async("blob")
						.then(blob => {
							sound.sound = new AudioWrapper(blob);
						}));
				});

				project.resources.ProjectBackground.forEach(background => {
					const file = zip.file("backgrounds/"+background.id);
					if (file == null) return;

					promises.push(file.async("blob")
						.then(blob => {
							background.image = new ImageWrapper(blob);
						}));
				});

				return Promise.all(promises).then(() => {
					return project;
				});
			}

			throw new UnserializeException("Unsupported "+version.toString()+" version.");
		});
	}
}