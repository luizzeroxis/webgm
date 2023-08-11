import Serializer from "~/common/Serializer.js";

export class ProjectScript {
	static {
		Serializer.setupClass(this, "ProjectScript", {
			id: null,
			name: null,
			code: "",
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "script"; }
	static getScreenName() { return "Script"; }
	static getScreenGroupName() { return "Scripts"; }
	static getClassName() { return "ProjectScript"; }
}