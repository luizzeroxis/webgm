class HTMLWindowObject extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(object) {
		this.htmlTitle.textContent = 'Edit Object '+object.name;
		this.htmlActionWindows = [];

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

					endparent()
				parent( add( newElem(null, 'div') ) )

					// events

					var selectEventsOptions = {};

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

						var index = paramEvents.findIndex(event => selectEvents.value == event.getNameId());
						if (index < 0) return;

						remove(selectEventsOptions[selectEvents.value])
						delete selectEventsOptions[selectEvents.value];

						paramEvents.splice(index, 1);

						selectActions.textContent = '';

						console.log(paramEvents);

						//selectEventsOptions[selectEve]
					}) )

					endparent();
				parent( add( newElem(null, 'div') ) )

					var selectActionsOptions = {};

					// actions
					var selectActions = parent( add( newSelect('actions', 'Actions:') ).$('select') );
						if (paramEvents.length > 0)
						paramEvents[0].actions.forEach((action, i) => {
							selectActionsOptions[i] = add( html('option', {/*value: action.getNameId()*/}, null, action.getName()) )
						})
						endparent();

					selectActions.size = 10;

					var buttonActionEdit = add( newButton(null, 'Edit action', () => {

						var event = paramEvents.find(event => selectEvents.value == event.getNameId());
						if (!event) return;
						var action = event.actions.find((action,i) => i == selectActions.selectedIndex);
						if (!action) return;

						this.htmlActionWindows.push(this.editor.openWindow(HTMLWindowCode, action, action, this));

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

						// TODO delete open action windows

					}) )

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

								var action = new ProjectAction(item);

								if (item.kind == "code") {
									this.htmlActionWindows.push(this.editor.openWindow(HTMLWindowCode, action, action, this));

								} else {

									var appliesTo, relative, not;

									if (item.hasAppliesTo) {}

									action.args = item.args.map(arg => {
										var v;
										if (arg.type == 'string') {
											v = prompt(arg.name);
										}
										return v;
									})

									if (item.hasRelative) {}
									if (item.hasNot) {}
									
									action.appliesTo = false;
									action.relative = false;
									action.not = false;
								}

								event.actions.push(action);

								parent(selectActions);
									selectActionsOptions[event.actions.length -1] = add( html('option', {/*value: action.getNameId()*/}, null, action.getName()) )
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