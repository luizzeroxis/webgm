class HTMLResource {

	constructor(resource, editor) {

		this.id = resource;
		this.resource = resource;
		this.editor = editor;

		this.html = parent( add( newElem(null, 'li') ) )

			this.htmlIcon = add( newImage('icon') );
			this.htmlIcon.width = 16;
			this.htmlIcon.height = 16;

			this.editor.setImageSrcRemovable(this.htmlIcon, this.editor.getResourceIconSrc(this.resource));

			this.htmlName = add( newElem('name', 'span') )
			this.htmlName.textContent = this.resource.name;

			parent( add( newElem('right', 'div') ) )

				this.htmlEditButton = add( newButton(null, 'Edit') )
				this.htmlDeleteButton = add( newButton(null, 'Delete') )

				endparent()
			endparent()

		this.editor.dispatcher.listen({
			changeResourceName: i => {
				if (i !== this.resource) return;
				this.htmlName.textContent = i.name;
			},
			changeSpriteImages: i => {
				if (resource.classname == "ProjectObject") {
					console.log('===== ', resource, i)
					if (i.id != resource.sprite_index) return;
				} else {
					if (i != this.resource) return;
				}
				this.editor.setImageSrcRemovable(this.htmlIcon, this.editor.getResourceIconSrc(this.resource))
			},
			changeObjectSprite: i => {
				this.editor.setImageSrcRemovable(this.htmlIcon, this.editor.getResourceIconSrc(this.resource))
			}
		})
	}
	
	remove() {
		remove(this.html);
	}
}