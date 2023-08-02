import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HCanvas, HTextInput, HNumberInput, HColorInput, HCheckBoxInput, HRadioInput, HSelect, HOption, uniqueID} from "~/common/h";
import ImageWrapper from "~/common/ImageWrapper.js";
import {ProjectBackground, ProjectObject, ProjectRoom, ProjectInstance, ProjectRoomBackground, ProjectRoomView} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";
import HTabControl from "~/editor/components/HTabControl/HTabControl.js";
import HResourceSelect from "~/editor/HResourceSelect.js";
import DefaultInstanceIcon from "~/editor/img/default-instance-icon.png";

export default class HWindowRoom extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-room"}) ) );

				parent( add( new HElement("div", {class: "tool-bar"})) );

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					this.buttonClear = add( new HButton("Clear all", () => {
						if (!confirm("Are you sure you want to delete all object instances?")) return;
						this.resource.instances = [];
						this.updateCanvasPreview();
						this.onUpdate();
					}) );

					this.inputSnapX = add( new HNumberInput("Snap X:", 16, 1, 1) );
					this.inputSnapY = add( new HNumberInput("Snap Y:", 16, 1, 1) );
					this.inputShowGrid = add( new HCheckBoxInput("Show grid", true) );

					endparent();

				parent( add( new HElement("div", {class: "panel-container"})) );

					parent( add( new HElement("div", {class: "properties"}) ) );

						this.tabControl = add( new HTabControl("properties-tabs") );

						const tabInstances = parent( this.tabControl.addTab("objects") );

							this.selectObject = add( new HResourceSelect(this.editor, "Object:", ProjectObject, true) );

							this.inputDeleteUnderlying = add( new HCheckBoxInput("Delete underlying", false) );

							setDeepOnUpdateOnElement(tabInstances, () => this.onUpdate());
							endparent();

						const tabSettings = parent( this.tabControl.addTab("settings") );

							this.inputName = add( new HTextInput("Name:", this.resource.name) );
							this.inputWidth = add( new HNumberInput("Width:", this.resource.width, 1, 1) );
							this.inputHeight = add( new HNumberInput("Height:", this.resource.height, 1, 1) );
							this.inputSpeed = add( new HNumberInput("Speed:", this.resource.speed, 1, 1) );

							setDeepOnUpdateOnElement(tabSettings, () => this.onUpdate());
							endparent();

						const tabTiles = parent( this.tabControl.addTab("tiles") );

							setDeepOnUpdateOnElement(tabTiles, () => this.onUpdate());
							endparent();

						const tabBackgrounds = parent( this.tabControl.addTab("backgrounds") );

							this.inputDrawBackgroundColor = add( new HCheckBoxInput("Draw background color", this.resource.drawBackgroundColor) );
							this.inputBackgroundColor = add( new HColorInput("Color:", this.resource.backgroundColor) );

							this.selectBackgrounds = add( new HSelect(null, "backgrounds") );
							this.selectBackgroundsOptions = [];

							parent(this.selectBackgrounds.select);
								for (let i=0; i<8; ++i) {
									const background = this.getBackground(i);
									const _class = (background.visibleAtStart ? "bold" : null);
									this.selectBackgroundsOptions[i] = add( new HOption("Background "+i.toString(), i, _class) );
								}
								endparent();

							this.selectBackgrounds.select.html.size = 8;

							this.selectBackgrounds.setOnChange(() => {
								this.updateBackgroundProperties();
							});

							this.inputBackgroundVisibleAtStart = add( new HCheckBoxInput("Visible when room starts") );
							this.inputBackgroundVisibleAtStart.setOnChange(() => {
								const currentBackgroundId = this.selectBackgrounds.getValue();
								const currentBackground = this.getOrCreateBackground(currentBackgroundId);

								currentBackground.visibleAtStart = this.inputBackgroundVisibleAtStart.getChecked();

								if (currentBackground.visibleAtStart) {
									this.selectBackgroundsOptions[currentBackgroundId].html.classList.add("bold");
								} else {
									this.selectBackgroundsOptions[currentBackgroundId].html.classList.remove("bold");
								}

								this.updateCanvasPreview();
							});

							this.inputForeground = add( new HCheckBoxInput("Foreground image") );
							this.inputForeground.setOnChange(() => {
								this.getOrCreateCurrentBackground().isForeground = this.inputForeground.getChecked();
								this.updateCanvasPreview();
							});

							this.selectResourceBackground = add( new HResourceSelect(this.editor, null, ProjectBackground) );
							this.selectResourceBackground.setOnChange(() => {
								this.getOrCreateCurrentBackground().backgroundIndex = this.selectResourceBackground.getValue();
								this.updateCanvasPreview();
							});

							this.inputTileHorizontally = add( new HCheckBoxInput("Tile Hor.") );
							this.inputTileHorizontally.setOnChange(() => {
								this.getOrCreateCurrentBackground().tileHorizontally = this.inputTileHorizontally.getChecked();
								this.updateCanvasPreview();
							});

							this.inputTileVertically = add( new HCheckBoxInput("Tile Vert.") );
							this.inputTileVertically.setOnChange(() => {
								this.getOrCreateCurrentBackground().tileVertically = this.inputTileVertically.getChecked();
								this.updateCanvasPreview();
							});

							this.inputStretch = add( new HCheckBoxInput("Stretch") );
							this.inputStretch.setOnChange(() => {
								this.getOrCreateCurrentBackground().stretch = this.inputStretch.getChecked();
								this.updateCanvasPreview();
							});

							this.inputX = add( new HNumberInput("X:") );
							this.inputX.setOnChange(() => {
								this.getOrCreateCurrentBackground().x = this.inputX.getFloatValue();
								this.updateCanvasPreview();
							});

							this.inputY = add( new HNumberInput("Y:") );
							this.inputY.setOnChange(() => {
								this.getOrCreateCurrentBackground().y = this.inputY.getFloatValue();
								this.updateCanvasPreview();
							});

							this.inputHorizontalSpeed = add( new HNumberInput("Hor. Speed:") );
							this.inputHorizontalSpeed.setOnChange(() => {
								this.getOrCreateCurrentBackground().horizontalSpeed = this.inputHorizontalSpeed.getFloatValue();
							});

							this.inputVerticalSpeed = add( new HNumberInput("Vert. Speed:") );
							this.inputVerticalSpeed.setOnChange(() => {
								this.getOrCreateCurrentBackground().verticalSpeed = this.inputVerticalSpeed.getFloatValue();
							});

							this.updateBackgroundProperties();

							setDeepOnUpdateOnElement(tabBackgrounds, () => this.onUpdate());
							endparent();

						const tabViews = parent( this.tabControl.addTab("views") );
							this.inputEnableViews = add( new HCheckBoxInput("Enable the use of Views", this.resource.enableViews) );

							this.selectViews = add( new HSelect(null, "views") );
							this.selectViewsOptions = [];

							parent(this.selectViews.select);
								for (let i=0; i<8; ++i) {
									const view = this.getView(i);
									const _class = (view.visibleAtStart ? "bold" : null);
									this.selectViewsOptions[i] = add( new HOption("View "+i.toString(), i, _class) );
								}
								endparent();

							this.selectViews.select.html.size = 8;

							this.selectViews.setOnChange(() => {
								this.updateViewProperties();
							});

							this.inputViewVisibleAtStart = add( new HCheckBoxInput("Visible when room starts") );
							this.inputViewVisibleAtStart.setOnChange(() => {
								const currentViewId = this.selectViews.getValue();
								const currentView = this.getOrCreateView(currentViewId);

								currentView.visibleAtStart = this.inputViewVisibleAtStart.getChecked();

								if (currentView.visibleAtStart) {
									this.selectViewsOptions[currentViewId].html.classList.add("bold");
								} else {
									this.selectViewsOptions[currentViewId].html.classList.remove("bold");
								}
							});

							parent( add( new HElement("fieldset") ) );
								add( new HElement("legend", {}, "View in room") );

								this.inputViewX = add( new HNumberInput("X:") );
								this.inputViewX.setOnChange(() => {
									this.getOrCreateCurrentView().viewX = this.inputViewX.getFloatValue();
								});

								this.inputViewY = add( new HNumberInput("Y:") );
								this.inputViewY.setOnChange(() => {
									this.getOrCreateCurrentView().viewY = this.inputViewY.getFloatValue();
								});

								this.inputViewW = add( new HNumberInput("W:") );
								this.inputViewW.setOnChange(() => {
									this.getOrCreateCurrentView().viewW = this.inputViewW.getFloatValue();
								});

								this.inputViewH = add( new HNumberInput("H:") );
								this.inputViewH.setOnChange(() => {
									this.getOrCreateCurrentView().viewH = this.inputViewH.getFloatValue();
								});

								endparent();

							parent( add( new HElement("fieldset") ) );
								add( new HElement("legend", {}, "Port on screen") );

								this.inputPortX = add( new HNumberInput("X:") );
								this.inputPortX.setOnChange(() => {
									this.getOrCreateCurrentView().portX = this.inputPortX.getFloatValue();
								});

								this.inputPortY = add( new HNumberInput("Y:") );
								this.inputPortY.setOnChange(() => {
									this.getOrCreateCurrentView().portY = this.inputPortY.getFloatValue();
								});

								this.inputPortW = add( new HNumberInput("W:") );
								this.inputPortW.setOnChange(() => {
									this.getOrCreateCurrentView().portW = this.inputPortW.getFloatValue();
								});

								this.inputPortH = add( new HNumberInput("H:") );
								this.inputPortH.setOnChange(() => {
									this.getOrCreateCurrentView().portH = this.inputPortH.getFloatValue();
								});

								endparent();

							this.updateViewProperties();

							setDeepOnUpdateOnElement(tabViews, () => this.onUpdate());
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

					parent( add( new HElement("div", {class: "room"}) ) );

						parent( add( new HElement("div", {class: "preview"}) ) );

							this.canvasPreview = add( new HCanvas(this.resource.width, this.resource.height) );
							this.ctx = this.canvasPreview.html.getContext("2d", {alpha: false});
							this.ctx.imageSmoothingEnabled = false;

							this.canvasPreview.html.onmousedown = e => this.canvasMouseDown(e);
							this.canvasPreview.html.onmousemove = e => this.canvasMouseMove(e);
							this.canvasPreview.html.oncontextmenu = e => e.preventDefault();

							endparent();

						parent( add( new HElement("div", {class: "status-bar"}) ) );

							parent( add( new HElement("div", {class: "x"}, "x: ") ) );
								this.spanX = add( new HElement("span", {}, "0") );
								endparent();
							parent( add( new HElement("div", {class: "y"}, "y: ") ) );
								this.spanY = add( new HElement("span", {}, "0") );
								endparent();
							parent( add( new HElement("div", {class: "object"}, "object: ") ) );
								this.spanObject = add( new HElement("span") );
								endparent();
							parent( add( new HElement("div", {class: "id"}, "id: ") ) );
								this.spanId = add( new HElement("span") );
								endparent();

							endparent();

						endparent();

					endparent();
				endparent();

				this.defaultInstanceImage = new ImageWrapper(DefaultInstanceIcon);
				this.updateCanvasPreview();

			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());

		this.tabControl.showTabContent(tabInstances);
	}

	onAdd() {
		super.onAdd();

		this.mouseUpHandler = () => this.canvasMouseUp();
		document.addEventListener("mouseup", this.mouseUpHandler);

		this.listeners = this.editor.project.dispatcher.listen({
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
		super.onRemove();

		document.removeEventListener("mouseup", this.mouseUpHandler);

		this.editor.project.dispatcher.stopListening(this.listeners);
	}

	copyData() {
		this.resourceCopy = new ProjectRoom(this.resource);
	}

	saveData() {
		this.editor.project.changeResourceName(this.resource, this.inputName.getValue());
		this.updateTitle();

		this.resource.width = parseInt(this.inputWidth.getValue());
		this.resource.height = parseInt(this.inputHeight.getValue());
		this.resource.speed = parseInt(this.inputSpeed.getValue());

		this.resource.drawBackgroundColor = this.inputDrawBackgroundColor.getChecked();
		this.resource.backgroundColor = this.inputBackgroundColor.getValue();

		this.resource.enableViews = this.inputEnableViews.getChecked();

		// In GM, these ids are saved instantly. Even if you close and don't save the room, it still uses the ids. In this project, ideally resource editors would only change the project when you press ok or apply. Because of that, we create the ProjectInstances without ids, and only when saving we fill in the ids.
		// lol ignore this its all saved babye

		for (const instance of this.resource.instances) {
			if (instance.id == null) {
				this.editor.project.lastId += 1;
				instance.id = this.editor.project.lastId;
			}
		}
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);

		this.editor.project.changeResourceName(this.resource, this.resource.name);
		this.updateTitle();
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	updateTitle() {
		this.setTitle("Room Properties: "+this.resource.name);
	}

	// Objects

	addInstance() {
		if (this.selectObject.getValue() == -1) return null;

		const i = new ProjectInstance();
		i.x = this.currentPos.x;
		i.y = this.currentPos.y;
		i.object_index = this.selectObject.getValue();

		this.resource.instances.push(i);
		return i;
	}

	deleteUnderlying() {
		if (this.inputDeleteUnderlying.getChecked()) {
			for (let i = this.resource.instances.length - 1; i >= 0; i--) {
				const instance = this.resource.instances[i];
				if (instance != this.movingInstance && this.isInstanceAtPosition(instance, this.currentPos)) {
					this.resource.instances.splice(i, 1);
				}
			}
		}
	}

	getInstanceAtPosition(pos) {
		for (let i = this.resource.instances.length - 1; i >= 0; i--) {
			const instance = this.resource.instances[i];
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
				w = sprite.images[0].width;
				h = sprite.images[0].height;
			} else {
				// On GM, if there's no images, it just defaults to 32x32. A possible improvement would be to either simply show the default image anyway, or use the grid size. Right now I'll just use 32x32 anyway.
			}
		} else {
			w = this.defaultInstanceImage.width;
			h = this.defaultInstanceImage.height;
		}

		const x1 = instance.x - ox;
		const y1 = instance.y - oy;
		const x2 = x1 + w;
		const y2 = y1 + h;

		return (pos.x >= x1 && pos.x < x2 && pos.y >= y1 && pos.y < y2);
	}

	// Backgrounds

	getBackground(index) {
		return this.resource.backgrounds[index] ?? new ProjectRoomBackground();
	}

	getOrCreateBackground(index) {
		if (this.resource.backgrounds[index] == null) {
			this.resource.backgrounds[index] = new ProjectRoomBackground(); // default values used
		}
		return this.resource.backgrounds[index];
	}

	getOrCreateCurrentBackground() {
		const currentBackgroundId = this.selectBackgrounds.getValue();
		if (this.resource.backgrounds[currentBackgroundId] == null) {
			this.resource.backgrounds[currentBackgroundId] = new ProjectRoomBackground();
		}
		return this.resource.backgrounds[currentBackgroundId];
	}

	updateBackgroundProperties() {
		const currentBackground = this.getBackground(this.selectBackgrounds.getValue());

		this.inputBackgroundVisibleAtStart.setChecked(currentBackground.visibleAtStart);
		this.inputForeground.setChecked(currentBackground.isForeground);
		this.selectResourceBackground.setValue(currentBackground.backgroundIndex);
		this.inputTileHorizontally.setChecked(currentBackground.tileHorizontally);
		this.inputTileVertically.setChecked(currentBackground.tileVertically);
		this.inputStretch.setChecked(currentBackground.stretch);
		this.inputX.setValue(currentBackground.x);
		this.inputY.setValue(currentBackground.y);
		this.inputHorizontalSpeed.setValue(currentBackground.horizontalSpeed);
		this.inputVerticalSpeed.setValue(currentBackground.verticalSpeed);
	}

	// Views

	getView(index) {
		return this.resource.views[index] ?? new ProjectRoomView();
	}

	getOrCreateView(index) {
		if (this.resource.views[index] == null) {
			this.resource.views[index] = new ProjectRoomView(); // default values used
		}
		return this.resource.views[index];
	}

	getOrCreateCurrentView() {
		return this.getOrCreateView(this.selectViews.getValue());
	}

	updateViewProperties() {
		const currentView = this.getView(this.selectViews.getValue());

		this.inputViewVisibleAtStart.setChecked(currentView.visibleAtStart);
		this.inputViewX.setValue(currentView.viewX);
		this.inputViewY.setValue(currentView.viewY);
		this.inputViewW.setValue(currentView.viewW);
		this.inputViewH.setValue(currentView.viewH);
		this.inputPortX.setValue(currentView.portX);
		this.inputPortY.setValue(currentView.portY);
		this.inputPortW.setValue(currentView.portW);
		this.inputPortH.setValue(currentView.portH);
	}

	// Preview

	async updateCanvasPreview() {
		// Setting the size resets the background to black, in case 'draw background color' isn't on.
		this.canvasPreview.html.width = this.inputWidth.getValue();
		this.canvasPreview.html.height = this.inputHeight.getValue();

		this.ctx.imageSmoothingEnabled = false;

		if (this.inputDrawBackgroundColor.getChecked()) {
			this.ctx.fillStyle = this.inputBackgroundColor.getValue();
			this.ctx.fillRect(0, 0, this.canvasPreview.html.width, this.canvasPreview.html.height);
		}

		// backgrounds
		for (const roomBackground of this.resource.backgrounds) {
			if (!roomBackground) continue;
			if (roomBackground.isForeground == true) continue;
			await this.drawRoomBackground(roomBackground);
		}

		// instance
		for (const roomInstance of this.resource.instances) {
			await this.drawRoomInstance(roomInstance);
		}

		// foregrounds
		for (const roomBackground of this.resource.backgrounds) {
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

		await image.promise;

		let xStart = roomBackground.x;
		let yStart = roomBackground.y;

		const width = roomBackground.stretch ? this.canvasPreview.html.width : background.image.width;
		const height = roomBackground.stretch ? this.canvasPreview.html.height : background.image.height;

		if (roomBackground.tileHorizontally) {
			xStart = (roomBackground.x % width) - width;
		}
		if (roomBackground.tileVertically) {
			yStart = (roomBackground.y % height) - height;
		}

		for (let x = xStart; x < this.canvasPreview.html.width; x += width) {
			for (let y = yStart; y < this.canvasPreview.html.height; y += height) {
				this.ctx.drawImage(image.image, x, y, width, height);

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

	canvasMouseDown(e) {
		const pos = this.getMousePosition(e);
		const snappedPos = this.snapMousePosition(pos);

		this.currentPos = e.altKey ? pos : snappedPos;
		this.mouseButton = e.button;

		if (this.mouseButton == 0) {
			if (e.ctrlKey) {
				// Move
				const hover = this.getInstanceAtPosition(pos);
				if (hover) {
					this.movingInstance = hover;
				}
			} else
			if (e.shiftKey) {
				// Add multiple
				this.movingInstance = this.addInstance();
				this.deleteUnderlying();
				this.onUpdate();
			} else {
				// Add
				this.movingInstance = this.addInstance();
				this.onUpdate();
			}
		} else if (this.mouseButton == 2) {
			if (e.ctrlKey) {
				// Menu
			} else
			if (e.shiftKey) {
				// Delete all
				this.resource.instances = this.resource.instances.filter(instance => !this.isInstanceAtPosition(instance, pos));
				this.onUpdate();
			} else {
				// Delete
				this.movingInstance = null;
				const hover = this.getInstanceAtPosition(pos);
				if (hover) {
					this.resource.instances = this.resource.instances.filter(i => i != hover);
					this.onUpdate();
				}
			}
		}

		this.updateCanvasPreview();
	}

	canvasMouseMove(e) {
		const pos = this.getMousePosition(e);
		const snappedPos = this.snapMousePosition(pos);

		this.currentPos = e.altKey ? pos : snappedPos;

		if (this.mouseButton == 0) {
			if (e.ctrlKey) {
				// Move
				if (this.movingInstance) {
					this.movingInstance.x = this.currentPos.x;
					this.movingInstance.y = this.currentPos.y;
					this.onUpdate();
				}
			} else
			if (e.shiftKey) {
				// Add multiple
				const hover = this.getInstanceAtPosition(pos);
				if (hover != this.movingInstance) {
					this.movingInstance = this.addInstance();
					this.deleteUnderlying();
					this.onUpdate();
				}
			} else {
				// Add
				if (this.movingInstance) {
					this.movingInstance.x = this.currentPos.x;
					this.movingInstance.y = this.currentPos.y;
					this.onUpdate();
				}
			}
		} else if (this.mouseButton == 2) {
			if (e.ctrlKey) {
				// Menu
			} else
			if (e.shiftKey) {
				// Delete all
				this.resource.instances = this.resource.instances.filter(instance => !this.isInstanceAtPosition(instance, pos));
				this.onUpdate();
			} else {
				// Delete
				this.movingInstance = null;
				const hover = this.getInstanceAtPosition(pos);
				if (hover) {
					this.resource.instances = this.resource.instances.filter(i => i != hover);
					this.onUpdate();
				}
			}
		}

		this.updateCanvasPreview();

		this.spanX.html.textContent = this.currentPos.x;
		this.spanY.html.textContent = this.currentPos.y;
		this.spanObject.html.textContent = "";
		this.spanId.html.textContent = "";

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

	canvasMouseUp() {
		this.mouseButton = null;

		if (this.movingInstance) {
			this.deleteUnderlying();
			this.onUpdate();

			this.movingInstance = null;
			this.updateCanvasPreview();
		}
	}

	getMousePosition(e) {
		return {x: e.offsetX, y: e.offsetY};
	}

	snapMousePosition(pos) {
		const snapX = Math.max(1, parseInt(this.inputSnapX.getValue()) || 0);
		const snapY = Math.max(1, parseInt(this.inputSnapY.getValue()) || 0);

		return {
			x: Math.floor(pos.x / snapX) * snapX,
			y: Math.floor(pos.y / snapY) * snapY,
		};
	}

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to ${this.resource.name}?`)) return;
			this.restoreData();
		}

		super.close();
	}
}