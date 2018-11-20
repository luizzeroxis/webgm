//
class RoomWindow extends ResourceWindow {

	constructor(/**/) {
		super(...arguments);

		this.addingInstance = false;

	}

	makeResourceClient() {

		this.inputName = add( newTextBox(null, 'Name:') ).$('input');
		this.inputName.addEventListener('input', (e) => { this.isModified = true;
			this.changes.name = e.target.value;
		});

		this.inputSnapX = add( newNumberBox(null, 'Snap X:', 16, 1, 1) ).$('input');
		this.inputSnapX.addEventListener('input', (e) => {
			this.redrawCanvas();
		});

		this.inputSnapY = add( newNumberBox(null, 'Snap Y:', 16, 1, 1) ).$('input');
		this.inputSnapY.addEventListener('input', (e) => {
			this.redrawCanvas();
		});

		this.inputShowGrid = add( newCheckBox(null, 'Show grid', true) ).$('input')
		this.inputShowGrid.addEventListener('input', (e) => {
			this.redrawCanvas();
		});

		this.selectObject = add( newResourceSelect(null, 'Object:', 'object', this.editor) ).$('select')
		this.selectObject.addEventListener('input', (e) => {
			this.objecttoinsert = e.target.value;
		});

		this.inputBackgroundColor = add( newColorBox(null, 'Background color:') ).$('input');
		this.inputBackgroundColor.addEventListener('input', (e) => { this.isModified = true;
			this.changes.background_color = e.target.value;
			this.redrawCanvas();
		})

		this.canvasRoom = add( newCanvas(null, 0, 0) )
		this.canvasRoom.addEventListener('click', (e) => {

			if (this.selectObject.value == "" || this.selectObject.value == null) {
				console.log('no');
			} else {
				this.isModified = true;

				var x = Math.floor(e.offsetX / this.inputSnapX.value) * this.inputSnapX.value;
				var y = Math.floor(e.offsetY / this.inputSnapY.value) * this.inputSnapY.value;
				var object_index = this.selectObject.value;

				var instance = new ProjectInstance(x, y, object_index);
								
				//if (this.changes.instances == null) {this.changes.instances = [];}
				this.instances.push(instance);
				this.changes.instances = this.instances;

				this.redrawCanvas();

				this.addingInstance = false;
			}

		});
		this.canvasRoom.addEventListener('mousedown', (e) => {
			if (e.buttons==1) {
				if (this.addingInstance == false) {
					this.addingInstance = true;
					this.redrawCanvas();
				}
				this.instancePreviewX = Math.floor(e.offsetX / this.inputSnapX.value) * this.inputSnapX.value;
				this.instancePreviewY = Math.floor(e.offsetY / this.inputSnapY.value) * this.inputSnapY.value;
				this.instancePreviewObjectIndex = this.selectObject.value;

			}
		})
		this.canvasRoom.addEventListener('mousemove', (e) => {
			if (e.buttons==1) {
				if (this.addingInstance) {
					this.instancePreviewX = Math.floor(e.offsetX / this.inputSnapX.value) * this.inputSnapX.value;
					this.instancePreviewY = Math.floor(e.offsetY / this.inputSnapY.value) * this.inputSnapY.value;
					this.redrawCanvas();
				}
			} else {
				this.addingInstance = false;
				this.redrawCanvas();
			}
		})
		document.addEventListener('mouseup', (e) => {
			this.addingInstance = false;
			this.redrawCanvas();
		})

		this.makeApplyOkButtons();

	}

	redrawCanvas() {

		this.editor.imageLoader.getPromiseAllLoaded().then(() => {

			console.log('drawing canvas');

			var ctx = this.canvasRoom.getContext('2d');

			ctx.globalCompositeOperation = 'source-over';
			ctx.fillStyle = this.inputBackgroundColor.value;
			ctx.fillRect(0,0, this.canvasRoom.width, this.canvasRoom.height);

			//draw instances
			for (var i = 0; i < this.instances.length; i++) {

				let inst = this.instances[i];

				var object_index = inst.object_index;
				var object = this.editor.project.objects.find((x) => x.id == object_index);
				var sprite_index = object.sprite_index;

				if (sprite_index < 0) {

					console.log('sprite is ', sprite_index);
					ctx.drawImage(this.editor.imageLoader.images[-1].image, inst.x, inst.y);

				} else {

					var sprite = this.editor.project.sprites.find((x) => x.id == sprite_index);

					if (!(sprite.sprite == null)) {
						
						ctx.save();
						ctx.translate(-sprite.originx, -sprite.originy);

						ctx.drawImage(this.editor.imageLoader.images[sprite.id].image, inst.x, inst.y);

						ctx.restore();

					} else {
						console.log('sprite exists but theres no image.');
					}
				}
			}

			//draw adding instance
			if (this.addingInstance) {
				var object_index = this.instancePreviewObjectIndex;
				var object = this.editor.project.objects.find((x) => x.id == object_index);
				var sprite_index = object.sprite_index;

				if (sprite_index < 0) {
					ctx.drawImage(this.editor.imageLoader.images[-1].image, this.instancePreviewX, this.instancePreviewY);
				} else {
					var sprite = this.editor.project.sprites.find((x) => x.id == sprite_index);

					if (!(sprite.sprite == null)) {
						ctx.save();
						ctx.translate(-sprite.originx, -sprite.originy);
						ctx.drawImage(this.editor.imageLoader.images[sprite.id].image, this.instancePreviewX, this.instancePreviewY);
						ctx.restore();
					}
				}
			}

			//draw grid
			if (this.inputShowGrid.checked) {

				ctx.globalCompositeOperation = 'difference';
				ctx.strokeStyle = 'white';

				var snapx = this.inputSnapX.value;
				var snapy = this.inputSnapY.value;

				if (snapx) {
					for (var x = 0; x < this.canvasRoom.width / snapx; x++) {
						this.drawLine(x*snapx,0,x*snapx,this.canvasRoom.height)
					}
				}

				if (snapy) {
					for (var y = 0; y < this.canvasRoom.height / snapy; y++) {
						this.drawLine(0,y*snapy,this.canvasRoom.width,y*snapy)
					}
				}

				ctx.globalCompositeOperation = 'source-over';

			}

		});
	}

	drawLine(x1, y1, x2, y2) {
		var ctx = this.canvasRoom.getContext('2d')

		ctx.save();
		ctx.translate(0.5, 0.5)

		ctx.beginPath()
		ctx.moveTo(x1,y1)
		ctx.lineTo(x2,y2)
		ctx.closePath()
		ctx.stroke();

		ctx.restore();
	}

	resetChanges() {
		super.resetChanges();

		this.inputName.value = this.resource.name;
		this.inputBackgroundColor.value = this.resource.background_color;
		// console.log(this.inputBackgroundColor.value);

		this.canvasRoom.width = this.resource.width;
		this.canvasRoom.height = this.resource.height;

		this.instances = this.resource.instances;

		this.redrawCanvas();
	}

}