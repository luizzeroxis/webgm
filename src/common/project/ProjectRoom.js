import Serializer from "~/common/Serializer.js";

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