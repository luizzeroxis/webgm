import AudioWrapper from "~/common/AudioWrapper.js";
import Serializer from "~/common/Serializer.js";

export class ProjectSound {
	static {
		Serializer.setupClass(this, "ProjectSound", {
			id: null,
			name: null,
			sound: {object: AudioWrapper, serialize: false},
			fileType: null,
			volume: 1,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "sound"; }
	static getScreenName() { return "Sound"; }
	static getScreenGroupName() { return "Sounds"; }
	static getClassName() { return "ProjectSound"; }
}