import Serializer from "~/common/Serializer.js";

export class ProjectConstant {
	static {
		Serializer.setupClass(this, "ProjectConstant", {
			name: "",
			value: "",
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}