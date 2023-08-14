import Serializer from "~/common/Serializer.js";

export class ProjectGlobalGameSettings {
	static {
		Serializer.setupClass(this, "ProjectGameInformation", {
			startInFullScreen: false,
			colorOutsideRoom: "#000000",
			displayCursor: true,

			keyEscEndsGame: true,
			treatCloseButtonAsEsc: true,
			keyF1ShowsGameInformation: true,
			keyF4SwitchesFullscreen: true,
			keyF5SavesF6Loads: true,
			keyF9Screenshots: true,
			versionMajor: 1,
			versionMinor: 0,
			versionRelease: 0,
			versionBuild: 0,
			company: "",
			product: "",
			copyright: "",
			description: "",

			displayErrors: true,
			abortOnError: false,
			uninitializedVarsAre0: false,

			author: "",
			version: "100",
			information: "",
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}