class Project {
	constructor (json) {
		this.sprites = [];
		this.sounds = [];
		this.fonts = [];
		this.objects = [];
		this.rooms = [];
		
		this.counter = {};
		this.counter['sprite'] = 0;
		this.counter['sound'] = 0;
		this.counter['font'] = 0;
		this.counter['object'] = 0;
		this.counter['room'] = 0;
	}
}

	class ProjectSprite {
		constructor () {
			this.id = null;
			this.name = null;
			this.sprite = null;
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

	class ProjectFont {
		constructor () {
			this.id = null;
			this.name = null;
			this.font = 'Arial';
			this.size = 12;
		}
	}

	class ProjectObject {
		constructor () {
			this.id = null;
			this.name = null;
			this.sprite_index = -1;
			this.visible = true;
			this.events = [];
		}
	}

		class ProjectEvent {
			constructor () {
				this.type = "create";
				this.subtype = null;
				this.actions = [];
			}
		}

			class ProjectAction {
				constructor () {
					this.type = "show_message";
					this.arg0 = "";
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