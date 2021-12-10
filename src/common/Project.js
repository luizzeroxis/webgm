export class Project {

	constructor() {

		this.resources = {};
		this.counter = {};

		Project.getTypes().forEach(x => {
			this.resources[x.getClassName()] = [];
			this.counter[x.getClassName()] = 0;
		})

		this.gameInformation = new ProjectGameInformation();
		this.globalGameSettings = new ProjectGlobalGameSettings();
		this.extensionPackages = new ProjectExtensionPackages();

		// this.constants = [];

		this.lastId = 100000;

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
			ProjectRoom
		];
	}

}

	export class ProjectSprite {

		constructor() {
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
			this.shape = 'precise'
		}
		static getName() { return 'sprite'; }
		static getScreenName() { return 'Sprite'; }
		static getScreenGroupName() { return 'Sprites'; }
		static getClassName() { return 'ProjectSprite'; }

	}

	export class ProjectSound {
		constructor() {
			this.id = null;
			this.name = null;
			this.sound = null;
			this.volume = 1;
		}
		static getName() { return 'sound'; }
		static getScreenName() { return 'Sound'; }
		static getScreenGroupName() { return 'Sounds'; }
		static getClassName() { return 'ProjectSound'; }
	}

	export class ProjectBackground {

		constructor() {
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
		}
		static getName() { return 'background'; }
		static getScreenName() { return 'Background'; }
		static getScreenGroupName() { return 'Backgrounds'; }
		static getClassName() { return 'ProjectBackground'; }

	}

	export class ProjectPath {

		constructor() {
			this.id = null;
			this.name = null;
			this.points = []; // ProjectPathPoint
			this.backgroundRoomIndex = -1;
			this.connectionKind = 'lines';
			this.closed = true;
			this.precision = 4;

		}
		static getName() { return 'path'; }
		static getScreenName() { return 'Path'; }
		static getScreenGroupName() { return 'Paths'; }
		static getClassName() { return 'ProjectPath'; }

	}

		export class ProjectPathPoint {
			constructor(x=0, y=0, sp=100) {
				this.x = x;
				this.y = y;
				this.sp = sp;
			}
		}

	export class ProjectScript {
		constructor() {
			this.id = null;
			this.name = null;
			this.code = "";
		}
		static getName() { return 'script'; }
		static getScreenName() { return 'Script'; }
		static getScreenGroupName() { return 'Scripts'; }
		static getClassName() { return 'ProjectScript'; }
	}

	export class ProjectFont {
		constructor() {
			this.id = null;
			this.name = null;
			this.font = 'Arial';
			this.size = 12;
			this.bold = false;
			this.italic = false;
		}
		static getName() { return 'font'; }
		static getScreenName() { return 'Font'; }
		static getScreenGroupName() { return 'Fonts'; }
		static getClassName() { return 'ProjectFont'; }
	}

	export class ProjectTimeline {

		constructor() {
			this.id = null;
			this.name = null;
			this.moments = []; // ProjectTimelineMoment
		}
		static getName() { return 'timeline'; }
		static getScreenName() { return 'Time Line'; }
		static getScreenGroupName() { return 'Time Lines'; }
		static getClassName() { return 'ProjectTimeline'; }

	}

		export class ProjectTimelineMoment {
			constructor(step) {
				this.step = step;
				this.actions = []; // ProjectAction
			}
		}

	export class ProjectObject {
		constructor() {
			this.id = null;
			this.name = null;
			this.sprite_index = -1;
			this.visible = true;
			this.solid = false;
			this.depth = 0;
			this.persistent = false
			this.parent = null;
			this.mask = null;
			this.events = [];
		}
		static getName() { return 'object'; }
		static getScreenName() { return 'Object'; }
		static getScreenGroupName() { return 'Objects'; }
		static getClassName() { return 'ProjectObject'; }
	}

		export class ProjectEvent {
			constructor(type, subtype) {
				this.type = type;
				this.subtype = subtype;
				this.actions = [];
			}
			getNameId() {
				return JSON.stringify({type: this.type, subtype: this.subtype});
			}
			getName() {
				return this.type + ' ' + this.subtype;
			}
		}

			export class ProjectAction {
				constructor() {
					this.typeLibrary = null;
					this.typeId = null;
					this.typeKind = null;  // normal, begin group, end group, else, exit, repeat, variable, code
					this.typeExecution = null; // none, function, code
					this.typeExecutionFunction = null;
					this.typeExecutionCode = null;
					this.typeIsQuestion = null;

					this.args = [];  // ProjectActionArg

					this.appliesTo = -1;  // -1 = self, -2 = other, 0>= = object index
					this.relative = false;
					this.not = false;
				}
			}

				export class ProjectActionArg {
					constructor(kind, value) {
						this.kind = kind;  // expression, string, both, boolean, menu, color, sprite, sound, background, path, script, object, room, font, timeline
						this.value = value;
					}
				}

	export class ProjectRoom {
		constructor() {
			this.id = null;
			this.name = null;

			this.instances = []; // ProjectInstance

			this.caption = '';
			this.width = 640;
			this.height = 480;
			this.speed = 30;
			this.persistent = false;
			this.creationCode = '';

			this.tiles = []; // ProjectRoomTile

			this.drawBackgroundColor = true;
			this.backgroundColor = "#c0c0c0";
			this.backgrounds = []; // ProjectRoomBackground

			this.enableViews = false;
			this.views = []; // ProjectRoomView

		}
		static getName() { return 'room'; }
		static getScreenName() { return 'Room'; }
		static getScreenGroupName() { return 'Rooms'; }
		static getClassName() { return 'ProjectRoom'; }
	}

		export class ProjectInstance {
			constructor(x, y, object_index) {
				this.x = x;
				this.y = y;
				this.object_index = object_index;
			}
		}

		export class ProjectRoomTile {
			constructor(backgroundIndex, x, y, backgroundX, backgroundY, backgroundW, backgroundH, depth) {
				this.backgroundIndex = backgroundIndex;
				this.x = x;
				this.y = y;
				this.backgroundX = backgroundX;
				this.backgroundY = backgroundY;
				this.backgroundW = backgroundW;
				this.backgroundH = backgroundH;
				this.depth = depth;
			}
		}

		export class ProjectRoomBackground {
			constructor() {
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
			}
		}

		export class ProjectRoomView {
			constructor() {
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
			}
		}

export class ProjectGameInformation {
	constructor() {
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
	}
}
export class ProjectGlobalGameSettings {
	constructor() {
		this.startInFullScreen = false;
		this.colorOutsideRoom = '#000000';
		this.displayCursor = true;

		this.keyEscEndsGame = true;
		this.keyF1ShowsGameInformation = true;
		this.ketF4SwitchesFullScreen = true;
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
	}
}
export class ProjectExtensionPackages {
	constructor() {
		
	}
}