import {makeCSSFont} from "~/common/tools.js";

import ActionsParser from "./ActionsParser.js";
import {EngineException, ProjectErrorException} from "./Game.js";

export default class ProjectLoader {
	constructor(game, project) {
		this.game = game;
		this.project = project;

		this.collisionMasks = new Map();
		this.sounds = new Map();

		this.cssFontsCache = {
			"-1": makeCSSFont("Arial", 12, false, false),
		};

		this.actionsCache = new Map();

		this.gmlCache = new Map();
	}

	// Makes sure all resources are loaded, and parses GML code.
	loadProject() {
		const promises = [
			this.loadSprites(),
			this.loadSounds(),
			this.loadBackgrounds(),
			this.loadGML(),
		];

		this.loadFonts();
		this.loadActions();

		return Promise.all(promises);
	}

	// Return a list of promises of loading sprite images.
	loadSprites() {
		const promises = [];

		const offscreen = new OffscreenCanvas(0, 0);
		const offscreenCtx = offscreen.getContext("2d", {willReadFrequently: true});

		this.project.resources.ProjectSprite.forEach(sprite => {
			let prevMask;

			this.images.forEach((image, imageIndex) => {
				image.load();
				promises.push(image.promise
					.then(() => {
						const mask = sprite.getMaskIntoPrev(image, prevMask, offscreen, offscreenCtx);
						prevMask = mask;
						this.collisionMasks.set(image, mask);
					})
					.catch(e => {
						console.error(e);
						throw new EngineException("Could not load image " + imageIndex.toString() + " in sprite " + sprite.name);
					}),
				);
			});
		});

		return Promise.all(promises);
	}

	// Returns a list of promises of loading sounds.
	loadSounds() {
		const promises = [];
		this.project.resources.ProjectSound.forEach(sound => {
			if (!sound.sound) return;
			sound.sound.load();
			promises.push(sound.sound.promise
				.catch(() => {
					throw new EngineException("Could not load audio in sound " + sound.name);
				}));

			this.sounds.set(sound, {volume: sound.volume, audioNodes: []});
		});
		return Promise.all(promises);
	}

	// Returns a list of promises of loading background images.
	loadBackgrounds() {
		const promises = [];
		this.project.resources.ProjectBackground.forEach(background => {
			if (!background.image) return;
			background.image.load();
			promises.push(background.image.promise
				.catch(() => {
					throw new EngineException("Could not load image in background " + background.name);
				}));
		});
		return Promise.all(promises);
	}

	// Loads all fonts.
	loadFonts() {
		this.project.resources.ProjectFont.forEach(font => {
			this.cssFontsCache[font.id] = makeCSSFont(font.font, font.size, font.bold, font.italic);
		});
	}

	// Parse all action lists in events and timeline moments into action trees.
	loadActions() {
		this.loadActionsTimelines();
		this.loadActionsObjects();
	}

	// Parse all action lists in timelines.
	loadActionsTimelines() {
		this.project.resources.ProjectTimeline.every(timeline => {
			return timeline.moments.every(moment => {
				const parsedActions = new ActionsParser().parse(moment.actions);
				this.actionsCache.set(moment, parsedActions);
				return true;
			});
		});
	}

	// Parse all action lists in objects.
	loadActionsObjects() {
		this.project.resources.ProjectObject.every(object => {
			return object.events.every(event => {
				const parsedActions = new ActionsParser().parse(event.actions);
				this.actionsCache.set(event, parsedActions);
				return true;
			});
		});
	}

	// Compile all GML code, parsing it and checking for errors.
	async loadGML() {
		try {
			this.loadGMLScripts();
			this.loadGMLTimelines();
			this.loadGMLObjects();
			this.loadGMLRooms();
		} catch (e) {
			if (e instanceof ProjectErrorException) {
				await this.game.showError(e);
			}
		}
	}

	// Compile all GML inside of scripts.
	loadGMLScripts() {
		this.project.resources.ProjectScript.every(script => {
			return this.compileGMLAndCache(script.code, script, matchResult => {
				throw this.game.makeError({fatal: true, header: false, text:
					`\n`
					+ `___________________________________________\n`
					+ `COMPILATION ERROR in Script: ${script.name}\n`
					+ `\n`
					+ `${matchResult.message}\n`,
				});
			});
		});
	}

	// Compile all GML inside time lines.
	loadGMLTimelines() {
		this.project.resources.ProjectTimeline.every(timeline => {
			return timeline.moments.every(moment => {
				return moment.actions.every((action, actionNumber) => {
					return this.loadGMLAction(action, actionNumber, {moment, timeline});
				});
			});
		});
	}

	// Compile all GML inside objects.
	loadGMLObjects() {
		this.project.resources.ProjectObject.every(object => {
			return object.events.every(event => {
				return event.actions.every((action, actionNumber) => {
					return this.loadGMLAction(action, actionNumber, {event, object});
				});
			});
		});
	}

	// Compile this action
	loadGMLAction(action, actionNumber, location) {
		if (action.typeKind == "code") {
			return this.compileGMLAndCache(action.args[0].value, action, matchResult => {
				throw this.game.makeError({fatal: true, actionNumber, ...location, text:
					`COMPILATION ERROR in code action:\n`
					+ `${matchResult.message}\n`,
				});
			});
		} else if (action.typeKind == "normal" && action.typeExecution == "code") {
			return this.compileGMLAndCache(action.args[0].value, action, matchResult => {
				throw this.game.makeError({fatal: true, actionNumber, ...location, text:
					`COMPILATION ERROR in code action (in action type in a library):\n`
					+ `${matchResult.message}\n`,
				});
			});
		} else if (action.typeKind == "variable") {
			const name = action.args[0].value;
			const value = action.args[1].value;
			const assignSymbol = action.relative ? " += " : " = ";
			const code = name + assignSymbol + value;

			return this.compileGMLAndCache(code, action, matchResult => {
				throw this.game.makeError({fatal: true, actionNumber, ...location, text:
					`COMPILATION ERROR in code action (in variable set):\n`
					+ `${matchResult.message}\n`,
				});
			});
		}
		return true;
	}

	// Compile all GML inside rooms.
	loadGMLRooms() {
		this.project.resources.ProjectRoom.every(room => {
			if (!room.instances.every(instance => {
				return this.compileGMLAndCache(instance.creationCode, instance, matchResult => {
					throw this.game.makeError({fatal: true, header: false, text:
						`\n`
						+ `___________________________________________\n`
						+ `COMPILATION ERROR in creation code for instance ${instance.id} in room ${room.name}\n`
						+ `\n`
						+ `${matchResult.message}\n`,
					});
				});
			})) return false;

			return this.compileGMLAndCache(room.creationCode, room, matchResult => {
				throw this.game.makeError({fatal: true, header: false, text:
					`\n`
					+ `___________________________________________\n`
					+ `COMPILATION ERROR in creation code of room ${room.name}\n`
					+ `\n`
					+ `${matchResult.message}\n`,
				});
			});
		});
	}

	// Compiles a GML code string and stores the result in a cache. mapKey is used when accessing gmlCache.
	compileGMLAndCache(code, mapKey, failureFunction) {
		const result = this.game.gml.compile(code);
		if (result.succeeded) {
			this.gmlCache.set(mapKey, result.ast);
			return true;
		} else {
			failureFunction(result.matchResult);
			return false;
		}
	}
}