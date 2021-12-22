export class WebGMException extends Error {
	constructor(...args) {
		super(...args);
		this.name = this.constructor.name;
	}
}

// Errors related to webgm itself (editor or runner catches it)
export class EngineException extends WebGMException {}

// Errors in the user project
export class ProjectErrorException extends WebGMException {
	constructor(object) {
		super(JSON.stringify(object)/*, options*/);
		Object.assign(this, object);
	}
}

// Errors in the game that are fatal
export class FatalErrorException extends ProjectErrorException {}
// Errors in the game that are not fatal
export class NonFatalErrorException extends ProjectErrorException {}

// Not errors, used for flow control.
export class ExitException extends WebGMException {}
export class ReturnException extends WebGMException {
	constructor(value, ...args) {
		super(...args);
		this.value = value;
	}
}
export class BreakException extends WebGMException {}
export class ContinueException extends WebGMException {}