import {parent, endparent, add, HElement, HButton, HImage} from "../common/H.js";
import {ProjectSprite, ProjectSound, ProjectBackground, ProjectObject} from "../common/Project.js";

import FontResourceIcon from "./img/font-resource-icon.png";
import PathResourceIcon from "./img/path-resource-icon.png";
import RoomResourceIcon from "./img/room-resource-icon.png";
import ScriptResourceIcon from "./img/script-resource-icon.png";
import SoundResourceIcon from "./img/sound-resource-icon.png";
import TimelineResourceIcon from "./img/timeline-resource-icon.png";

export default class HResourceListItem extends HElement {
	static resourceIcons = {
		"ProjectSprite": null,
		"ProjectSound": SoundResourceIcon,
		"ProjectBackground": null,
		"ProjectPath": PathResourceIcon,
		"ProjectScript": ScriptResourceIcon,
		"ProjectFont": FontResourceIcon,
		"ProjectTimeline": TimelineResourceIcon,
		"ProjectObject": null,
		"ProjectRoom": RoomResourceIcon,
	};

	constructor(resource, editor) {
		super("li");

		this.id = resource;
		this.resource = resource;
		this.editor = editor;

		parent(this);

			parent( add( new HElement("div", {class: "item"}) ) );

				add( new HElement("div", {class: "expander"}, "–") );
				this.icon = add( new HImage(null, "icon") );

				this.updateIcon();

				this.name = add( new HElement("div", {class: "name"}, this.resource.name) );
				this.name.html.tabIndex = 0;
				this.name.html.addEventListener("click", () => this.properties());
				this.name.html.addEventListener("keypress", e => {
					if (e.code == "Space" || e.code == "Enter") {
						this.properties();
					}
				});

				this.menuButton = add( new HButton("▼", () => {
					this.editor.menuManager.openMenu([
						{text: "Move up", onClick: () => this.moveUp()},
						{text: "Move down", onClick: () => this.moveDown()},
						{text: "Duplicate", onClick: () => this.duplicate()},
						{text: "Delete", onClick: () => this.delete()},
						{text: "Properties", onClick: () => this.properties()},
					], {fromElement: this.menuButton});
				}) );

				endparent();
			endparent();
	}

	onAdd() {
		this.listeners = this.editor.project.dispatcher.listen({
			changeResourceName: i => {
				if (i !== this.resource) return;
				this.name.html.textContent = i.name;
			},
		});

		if (this.resource.constructor == ProjectSprite || this.resource.constructor == ProjectObject) {
			this.listeners = {...this.listeners, ...this.editor.project.dispatcher.listen({
				changeSpriteImages: i => {
					if (this.resource.constructor == ProjectObject) {
						if (i.id != this.resource.sprite_index) return;
					} else {
						if (i != this.resource) return;
					}
					this.updateIcon();
				},
			})};
		}

		if (this.resource.constructor == ProjectBackground) {
			this.listeners = {...this.listeners, ...this.editor.project.dispatcher.listen({
				changeBackgroundImage: i => {
					if (i != this.resource) return;
					this.updateIcon();
				},
			})};
		}

		if (this.resource.constructor == ProjectObject) {
			this.listeners = {...this.listeners, ...this.editor.project.dispatcher.listen({
				changeObjectSprite: i => {
					if (i != this.resource) return;
					this.updateIcon();
				},
				deleteResource: i => {
					if (i.id != this.resource.sprite_index) return;
					this.updateIcon();
				},
			})};
		}
	}

	onRemove() {
		this.editor.project.dispatcher.stopListening(this.listeners);
	}

	updateIcon() {
		let src;

		if (this.resource.constructor == ProjectSprite) {
			if (this.resource.images.length > 0) {
				src = this.resource.images[0].src;
			}
		} else
		if (this.resource.constructor == ProjectSound) {
			src = SoundResourceIcon; // TODO: different icon for different kinds of sounds
		} else
		if (this.resource.constructor == ProjectBackground) {
			if (this.resource.image) {
				src = this.resource.image.src;
			}
		} else
		if (this.resource.constructor == ProjectObject) {
			if (this.resource.sprite_index >= 0) {
				const sprite = this.editor.project.getResourceById("ProjectSprite", this.resource.sprite_index);
				if (sprite) {
					if (sprite.images.length > 0) {
						src = sprite.images[0].src;
					}
				}
			}
		} else {
			src = HResourceListItem.resourceIcons[this.resource.constructor.getClassName()];
		}

		this.icon.setSrc(src);
	}

	moveUp() {
		const list = this.editor.project.resources[this.resource.constructor.getClassName()];
		const fromIndex = list.indexOf(this.resource);
		if (fromIndex > 0) {
			this.editor.project.moveResource(this.resource, fromIndex - 1);
		}
	}

	moveDown() {
		const list = this.editor.project.resources[this.resource.constructor.getClassName()];
		const fromIndex = list.indexOf(this.resource);
		if (fromIndex < list.length - 1) {
			this.editor.project.moveResource(this.resource, fromIndex + 1);
		}
	}

	duplicate() {
		this.editor.project.duplicateResource(this.resource);
	}

	delete() {
		if (confirm("You are about to delete "+this.resource.name+". This will be permanent. Continue?")) {
			this.editor.project.deleteResource(this.resource);
		}
	}

	properties() {
		this.editor.windowsArea.openResource(this.resource);
	}
}