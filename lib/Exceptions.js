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

// 
// class ExitException extends WebGMException {}
