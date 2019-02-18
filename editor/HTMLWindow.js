class HTMLWindow {

	constructor(id) {

		this.id = id;
		this.html = parent( add( newElem('window', 'div') ) )

			parent( add( newElem('titlebar', 'div') ) )
				this.htmlTitle = add( newElem(null, 'span', '') )
				this.htmlCloseButton = add( newButton('closebutton right', 'Close') )
				endparent()

			this.htmlClient = parent( add( newElem('client', 'div') ) )
				endparent();
			endparent();
	}

	makeClientResource(resource, editor) {

		this.editor = editor;

		this.htmlCloseButton.onclick = () => this.editor.deleteResourceWindow(resource);

		var windowMakers = {};
		windowMakers[ProjectSprite.name] = (w) => this.makeClientSprite(resource);
		windowMakers[ProjectSound.name] = (w) => this.makeClientSound(resource);
		windowMakers[ProjectScript.name] = (w) => this.makeClientScript(resource);
		windowMakers[ProjectFont.name] = (w) => this.makeClientFont(resource);
		windowMakers[ProjectObject.name] = (w) => this.makeClientObject(resource);
		windowMakers[ProjectRoom.name] = (w) => this.makeClientRoom(resource);

		windowMakers[resource.classname]();

	}

	makeClientSprite(sprite) {

		this.htmlTitle.textContent = 'Edit Sprite '+sprite.name;

		parent(this.htmlClient)

			parent( add( newElem('grid-resource resource-sprite', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var paramName = sprite.name;
					var paramImages = sprite.images;
					var paramOriginX = sprite.originx;
					var paramOriginY = sprite.originy;

					var inputName = add( newTextBox(null, 'Name:', paramName) ).$('input');

					add( newButton(null, 'Load Sprite', () => {

						VirtualFileSystem.openDialog('image/*')
						.then(file => {

							console.log(file);

							paramImages[0] = new AbstractImage(file);
							// TODO check if there is errors or something

							imgSprite.src = paramImages[0].image.src;

							paramImages[0].promise.then(() => {
								divWidth.textContent = paramImages[0].image.width;
								divHeight.textContent = paramImages[0].image.height;
							})

						});

					}) )

					add( newButton(null, 'Edit Sprite', () => {
						// TODO open sprite subimage editor
					}) );

					parent( add( newElem(null, 'div', 'Width: ')) )
						var divWidth = add( newElem(null, 'span', '32') )
						endparent()

					parent( add( newElem(null, 'div', 'Height: ')) )
						var divHeight = add( newElem(null, 'span', '32') )
						endparent()

					if (sprite.images.length > 0) {
						sprite.images[0].promise.then(() => {
							divWidth.textContent = sprite.images[0].image.width;
							divHeight.textContent = sprite.images[0].image.height;
						})
					}

					parent( add( newElem(null, 'fieldset') ) )

						add( newElem(null, 'legend', 'Origin') )

						var inputOriginX = add( newNumberBox(null, 'X:', paramOriginX, 1, 0) ).$('input');
						var inputOriginY = add( newNumberBox(null, 'Y:', paramOriginY, 1, 0) ).$('input');

						endparent()

					endparent()

				parent( add( newElem('preview', 'div') ) )
					var imgSprite = add( newImage() )

					if (sprite.images.length > 0) {
						imgSprite.src = sprite.images[0].image.src;
					}
					endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(sprite, inputName.value);
					this.editor.changeSpriteImages(sprite, paramImages);
					this.editor.changeSpriteOrigin(sprite, inputOriginX.value, inputOriginY.value);
				},
				() => {
					this.editor.deleteResourceWindow(sprite);
				}
			);
			endparent();

	}

	makeClientSound(sound) {
		this.htmlTitle.textContent = 'Edit Sound '+sound.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-sound', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var inputName = add( newTextBox(null, 'Name:', sound.name) ).$('input');

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(sound, inputName.value);
					//
				},
				() => {
					this.editor.deleteResourceWindow(sound);
				}
			);
			endparent();

	}

	makeClientScript(script) {
		this.htmlTitle.textContent = 'Edit Script '+script.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-script', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var inputName = add( newTextBox(null, 'Name:', script.name) ).$('input');

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(script, inputName.value);
					// changes here
				},
				() => {
					this.editor.deleteResourceWindow(script);
				}
			);
			endparent();
	}

	makeClientFont(font) {
		this.htmlTitle.textContent = 'Edit Font '+font.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-font', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var inputName = add( newTextBox(null, 'Name:', font.name) ).$('input');

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(font, inputName.value);
					// changes here
				},
				() => {
					this.editor.deleteResourceWindow(font);
				}
			);
			endparent();
	}

	makeClientObject(object) {
		this.htmlTitle.textContent = 'Edit Object '+object.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-object', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					// main area

					var inputName = add( newTextBox(null, 'Name:', object.name) ).$('input');

					var selectSprite = this.makeResourceSelect(null, 'Sprite:', 'ProjectSprite').$('select');
					selectSprite.value = object.sprite_index;

					var inputVisible = add( newCheckBox(null, 'Visible', object.visible) ).$('input');
					var inputDepth = add( newNumberBox(null, 'Depth:', object.depth, 1) ).$('input');

					var paramEvents = object.events.map(event => {
						var newevent = new ProjectEvent(event.type, event.subtype);
						newevent.actions = event.actions.map(action => {
							var newaction = new ProjectAction(action.type, action.appliesTo, action.elative, action.not);
							newaction.args = action.args.slice(); // TODO will work?
							return newaction;
						})
						return newevent;
					})

					// you know, fuck javascript

					var selectEventsOptions = {};

					endparent()
				parent( add( newElem(null, 'div') ) )

					// events

					var selectEvents = parent( add( newSelect('events', 'Events:') ).$('select') );
						paramEvents.forEach(event => {
							selectEventsOptions[event.getNameId()] = add( html('option',
								{value: event.getNameId()}, null, event.getName()) )
						})
						endparent();

					selectEvents.size = 10;
					selectEvents.onchange = () => {

						selectActions.textContent = '';

						var event = paramEvents.find(event => selectEvents.value == event.getNameId());

						parent(selectActions);
							event.actions.forEach(action => {
								add( html('option', {/*value: action.getNameId()*/}, null, action.getName()) )
							})
							endparent()

					}

					var buttonEventAdd = add( newButton(null, 'Add event', () => {
						var type = prompt('Event type');
						var subtype = prompt('Event subtype');

						var event = new ProjectEvent();
						event.type = type;
						event.subtype = subtype;
						paramEvents.push(event)

						parent(selectEvents);
							selectEventsOptions[event.getNameId()] = add( html('option', {
								value: event.getNameId()
							}, null, event.getName()) )
							endparent();

					}) )
					var buttonEventDelete = add( newButton(null, 'Delete event', () => {
						//selectEventsOptions[selectEve]
					}) )

					endparent();
				parent( add( newElem(null, 'div') ) )

					// actions
					var selectActions = parent( add( newSelect('actions', 'Actions:') ).$('select') );
						if (paramEvents.length > 0)
						paramEvents[0].actions.forEach(action => {
							add( html('option', {/*value: action.getNameId()*/}, null, action.getName()) )
						})
						endparent();

					selectActions.size = 10;

					endparent();
				parent( add( newElem(null, 'div') ) )

					// action libraries
					this.editor.libraries.forEach(lib => {
						//lib.name
						add( newElem(null, 'div', lib.name) )

						lib.items.forEach(item => {

							add( newButton(null, item.name, () => {

								var event = paramEvents.find(event => selectEvents.value == event.getNameId());
								if (!event) return;

								// var appliesTo = prompt('Applies to');
								// var relative = prompt('Relative');
								// var not = prompt('NOT');
								var appliesTo, relative, not;
								
								var action = new ProjectAction( item, appliesTo, relative, not );
								action.args = ['eae'];
								event.actions.push(action);

								parent(selectActions);
									add( html('option', {/*value: action.getNameId()*/}, null, action.getName()) )
									endparent();

							}) )

						})
					})

					endparent();
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(object, inputName.value);
					this.editor.changeObjectSprite(object, selectSprite.value);
					object.visible = inputVisible.checked;
					object.depth = inputDepth.value;
					object.events = paramEvents;
					// changes here
				},
				() => {
					this.editor.deleteResourceWindow(object);
				}
			);
			endparent();
	}

	makeClientRoom(room) {
		this.htmlTitle.textContent = 'Edit Room '+room.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-room', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					// left area

					var paramInstances = room.instances.map(instance => {
						return new ProjectInstance(instance.x, instance.y, instance.object_index);
					});

					var inputName = add( newTextBox(null, 'Name:', room.name) ).$('input');
					var inputWidth = add( newNumberBox(null, 'Width:', room.width, 1, 1) ).$('input');
					var inputHeight = add( newNumberBox(null, 'Height:', room.height, 1, 1) ).$('input');

					var inputBackgroundColor = add( newColorBox(null, 'Background color:', room.background_color) ).$('input');
					inputBackgroundColor.onchange = () => {
						ctx.fillStyle = inputBackgroundColor.value;
						ctx.fillRect(0,0,canvas.width,canvas.height);
					}

					var selectObject = this.makeResourceSelect(null, 'Object:', 'ProjectObject').$('select');

					// view options
					var inputSnapX = add( newNumberBox(null, 'Snap X:', 16, 1, 1) ).$('input');
					var inputSnapY = add( newNumberBox(null, 'Snap Y:', 16, 1, 1) ).$('input');
					var inputShowGrid = add( newCheckBox(null, 'Show grid', true) ).$('input');

					endparent()
				parent( add( newElem('canvasarea', 'div') ) )

					// actual room area
					var canvas = add( newCanvas(null, room.width, room.height) );
					var ctx = canvas.getContext('2d');

					ctx.fillStyle = inputBackgroundColor.value;
					ctx.fillRect(0,0,canvas.width,canvas.height);

					canvas.onclick = (e) => {
						// add instance to room

						if (selectObject.value < 0) return
						var x = e.offsetX;
						var y = e.offsetY;
						paramInstances.push(new ProjectInstance(x, y, selectObject.value));
						console.log(paramInstances);

					}

					endparent();
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(room, inputName.value);
					room.width = inputWidth.value;
					room.height = inputHeight.value;
					room.background_color = inputBackgroundColor.value;
					room.instances = paramInstances;
				},
				() => {
					this.editor.deleteResourceWindow(room);
				}
			);
			endparent();
	}

	makeResourceSelect (classes, labelcontent, resourcetype) {

		var e = add( newSelect(classes, labelcontent) );

		var selectOptions = {};
		var select = parent(e.$('select'))

			add( html('option', {value: -1}, null, '<none>') )
			this.editor.project.resources[resourcetype].forEach(resource => {
				selectOptions[resource.id] = add( html('option', {value: resource.id}, null, resource.name) )
			})
			endparent();

		this.editor.dispatcher.listen({
			createResource: i => {
				if (i.classname != resourcetype) return;
				parent(select)
					selectOptions[i.id] = add( html('option', {value: i.id}, null, i.name) )
					endparent()
			},
			deleteResource: i => {
				if (i.classname != resourcetype) return;
				remove(selectOptions[i.id])
				delete selectOptions[i.id];
			},
			changeResourceName: i => {
				if (i.classname != resourcetype) return;
				selectOptions[i.id].textContent = i.name;
			}
		})

		return e;

	}

	makeApplyOkButtons(applyOkFunc, okFunc) {
		parent( add ( html('div') ) )

			add( newButton(null, 'Apply', () => {
				applyOkFunc();
			}) );

			add( newButton(null, 'Ok', () => {
				applyOkFunc();
				okFunc();
			}) );

			endparent()
	}

	remove() {
		remove(this.html);
	}

}