import AudioWrapper from "~/common/AudioWrapper.js";
import Serializer from "~/common/Serializer.js";

export class ProjectSound {
	static {
		Serializer.setupClass(this, "ProjectSound", {
			id: null,
			name: null,
			sound: {object: AudioWrapper, serialize: false},
			fileType: "",
			kind: "media", // normal, background, 3d, media
			// chorus: false,
			// flanger: false,
			// gargle: false,
			// echo: false,
			// reverb: false,
			volume: 1,
			pan: 0,
			preload: true,
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