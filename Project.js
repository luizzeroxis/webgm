class Project {
	constructor (json) {
		this.sprites = [];
		this.sounds = [];
		this.scripts = [];
		this.fonts = [];
		this.objects = [];
		this.rooms = [];
		
		this.counter = {};
		this.counter['sprite'] = 0;
		this.counter['sound'] = 0;
		this.counter['scripts'] = 0;
		this.counter['font'] = 0;
		this.counter['object'] = 0;
		this.counter['room'] = 0;
	}
}

	class ProjectSprite {
		constructor () {
			this.id = null;
			this.name = null;
			this.images = [];
			this.originx = 0;
			this.originy = 0;
		}
	}

	class ProjectSound {
		constructor () {
			this.id = null;
			this.name = null;
			this.sound = null;
			this.volume = 1;
		}
	}

	class ProjectScript {
		constructor() {
			this.id = null;
			this.name = null;
			this.code = "";
		}
	}

	class ProjectFont {
		constructor () {
			this.id = null;
			this.name = null;
			this.font = 'Arial';
			this.size = 12;
			this.bold = false;
			this.italic = false;
		}
	}

	class ProjectObject {
		constructor () {
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
	}

		class ProjectEvent {
			constructor () {
				this.type = null;
				this.subtype = null;
				this.actions = [];
			}
		}

			class ProjectAction {
				constructor () {
					this.type = null;
					this.appliesTo = 0;
					this.args = [];
					this.relative = false;
					this.not = false;
				}
			}

	class ProjectRoom {
		constructor() {
			this.id = null;
			this.name = null;

			this.instances = [];

			this.caption = '';
			this.width = 640;
			this.height = 480;
			this.roomSpeed = 30;
			
			this.background_color = "#c0c0c0";

		}
	}

		class ProjectInstance {
			constructor(x, y, object_index) {
				this.x = x;
				this.y = y;
				this.object_index = object_index;
			}
		}