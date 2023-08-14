import {StepStopException, ExitException, ProjectErrorException} from "./Game.js";

export default class GameEvents {
	constructor(game) {
		this.game = game;

		this.state = {};

		this.actionNumber = null;

		this.mapOfEvents = new Map();
	}

	// Executes an event on an instance.
	async runEvent(event, instance, other=null) {
		if (event == null) return;

		const previousState = this.state;

		this.state = {
			event: event.event,
			object: event.object,
			instance: instance,
			other: other ?? instance,
		};

		try {
			await this.runActionsOf(event.event);
		} finally {
			this.state = previousState;
		}
	}

	// Execute a moment on an instance.
	async runMoment(moment, timeline, instance) {
		if (moment == null) return;

		const previousState = this.state;

		this.state = {
			moment: moment,
			timeline: timeline,
			instance: instance,
			other: instance,
		};

		try {
			await this.runActionsOf(moment);
		} finally {
			this.state = previousState;
		}
	}

	// Executes the list of actions of an event or a moment.
	async runActionsOf(key) {
		const actions = this.game.loadedProject.actionsCache.get(key);

		for (const action of actions) {
			try {
				await this.runAction(action);

				if (this.game.stepStopAction != null) {
					throw new StepStopException(this.game.stepStopAction);
				}
			} catch (e) {
				if (e instanceof ExitException) {
					break;
				} if (e instanceof ProjectErrorException) {
					await this.game.showError(e);
				} else {
					throw e;
				}
			}
		}
	}

	// Executes an action.
	async runAction(actionAst) {
		if (actionAst == null) return null;

		const previousActionNumber = this.actionNumber;
		this.actionNumber = actionAst.actionNumber;

		try {
			let applyToInstances;
			let otherInstance;

			if (actionAst.appliesTo != undefined) {
				applyToInstances = this.getApplyToInstances(actionAst.appliesTo);
				otherInstance = this.state.other;
				if (actionAst.appliesTo == -2) { // other
					otherInstance = this.state.instance;
				}
			}

			switch (actionAst.type) {
				case "executeFunction":
				case "executeCode":
					{
						let result = true;
						for (const applyToInstance of applyToInstances) {
							if (!applyToInstance.exists) continue;

							const args = [];
							for (const [i, x] of actionAst.args.entries()) {
								args.push(await this.parseActionArg(x, i, applyToInstance, otherInstance));
							}

							let currentResult;
							if (actionAst.type == "executeFunction") {
								currentResult = await this.game.gml.builtInFunction(actionAst.function, applyToInstance, otherInstance, args, actionAst.relative);
							} else {
								currentResult = await this.game.gml.execute(this.game.loadedProject.gmlCache.get(actionAst.action), applyToInstance, otherInstance, args, actionAst.relative);
							}

							if (typeof currentResult !== "number" || currentResult < 0.5) {
								result = false;
							}
						}

						return result;
					}

				case "if":
					{
						const result = await this.runAction(actionAst.condition);
						if (result) {
							await this.runAction(actionAst.ifTrue);
						} else {
							await this.runAction(actionAst.ifFalse);
						}
						break;
					}

				case "block":
					for (const blockActionAst of actionAst.actions) {
						await this.runAction(blockActionAst);
					}
					break;

				case "exit":
					throw new ExitException();

				case "repeat":
					{
						const times = await this.parseActionArg(actionAst.times, 0, this.state.instance, this.state.other);
						for (let i=0; i<times; i++) {
							await this.runAction(actionAst.actionAst);
						}
						break;
					}

				case "variable":
					for (const applyToInstance of applyToInstances) {
						if (!applyToInstance.exists) continue;
						await this.game.gml.execute(this.game.loadedProject.gmlCache.get(actionAst.action), applyToInstance, otherInstance);
					}
					break;

				case "code":
					for (const applyToInstance of applyToInstances) {
						if (!applyToInstance.exists) continue;
						await this.game.gml.execute(this.game.loadedProject.gmlCache.get(actionAst.action), applyToInstance, otherInstance);
					}
					break;
			}
		} finally {
			this.actionAst = previousActionNumber;
		}

		return null;
	}

