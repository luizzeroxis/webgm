import Dispatcher from "./Dispatcher.js";
import {ProjectGameInformation, ProjectGlobalGameSettings, ProjectExtensionPackages} from "./ProjectProperties.js";
import {ProjectResources, ProjectCounters} from "./ProjectResourcesAndCounters.js";
import Serializer from "./Serializer.js";

export * from "./ProjectProperties.js";

export class Project {
	static resourceTypes = ProjectResources.types;

	static {
		Serializer.setupClass(this, "Project", {
			resources: ProjectResources,
			counter: ProjectCounters,

			gameInformation: ProjectGameInformation,
			globalGameSettings: ProjectGlobalGameSettings,
			extensionPackages: ProjectExtensionPackages,

			lastId: 100000,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);

		this.dispatcher = new Dispatcher();
	}

	getResourceById(type, id) {
		if (typeof type == "object") {
			type = type.getClassName();
		}
		return this.resources[type].find(x => x.id == id);
	}

	createResource(type) {
		const resource = new type();
		resource.id = this.counter[type.getClassName()];
		resource.name = type.getName() + this.counter[type.getClassName()].toString();

		this.counter[type.getClassName()]++;
		this.resources[type.getClassName()].push(resource);

		this.dispatcher.speak("createResource", resource);
		return resource;
	}

	moveResource(resource, toIndex) {
		const list = this.resources[resource.constructor.getClassName()];
		const fromIndex = list.indexOf(resource);
		if (fromIndex == -1) throw new Error("Resource doesn't exist.");
		list.splice(toIndex, 0, ...list.splice(fromIndex, 1));
		this.dispatcher.speak("moveResource", resource, toIndex);
	}

	duplicateResource(oldResource) {
		const type = oldResource.constructor;

		const resource = new type(oldResource);
		resource.id = this.counter[type.getClassName()];
		resource.name = type.getName() + this.counter[type.getClassName()].toString();

		this.counter[type.getClassName()]++;
		this.resources[type.getClassName()].push(resource);

		this.dispatcher.speak("createResource", resource);
		return resource;
	}

	deleteResource(resource) {
		const index = this.resources[resource.constructor.getClassName()].findIndex(x => x == resource);
		this.resources[resource.constructor.getClassName()].splice(index, 1);

		this.dispatcher.speak("deleteResource", resource);
	}

	changeResourceName(resource, name) {
		resource.name = name;
		this.dispatcher.speak("changeResourceName", resource);
	}

	changeSpriteImages(sprite, images) {
		sprite.images = images;
		this.dispatcher.speak("changeSpriteImages", sprite);
	}

	changeSpriteOrigin(sprite, originx, originy) {
		sprite.originx = originx;
		sprite.originy = originy;
		this.dispatcher.speak("changeSpriteOrigin", sprite);
	}

	changeBackgroundImage(background, image) {
		background.image = image;
		this.dispatcher.speak("changeBackgroundImage", background);
	}

	changeObjectSprite(object, sprite) {
		object.sprite_index = sprite;
		this.dispatcher.speak("changeObjectSprite", object);
	}
}

export default Project;