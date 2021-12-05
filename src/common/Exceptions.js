export class WebGMException extends Error {
	constructor(...args) {
		super(...args);
		this.name = this.constructor.name;
	}
}

// Errors related to webgm itself (editor or runner catches it)
export class EngineException extends WebGMException {}
// Errors related to parsing GML
export class CompilationException  extends WebGMException {}
// Errors in the game that are fatal
export class FatalErrorException extends WebGMException {}
// Errors in the game that are not fatal
export class NonFatalErrorException extends WebGMException {}

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