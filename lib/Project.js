class Project {

	constructor (json) {

		this.resources = {};
		this.counter = {};

		Project.getTypes().forEach(x => {
			this.resources[x.name] = [];
			this.counter[x.name] = 0;
		})

		this.gameInformation = new ProjectGameInformation();
		this.globalGameSettings = new ProjectGlobalGameSettings();
		this.extensionPackages = new ProjectExtensionPackages();

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

class ProjectSprite {

	constructor () {
		this.classname = "ProjectSprite";
		this.id = null;
		this.name = null;
		this.images = []; //AbstractImage
		this.originx = 0;
		this.originy = 0;
	}
	static getName() { return 'sprite'; }
	static getScreenName() { return 'Sprite'; }
	static getScreenGroupName() { return 'Sprites'; }

}

	class ProjectSound {
		constructor () {
			this.classname = "ProjectSound";
			this.id = null;
			this.name = null;
			this.sound = null;
			this.volume = 1;
		}
		static getName() { return 'sound'; }
		static getScreenName() { return 'Sound'; }
		static getScreenGroupName() { return 'Sounds'; }
	}

	class ProjectBackground {

		constructor () {
			this.classname = "ProjectBackground";
			this.id = null;
			this.name = null;
			this.image = null; // AbstractImage
		}
		static getName() { return 'background'; }
		static getScreenName() { return 'Background'; }
		static getScreenGroupName() { return 'Backgrounds'; }

	}

	class ProjectPath {

		constructor() {
			this.classname = "ProjectPath";
			this.id = null;
		}
		static getName() { return 'path'; }
		static getScreenName() { return 'Path'; }
		static getScreenGroupName() { return 'Paths'; }

	}

	class ProjectScript {
		constructor() {
			this.classname = "ProjectScript";
			this.id = null;
			this.name = null;
			this.code = "";
		}
		static getName() { return 'script'; }
		static getScreenName() { return 'Script'; }
		static getScreenGroupName() { return 'Scripts'; }
	}

	class ProjectFont {
		constructor () {
			this.classname = "ProjectFont";
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
	}

	class ProjectTimeline {

		constructor() {
			this.classname = "ProjectTimeline";
			this.id = null;
		}
		static getName() { return 'timeline'; }
		static getScreenName() { return 'Time Line'; }
		static getScreenGroupName() { return 'Time Lines'; }

	}

	class ProjectObject {
		constructor () {
			this.classname = "ProjectObject";
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
	}

		class ProjectEvent {
			constructor (type, subtype) {
				this.classname = "ProjectEvent";
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

			class ProjectAction {
				constructor (type, appliesTo, relative, not) {
					this.classname = "ProjectAction";
					this.type = type;
					this.appliesTo = appliesTo;
					this.args = [];
					this.relative = relative;
					this.not = not;
				}
				getName() {
					return this.type.name + ' ' + this.args;
				}
			}

	class ProjectRoom {
		constructor() {
			this.classname = "ProjectRoom";
			this.id = null;
			this.name = null;

			this.instances = [];

			this.caption = '';
			this.width = 640;
			this.height = 480;
			this.speed = 30;
			
			this.background_color = "#c0c0c0";

		}
		static getName() { return 'room'; }
		static getScreenName() { return 'Room'; }
		static getScreenGroupName() { return 'Rooms'; }
	}

		class ProjectInstance {
			constructor(x, y, object_index) {
				this.classname = "ProjectInstance";
				this.x = x;
				this.y = y;
				this.object_index = object_index;
			}
		}

class ProjectGameInformation {
	constructor() {
		this.text = '';
	}
}
class ProjectGlobalGameSettings {
	constructor() {
		this.colorOutsideRoom = '#000000';
		this.displayCursor = true;

		this.keyEscEndsGame = true;
		this.keyF1ShowsGameInformation = true;
		this.keyF5SavesF6Loads = true;
		this.keyF9Screenshots = true;

		this.displayErrors = true;
		this.abortOnError = false;
		this.unitializedVarsAre0 = false;

		this.author = '';
	}
}
class ProjectExtensionPackages {
	constructor() {
		
	}
}