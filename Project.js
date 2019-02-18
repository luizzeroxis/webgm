class Project {

	constructor (json) {
		this.resources = {};
		this.resources[ProjectSprite.name] = [];
		this.resources[ProjectSound.name] = [];
		this.resources[ProjectScript.name] = [];
		this.resources[ProjectFont.name] = [];
		this.resources[ProjectObject.name] = [];
		this.resources[ProjectRoom.name] = [];
		
		this.counter = {};
		this.counter[ProjectSprite.name] = 0;
		this.counter[ProjectSound.name] = 0;
		this.counter[ProjectScript.name] = 0;
		this.counter[ProjectFont.name] = 0;
		this.counter[ProjectObject.name] = 0;
		this.counter[ProjectRoom.name] = 0;

	}

	static getTypes() {
		return [
			ProjectSprite,
			ProjectSound,
			ProjectScript,
			ProjectFont,
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
				return this.type + (this.subtype ? ' ' +this.subtype : '');
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
			this.roomSpeed = 30;
			
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