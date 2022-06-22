import {parent, endparent, add, HElement, HButton, HImage} from '../common/H.js'
import {ProjectSprite, ProjectSound, ProjectBackground, ProjectObject} from '../common/Project.js';

import Editor from './Editor.js';
import DefaultProjectSoundIcon from './img/default-ProjectSound-icon.png';

export default class HResourceListItem extends HElement {

	constructor(resource, editor) {
		super('li')

		this.id = resource;
		this.resource = resource;
		this.editor = editor;

		parent(this)

			parent( add( new HElement('div', {class: 'item'}) ) )

				this.htmlIcon = add( new HImage(null, 'icon') );
				this.htmlIcon.html.width = 16;
				this.htmlIcon.html.height = 16;

				this.updateIcon();

				this.htmlName = add( new HElement('div', {class: 'name'}) )
				this.htmlName.html.textContent = this.resource.name;

				this.htmlEditButton = add( new HButton('Edit', () => this.properties()) )
				this.htmlDeleteButton = add( new HButton('Delete', () => this.delete()) )

				endparent()
			endparent()

	}

	onAdd() {

		this.listeners = this.editor.dispatcher.listen({
			changeResourceName: i => {
				if (i !== this.resource) return;
				this.htmlName.html.textContent = i.name;
			},
		})

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
			})}
		}

		if (this.resource.constructor == ProjectBackground) {
			this.listeners = {...this.listeners, ...this.editor.dispatcher.listen({
				changeBackgroundImage: i => {
					if (i != this.resource) return;
					this.updateIcon();
				},
			})}
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
			})}
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
				const sprite = this.editor.project.resources.ProjectSprite.find(x => x.id == this.resource.sprite_index);
				if (sprite) {
					if (sprite.images.length > 0) {
						src = sprite.images[0].image.src;
					}
				}
			}
		} else {
			src = Editor.resourceTypesInfo.find(x => x.class == this.resource.constructor).resourceIcon;
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