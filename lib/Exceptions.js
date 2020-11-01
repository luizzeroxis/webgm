class WebGMException extends Error {
	constructor(...args) {
		super(...args);
		this.name = this.constructor.name;
	}
}

// Errors related to webgm itself (editor or runner catches it)
class EngineException extends WebGMException {}
// Errors related to parsing GML
class CompilationException  extends WebGMException {}
// Errors in the game that are fatal
class FatalErrorException extends WebGMException {}
// Errors in the game that are not fatal
class NonFatalErrorException extends WebGMException {}

// Not errors, but when there's a exit in the code or in the actions
class ExitException extends WebGMException {}