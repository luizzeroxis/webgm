import {parent, endparent, add, HElement, HButton, HImage} from "../common/H.js";
import {ProjectSprite, ProjectSound, ProjectBackground, ProjectObject} from "../common/Project.js";

import DefaultProjectFontIcon from "./img/default-ProjectFont-icon.png";
import DefaultProjectPathIcon from "./img/default-ProjectPath-icon.png";
import DefaultProjectRoomIcon from "./img/default-ProjectRoom-icon.png";
import DefaultProjectScriptIcon from "./img/default-ProjectScript-icon.png";
import DefaultProjectSoundIcon from "./img/default-ProjectSound-icon.png";
import DefaultProjectTimelineIcon from "./img/default-ProjectTimeline-icon.png";

export default class HResourceListItem extends HElement {
	static resourceTypesIcons = {
		"ProjectSprite": null,
		"ProjectSound": DefaultProjectSoundIcon,
		"ProjectBackground": null,
		"ProjectPath": DefaultProjectPathIcon,
		"ProjectScript": DefaultProjectScriptIcon,
		"ProjectFont": DefaultProjectFontIcon,
		"ProjectTimeline": DefaultProjectTimelineIcon,
		"ProjectObject": null,
		"ProjectRoom": DefaultProjectRoomIcon,
	};

	constructor(resource, editor) {
		super("li");

		this.id = resource;
		this.resource = resource;
		this.editor = editor;

		parent(this);

			parent( add( new HElement("div", {class: "item"}) ) );

				this.htmlIcon = add( new HImage(null, "icon") );
				this.htmlIcon.html.width = 16;
				this.htmlIcon.html.height = 16;

				this.updateIcon();

				this.htmlName = add( new HElement("div", {class: "name"}) );
				this.htmlName.html.textContent = this.resource.name;

				this.htmlEditButton = add( new HButton("Edit", () => this.properties()) );
				this.htmlDeleteButton = add( new HButton("Delete", () => this.delete()) );

				endparent();
			endparent();
	}

	onAdd() {
		this.listeners = this.editor.dispatcher.listen({
			changeResourceName: i => {
				if (i !== this.resource) return;
				this.htmlName.html.textContent = i.name;
			},
		});

		if (this.resource.constructor == ProjectSprite || this.resource.constructor == ProjectObject) {
			this.listeners = {...this.listeners, ...this.editor.dispatcher.listen({
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
			this.listeners = {...this.listeners, ...this.editor.dispatcher.listen({
				changeBackgroundImage: i => {
					if (i != this.resource) return;
					this.updateIcon();
				},
			})};
		}

		if (this.resource.constructor == ProjectObject) {
			this.listeners = {...this.listeners, ...this.editor.dispatcher.listen({
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
		this.editor.dispatcher.stopListening(this.listeners);
	}

	updateIcon() {
		let src;

		if (this.resource.constructor == ProjectSprite) {
			if (this.resource.images.length > 0) {
				src = this.resource.images[0].image.src;
			}
		} else
		if (this.resource.constructor == ProjectSound) {
			src = DefaultProjectSoundIcon; // TODO: different icon for different kinds of sounds
		} else
		if (this.resource.constructor == ProjectBackground) {
			if (this.resource.image) {
				src = this.resource.image.image.src;
			}
		} else
		if (this.resource.constructor == ProjectObject) {
			if (this.resource.sprite_index >= 0) {
				const sprite = this.editor.project.getResourceById("ProjectSprite", this.resource.sprite_index);
				if (sprite) {
					if (sprite.images.length > 0) {
						src = sprite.images[0].image.src;
					}
				}
			}
		} else {
			src = HResourceListItem.resourceTypesIcons[this.resource.constructor.getClassName()];
		}

		this.htmlIcon.setSrc(src);
	}

	properties() {
		this.editor.windowsArea.openResource(this.resource);
	}

	delete() {
		this.editor.deleteResource(this.resource);
	}
}