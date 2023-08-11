import ImageWrapper from "~/common/ImageWrapper.js";
import Serializer from "~/common/Serializer.js";

export class ProjectBackground {
	static {
		Serializer.setupClass(this, "ProjectBackground", {
			id: null,
			name: null,
			image: {object: ImageWrapper, value: null},

			useAsTileSet: false,
			tileWidth: 16,
			tileHeight: 16,
			horizontalOffset: 0,
			verticalOffset: 0,
			horizontalSep: 0,
			verticalSep: 0,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "background"; }
	static getScreenName() { return "Background"; }
	static getScreenGroupName() { return "Backgrounds"; }
	static getClassName() { return "ProjectBackground"; }
}