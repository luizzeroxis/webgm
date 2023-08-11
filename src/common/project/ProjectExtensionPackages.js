import Serializer from "~/common/Serializer.js";

export class ProjectExtensionPackages {
	static {
		Serializer.setupClass(this, "ProjectExtensionPackages", {

		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}