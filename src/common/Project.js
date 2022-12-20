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