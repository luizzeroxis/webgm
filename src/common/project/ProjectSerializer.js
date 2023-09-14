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
		zip.file("version", "3");

		const json = Serializer.serializeToJSON(project);

		project.resources.ProjectSprite.forEach(sprite => {
			sprite.images.forEach((image, imageIndex) => {
				if (image) {
					zip.file(`sprites/${sprite.id}/${imageIndex}.png`, image.blob);
				}
			});
		});

		project.resources.ProjectSound.forEach(sound => {
			if (sound.sound) {
				zip.file(`sounds/${sound.id}${sound.fileType}`, sound.sound.blob);
			}
		});

		project.resources.ProjectBackground.forEach(background => {
			if (background.image) {
				zip.file(`backgrounds/${background.id}.png`, background.image.blob);
			}
		});

		zip.file("project.json", json);

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
			if (version <= 1) throw new UnserializeException(`Unsupported ${version} version.`);
		})
		.then(() => {
			const file = zip.file("project.json");
			if (file == null) throw new UnserializeException("\"project.json\" file does not exist in zip file.");
			return file.async("string");
		})
		.then(json => {
			if (version == 2 || version == 3) {
				const promises = [];

				// const project = Serializer.unserializeFromJSON(json);
				const project = Serializer.unserializeFromJSON(json, {kind: "object", objectType: Project});

				project.resources.ProjectSprite.forEach(sprite => {
					let imageIndexLoop = 0;

					while (true) {
						const imageIndex = imageIndexLoop;

						const fileName = (version == 3) ? `sprites/${sprite.id}/${imageIndex}.png` : `sprites/${sprite.id}/${imageIndex}`;
						const file = zip.file(fileName);

						if (file) {
							promises.push(file.async("blob").then(blob => {
								sprite.images[imageIndex] = new ImageWrapper(blob);
							}));
							++imageIndexLoop;
						} else {
							break;
						}
					}
				});

				project.resources.ProjectSound.forEach(sound => {
					const fileName = (version == 3) ? `sounds/${sound.id}${sound.fileType}` : `sounds/${sound.id}`;
					const file = zip.file(fileName);
					if (!file) throw new Error("File not found");

					promises.push(file.async("blob").then(blob => {
						sound.sound = new AudioWrapper(blob);
					}));
				});

				project.resources.ProjectBackground.forEach(background => {
					const fileName = (version == 3) ? `backgrounds/${background.id}.png` : `backgrounds/${background.id}`;
					const file = zip.file(fileName);
					if (!file) throw new Error("File not found");

					promises.push(file.async("blob").then(blob => {
						background.image = new ImageWrapper(blob);
					}));
				});

				return Promise.all(promises).then(() => {
					return project;
				});
			}

			throw new UnserializeException(`Unsupported ${version} version.`);
		});
	}
}