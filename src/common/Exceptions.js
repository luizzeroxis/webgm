export class WebGMException extends Error {
	constructor(messageOrObject) {
		if (typeof messageOrObject != "object") {
			super(messageOrObject);
		} else {
			if (messageOrObject.text) {
				super(messageOrObject.text);
			} else {
				super(JSON.stringify(messageOrObject));
			}
			Object.assign(this, messageOrObject);
		}
		this.name = this.constructor.name;
	}
}

// Errors related to webgm itself (editor or runner catches it)
export class EngineException extends WebGMException {}

// Errors in the user project
export class ProjectErrorException extends WebGMException {}

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

// Used when calling functions that require stopping the current step
export class StepStopException extends WebGMException {
	constructor(fn, ...args) {
		super(...args);
		this.fn = fn;
	}
}