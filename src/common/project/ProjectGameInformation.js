import Serializer from "~/common/Serializer.js";

export class ProjectGameInformation {
	static {
		Serializer.setupClass(this, "ProjectGameInformation", {
			text: "",
			separateWindow: false,
			windowCaption: "Game Information",
			left: -1,
			right: -1,
			width: 600,
			height: 400,
			showBorderAndCaption: true,
			allowResize: true,
			alwaysOnTop: false,
			stopGame: true,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}