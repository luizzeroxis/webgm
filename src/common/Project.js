export class Project {
	constructor(object) {
		if (!object) {
			this.resources = {};
			this.counter = {};

			Project.getTypes().forEach(type => {
				const typeName = type.getClassName();
				this.resources[typeName] = [];
				this.counter[typeName] = 0;
			})

			this.gameInformation = new ProjectGameInformation();
			this.globalGameSettings = new ProjectGlobalGameSettings();
			this.extensionPackages = new ProjectExtensionPackages();

			// this.constants = [];

			this.lastId = 100000;
		} else {
			this.resources = {};
			this.counter = {};

			Project.getTypes().forEach(type => {
				const typeName = type.getClassName();
				this.resources[typeName] = object.resources[typeName].map(resource => new type(resource));
				this.counter[typeName] = object.counter[typeName];
			})

			this.gameInformation = new ProjectGameInformation(object.gameInformation);
			this.globalGameSettings = new ProjectGlobalGameSettings(object.globalGameSettings);
			this.extensionPackages = new ProjectExtensionPackages(object.extensionPackages);
			this.lastId = object.lastId;
		}
	}

	static getTypes() {
		return [
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
	}
}

	export class ProjectSprite {
		constructor(object) {
			if (!object) {
				this.id = null;
				this.name = null;
				this.images = []; //AbstractImage
				this.originx = 0;
				this.originy = 0;

				this.separateCollisionMasks = false;
				this.alphaTolerance = 0;
				this.boundingBox = 'automatic';
				this.bbLeft = 31;
				this.bbTop = 31;
				this.bbRight = 0;
				this.bbBottom = 0;
				this.shape = 'precise';
			} else {
				this.id = object.id;
				this.name = object.name;
				this.images = [...object.images]; // No need to copy AbstractImage, it should never be modified
				this.originx = object.originx;
				this.originy = object.originy;

				this.separateCollisionMasks = object.separateCollisionMasks;
				this.alphaTolerance = object.alphaTolerance;
				this.boundingBox = object.boundingBox;
				this.bbLeft = object.bbLeft;
				this.bbTop = object.bbTop;
				this.bbRight = object.bbRight;
				this.bbBottom = object.bbBottom;
				this.shape = object.shape;
			}
		}
		static getName() { return 'sprite'; }
		static getScreenName() { return 'Sprite'; }
		static getScreenGroupName() { return 'Sprites'; }
		static getClassName() { return 'ProjectSprite'; }
	}

	export class ProjectSound {
		constructor(object) {
			if (!object) {
				this.id = null;
				this.name = null;
				this.sound = null; // AbstractAudio
				this.volume = 1;
			} else {
				this.id = object.id;
				this.name = object.name;
				this.sound = object.sound; // No need to copy AbstractAudio, it should never be modified
				this.volume = object.volume;
			}
		}
		static getName() { return 'sound'; }
		static getScreenName() { return 'Sound'; }
		static getScreenGroupName() { return 'Sounds'; }
		static getClassName() { return 'ProjectSound'; }
	}

	export class ProjectBackground {
		constructor(object) {
			if (!object) {
				this.id = null;
				this.name = null;
				this.image = null; // AbstractImage

				this.useAsTileSet = false;
				this.tileWidth = 16;
				this.tileHeight = 16;
				this.horizontalOffset = 0;
				this.verticalOffset = 0;
				this.horizontalSep = 0;
				this.verticalSep = 0;
			} else {
				this.id = object.id;
				this.name = object.name;
				this.image = object.image; // No need to copy AbstractImage, it should never be modified

				this.useAsTileSet = object.useAsTileSet;
				this.tileWidth = object.tileWidth;
				this.tileHeight = object.tileHeight;
				this.horizontalOffset = object.horizontalOffset;
				this.verticalOffset = object.verticalOffset;
				this.horizontalSep = object.horizontalSep;
				this.verticalSep = object.verticalSep;
			}
		}
		static getName() { return 'background'; }
		static getScreenName() { return 'Background'; }
		static getScreenGroupName() { return 'Backgrounds'; }
		static getClassName() { return 'ProjectBackground'; }

	}

	export class ProjectPath {
		constructor(object) {
			if (!object) {
				this.id = null;
				this.name = null;
				this.points = []; // ProjectPathPoint
				this.backgroundRoomIndex = -1;
				this.connectionKind = 'lines';
				this.closed = true;
				this.precision = 4;
			} else {
				this.id = object.id;
				this.name = object.name;
				this.points = object.points.map(point => new ProjectPathPoint(point));
				this.backgroundRoomIndex = object.backgroundRoomIndex;
				this.connectionKind = object.connectionKind;
				this.closed = object.closed;
				this.precision = object.precision;
			}
		}
		static getName() { return 'path'; }
		static getScreenName() { return 'Path'; }
		static getScreenGroupName() { return 'Paths'; }
		static getClassName() { return 'ProjectPath'; }
	}

		export class ProjectPathPoint {
			constructor(object) {
				if (!object) {
					this.x = 0;
					this.y = 0;
					this.sp = 100;
				} else {
					this.x = object.x;
					this.y = object.y;
					this.sp = object.sp;
				}
			}
		}

	export class ProjectScript {
		constructor(object) {
			if (!object) {
				this.id = null;
				this.name = null;
				this.code = "";
			} else {
				this.id = object.id;
				this.name = object.name;
				this.code = object.code;
			}
		}
		static getName() { return 'script'; }
		static getScreenName() { return 'Script'; }
		static getScreenGroupName() { return 'Scripts'; }
		static getClassName() { return 'ProjectScript'; }
	}

	export class ProjectFont {
		constructor(object) {
			if (!object) {
				this.id = null;
				this.name = null;
				this.font = 'Arial';
				this.size = 12;
				this.bold = false;
				this.italic = false;
			} else {
				this.id = object.id;
				this.name = object.name;
				this.font = object.font;
				this.size = object.size;
				this.bold = object.bold;
				this.italic = object.italic;
			}
		}
		static getName() { return 'font'; }
		static getScreenName() { return 'Font'; }
		static getScreenGroupName() { return 'Fonts'; }
		static getClassName() { return 'ProjectFont'; }
	}

	export class ProjectTimeline {
		constructor(object) {
			if (!object) {
				this.id = null;
				this.name = null;
				this.moments = []; // ProjectTimelineMoment
			} else {
				this.id = object.id;
				this.name = object.name;
				this.moments = object.moments.map(moment => new ProjectTimelineMoment(moment));
			}
		}
		static getName() { return 'timeline'; }
		static getScreenName() { return 'Time Line'; }
		static getScreenGroupName() { return 'Time Lines'; }
		static getClassName() { return 'ProjectTimeline'; }
	}

		export class ProjectTimelineMoment {
			constructor(object) {
				if (!object) {
					this.step = null;
					this.actions = []; // ProjectAction
				} else {
					this.step = object.step;
					this.actions = object.actions.map(action => new ProjectAction(action));
				}
			}
		}

	export class ProjectObject {
		constructor(object) {
			if (!object) {
				this.id = null;
				this.name = null;
				this.sprite_index = -1;
				this.visible = true;
				this.solid = false;
				this.depth = 0;
				this.persistent = false
				this.parent_index = -1;
				this.mask_index = -1;
				this.events = [];
			} else {
				this.id = object.id;
				this.name = object.name;
				this.sprite_index = object.sprite_index;
				this.visible = object.visible;
				this.solid = object.solid;
				this.depth = object.depth;
				this.persistent = object.persistent;
				this.parent_index = object.parent_index;
				this.mask_index = object.mask_index;
				this.events = object.events.map(event => new ProjectEvent(event));
			}
		}
		static getName() { return 'object'; }
		static getScreenName() { return 'Object'; }
		static getScreenGroupName() { return 'Objects'; }
		static getClassName() { return 'ProjectObject'; }
	}

		export class ProjectEvent {
			constructor(object) {
				if (!object) {
					this.type = null;
					this.subtype = null;
					this.actions = [];
				} else {
					this.type = object.type;
					this.subtype = object.subtype;
					this.actions = object.actions.map(action => new ProjectAction(action));
				}
			}
			getNameId() {
				return JSON.stringify({type: this.type, subtype: this.subtype});
			}
			getName() {
				return this.type + ' ' + this.subtype;
			}
		}

	export class ProjectAction {
		constructor(object) {
			if (!object) {
				this.typeLibrary = null;
				this.typeId = null;
				this.typeKind = null;  // normal, begin group, end group, else, exit, repeat, variable, code
				this.typeExecution = null; // nothing, function, code
				this.typeExecutionFunction = null;
				this.typeExecutionCode = null;
				this.typeIsQuestion = null;

				this.args = [];  // ProjectActionArg

				this.appliesTo = -1;  // -1 = self, -2 = other, 0>= = object index
				this.relative = false;
				this.not = false;
			} else {
				this.typeLibrary = object.typeLibrary;
				this.typeId = object.typeId;
				this.typeKind = object.typeKind;
				this.typeExecution = object.typeExecution;
				this.typeExecutionFunction = object.typeExecutionFunction;
				this.typeExecutionCode = object.typeExecutionCode;
				this.typeIsQuestion = object.typeIsQuestion;

				this.args = object.args.map(arg => new ProjectActionArg(arg));

				this.appliesTo = object.appliesTo;
				this.relative = object.relative;
				this.not = object.not;
			}
		}
	}

		export class ProjectActionArg {
			constructor(object) {
				if (!object) {
					this.kind = null;  // expression, string, both, boolean, menu, color, sprite, sound, background, path, script, object, room, font, timeline
					this.value = null;
				} else {
					this.kind = object.kind;
					this.value = object.value;
				}
			}
		}

	export class ProjectRoom {
		constructor(object) {
			if (!object) {
				this.id = null;
				this.name = null;

				this.instances = []; // ProjectInstance

				this.caption = '';
				this.width = 640;
				this.height = 480;
				this.speed = 30;
				this.persistent = false;
				this.creationCode = "";

				this.tiles = []; // ProjectRoomTile

				this.drawBackgroundColor = true;
				this.backgroundColor = "#c0c0c0";
				this.backgrounds = []; // ProjectRoomBackground

				this.enableViews = false;
				this.views = []; // ProjectRoomView
			} else {
				this.id = object.id;
				this.name = object.name;

				this.instances = object.instances.map(instance => new ProjectInstance(instance));

				this.caption = object.caption;
				this.width = object.width;
				this.height = object.height;
				this.speed = object.speed;
				this.persistent = object.persistent;
				this.creationCode = object.creationCode;

				this.tiles = object.tiles.map(tile => new ProjectRoomTile(tile));

				this.drawBackgroundColor = object.drawBackgroundColor;
				this.backgroundColor = object.backgroundColor;
				this.backgrounds = object.backgrounds.map(background => new ProjectRoomBackground(background));

				this.enableViews = object.enableViews;
				this.views = object.views.map(view => new ProjectRoomView(view));
			}
		}
		static getName() { return 'room'; }
		static getScreenName() { return 'Room'; }
		static getScreenGroupName() { return 'Rooms'; }
		static getClassName() { return 'ProjectRoom'; }
	}

		export class ProjectInstance {
			constructor(object) {
				if (!object) {
					this.id = null;
					this.x = null;
					this.y = null;
					this.object_index = null;
					this.creationCode = "";
				} else {
					this.id = object.id;
					this.x = object.x;
					this.y = object.y;
					this.object_index = object.object_index;
					this.creationCode = object.creationCode;
				}
			}
		}

		export class ProjectRoomTile {
			constructor(object) {
				if (!object) {
					this.backgroundIndex = null;
					this.x = null;
					this.y = null;
					this.backgroundX = null;
					this.backgroundY = null;
					this.backgroundW = null;
					this.backgroundH = null;
					this.depth = null;
				} else {
					this.backgroundIndex = object.backgroundIndex;
					this.x = object.x;
					this.y = object.y;
					this.backgroundX = object.backgroundX;
					this.backgroundY = object.backgroundY;
					this.backgroundW = object.backgroundW;
					this.backgroundH = object.backgroundH;
					this.depth = object.depth;
				}
			}
		}

		export class ProjectRoomBackground {
			constructor(object) {
				if (!object) {
					this.visibleAtStart = false;
					this.isForeground = false;
					this.backgroundIndex = -1;
					this.tileHorizontally = true;
					this.tileVertically = true;
					this.x = 0;
					this.y = 0;
					this.stretch = false;
					this.horizontalSpeed = 0;
					this.verticalSpeed = 0;
				} else {
					this.visibleAtStart = object.visibleAtStart;
					this.isForeground = object.isForeground;
					this.backgroundIndex = object.backgroundIndex;
					this.tileHorizontally = object.tileHorizontally;
					this.tileVertically = object.tileVertically;
					this.x = object.x;
					this.y = object.y;
					this.stretch = object.stretch;
					this.horizontalSpeed = object.horizontalSpeed;
					this.verticalSpeed = object.verticalSpeed;
				}
			}
		}

		export class ProjectRoomView {
			constructor(object) {
				if (!object) {
					this.visibleAtStart = false;
					this.viewX = 0;
					this.viewY = 0;
					this.viewW = 640;
					this.viewH = 480;
					this.portX = 0;
					this.portY = 0;
					this.portW = 640;
					this.portH = 480;
					this.objectFollowIndex = -1;
					this.objectFollowHorizontalBorder = 32;
					this.objectFollowVerticalBorder = 32;
					this.objectFollowHorizontalSpeed = -1;
					this.objectFollowVerticalSpeed = -1;
				} else {
					this.visibleAtStart = object.visibleAtStart;
					this.viewX = object.viewX;
					this.viewY = object.viewY;
					this.viewW = object.viewW;
					this.viewH = object.viewH;
					this.portX = object.portX;
					this.portY = object.portY;
					this.portW = object.portW;
					this.portH = object.portH;
					this.objectFollowIndex = object.objectFollowIndex;
					this.objectFollowHorizontalBorder = object.objectFollowHorizontalBorder;
					this.objectFollowVerticalBorder = object.objectFollowVerticalBorder;
					this.objectFollowHorizontalSpeed = object.objectFollowHorizontalSpeed;
					this.objectFollowVerticalSpeed = object.objectFollowVerticalSpeed;
				}
			}
		}

export class ProjectGameInformation {
	constructor(object) {
		if (!object) {
			this.text = '';
			this.separateWindow = false;
			this.windowCaption = "Game Information";
			this.left = -1;
			this.right = -1;
			this.width = 600;
			this.height = 400;
			this.showBorderAndCaption = true;
			this.allowResize = true;
			this.alwaysOnTop = false;
			this.stopGame = true;
		} else {
			this.text = object.text;
			this.separateWindow = object.separateWindow;
			this.windowCaption = object.windowCaption;
			this.left = object.left;
			this.right = object.right;
			this.width = object.width;
			this.height = object.height;
			this.showBorderAndCaption = object.showBorderAndCaption;
			this.allowResize = object.allowResize;
			this.alwaysOnTop = object.alwaysOnTop;
			this.stopGame = object.stopGame;
		}
	}
}
export class ProjectGlobalGameSettings {
	constructor(object) {
		if (!object) {
			this.startInFullScreen = false;
			this.colorOutsideRoom = '#000000';
			this.displayCursor = true;

			this.keyEscEndsGame = true;
			this.keyF1ShowsGameInformation = true;
			this.keyF4SwitchesFullscreen = true;
			this.keyF5SavesF6Loads = true;
			this.keyF9Screenshots = true;
			this.versionMajor = 1;
			this.versionMinor = 0;
			this.versionRelease = 0;
			this.versionBuild = 0;
			this.company = "";
			this.product = "";
			this.copyright = "";
			this.description = "";

			this.displayErrors = true;
			this.abortOnError = false;
			this.unitializedVarsAre0 = false;

			this.author = "";
			this.version = "100";
			this.information = "";
		} else {
			this.startInFullScreen = object.startInFullScreen;
			this.colorOutsideRoom = object.colorOutsideRoom;
			this.displayCursor = object.displayCursor;

			this.keyEscEndsGame = object.keyEscEndsGame;
			this.keyF1ShowsGameInformation = object.keyF1ShowsGameInformation;
			this.ketF4SwitchesFullScreen = object.ketF4SwitchesFullScreen;
			this.keyF5SavesF6Loads = object.keyF5SavesF6Loads;
			this.keyF9Screenshots = object.keyF9Screenshots;
			this.versionMajor = object.versionMajor;
			this.versionMinor = object.versionMinor;
			this.versionRelease = object.versionRelease;
			this.versionBuild = object.versionBuild;
			this.company = object.company;
			this.product = object.product;
			this.copyright = object.copyright;
			this.description = object.description;

			this.displayErrors = object.displayErrors;
			this.abortOnError = object.abortOnError;
			this.unitializedVarsAre0 = object.unitializedVarsAre0;

			this.author = object.author;
			this.version = object.version;
			this.information = object.information;
		}
	}
}
export class ProjectExtensionPackages {
	// constructor() {

	// }
}