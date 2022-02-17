import {parent, endparent, add, remove, newElem, newButton, newImage, setAttributeExceptNull} from '../common/H.js'
import {ProjectSprite, ProjectSound, ProjectBackground, ProjectObject} from '../common/Project.js';

import Editor from './Editor.js';
import DefaultProjectSoundIcon from './img/default-ProjectSound-icon.png';

export default class HTMLResource {

	constructor(resource, editor) {

		this.id = resource;
		this.resource = resource;
		this.editor = editor;

		this.html = parent( add( newElem(null, 'li') ) )

			this.htmlIcon = add( newImage('icon') );
			this.htmlIcon.width = 16;
			this.htmlIcon.height = 16;

			this.updateIcon();
			
			this.htmlName = add( newElem('name', 'span') )
			this.htmlName.textContent = this.resource.name;

			parent( add( newElem('right', 'div') ) )

				this.htmlEditButton = add( newButton(null, 'Edit') )
				this.htmlDeleteButton = add( newButton(null, 'Delete') )

				endparent()
			endparent()

		this.listeners = this.editor.dispatcher.listen({
			changeResourceName: i => {
				if (i !== this.resource) return;
				this.htmlName.textContent = i.name;
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
				}
			})}
		}
	}

	updateIcon() {
		var src;

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
				var sprite = this.editor.project.resources.ProjectSprite.find(x => x.id == this.resource.sprite_index);
				if (sprite) {
					if (sprite.images.length > 0) {
						src = sprite.images[0].image.src;
					}
				}
			}
		} else {
			src = Editor.resourceTypesInfo.find(x => x.class == this.resource.constructor).resourceIcon;
		}

		setAttributeExceptNull(this.htmlIcon, 'src', src);
	}
	
	remove() {
		remove(this.html);
		this.editor.dispatcher.stopListening(this.listeners);
	}
}