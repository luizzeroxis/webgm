import {ProjectSprite, ProjectSound, ProjectBackground, ProjectPath, ProjectScript, ProjectFont, ProjectTimeline, ProjectObject, ProjectRoom, ProjectGameInformation, ProjectGlobalGameSettings, ProjectExtensionPackages} from "./ProjectProperties.js";

export * from "./ProjectProperties.js";

export class Project {
	static resourceTypes = [
		ProjectSprite,
		ProjectSound,
		ProjectBackground,
		ProjectPath,
		ProjectScript,
		ProjectFont,
		ProjectTimeline,
		ProjectObject,
		ProjectRoom,
	];

	constructor(object) {
		if (!object) {
			this.resources = {};
			this.counter = {};

			Project.resourceTypes.forEach(type => {
				const typeName = type.getClassName();
				this.resources[typeName] = [];
				this.counter[typeName] = 0;
			});

			this.gameInformation = new ProjectGameInformation();
			this.globalGameSettings = new ProjectGlobalGameSettings();
			this.extensionPackages = new ProjectExtensionPackages();

			// this.constants = [];

			this.lastId = 100000;
		} else {
			this.resources = {};
			this.counter = {};

			Project.resourceTypes.forEach(type => {
				const typeName = type.getClassName();
				this.resources[typeName] = object.resources[typeName].map(resource => new type(resource));
				this.counter[typeName] = object.counter[typeName];
			});

			this.gameInformation = new ProjectGameInformation(object.gameInformation);
			this.globalGameSettings = new ProjectGlobalGameSettings(object.globalGameSettings);
			this.extensionPackages = new ProjectExtensionPackages(object.extensionPackages);
			this.lastId = object.lastId;
		}
	}

	createResource(type) {
		const resource = new type();
		resource.id = this.counter[type.getClassName()];
		resource.name = type.getName() + this.counter[type.getClassName()].toString();

		this.counter[type.getClassName()]++;
		this.resources[type.getClassName()].push(resource);
		return resource;
	}

	duplicateResource(oldResource) {
		const type = oldResource.constructor;

		const resource = new type(oldResource);
		resource.id = this.counter[type.getClassName()];
		resource.name = type.getName() + this.counter[type.getClassName()].toString();

		this.counter[type.getClassName()]++;
		this.resources[type.getClassName()].push(resource);
		return resource;
	}

	deleteResource(resource) {
		const index = this.resources[resource.constructor.getClassName()].findIndex(x => x == resource);
		this.resources[resource.constructor.getClassName()].splice(index, 1);
	}

	getResourceById(type, id) {
		if (typeof type == "object") {
			type = type.getClassName();
		}
		return this.resources[type].find(x => x.id == id);
	}
}

export default Project;