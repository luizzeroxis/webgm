class HTMLWindowObject extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(object) {

		this.defineEventTypes();

		this.htmlTitle.textContent = 'Edit Object '+object.name;
		this.htmlActionWindows = [];

		// make a copy of the events and actions inside
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

		var selectEventsOptions = {}; //<option>s inside event <select>
		var selectActionsOptions = {}; //<option>s inside action <select>

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-object', 'div') ) )

				parent( add( newElem(null, 'div') ) ) // Main area

					var inputName = add( newTextBox(null, 'Name:', object.name) ).$('input');

					var selectSprite = this.makeResourceSelect(null, 'Sprite:', 'ProjectSprite').$('select');
					selectSprite.value = object.sprite_index;

					var inputVisible = add( newCheckBox(null, 'Visible', object.visible) ).$('input');
					var inputSolid = add( newCheckBox(null, 'Solid', object.solid) ).$('input');
					var inputDepth = add( newNumberBox(null, 'Depth:', object.depth, 1) ).$('input');
					var inputPersistent = add( newCheckBox(null, 'Persistent', object.persistent) ).$('input');

					endparent()

				parent( add( newElem(null, 'div') ) ) // Events area

					// Initial creation of event options
					var selectEvents = parent( add( newSelect('events', 'Events:') ).$('select') );
						paramEvents.forEach(event => {
							selectEventsOptions[event.getNameId()] = add( html('option',
								{value: event.getNameId()}, null, this.getEventName(event)) )
						})
						endparent();

					selectEvents.size = 10;

					// Update actions select when changing events
					var updateSelectActions = () => {

						selectActions.textContent = '';

						var event = paramEvents.find(event => selectEvents.value == event.getNameId());

						if (event) {
							parent(selectActions);
								event.actions.forEach((action, i) => {
									selectActionsOptions[i] = add( html('option', {/*value: action.getNameId()*/}, null, action.getName()) )
								})
								endparent()
						}

					}
					selectEvents.onchange = () => updateSelectActions();

					var eventType = 'create';
					var eventSubtype = 0;

					var selectEventType = add( newSelect(null, 'Event type:', this.listEventTypes) ).$('select');

					var divEventSubtype = add( html('div') );

					var updateDivEventSubtype = () => {

						divEventSubtype.textContent = '';
						eventType = selectEventType.value;
						eventSubtype = 0;

						parent(divEventSubtype);

							var subtypeElement;

							if (eventType == 'step') {
								subtypeElement = add( newSelect(null, 'Step:',
									Object.keys(this.listStepSubtypes).map(x => ({value: x, name: this.listStepSubtypes[x]}))
								)).$('select');
							} else

							if (eventType == 'alarm') {
								subtypeElement = add( newNumberBox(null, 'Alarm:', 0, 1, 0, 11) ).$('input');
							} else

							if (eventType == 'keyboard' || eventType == 'keypress' || eventType == 'keyrelease') {
								subtypeElement = add( newNumberBox(null, 'Key:', 0, 1, 0) ).$('input');
							} else

							if (eventType == 'mouse') {
								subtypeElement = add( newSelect(null, 'Mouse:',
									Object.keys(this.listMouseSubtypes).map(x => ({value: x, name: this.listMouseSubtypes[x]}))
								)).$('select');
							} else

							if (eventType == 'collision') {
								subtypeElement = add( this.makeResourceSelect(null, 'Object:', 'ProjectObject', true) ).$('select');
							} else

							if (eventType == 'other') {
								subtypeElement = add( newSelect(null, 'Other:',
									Object.keys(this.listOtherSubtypes).map(x => ({value: x, name: this.listOtherSubtypes[x]}))
								)).$('select');
							}

							if (subtypeElement) {
								eventSubtype = subtypeElement.value;
								subtypeElement.onchange = () => {eventSubtype = subtypeElement.value};
							}

							endparent()
						
					}

					updateDivEventSubtype();
					selectEventType.onchange = () => updateDivEventSubtype();

					var buttonEventAdd = add( newButton(null, 'Add event', () => {

						if (paramEvents.find(x => x.type == eventType && x.subtype == eventSubtype)) {
							return;
						}

						var event = new ProjectEvent();
						event.type = eventType;
						event.subtype = eventSubtype;
						paramEvents.push(event);

						parent(selectEvents);
							selectEventsOptions[event.getNameId()]
								= add( html('option', {value: event.getNameId()}, null, this.getEventName(event)) )
							endparent();

						selectEvents.selectedIndex++; //can't believe this works
						updateSelectActions();

					}) )

					var buttonEventDelete = add( newButton(null, 'Delete event', () => {

						var index = paramEvents.findIndex(event => selectEvents.value == event.getNameId());
						if (index < 0) return;

						remove(selectEventsOptions[selectEvents.value])
						delete selectEventsOptions[selectEvents.value];

						paramEvents.splice(index, 1);

						selectActions.textContent = '';
					}) )

					endparent();

				parent( add( newElem(null, 'div') ) ) // Actions area

					// Initial creation of action options
					var selectActions = add( newSelect('actions', 'Actions:') ).$('select');

					updateSelectActions();

					selectActions.size = 10;

					var buttonActionEdit = add( newButton(null, 'Edit action', () => {
						var event = paramEvents.find(event => selectEvents.value == event.getNameId());
						if (!event) return;
						var action = event.actions.find((action,i) => i == selectActions.selectedIndex);
						if (!action) return;

						this.openActionWindow(action);
					}) )

					var buttonActionDelete = add( newButton(null, 'Delete action', () => {
						var event = paramEvents.find(event => selectEvents.value == event.getNameId());
						if (!event) return;
						var action = event.actions.find((action,i) => i == selectActions.selectedIndex);
						if (!action) return;

						remove(selectActionsOptions[selectActions.selectedIndex]);
						delete selectActionsOptions[selectActions.selectedIndex];

						var w = this.htmlActionWindows.find(x => x.id == action);
						if (w) {w.close();}

						event.actions.splice(selectActions.selectedIndex, 1);
					}) )

					endparent();

				parent( add( newElem(null, 'div') ) ) // Libraries area

					this.editor.libraries.forEach(library => {
						
						add( newElem(null, 'div', library.name) )

						library.items.forEach(item => {

							add( newButton(null, item.name, () => {

								var event = paramEvents.find(event => selectEvents.value == event.getNameId());
								if (!event) {
									alert("You need to select or add an event before you can add actions.");
									return;
								}

								var action = new ProjectAction(item, -1, false, false);

								this.openActionWindow(action);

								event.actions.push(action);

								parent(selectActions);
									selectActionsOptions[event.actions.length -1]
										= add( html('option', {/*value: action.getNameId()*/}, null, action.getName()) )
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
					object.solid = inputSolid.checked;
					object.depth = inputDepth.value;
					object.persistent = inputPersistent.checked;
					this.htmlActionWindows.forEach(w => {
						w.apply();
					})

					object.events = paramEvents;
					// changes here
				},
				() => {
					this.close();
				}
			);
			endparent();
	}

	openActionWindow(action) {
		this.htmlActionWindows.find(x => x == w)

		var htmlclass = (action.type.kind == "code") ? HTMLWindowCode : HTMLWindowAction

		var w = this.editor.openWindow(htmlclass, action, action, this);
		if (w) {
			this.htmlActionWindows.push(w);
		}
		
	}

	deleteActionWindow(w) {
		var index = this.htmlActionWindows.findIndex(x => x == w);
		if (index>=0) {
			this.editor.deleteWindow(w);
			this.htmlActionWindows.splice(index, 1);
		}
	}

	close() {
		super.close();
		this.htmlActionWindows.forEach(w => {
			this.editor.deleteWindow(w);
		})
	}

	defineEventTypes() {
		this.listEventTypes = [
			{value: 'create',     name: 'Create',      getFullName: () => 'Create'},
			{value: 'destroy',    name: 'Destroy',     getFullName: () => 'Destroy'},
			{value: 'step',       name: 'Step',        getFullName: (subtype) => this.listStepSubtypes[subtype]},
			{value: 'alarm',      name: 'Alarm',       getFullName: (subtype) => 'Alarm '+subtype},
			{value: 'keyboard',   name: 'Keyboard',    getFullName: (subtype) => 'Keyboard '+subtype},
			{value: 'mouse',      name: 'Mouse',       getFullName: (subtype) => this.listMouseSubtypes[subtype]},
			{value: 'collision',  name: 'Collision',   getFullName: (subtype) => 'Collision with '+ (this.editor.project.resources.ProjectObject.find(x => x.id == subtype).name)},
			{value: 'other',      name: 'Other',       getFullName: (subtype) => this.listOtherSubtypes[subtype]},
			{value: 'draw',       name: 'Draw',        getFullName: () => 'Draw'},
			{value: 'keypress',   name: 'Key press',   getFullName: (subtype) => 'Key press'+subtype},
			{value: 'keyrelease', name: 'Key release', getFullName: (subtype) => 'Key release'+subtype},
		];

		this.listStepSubtypes = {
			'normal': 'Step',
			'begin': 'Begin step',
			'end': 'End step',
		};
		this.listMouseSubtypes = {
			0: 'Left Button',
			1: 'Right Button',
			2: 'Middle Button',
			3: 'No Button',
			4: 'Left Press',
			5: 'Right Press',
			6: 'Middle Press',
			7: 'Left Release',
			8: 'Right Release',
			9: 'Middle Release',
			10: 'Mouse Enter',
			11: 'Mouse Leave',
			12: 'Global Press',
			13: 'Global Release',
			16: 'Joystick1 Left',
			17: 'Joystick1 Right',
			18: 'Joystick1 Up',
			19: 'Joystick1 Down',
			21: 'Joystick1 Button1',
			22: 'Joystick1 Button2',
			23: 'Joystick1 Button3',
			24: 'Joystick1 Button4',
			25: 'Joystick1 Button5',
			26: 'Joystick1 Button6',
			27: 'Joystick1 Button7',
			28: 'Joystick1 Button8',
			31: 'Joystick2 Left',
			32: 'Joystick2 Right',
			33: 'Joystick2 Up',
			34: 'Joystick2 Down',
			36: 'Joystick2 Button1',
			37: 'Joystick2 Button2',
			38: 'Joystick2 Button3',
			39: 'Joystick2 Button4',
			40: 'Joystick2 Button5',
			41: 'Joystick2 Button6',
			42: 'Joystick2 Button7',
			43: 'Joystick2 Button8',
			50: 'Global Left Button',
			51: 'Global Right Button',
			52: 'Global Middle Button',
			53: 'Global Left Press',
			54: 'Global Right Press',
			55: 'Global Middle Press',
			56: 'Global Left Release',
			57: 'Global Right Release',
			58: 'Global Middle Release',
			60: 'Mouse Wheel Up',
			61: 'Mouse Wheel Down',
		};
		this.listOtherSubtypes = {
			0: 'Outside',
			1: 'Boundary',
			2: 'Game start',
			3: 'Game end',
			4: 'Room start',
			5: 'Room end',
			6: 'No more lives',
			7: 'Animation end',
			8: 'End of path',
			9: 'No more health',
			10: 'User 0',
			11: 'User 1',
			12: 'User 2',
			13: 'User 3',
			14: 'User 4',
			15: 'User 5',
			16: 'User 6',
			17: 'User 7',
			18: 'User 8',
			19: 'User 9',
			20: 'User 10',
			21: 'User 11',
			22: 'User 12',
			23: 'User 13',
			24: 'User 14',
			25: 'User 15',
			30: 'Close button',
		}
	}

	getEventName (event) {
		return this.listEventTypes.find(x => x.value == event.type).getFullName(event.subtype);
	}
}