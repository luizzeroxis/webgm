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
					this.inputSpeed = add( newNumberBox(null, 'Speed:', room.speed, 1, 1) ).$('input');
					this.inputBackgroundColor = add( newColorBox(null, 'Background color:', room.background_color) ).$('input');
					
					parent( add( newElem(null, 'fieldset') ) )

						add( newElem(null, 'legend', 'Instances') )

						this.selectObject = this.makeResourceSelect(null, 'Object:', 'ProjectObject').$('select');

						var toolGroup = '_radio_'+uniqueID();
						this.radioAdd = add( newRadioBox(null, 'Add instance', toolGroup, true) ).$('input')
						this.radioMultiple = add( newRadioBox(null, 'Add multiple instances', toolGroup) ).$('input')
						this.radioMove = add( newRadioBox(null, 'Move instance', toolGroup) ).$('input')
						this.radioDelete = add( newRadioBox(null, 'Delete instance', toolGroup) ).$('input')

						this.inputSnapToGrid = add( newCheckBox(null, 'Snap to grid', true) ).$('input');
						this.inputDeleteUnderlying = add( newCheckBox(null, 'Delete underlying', false) ).$('input');

						endparent()

					this.inputSnapX = add( newNumberBox(null, 'Snap X:', 16, 1, 1) ).$('input');
					this.inputSnapY = add( newNumberBox(null, 'Snap Y:', 16, 1, 1) ).$('input');
					this.inputShowGrid = add( newCheckBox(null, 'Show grid', true) ).$('input');

					parent( add( newElem(null, 'div', 'X: ') ) )
						this.spanX = add( newElem(null, 'span', '0') );
						endparent()
					parent( add( newElem(null, 'div', 'Y: ') ) )
						this.spanY = add( newElem(null, 'span', '0') );
						endparent()
					parent( add( newElem(null, 'div', 'Object: ') ) )
						this.spanObject = add( newElem(null, 'span', '') );
						endparent()
					// parent( add( newElem(null, 'div', 'Id: ') ) )
					// 	this.spanId = add( newElem(null, 'span', '') );
					// 	endparent()
					/* Having ids in the room editor would mean saving the counter imediately,
					 * since you can have multiple rooms at the same time. This violates a
					 * principle of this project, which is that you have to press 'ok' or 'apply'
					 * to save the changes. Sorry GM, but this is where I draw the line. */

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
					this.ctx.imageSmoothingEnabled = false;

					// TODO: account for sprite size when moving and deleting

					this.canvasPreview.onmousedown = (e) => {

						this.mouseIsDown = true;
						this.currentPos = this.getMousePositionSnapped(e);
						var pos = this.currentPos;

						if (this.radioAdd.checked) {
							this.movingInstance = this.addInstance(e);
						} else

						if (this.radioMultiple.checked) {
							this.addInstance(e);
							this.deleteUnderlying(e);
						} else

						if (this.radioMove.checked) {
							for (var i = this.paramInstances.length - 1; i >= 0; i--) {
								if (this.paramInstances[i].x == pos.x
								 && this.paramInstances[i].y == pos.y) {
									this.movingInstance = this.paramInstances[i];
									break;
								}
							}
						} else

						if (this.radioDelete.checked) {
							for (var i = this.paramInstances.length - 1; i >= 0; i--) {
								if (this.paramInstances[i].x == pos.x
								 && this.paramInstances[i].y == pos.y) {

									this.paramInstances.splice(i, 1);
									break;
								}
							}
						}

						this.updateCanvasPreview();

					}

					this.canvasPreview.onmousemove = (e) => {
						var pos = this.getMousePositionSnapped(e);

						if (this.mouseIsDown) {

							if (this.movingInstance) {
								this.movingInstance.x = pos.x;
								this.movingInstance.y = pos.y;
							}

							if (!(pos.x == this.currentPos.x && pos.y == this.currentPos.y)) {
								if (this.radioMultiple.checked) {
									this.addInstance(e);
									this.currentPos = pos;
								} else

								if (this.radioDelete.checked) {
									for (var i = this.paramInstances.length - 1; i >= 0; i--) {
										if (this.paramInstances[i].x == pos.x
										 && this.paramInstances[i].y == pos.y) {

											this.paramInstances.splice(i, 1);
											break;
										}
									}
									this.currentPos = pos;
								}
							}
							
						}

						this.spanX.textContent = pos.x;
						this.spanY.textContent = pos.y;
						this.spanObject.textContent = '';
						//this.spanId.textContent = '';

						for (var i = this.paramInstances.length - 1; i >= 0; i--) {
							if (this.paramInstances[i].x == pos.x
							 && this.paramInstances[i].y == pos.y) {

								this.spanObject.textContent = this.editor.project.resources['ProjectObject']
									.find(x => x.id == this.paramInstances[i].object_index).name;

								break;
							}
						}

						this.updateCanvasPreview();
					}

					// is this... right?
					document.onmouseup = (e) => {
						this.mouseIsDown = false;

						if (this.movingInstance) {
							if (this.radioAdd.checked) {
								this.deleteUnderlying(e);
							}
						}

						this.movingInstance = null;

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
					room.speed = this.inputSpeed.value;

					room.background_color = this.inputBackgroundColor.value;
					room.instances = this.paramInstances;
				},
				() => {
					this.editor.deleteWindow(this);
				}
			);
			endparent();

		this.editor.dispatcher.listen({
			changeObjectSprite: i => {
				this.updateCanvasPreview();
			}
			//changeSpriteOrigin
		})

	}

	getMousePositionSnapped(e) {
		var x = e.offsetX;
		var y = e.offsetY;

		if (this.inputSnapToGrid.checked) {
			x = Math.floor(x / this.inputSnapX.value) * this.inputSnapX.value;
			y = Math.floor(y / this.inputSnapY.value) * this.inputSnapY.value;
		}

		return {x: x, y: y};
	}

	addInstance(e) {
		if (this.selectObject.value < 0) return;

		var pos = this.getMousePositionSnapped(e);

		var i = new ProjectInstance(pos.x, pos.y, this.selectObject.value);
		this.paramInstances.push(i);
		return i;
	}

	deleteUnderlying(e) {
		var pos = this.getMousePositionSnapped(e);

		if (this.inputDeleteUnderlying.checked) {
			this.paramInstances = this.paramInstances.filter(instance => {
				if (instance == this.movingInstance) {
					return true;
				}
				if (instance.x == pos.x && instance.y == pos.y) {
					//console.log(instance, 'removed!!!');
					return false;
				}
				return true;
			})
		}
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

		this.ctx.save();
		this.ctx.translate(0.5, 0.5)

		this.ctx.beginPath();
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		//this.ctx.closePath();
		this.ctx.stroke();

		this.ctx.restore();
		
	}
}