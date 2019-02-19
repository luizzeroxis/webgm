class HTMLWindowRoom extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(room) {
		this.htmlTitle.textContent = 'Edit Room '+room.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-room', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					// left area

					this.paramInstances = room.instances.map(instance => {
						return new ProjectInstance(instance.x, instance.y, instance.object_index);
					});

					this.inputName = add( newTextBox(null, 'Name:', room.name) ).$('input');
					this.inputWidth = add( newNumberBox(null, 'Width:', room.width, 1, 1) ).$('input');
					this.inputHeight = add( newNumberBox(null, 'Height:', room.height, 1, 1) ).$('input');
					this.inputBackgroundColor = add( newColorBox(null, 'Background color:', room.background_color) ).$('input');
					
					this.selectObject = this.makeResourceSelect(null, 'Object:', 'ProjectObject').$('select');

					// view options
					this.inputSnapX = add( newNumberBox(null, 'Snap X:', 16, 1, 1) ).$('input');
					this.inputSnapY = add( newNumberBox(null, 'Snap Y:', 16, 1, 1) ).$('input');
					this.inputShowGrid = add( newCheckBox(null, 'Enable grid', true) ).$('input');

					this.inputDeleteUnderlying = add( newCheckBox(null, 'Delete underlying', false) ).$('input');

					// updates
					this.inputWidth.onchange = () => this.updateCanvasPreview();
					this.inputHeight.onchange = () => this.updateCanvasPreview();
					this.inputBackgroundColor.onchange = () => this.updateCanvasPreview();

					this.inputSnapX.onchange = () => this.updateCanvasPreview();
					this.inputSnapY.onchange = () => this.updateCanvasPreview();
					this.inputShowGrid.onchange = () => this.updateCanvasPreview();

					endparent()
				parent( add( newElem('preview', 'div') ) )

					// actual room area

					this.canvasPreview = add( newCanvas(null, room.width, room.height) );
					this.ctx = this.canvasPreview.getContext('2d');

					this.canvasPreview.onclick = (e) => {
						// add instance to room

						if (this.selectObject.value < 0) return;
						var x = e.offsetX;
						var y = e.offsetY;

						if (this.inputShowGrid.checked) {
							x = Math.floor(x / this.inputSnapX.value) * this.inputSnapX.value;
							y = Math.floor(y / this.inputSnapY.value) * this.inputSnapY.value;
						}

						if (this.inputDeleteUnderlying.checked) {
							this.paramInstances = this.paramInstances.filter(instance => {
								if (instance.x == x && instance.y == y) {
									console.log(instance, 'removed!!!');
									return false;
								}
								return true;
							})
						}

						this.paramInstances.push(new ProjectInstance(x, y, this.selectObject.value));
						console.log(this.paramInstances);

						this.updateCanvasPreview();

					}

					endparent();
				endparent();

				this.defaultInstanceImage = new AbstractImage('img/default-instance-image.png');
				this.updateCanvasPreview();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(room, this.inputName.value);
					room.width = this.inputWidth.value;
					room.height = this.inputHeight.value;

					room.background_color = this.inputBackgroundColor.value;
					room.instances = this.paramInstances;
				},
				() => {
					this.editor.deleteWindow(this);
				}
			);
			endparent();
	}
	updateCanvasPreview() {

		this.canvasPreview.width = this.inputWidth.value;
		this.canvasPreview.height = this.inputHeight.value;

		this.ctx.fillStyle = this.inputBackgroundColor.value;
		this.ctx.fillRect(0, 0, this.canvasPreview.width, this.canvasPreview.height);

		// instance
		this.paramInstances.forEach(instance => {
			var object = this.editor.project.resources.ProjectObject.find(x => x.id == instance.object_index);
			var sprite = this.editor.project.resources.ProjectSprite.find(x => x.id == object.sprite_index);
			var image, ox=0, oy=0;

			if (sprite) {
				ox = sprite.originx;
				oy = sprite.originy;
				if (sprite.images.length > 0) {
					image = sprite.images[0];
				} else {
					// won't show if there is a sprite, but no images
					return;
				}
			} else {
				image = this.defaultInstanceImage;
			}
			image.promise.then(() => {

				this.ctx.save()
				this.ctx.translate(ox, oy)
				this.ctx.drawImage(image.image, instance.x, instance.y);
				this.ctx.restore()

			})
		})

		// grid
		if (this.inputShowGrid.checked) {
			
			this.ctx.globalCompositeOperation = 'difference';
			this.ctx.fillStyle = 'white';
			this.ctx.strokeStyle = 'white';

			var snapx = parseInt(this.inputSnapX.value);
			var snapy = parseInt(this.inputSnapY.value);

			for (var x = 0; x < this.canvasPreview.width; x += snapx) {
				this.drawLine(x, 0, x, this.canvasPreview.height);
			}

			for (var y = 0; y < this.canvasPreview.height; y += snapy) {
				this.drawLine(0, y, this.canvasPreview.width, y);
			}

			this.ctx.globalCompositeOperation = 'source-over';
		}
	}

	drawLine(x1, y1, x2, y2) {

		console.log(x1, y1, x2, y2)
		this.ctx.save();
		this.ctx.translate(0.5, 0.5)

		this.ctx.beginPath();
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		this.ctx.closePath();
		this.ctx.stroke();

		this.ctx.restore();

		debugger;
	}
}