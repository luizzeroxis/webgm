import AudioWrapper from "~/common/AudioWrapper.js";
import ImageWrapper from "~/common/ImageWrapper.js";
import Serializer from "~/common/Serializer.js";

export class ProjectSprite {
	static {
		Serializer.setupClass(this, "ProjectSprite", {
			id: null,
			name: null,
			images: {array: ImageWrapper}, // this should not be serialized, however look at ProjectSerializer
			originx: 0,
			originy: 0,
			separateCollisionMasks: false,
			alphaTolerance: 0,
			boundingBox: "automatic", // automatic, fullimage, manual
			bbLeft: 0,
			bbTop: 0,
			bbRight: 0,
			bbBottom: 0,
			shape: "precise", // precise, rectangle, disk, diamond
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "sprite"; }
	static getScreenName() { return "Sprite"; }
	static getScreenGroupName() { return "Sprites"; }
	static getClassName() { return "ProjectSprite"; }
}

export class ProjectSound {
	static {
		Serializer.setupClass(this, "ProjectSound", {
			id: null,
			name: null,
			sound: {object: AudioWrapper, value: null},
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

export class ProjectPathPoint {
	static {
		Serializer.setupClass(this, "ProjectPathPoint", {
			x: 0,
			y: 0,
			sp: 100,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectPath {
	static {
		Serializer.setupClass(this, "ProjectPath", {
			id: null,
			name: null,
			points: {array: ProjectPathPoint},
			backgroundRoomIndex: -1,
			connectionKind: "lines", // lines, curve
			closed: true,
			precision: 4,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "path"; }
	static getScreenName() { return "Path"; }
	static getScreenGroupName() { return "Paths"; }
	static getClassName() { return "ProjectPath"; }
}

export class ProjectScript {
	static {
		Serializer.setupClass(this, "ProjectScript", {
			id: null,
			name: null,
			code: "",
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "script"; }
	static getScreenName() { return "Script"; }
	static getScreenGroupName() { return "Scripts"; }
	static getClassName() { return "ProjectScript"; }
}

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

export class ProjectActionArg {
	static {
		Serializer.setupClass(this, "ProjectActionArg", {
			kind: null, // expression, string, both, boolean, menu, color, sprite, sound, background, path, script, object, room, font, timeline
			value: null,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectAction {
	static {
		Serializer.setupClass(this, "ProjectAction", {
			typeLibrary: null,
			typeId: null,
			typeKind: null, // normal, begin group, end group, else, exit, repeat, variable, code
			typeExecution: null, // nothing, function, code
			typeExecutionFunction: null,
			typeExecutionCode: null,
			typeIsQuestion: null,

			args: {array: ProjectActionArg}, // ProjectActionArg

			appliesTo: -1, // -1 = self, -2 = other, 0>= = object index
			relative: false,
			not: false,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static typeInfo = [
		{kind: "normal", interfaceKind: "none", args: []},
		{kind: "normal", interfaceKind: "normal"},
		{kind: "normal", interfaceKind: "arrows", args: [
			{name: "Directions:", kind: "string", default: "000000000"},
			{name: "Speed:", kind: "expression", default: "0"},
		]},
		{kind: "normal", interfaceKind: "code", args: [
			{kind: "string", default: ""},
		]},
		{kind: "normal", interfaceKind: "text", args: [
			{kind: "string", default: ""},
		]},
		{kind: "repeat", hasApplyTo: false, args: [
			{name: "times:", kind: "expression", default: "1"},
		]},
		{kind: "variable", hasApplyTo: true, hasRelative: true, args: [
			{name: "variable:", kind: "string", default: ""},
			{name: "value:", kind: "expression", default: "0"},
		]},
		{kind: "code", hasApplyTo: true, args: [
			{kind: "string", default: ""},
		]},
		{kind: "begin", args: []},
		{kind: "end", args: []},
		{kind: "else", args: []},
		{kind: "exit", args: []},
	];

	setType(library, actionType) {
		this.typeLibrary = library.name;
		this.typeId = actionType.id;
		this.typeKind = actionType.kind;
		this.typeExecution = actionType.execution;
		this.typeExecutionFunction = actionType.executionFunction;
		this.typeExecutionCode = actionType.executionCode;
		this.typeIsQuestion = actionType.isQuestion;

		let typeArgs;

		if (actionType.kind == "normal" && actionType.interfaceKind == "normal") {
			// If kind and interface are normal, arguments come from the action type itself
			typeArgs = actionType.args;
		} else {
			// Otherwise, the arguments come from a predefined list
			typeArgs = ProjectAction.typeInfo
				.find(x => x.kind == actionType.kind && x.interfaceKind == actionType.interfaceKind)
				.args;
		}

		this.args = typeArgs.map(typeArg => {
			const actionArg = new ProjectActionArg();
			actionArg.kind = typeArg.kind;
			actionArg.value = typeArg.default;
			return actionArg;
		});
	}
}

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

export class ProjectInstance {
	static {
		Serializer.setupClass(this, "ProjectInstance", {
			id: null,
			x: null,
			y: null,
			object_index: null,
			creationCode: "",
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectRoomTile {
	static {
		Serializer.setupClass(this, "ProjectRoomTile", {
			backgroundIndex: null,
			x: null,
			y: null,
			backgroundX: null,
			backgroundY: null,
			backgroundW: null,
			backgroundH: null,
			depth: null,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectRoomBackground {
	static {
		Serializer.setupClass(this, "ProjectRoomBackground", {
			visibleAtStart: false,
			isForeground: false,
			backgroundIndex: -1,
			tileHorizontally: true,
			tileVertically: true,
			x: 0,
			y: 0,
			stretch: false,
			horizontalSpeed: 0,
			verticalSpeed: 0,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectRoomView {
	static {
		Serializer.setupClass(this, "ProjectRoomBackground", {
			visibleAtStart: false,
			viewX: 0,
			viewY: 0,
			viewW: 640,
			viewH: 480,
			portX: 0,
			portY: 0,
			portW: 640,
			portH: 480,
			objectFollowIndex: -1,
			objectFollowHorizontalBorder: 32,
			objectFollowVerticalBorder: 32,
			objectFollowHorizontalSpeed: -1,
			objectFollowVerticalSpeed: -1,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectRoom {
	static {
		Serializer.setupClass(this, "ProjectRoom", {
			id: null,
			name: null,

			instances: {array: ProjectInstance},

			caption: "",
			width: 640,
			height: 480,
			speed: 30,
			persistent: false,
			creationCode: "",

			tiles: {array: ProjectRoomTile},

			drawBackgroundColor: true,
			backgroundColor: "#c0c0c0",
			backgrounds: {array: ProjectRoomBackground},

			enableViews: false,
			views: {array: ProjectRoomView},
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static getName() { return "room"; }
	static getScreenName() { return "Room"; }
	static getScreenGroupName() { return "Rooms"; }
	static getClassName() { return "ProjectRoom"; }
}

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

export class ProjectGlobalGameSettings {
	static {
		Serializer.setupClass(this, "ProjectGameInformation", {
			startInFullScreen: false,
			colorOutsideRoom: "#000000",
			displayCursor: true,

			keyEscEndsGame: true,
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
			unitializedVarsAre0: false,

			author: "",
			version: "100",
			information: "",
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectExtensionPackages {
	static {
		Serializer.setupClass(this, "ProjectExtensionPackages", {

		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}