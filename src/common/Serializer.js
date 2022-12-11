import {
	Project,
	ProjectResources,
	ProjectCounters,
	ProjectSprite,
	ProjectSound,
	ProjectBackground,
	ProjectPath,
	ProjectPathPoint,
	ProjectScript,
	ProjectFont,
	ProjectTimeline,
	ProjectTimelineMoment,
	ProjectObject,
	ProjectEvent,
	ProjectAction,
	ProjectActionArg,
	ProjectRoom,
	ProjectInstance,
	ProjectRoomTile,
	ProjectRoomBackground,
	ProjectRoomView,
	ProjectGameInformation,
	ProjectGlobalGameSettings,
	ProjectExtensionPackages,
} from "./Project.js";

export default class Serializer {
	// TODO this is temporary, classes should register themselves
	static classes = [
		{class: Project, name: "Project"},
		{class: ProjectResources, name: "ProjectResources"},
		{class: ProjectCounters, name: "ProjectConters"},
		{class: ProjectSprite, name: "ProjectSprite"},
		{class: ProjectSound, name: "ProjectSound"},
		{class: ProjectBackground, name: "ProjectBackground"},
		{class: ProjectPath, name: "ProjectPath"},
		{class: ProjectPathPoint, name: "ProjectPathPoint"},
		{class: ProjectScript, name: "ProjectScript"},
		{class: ProjectFont, name: "ProjectFont"},
		{class: ProjectTimeline, name: "ProjectTimeline"},
		{class: ProjectTimelineMoment, name: "ProjectTimelineMoment"},
		{class: ProjectObject, name: "ProjectObject"},
		{class: ProjectEvent, name: "ProjectEvent"},
		{class: ProjectAction, name: "ProjectAction"},
		{class: ProjectActionArg, name: "ProjectActionArg"},
		{class: ProjectRoom, name: "ProjectRoom"},
		{class: ProjectInstance, name: "ProjectInstance"},
		{class: ProjectRoomTile, name: "ProjectRoomTile"},
		{class: ProjectRoomBackground, name: "ProjectRoomBackground"},
		{class: ProjectRoomView, name: "ProjectRoomView"},
		{class: ProjectGameInformation, name: "ProjectGameInformation"},
		{class: ProjectGlobalGameSettings, name: "ProjectGlobalGameSettings"},
		{class: ProjectExtensionPackages, name: "ProjectExtensionPackages"},
	];

	static register(_class, name) {
		this.classes.push({name: name, class: _class});
	}

	static serializeToJSON(classObj) {
		const jsonObj = this.serializeValue(classObj);

		return JSON.stringify(jsonObj, null, "\t");
	}

	static serializeValue(value) {
		if (typeof value == "undefined" || typeof value == "boolean" ||typeof value == "number" || typeof value == "string") {
			return value;
		} else

		if (Array.isArray(value)) {
			return value.map(x => this.serializeValue(x));
		} else

		if (typeof value == "object") {
			if (value == null) return null;

			if (value.toJSON) return value.toJSON();

			const jsonObj = {};

			const className = this.classes.find(x => x.class == value.constructor)?.name;

			if (className) {
				jsonObj.$class = className;

				this.getProperties(value.constructor).forEach(p => {
					jsonObj[p.name] = this.serializeValue(value[p.name]);
				});
			} else {
				// throw new Error("class not registered in serializer");
				// TODO Remove this code after adding all _properties, so there won't be plain objects anymore.
				for (const property in value) {
					jsonObj[property] = this.serializeValue(value[property]);
				}
			}

			return jsonObj;
		} else {
			throw new Error("error serializing value");
		}
	}

	static unserializeFromJSON(json) {
		const jsonObj = JSON.parse(json);

		return this.unserializeValue(jsonObj);
	}

	static unserializeValue(value) {
		if (typeof value == "undefined" || typeof value == "boolean" ||typeof value == "number" || typeof value == "string") {
			return value;
		} else

		if (Array.isArray(value)) {
			return value.map(x => this.unserializeValue(x));
		} else

		if (typeof value == "object") {
			if (value == null) return null;

			let classObj;

			if (value.$class) {
				const _class = this.classes.find(x => x.name == value.$class)?.class;

				if (!_class) {
					throw new Error("class not registered in serializer");
				}

				classObj = new _class();

				this.getProperties(_class).forEach(p => {
					classObj[p.name] = this.unserializeValue(value[p.name]);
				});
			} else {
				// throw new Error("no $class");
				// TODO Remove this code after adding all _properties, so there won't be plain objects anymore.
				classObj = {};
				for (const property in value) {
					if (property != "$class") {
						classObj[property] = this.unserializeValue(value[property]);
					}
				}
			}

			return classObj;
		} else {
			throw new Error("error unserializing value");
		}
	}

	static getProperties(_class) {
		if (_class._properties) return _class._properties;

		const properties = [];
		const obj = new _class();

		for (const property in obj) {
			properties.push({name: property});
		}

		return properties;
	}
}