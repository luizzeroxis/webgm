import {ProjectSprite, ProjectSound, ProjectBackground, ProjectPath, ProjectScript, ProjectFont, ProjectTimeline, ProjectObject, ProjectRoom} from "./ProjectProperties.js";
import Serializer from "./Serializer.js";

export class ProjectResources {
	static types = [
		ProjectSprite,
		ProjectSound,
		ProjectBackground,
		ProjectPath,
		ProjectScript,
		ProjectFont,
		ProjectTimeline,
		ProjectObject,
		ProjectRoom,
	];

	static {
		Serializer.setupClass(this, "ProjectResources", Object.fromEntries(
			ProjectResources.types.map(type => [type.getClassName(), {array: type}]),
		));
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectCounters {
	static {
		Serializer.setupClass(this, "ProjectCounters", Object.fromEntries(
			ProjectResources.types.map(type => [type.getClassName(), 0]),
		));
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}