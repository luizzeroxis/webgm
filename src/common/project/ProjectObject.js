import Serializer from "~/common/Serializer.js";

import {ProjectAction} from "./ProjectAction.js";

export class ProjectEvent {
	static {
		Serializer.setupClass(this, "ProjectEvent", {
			type: null, // refer to Events.js
			subtype: null,
			actions: {array: ProjectAction},
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	getNameId() {
		return JSON.stringify({type: this.type, subtype: this.subtype});
	}
}

export class ProjectObject {
	static {
		Serializer.setupClass(this, "ProjectObject", {
			id: null,
			name: null,
			sprite_index: -1,
			visible: true,
			solid: false,
			depth: 0,
			persistent: false,
			parent_index: -1,
			mask_index: -1,
			events: {array: ProjectEvent},
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "object"; }
	static getScreenName() { return "Object"; }
	static getScreenGroupName() { return "Objects"; }
	static getClassName() { return "ProjectObject"; }
}