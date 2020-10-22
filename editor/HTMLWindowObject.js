class HTMLWindowObject extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(object) {

		this.htmlTitle.textContent = 'Edit Object '+object.name;
		this.htmlActionWindows = [];

		// make a copy of the events and actions inside
		this.paramEvents = object.events.map(event => {
			var newevent = new ProjectEvent(event.type, event.subtype);
			newevent.actions = event.actions.map(action => {
				var newaction = new ProjectAction();
				newaction.typeLibrary = action.typeLibrary;
				newaction.typeId = action.typeId;
				newaction.typeKind = action.typeKind;
				newaction.typeExecution = action.typeExecution;
				newaction.typeExecutionFunction = action.typeExecutionFunction;
				newaction.typeExecutionCode = action.typeExecutionCode;
				newaction.typeIsQuestion = action.typeIsQuestion;

				newaction.args = [...action.args];

				newaction.appliesTo = action.appliesTo;
				newaction.relative = action.relative;
				newaction.not = action.not;

				return newaction;
			})
			return newevent;
		})
		// you know, fuck javascript

		this.selectEventsOptions = {}; //<option>s inside event <select>
		this.selectActionsOptions = {}; //<option>s inside action <select>

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

					// // Events

					this.selectEvents = add( newSelect('events', 'Events:') ).$('select');
					this.selectEvents.size = 2;

					// Update actions select when changing events
					this.selectEvents.onchange = () => this.updateSelectActions();

					// // Add event

					this.selectEventType = add( newSelect(null, 'Event type:', Events.listEventTypes) ).$('select');

					// Update event subtype div when changing type
					this.selectEventType.onchange = () => this.updateDivEventSubtype();

					this.divEventSubtype = add( html('div') );

					// Add event button
					var buttonEventAdd = add( newButton(null, 'Add event', () => {

						var eventType = this.selectEventType.value;
						var eventSubtype = 0;

						if (this.subtypeElement)
							eventSubtype = this.subtypeElement.value;

						if (this.paramEvents.find(x => x.type == eventType && x.subtype == eventSubtype)) {
							return;
						}

						var event = new ProjectEvent();
						event.type = eventType;
						event.subtype = eventSubtype;
						this.paramEvents.push(event);

						this.sortEvents();
						this.updateSelectEvents();

						this.selectEvents.value = event.getNameId();
						this.updateSelectActions();

					}) )

					// Delete event button
					var buttonEventDelete = add( newButton(null, 'Delete event', () => {

						var index = this.paramEvents.findIndex(event => this.selectEvents.value == event.getNameId());
						if (index < 0) return;

						// if (this.paramEvents[index].actions.length > 0) 
						// if (!confirm("Are you sure you want to remove the event with all its actions?"))
						// 	return;

						this.paramEvents.splice(index, 1);

						remove(this.selectEventsOptions[this.selectEvents.value])

						this.selectActions.textContent = '';

					}) )

					endparent();

				parent( add( newElem(null, 'div') ) ) // Actions area

					// // Actions

					this.selectActions = add( newSelect('actions', 'Actions:') ).$('select');
					this.selectActions.size = 2;

					var buttonActionEdit = add( newButton(null, 'Edit action', () => {
						var event = this.paramEvents.find(event => this.selectEvents.value == event.getNameId());
						if (!event) return;
						var action = event.actions.find((action,i) => i == this.selectActions.selectedIndex);
						if (!action) return;

						this.openActionWindow(action);
					}) )

					var buttonActionDelete = add( newButton(null, 'Delete action', () => {
						var event = this.paramEvents.find(event => this.selectEvents.value == event.getNameId());
						if (!event) return;
						var action = event.actions.find((action,i) => i == this.selectActions.selectedIndex);
						if (!action) return;

						remove(this.selectActionsOptions[this.selectActions.selectedIndex]);
						delete this.selectActionsOptions[this.selectActions.selectedIndex];

						var w = this.htmlActionWindows.find(x => x.id == action);
						if (w) {w.close();}

						event.actions.splice(this.selectActions.selectedIndex, 1);
					}) )

					endparent();

				parent( add( newElem(null, 'div') ) ) // Libraries area

					this.editor.libraries.forEach(library => {
						
						parent( add( newElem(null, 'fieldset') ) )

							add( newElem(null, 'legend', library.name) )

							library.items.forEach(actionType => {

								add( newButton(null, actionType.description, () => {

									var event = this.paramEvents.find(event => this.selectEvents.value == event.getNameId());
									if (!event) {
										alert("You need to select or add an event before you can add actions.");
										return;
									}

									var action = new ProjectAction();
									action.typeLibrary = library.name;
									action.typeId = actionType.id;
									action.typeKind = actionType.kind;
									action.typeExecution = actionType.execution;
									action.typeExecutionFunction = actionType.executionFunction;
									action.typeExecutionCode = actionType.executionCode;
									action.typeIsQuestion = actionType.isQuestion;

									action.appliesTo = -1;
									action.relative = false;
									action.not = false;

									if (actionType.kind == 'normal') {

										if (actionType.interfaceKind == 'none') {
											action.args = [];
										} else if (actionType.interfaceKind == 'arrows') {
											action.args = ["000000000", 0];
										} else if (['code', 'text'].includes(actionType.interfaceKind)) {
											action.args = [''];
										} else if (actionType.interfaceKind == 'normal') {
											action.args = actionType.args.map(arg => arg.default);
										}

									} else if (actionType.kind == 'repeat') {
										action.args = [1];
									} else if (actionType.kind == 'variable') {
										action.args = ['', '0'];
									} else if (actionType.kind == 'code') {
										action.args = [''];
									}

									this.openActionWindow(action);

									event.actions.push(action);

									parent(this.selectActions);
										this.selectActionsOptions[event.actions.length -1]
											= add( html('option', {
												/*value: action.getNameId(),*/
												title: actionType.getHintText(action),
											}, null, actionType.getListText(action)) )
										endparent();

								}) )

							})

							endparent()

					})

					endparent();

				endparent();

			// Add initial events
			this.updateSelectEvents();

			// Select first event
			this.selectEvents.selectedIndex = 0;
			this.updateSelectActions();

			// Add initial subtypes
			this.updateDivEventSubtype();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(object, inputName.value);
					this.editor.changeObjectSprite(object, parseInt(selectSprite.value));
					object.visible = inputVisible.checked;
					object.solid = inputSolid.checked;
					object.depth = parseInt(inputDepth.value);
					object.persistent = inputPersistent.checked;
					this.htmlActionWindows.forEach(w => {
						w.apply();
					})

					object.events = this.paramEvents;
					// changes here
				},
				() => {
					this.close();
				}
			);
			endparent();
	}

	sortEvents() {
		this.paramEvents.sort((a, b) => {

			var aTypeId = Events.listEventTypes.find(x => x.value == a.type).id;
			var bTypeId = Events.listEventTypes.find(x => x.value == b.type).id;

			var compareTypeId = aTypeId - bTypeId;
			if (compareTypeId != 0) return compareTypeId;

			var aSubtypeId = a.subtype;
			var bSubtypeId = b.subtype;
			
			var compareSubtypeId = aSubtypeId - bSubtypeId;
			return compareSubtypeId;

		})
	}

	updateSelectEvents() {

		this.selectEvents.textContent = '';
		this.selectEventsOptions = {};

		parent( this.selectEvents );
			this.paramEvents.forEach(event => {
				this.selectEventsOptions[event.getNameId()] = add( html('option',
					{value: event.getNameId()}, null, Events.getEventName(event, this.editor.project)) )
			})
			endparent();

	}

	updateDivEventSubtype() {

		this.divEventSubtype.textContent = '';
		var eventType = this.selectEventType.value;

		parent(this.divEventSubtype);

			this.subtypeElement = null;

			if (eventType == 'step') {
				this.subtypeElement = add( newSelect(null, 'Step:',
					Object.keys(Events.listStepSubtypes).map(x => ({value: x, name: Events.listStepSubtypes[x]}))
				)).$('select');
			} else

			if (eventType == 'alarm') {
				this.subtypeElement = add( newNumberBox(null, 'Alarm:', 0, 1, 0, 11) ).$('input');
			} else

			if (eventType == 'keyboard' || eventType == 'keypress' || eventType == 'keyrelease') {
				this.subtypeElement = add( newNumberBox(null, 'Key:', 0, 1, 0) ).$('input');
			} else

			if (eventType == 'mouse') {
				this.subtypeElement = add( newSelect(null, 'Mouse:',
					Object.keys(Events.listMouseSubtypes).map(x => ({value: x, name: Events.listMouseSubtypes[x]}))
				)).$('select');
			} else

			if (eventType == 'collision') {
				this.subtypeElement = add( this.makeResourceSelect(null, 'Object:', 'ProjectObject', true) ).$('select');
			} else

			if (eventType == 'other') {
				this.subtypeElement = add( newSelect(null, 'Other:',
					Object.keys(Events.listOtherSubtypes).map(x => ({value: x, name: Events.listOtherSubtypes[x]}))
				)).$('select');
			}

			endparent()
		
	}

	updateSelectActions() {

		this.selectActions.textContent = '';

		var event = this.paramEvents.find(event => this.selectEvents.value == event.getNameId());

		if (event) {
			parent(this.selectActions);
				event.actions.forEach((action, i) => {

					var actionType = this.editor.getActionType(action);

					//this.selectActionsOptions[event.actions.length -1]
					//		= add( html('option', {
					//			/*value: action.getNameId(),*/
					//			title: actionType.getHintText(action),
					//		}, null, actionType.getListText(action)) )

					this.selectActionsOptions[i] = add( html('option', {/*value: action.getNameId(),*/ title: actionType.getHintText(action)}, null, actionType.getListText(action)) )
				})
				endparent()
		}

	}

	openActionWindow(action) {
		// this.htmlActionWindows.find(x => x == w)

		var actionType = this.editor.getActionType(action.typeLibrary, action.typeId);

		var htmlclass;

		if (actionType.kind == 'normal') {
			if (['normal', 'none', 'arrows'].includes(actionType.interfaceKind)) {
				htmlclass = HTMLWindowAction;
			} else if (['code', 'text'].includes(actionType.interfaceKind)) {
				htmlclass = HTMLWindowCode;
			}
		} else if (actionType.kind == 'repeat') {
			// ???
			htmlclass = HTMLWindowAction;
		} else if (actionType.kind == 'variable') {
			// ???
			htmlclass = HTMLWindowAction;
		} else if (actionType.kind == 'code') {
			htmlclass = HTMLWindowCode;
		}

		if (htmlclass) {
			var w = this.editor.openWindow(htmlclass, action, action, this);
			if (w) {
				this.htmlActionWindows.push(w);
			}
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
}