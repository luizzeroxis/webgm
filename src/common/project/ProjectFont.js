import Serializer from "~/common/Serializer.js";

export class ProjectFont {
	static {
		Serializer.setupClass(this, "ProjectFont", {
			id: null,
			name: null,
			font: "Arial",
			size: 12,
			bold: false,
			italic: false,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "font"; }
	static getScreenName() { return "Font"; }
	static getScreenGroupName() { return "Fonts"; }
	static getClassName() { return "ProjectFont"; }
}