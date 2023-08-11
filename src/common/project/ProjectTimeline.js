import Serializer from "~/common/Serializer.js";

import {ProjectAction} from "./ProjectAction.js";

export class ProjectTimelineMoment {
	static {
		Serializer.setupClass(this, "ProjectTimelineMoment", {
			step: null,
			actions: {array: ProjectAction},
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectTimeline {
	static {
		Serializer.setupClass(this, "ProjectTimeline", {
			id: null,
			name: null,
			moments: {array: ProjectTimelineMoment},
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "timeline"; }
	static getScreenName() { return "Time Line"; }
	static getScreenGroupName() { return "Time Lines"; }
	static getClassName() { return "ProjectTimeline"; }
}