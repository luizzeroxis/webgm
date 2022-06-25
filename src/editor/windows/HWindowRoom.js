import AbstractImage from "../../common/AbstractImage.js";
import {parent, endparent, add, HElement, HCanvas, HTextInput, HNumberInput, HColorInput, HCheckBoxInput, HRadioInput, HSelect, HOption, uniqueID} from "../../common/H.js";
import {ProjectBackground, ProjectObject, ProjectInstance, ProjectRoomBackground} from "../../common/Project.js";
import HResourceSelect from "../HResourceSelect.js";
import HTabControl from "../HTabControl.js";
import HWindow from "../HWindow.js";
import DefaultInstanceIcon from "../img/default-instance-icon.png";

export default class HWindowRoom extends HWindow {
	constructor(editor, id, room) {
		super(editor, id);

		this.room = room;

		this.title.html.textContent = "Edit Room "+room.name;

		// Create paramInstances and paramBackgrounds as copies
		this.copyProperties();

		parent(this.client);
			parent( add( new HElement("div", {class: "grid-resource resource-room"}) ) );
				parent( add( new HElement("div") ) );

					// left area

					this.inputSnapX = add( new HNumberInput("Snap X:", 16, 1, 1) );
					this.inputSnapY = add( new HNumberInput("Snap Y:", 16, 1, 1) );
					this.inputShowGrid = add( new HCheckBoxInput("Show grid", true) );

					this.tabControl = add( new HTabControl() );

					parent( this.tabControl.addTab("Instances") );

						this.selectObject = add( new HResourceSelect(this.editor, "Object:", ProjectObject, true) );

						const toolGroup = "_radio_"+uniqueID();
						this.radioAdd = add( new HRadioInput(toolGroup, "Add instance", true) );
						this.radioMultiple = add( new HRadioInput(toolGroup, "Add multiple instances") );
						this.radioMove = add( new HRadioInput(toolGroup, "Move instance") );
						this.radioDelete = add( new HRadioInput(toolGroup, "Delete instance") );

						this.inputSnapToGrid = add( new HCheckBoxInput("Snap to grid", true) );
						this.inputDeleteUnderlying = add( new HCheckBoxInput("Delete underlying", false) );

						endparent();

					parent( this.tabControl.addTab("Settings") );

						this.inputName = add( new HTextInput("Name:", room.name) );
						this.inputWidth = add( new HNumberInput("Width:", room.width, 1, 1) );
						this.inputHeight = add( new HNumberInput("Height:", room.height, 1, 1) );
						this.inputSpeed = add( new HNumberInput("Speed:", room.speed, 1, 1) );

						endparent();

					parent( this.tabControl.addTab("Backgrounds") );

						this.inputDrawBackgroundColor = add( new HCheckBoxInput("Draw background color", room.drawBackgroundColor) );
						this.inputBackgroundColor = add( new HColorInput("Background color:", room.backgroundColor) );

						const getBackground = (index) => {
							const currentBackground = this.paramBackgrounds[index];
							if (currentBackground == null) {
								return new ProjectRoomBackground(); // default values used
							}
							return currentBackground;
						};

						const getOrCreateBackground = (index) => {
							if (this.paramBackgrounds[index] == null) {
								this.paramBackgrounds[index] = new ProjectRoomBackground(); // default values used
							}
							return this.paramBackgrounds[index];
						};

						const getOrCreateCurrentBackground = () => {
							const currentBackgroundId = this.selectBackgrounds.getValue();
							if (this.paramBackgrounds[currentBackgroundId] == null) {
								this.paramBackgrounds[currentBackgroundId] = new ProjectRoomBackground();
							}
							return this.paramBackgrounds[currentBackgroundId];
						};

						const updateBackgroundProperties = () => {
							const currentBackgroundId = this.selectBackgrounds.getValue();
							const currentBackground = getBackground(currentBackgroundId);

							this.inputBackgroundVisibleAtStart.setChecked(currentBackground.visibleAtStart);
							this.selectResourceBackground.setValue(currentBackground.backgroundIndex);
							this.inputTileHorizontally.setChecked(currentBackground.tileHorizontally);
							this.inputTileVertically.setChecked(currentBackground.tileVertically);
						};

						this.selectBackgrounds = add( new HSelect("Backgrounds:", "backgrounds") );
						this.selectBackgroundsOptions = [];

						parent(this.selectBackgrounds.select);
							for (let i=0; i<8; ++i) {
								const background = getBackground(i);
								const _class = (background.visibleAtStart ? "bold" : null);
								this.selectBackgroundsOptions[i] = add( new HOption("Background "+i.toString(), i, _class) );
							}
							endparent();

						this.selectBackgrounds.select.html.size = 8;

						this.selectBackgrounds.setOnChange(() => {
							updateBackgroundProperties();
						});

						this.inputBackgroundVisibleAtStart = add( new HCheckBoxInput("Visible when room starts") );
						this.inputBackgroundVisibleAtStart.setOnChange(() => {
							const currentBackgroundId = this.selectBackgrounds.getValue();
							const currentBackground = getOrCreateBackground(currentBackgroundId);

							currentBackground.visibleAtStart = this.inputBackgroundVisibleAtStart.getChecked();

							if (currentBackground.visibleAtStart) {
								this.selectBackgroundsOptions[currentBackgroundId].html.classList.add("bold");
							} else {
								this.selectBackgroundsOptions[currentBackgroundId].html.classList.remove("bold");
							}

							this.updateCanvasPreview();
						});

						this.selectResourceBackground = add( new HResourceSelect(this.editor, null, ProjectBackground) );
						this.selectResourceBackground.setOnChange(() => {
							getOrCreateCurrentBackground().backgroundIndex = this.selectResourceBackground.getValue();
							this.updateCanvasPreview();
						});

						this.inputTileHorizontally = add( new HCheckBoxInput("Tile Hor.") );
						this.inputTileHorizontally.setOnChange(() => {
							getOrCreateCurrentBackground().tileHorizontally = this.inputTileHorizontally.getChecked();
							this.updateCanvasPreview();
						});

						this.inputTileVertically = add( new HCheckBoxInput("Tile Vert.") );
						this.inputTileVertically.setOnChange(() => {
							getOrCreateCurrentBackground().tileVertically = this.inputTileVertically.getChecked();
							this.updateCanvasPreview();
						});

						updateBackgroundProperties();

						endparent();

					parent( add( new HElement("div", {}, "X: ") ) );
						this.spanX = add( new HElement("span", {}, "0") );
						endparent();
					parent( add( new HElement("div", {}, "Y: ") ) );
						this.spanY = add( new HElement("span", {}, "0") );
						endparent();
					parent( add( new HElement("div", {}, "Object: ") ) );
						this.spanObject = add( new HElement("span") );
						endparent();
					parent( add( new HElement("div", {}, "ID: ") ) );
						this.spanId = add( new HElement("span") );
						endparent();

					// updates
					this.inputSnapX.setOnChange(() => this.updateCanvasPreview());
					this.inputSnapY.setOnChange(() => this.updateCanvasPreview());
					this.inputShowGrid.setOnChange(() => this.updateCanvasPreview());

					this.inputWidth.setOnChange(() => this.updateCanvasPreview());
					this.inputHeight.setOnChange(() => this.updateCanvasPreview());

					this.inputDrawBackgroundColor.setOnChange(() => this.updateCanvasPreview());
					this.inputBackgroundColor.setOnChange(() => this.updateCanvasPreview());

					endparent();
				parent( add( new HElement("div", {class: "preview"}) ) );

					// actual room area

					this.canvasPreview = add( new HCanvas(room.width, room.height) );
					this.ctx = this.canvasPreview.html.getContext("2d");
					this.ctx.imageSmoothingEnabled = false;

					// TODO: account for sprite size when moving and deleting

					this.canvasPreview.html.onmousedown = (e) => {
						this.mouseIsDown = true;
						const pos = this.getMousePosition(e);
						const snappedPos = this.snapMousePosition(pos);

						this.currentPos = snappedPos;

						if (this.radioAdd.getChecked()) {
							this.movingInstance = this.addInstance();
						} else

						if (this.radioMultiple.getChecked()) {
							this.movingInstance = this.addInstance();
							this.deleteUnderlying();
						} else

						if (this.radioMove.getChecked()) {
							const hover = this.getInstanceAtPosition(pos);
							if (hover) {
								this.movingInstance = hover;
							}
						} else

						if (this.radioDelete.getChecked()) {
							const hover = this.getInstanceAtPosition(pos);
							if (hover) {
								this.paramInstances = this.paramInstances.filter(i => i != hover);
							}
						}

						this.updateCanvasPreview();
					};

					this.canvasPreview.html.onmousemove = (e) => {
						const pos = this.getMousePosition(e);
						const snappedPos = this.snapMousePosition(pos);

						if (this.mouseIsDown) {
							if (this.radioAdd.getChecked() || this.radioMove.getChecked()) {
								if (this.movingInstance) {
									this.movingInstance.x = snappedPos.x;
									this.movingInstance.y = snappedPos.y;
								}
							} else

							if (this.radioMultiple.getChecked()) {
								const hover = this.getInstanceAtPosition(pos);
								if (hover != this.movingInstance) {
									this.currentPos = snappedPos;
									this.movingInstance = this.addInstance();
									this.deleteUnderlying();
								}
							} else

							if (this.radioDelete.getChecked()) {
								const hover = this.getInstanceAtPosition(pos);
								if (hover) {
									this.paramInstances = this.paramInstances.filter(i => i != hover);
								}
							}

							this.updateCanvasPreview();
						}

						this.spanX.html.textContent = snappedPos.x;
						this.spanY.html.textContent = snappedPos.y;
						this.spanObject.html.textContent = "";
						this.spanId.html.textContent = "";

						{
							const hover = this.getInstanceAtPosition(pos);
							if (hover) {
								this.spanObject.html.textContent = this.editor.project.getResourceById("ProjectObject", hover.object_index).name;
								if (hover.id != null) {
									this.spanId.html.textContent = hover.id;
								} else {
									this.spanId.html.textContent = "(not applied)";
								}
							}
						}
					};

					endparent();
				endparent();

				this.defaultInstanceImage = new AbstractImage(DefaultInstanceIcon);
				this.updateCanvasPreview();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(room, this.inputName.getValue());

					room.width = parseInt(this.inputWidth.getValue());
					room.height = parseInt(this.inputHeight.getValue());
					room.speed = parseInt(this.inputSpeed.getValue());

					room.drawBackgroundColor = this.inputDrawBackgroundColor.getChecked();
					room.backgroundColor = this.inputBackgroundColor.getValue();

					room.backgrounds = this.paramBackgrounds;

					// In GM, these ids are saved instantly. Even if you close and don't save the room, it still uses the ids. In this project, ideally resource editors would only change the project when you press ok or apply. Because of that, we create the ProjectInstances without ids, and only when saving we fill in the ids.

					for (const instance of this.paramInstances) {
						if (instance.id == null) {
							this.editor.project.lastId += 1;
							instance.id = this.editor.project.lastId;
						}
					}

					room.instances = this.paramInstances;

					// Make sure that paramInstances and paramBackgrounds are copies
					this.copyProperties();
				},
				() => {
					this.close();
				},
			);
			endparent();
	}

	onAdd() {
		this.mouseUpHandler = () => {
			this.mouseIsDown = false;

			if (this.movingInstance) {
				if (this.radioAdd.getChecked()) {
					this.deleteUnderlying();
				}
				this.movingInstance = null;
				this.updateCanvasPreview();
			}
		};
		document.addEventListener("mouseup", this.mouseUpHandler);

		this.listeners = this.editor.dispatcher.listen({
			changeObjectSprite: () => {
				this.updateCanvasPreview();
			},
			changeSpriteOrigin: () => {
				this.updateCanvasPreview();
			},
			changeBackgroundImage: () => {
				this.updateCanvasPreview();
			},
		});
	}

	onRemove() {
		document.removeEventListener("mouseup", this.mouseUpHandler);

		this.editor.dispatcher.stopListening(this.listeners);
	}

	// Make a copy of every property of the resource so we can change it at will without changing the original resource.
	copyProperties() {
		this.paramBackgrounds = this.room.backgrounds.map(background => {
			if (background == null) return null;
			return new ProjectRoomBackground(background);
		});
		this.paramInstances = this.room.instances.map(instance => {
			return new ProjectInstance(instance);
		});
	}

	getMousePosition(e) {
		const x = e.offsetX;
		const y = e.offsetY;
		return {x: x, y: y};
	}

	snapMousePosition(pos) {
		let x = pos.x;
		let y = pos.y;

		if (this.inputSnapToGrid.getChecked()) {
			const snapX = Math.max(1, parseInt(this.inputSnapX.getValue()) || 0);
			const snapY = Math.max(1, parseInt(this.inputSnapY.getValue()) || 0);

			x = Math.floor(x / snapX) * snapX;
			y = Math.floor(y / snapY) * snapY;
		}

		return {x: x, y: y};
	}

	addInstance() {
		if (this.selectObject.getValue() == -1) return null;

		const i = new ProjectInstance();
		i.x = this.currentPos.x;
		i.y = this.currentPos.y;
		i.object_index = this.selectObject.getValue();

		this.paramInstances.push(i);
		return i;
	}

	deleteUnderlying() {
		if (this.inputDeleteUnderlying.getChecked()) {
			for (let i = this.paramInstances.length - 1; i >= 0; i--) {
				const instance = this.paramInstances[i];
				if (instance != this.movingInstance && this.isInstanceAtPosition(instance, this.currentPos)) {
					this.paramInstances.splice(i, 1);
				}
			}
		}
	}

	getInstanceAtPosition(pos) {
		for (let i = this.paramInstances.length - 1; i >= 0; i--) {
			const instance = this.paramInstances[i];
			if (this.isInstanceAtPosition(instance, pos)) {
				return instance;
			}
		}

		return null;
	}

	isInstanceAtPosition(instance, pos) {
		const object = this.editor.project.getResourceById("ProjectObject", instance.object_index);
		const sprite = this.editor.project.getResourceById("ProjectSprite", object.sprite_index);

		let w=32, h=32, ox=0, oy=0;

		if (sprite) {
			ox = sprite.originx;
			oy = sprite.originy;
			if (sprite.images.length > 0) {
				w = sprite.images[0].image.width;
				h = sprite.images[0].image.height;
			} else {
				// On GM, if there's no images, it just defaults to 32x32. A possible improvement would be to either simply show the default image anyway, or use the grid size. Right now I'll just use 32x32 anyway.
			}
		} else {
			w = this.defaultInstanceImage.image.width;
			h = this.defaultInstanceImage.image.height;
		}

		const x1 = instance.x - ox;
		const y1 = instance.y - oy;
		const x2 = x1 + w;
		const y2 = y1 + h;

		if (pos.x >= x1 && pos.x < x2 && pos.y >= y1 && pos.y < y2) {
			return true;
		} else {
			return false;
		}
	}

	async updateCanvasPreview() {
		// Setting the size resets the background to black, in case 'draw background color' isn't on.
		this.canvasPreview.html.width = this.inputWidth.getValue();
		this.canvasPreview.html.height = this.inputHeight.getValue();

		if (this.inputDrawBackgroundColor.getChecked()) {
			this.ctx.fillStyle = this.inputBackgroundColor.getValue();
			this.ctx.fillRect(0, 0, this.canvasPreview.html.width, this.canvasPreview.html.height);
		}

		// backgrounds
		for (const roomBackground of this.paramBackgrounds) {
			if (!roomBackground) continue;
			if (roomBackground.isForeground == true) continue;
			await this.drawRoomBackground(roomBackground);
		}

		// instance
		for (const roomInstance of this.paramInstances) {
			await this.drawRoomInstance(roomInstance);
		}

		// foregrounds
		for (const roomBackground of this.paramBackgrounds) {
			if (!roomBackground) continue;
			if (roomBackground.isForeground == false) continue;
			await this.drawRoomBackground(roomBackground);
		}

		// grid
		this.drawGrid();
	}

	async drawRoomInstance(roomInstance) {
		const object = this.editor.project.getResourceById("ProjectObject", roomInstance.object_index);
		const sprite = this.editor.project.getResourceById("ProjectSprite", object.sprite_index);
		let image, ox=0, oy=0;

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

		if (image) {
			await image.promise;
			this.ctx.drawImage(image.image, roomInstance.x - ox, roomInstance.y - oy);
		}
	}

	async drawRoomBackground(roomBackground) {
		if (!roomBackground.visibleAtStart) return false;

		const background = this.editor.project.getResourceById("ProjectBackground", roomBackground.backgroundIndex);
		if (!background) return false;

		const image = background.image;
		if (!image) return false;

		// TODO stretch

		await image.promise;

		let xStart = roomBackground.x;
		let yStart = roomBackground.y;

		if (roomBackground.tileHorizontally) {
			xStart = (roomBackground.x % background.image.image.width) - background.image.image.width;
		}
		if (roomBackground.tileVertically) {
			yStart = (roomBackground.y % background.image.image.height) - background.image.image.height;
		}

		for (let x = xStart; x < this.canvasPreview.html.width; x += background.image.image.width) {
			for (let y = yStart; y < this.canvasPreview.html.height; y += background.image.image.height) {
				this.ctx.drawImage(image.image, x, y);

				if (!roomBackground.tileVertically) {
					break;
				}
			}
			if (!roomBackground.tileHorizontally) {
				break;
			}
		}

		return true;
	}

	drawGrid() {
		if (this.inputShowGrid.getChecked()) {
			this.ctx.globalCompositeOperation = "difference";
			this.ctx.fillStyle = "white";
			this.ctx.strokeStyle = "white";

			const snapx = parseInt(this.inputSnapX.getValue());
			const snapy = parseInt(this.inputSnapY.getValue());

			if (snapx > 0) {
				for (let x = 0; x < this.canvasPreview.html.width; x += snapx) {
					this.drawLine(x, 0, x, this.canvasPreview.html.height);
				}
			}

			if (snapy > 0) {
				for (let y = 0; y < this.canvasPreview.html.height; y += snapy) {
					this.drawLine(0, y, this.canvasPreview.html.width, y);
				}
			}

			this.ctx.globalCompositeOperation = "source-over";
		}
	}

	drawLine(x1, y1, x2, y2) {
		this.ctx.save();
		this.ctx.translate(0.5, 0.5);

		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		//this.ctx.closePath();
		this.ctx.stroke();

		this.ctx.restore();
	}
}