	// Interpret apply to option, returns a list of instances that should be applied to.
	getApplyToInstances(appliesTo) {
		// -1 = self, -2 = other, 0>= = object index
		switch (appliesTo) {
			case -1:
				return [this.state.instance];
			case -2:
				return [this.state.other];
			default:
				return this.game.instances.filter(x => x.exists
					&& (x.objectIndex == appliesTo || this.game.objectIsAncestorByIndex(appliesTo, x.objectIndex)));
		}
	}

	// Interpret a action argument to its final value.
	async parseActionArg(arg, argNumber, instance, other) {
		if (arg.kind == "both") {
			if (arg.value[0] != "'" && arg.value[0] != "\"") {
				return arg.value;
			}
		}

		if (arg.kind == "both" || arg.kind == "expression") {
			// TODO check if this is really what gm is doing
			// TODO maybe compile all these codes beforehand

			const result = this.game.gml.compile(arg.value, "Expression");
			if (!result.succeeded) {
				throw this.game.makeError({fatal: true, text:
					`COMPILATION ERROR in argument ${argNumber}\n`
					+ `${result.matchResult.message}\n`,
				});
			}

			return await this.game.gml.execute(result.ast, instance, other);
		}

		// TODO maybe parse boolean

		return arg.value;
	}

	// Get an event that is in an object or its parents. Returns {event, object}
	getEventOfObject(object, type, subtype) {
		const event = object.events.find(x => (x.type == type) && (subtype ? (x.subtype == subtype) : true));
		if (event) return {event, object};

		const parent = this.game.project.getResourceById("ProjectObject", object.parent_index);
		if (parent) {
			return this.getEventOfObject(parent, type, subtype);
		}
		return null;
	}

	// Do the event of a type and subtype (optional) of an instance.
	runEventOfInstance(type, subtype, instance) {
		return this.runEvent(this.getEventOfObject(instance.object, type, subtype), instance);
	}

	// Generates this.mapOfEvents, a map containing all event-instance pairs that exist currently. It is structured like so:
	// Map(<event type>, Map(<event subtype>, {event, instance}))
	makeMapOfEvents() {
		const map = new Map();

		for (const instance of this.game.instances) {
			if (!instance.exists) continue;

			// outside: map, instance
			const findEvents = (object) => {
				object.events.forEach(event => {
					let subtypes = map.get(event.type);
					if (subtypes == undefined) {
						subtypes = new Map();
						map.set(event.type, subtypes);
					}

					let eventInstancePairs = subtypes.get(event.subtype);
					if (eventInstancePairs == undefined) {
						eventInstancePairs = [];
						subtypes.set(event.subtype, eventInstancePairs);
					}

					// maybe this is slow
					if (eventInstancePairs.find(x => x.instance == instance
						&& x.event.type == event.type && x.event.subtype == event.subtype)) {
						return;
					}
					eventInstancePairs.push({event: {event, object}, instance: instance});
				});

				const parent = this.game.project.getResourceById("ProjectObject", object.parent_index);
				if (parent) {
					findEvents(parent);
				}
			};

			findEvents(instance.object);
		}

		this.mapOfEvents = map;

		return map;
	}

	// From the map of events, get a list of event-instance pairs of that type, regardless of subtype.
	getEventsOfType(type) {
		const subtypes = this.mapOfEvents.get(type);
		if (!subtypes) return [];
		return [...subtypes.entries()];
	}

	// From the map of events, get a list of event-instance pairs of that type and subtype.
	getEventsOfTypeAndSubtype(type, subtype) {
		const subtypes = this.mapOfEvents.get(type);
		if (!subtypes) return [];
		const list = subtypes.get(subtype);
		if (!list) return [];
		return list;
	}
}