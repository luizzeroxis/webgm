import ohm from 'ohm-js';

import VariableHolder from '../common/VariableHolder.js';

import {ExitException, ReturnException, BreakException, ContinueException} from '../common/Exceptions.js';

import GMLGrammar from './GMLGrammar.js';
import BuiltInFunctions from './BuiltInFunctions.js';

export default class GML {

	constructor(game) {
		this.game = game;

		let _this = this; //fuck javascript

		this.vars = new VariableHolder();
		this.currentInstance = null;

		this.grammar = ohm.grammar(GMLGrammar.getText());
		this.semantics = this.grammar.createSemantics();

		this.semantics.addOperation('interpret', {

			Start(_code) {
				_code.interpret();
				return 0;
			},
			Block(_0, _listOfStatements, _2) {
				return _listOfStatements.interpret();
			},
			Statement (_statementNoSemicolon, _1) {
				return _statementNoSemicolon.interpret();
			},
			If(_0, _conditionExpression, _code, _elseStatement) {
				var condition = _conditionExpression.interpret();
				_this.checkIsNumber(condition, 'Expression expected (condition "' + condition.toString() + '" is not a number)', _conditionExpression);
				
				if (_this.toBool(condition)) {
					_code.interpret();
				} else {
					_elseStatement.interpret();
				}
			},
			Else(_0, _code) {
				return _code.interpret();
			},
			While(_0, _conditionExpression, _code) {
				
				while (true) {

					var condition = _conditionExpression.interpret();
					_this.checkIsNumber(condition, 'Expression expected (condition "' + condition.toString() + '" is not a number)', _conditionExpression);

					if (!(_this.toBool(condition))) break;

					try {
						_code.interpret();
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					}
				}

			},
			Exit(_0) {
				throw new ExitException();
			},
			Return(_0, _value) {
				throw new ReturnException(_value.interpret());
			},
			Break(_0) {
				throw new BreakException();
			},
			Continue(_0) {
				throw new ContinueException();
			},
			Function (_name, _1, _args, _3) {

				var name = _name.sourceString;
				var args = _args.asIteration().interpret();

				var script = _this.game.project.resources.ProjectScript.find(x => x.name == name);

				if (script) {

					// Store arguments

					var savedArgument = _this.game.globalVars.save('argument');
					var savedArgumentNumbered = [];
					for (let i=0; i<16; i++) {
						savedArgumentNumbered[i] = _this.game.globalVars.save('argument' + i.toString());
					}
					var savedArgumentRelative = _this.game.globalVars.save('argument_relative');

					// Change arguments

					_this.game.globalVars.clear('argument'); // avoid spillage
					for (let i=0; i<16; i++) {
						var arg = (args[i] == null) ? 0 : args[i];
						_this.game.globalVars.setForce('argument', arg, [i]);
						_this.game.globalVars.setForce('argument' + i.toString(), arg);
					}
					_this.game.globalVars.setForce('argument_relative', 0);

					// Execute
					var result = _this.execute(_this.game.preparedCodes.get(script), _this.currentInstance);

					// Restore arguments

					_this.game.globalVars.load('argument', savedArgument);
					for (var i=0; i<16; i++) {
						_this.game.globalVars.load('argument' + i.toString(), savedArgumentNumbered[i]);
					}
					_this.game.globalVars.load('argument_relative', savedArgumentRelative);

					return result;
				} else {
					return _this.builtInFunction(name, args, _this.currentInstance);
				}

			},
			Not(_0, _a) {
				var a = _this.toBool(_this.checkIsNumber(_a.interpret(), "Wrong type of arguments to unary operator.", _a));
				return (!a) ? 1 : 0;
			},
			Negate(_0, _a) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments to unary operator.", _a);
				return (-a);
			},
			NegateBitwise(_0, _a) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments to unary operator.", _a);
				return (~a);
			},
			And(_a, _1, _b) {
				var a = _this.toBool(_this.checkIsNumber(_a.interpret(), "Wrong type of arguments for &&.", _a));
				var b = _this.toBool(_this.checkIsNumber(_b.interpret(), "Wrong type of arguments for &&.", _b));
				return (a && b) ? 1 : 0;
			},
			Or(_a, _1, _b) {
				var a = _this.toBool(_this.checkIsNumber(_a.interpret(), "Wrong type of arguments for ||.", _a));
				var b = _this.toBool(_this.checkIsNumber(_b.interpret(), "Wrong type of arguments for ||.", _b));
				return (a || b) ? 1 : 0;
			},
			Xor(_a, _1, _b) {
				var a = _this.toBool(_this.checkIsNumber(_a.interpret(), "Wrong type of arguments for ^^.", _a));
				var b = _this.toBool(_this.checkIsNumber(_b.interpret(), "Wrong type of arguments for ^^.", _b));
				return (a != b) ? 1 : 0;
			},
			Less(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				_this.checkIsSameType(a, b, "Cannot compare arguments.", _1);
				return (a < b) ? 1 : 0;
			},
			LessOrEqual(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				_this.checkIsSameType(a, b, "Cannot compare arguments.", _1);
				return (a <= b) ? 1 : 0;
			},
			Equal(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				_this.checkIsSameType(a, b, "Cannot compare arguments.", _1);
				return (a === b) ? 1 : 0;
			},
			Different(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				_this.checkIsSameType(a, b, "Cannot compare arguments.", _1);
				return (a !== b) ? 1 : 0;
			},
			Greater(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				_this.checkIsSameType(a, b, "Cannot compare arguments.", _1);
				return (a > b) ? 1 : 0;
			},
			GreaterOrEqual(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				_this.checkIsSameType(a, b, "Cannot compare arguments.", _1);
				return (a >= b) ? 1 : 0;
			},
			BitwiseAnd(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments for &.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments for &.", _b);
				return a & b;
			},
			BitwiseOr(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments for |.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments for |.", _b);
				return a | b;
			},
			BitwiseXor(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments for ^.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments for ^.", _b);
				return a ^ b;
			},
			BitwiseShiftLeft(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments for <<.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments for <<.", _b);
				return a << b;
			},
			BitwiseShiftRight(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments for >>.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments for >>.", _b);
				return a >> b;
			},
			Add(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				_this.checkIsSameType(a, b, "Wrong type of arguments to +.", _1);
				return a + b;
			},
			Subtract(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments to -.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments to -.", _b);
				return a - b;
			},
			Multiply(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments to *.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments to *.", _b);
				return a * b;
			},
			Divide(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments to /.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments to /.", _b);
				return a / b;
			},
			IntegerDivision(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments to div.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments to div.", _b);
				return Math.floor(a / b);
			},
			Modulo(_a, _1, _b) {
				var a = _this.checkIsNumber(_a.interpret(), "Wrong type of arguments to mod.", _a);
				var b = _this.checkIsNumber(_b.interpret(), "Wrong type of arguments to mod.", _b);
				return a % b; // TODO check negative numbers
			},
			Parentheses(_0, _expression, _2) {
				return _expression.interpret();
			},
			Number(_integer, _dot, _decimals) {
				return Number(_integer.sourceString + _dot.sourceString + _decimals.sourceString);
			},
			String(_0, _string, _1) {
				return _string.sourceString;
			},
			Variable(_name, _arrayIndexes) {
				var varInfo = {};
				varInfo.name = _name.sourceString;
				varInfo.object = null;
				varInfo.indexes = _arrayIndexes.interpret()[0];
				return varInfo;
			},
			VariableGet(_variable) {
				var varInfo = _variable.interpret();
				var value = _this.varGet(varInfo, _variable);
				return value;
			},
			ArrayIndexes(_0, _index1, _index2, _3) {
				var indexes = [];
				var index1 = _index1.interpret();
				indexes.push(_this.arrayIndexValidate(index1, _index1));

				var index2 = _index2.interpret();
				if (index2.length==1) {
					indexes.push(index2[0]);
				}

				return indexes;
			},
			ArrayIndex2(_0, _index) {
				return _this.arrayIndexValidate(_index.interpret(), _index);
			},
			Assignment(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				_this.varSet(varInfo, value, _variable);
			},

			// Note: In GM, assignment operations don't error out when they should, and they have weird behaviour. It's replicated here.
			AssignmentAdd(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				_this.varModify(varInfo, old => {
					if (typeof old === typeof value) {
						return old + value; // Works for both numbers (addition) and strings (concatenation).
					}
					return old;
				}, _variable);
			},
			AssignmentSubtract(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				_this.varModify(varInfo, old => {
					if (typeof old === 'number' && typeof value == 'number') {
						return old - value;
					}
					return old;
				}, _variable);
			},
			AssignmentMultiply(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				_this.varModify(varInfo, old => {
					if (typeof old === 'number' && typeof value == 'string') {
						// Yeah, wtf. *= repeats the string like in Python, but only if the original value was a real and the new one a string. I have no idea why.
						return value.repeat(old);
					}
					if (typeof old === 'number' && typeof value == 'number') {
						return old * value;
					}
					return old;
				}, _variable);
			},
			AssignmentDivide(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				_this.varModify(varInfo, old => {
					if (typeof old === 'number' && typeof value == 'number') {
						return old / value;
					}
					return old;
				}, _variable);
				// strings or different: keep old
			},
			VarDeclare(_0, _names) {
				_names.asIteration().children.forEach(_name => {
					var name = _name.sourceString;
					if (!_this.vars.exists(name)) {
						_this.vars.set(name, null);
					}
				});
			},
			GlobalVarDeclare(_, _names) {
				_names.asIteration().children.forEach(_name => {
					var name = _name.sourceString;
					if (!_this.game.globalVars.exists(name)) {
						_this.game.globalVars.set(name, 0);
					}
				});
			},
			_iter(...children) {
				return children.map(c => c.interpret());
			},
		});

	}

	varGet(varInfo, node) {

		if (this.game.constants[varInfo.name] != null)
			return this.game.constants[varInfo.name];

		if (this.vars.exists(varInfo.name))
			return this.vars.get(varInfo.name, varInfo.indexes);
		if (this.game.globalVars.exists(varInfo.name))
			return this.game.globalVars.get(varInfo.name, varInfo.indexes);
		if (this.currentInstance.vars.exists(varInfo.name))
			return this.currentInstance.vars.get(varInfo.name, varInfo.indexes);

		throw this.makeErrorInGMLNode("Unknown variable " + varInfo.name, node);

	}

	varSet(varInfo, value, node) {

		if (this.game.constants[varInfo.name] != null)
			throw this.makeErrorInGMLNode("Variable name expected. (it's a constant!)", node);

		if (this.vars.exists(varInfo.name))
			return this.vars.set(varInfo.name, value, varInfo.indexes);
		if (this.game.globalVars.exists(varInfo.name))
			return this.game.globalVars.set(varInfo.name, value, varInfo.indexes);
		if (this.currentInstance.vars.exists(varInfo.name))
			return this.currentInstance.vars.set(varInfo.name, value, varInfo.indexes);

		this.currentInstance.vars.set(varInfo.name, value, varInfo.indexes);

	}

	varModify(varInfo, valueFunc, node) {
		var oldValue = this.varGet(varInfo, node);
		var newValue = valueFunc(oldValue);
		this.varSet(varInfo, newValue, node);
	}

	arrayIndexValidate(index, node) {
		if (typeof index != "number")
			throw this.makeErrorInGMLNode("Wrong type of array index", node);
		if (index < 0)
			throw this.makeErrorInGMLNode("Negative array index", node);
		return index;
	}

	toBool(value) {
		return value>=0.5;
	}

	checkIsNumber(value, message, node) {
		if (typeof value !== "number") {
			throw this.makeErrorInGMLNode(message, node);
		}
		return value;
	}

	checkIsSameType(a, b, message, node) {
		if (typeof a !== typeof b) {
			throw this.makeErrorInGMLNode(message, node);
		}
	}

	prepare(code, startRule) {
		//var trace = this.grammar.trace(code).toString();
		//console.log(trace);

		var match = this.grammar.match(code, startRule);
		//console.log(match);

		return match;
	}

	execute(preparedCode, instance) {

		if (preparedCode.succeeded()) {

			this.currentInstance = instance;
			
			var savedVars = this.vars.saveAll();
			this.vars.clearAll();

			var result = 0;

			try {
				result = this.semantics(preparedCode).interpret();
			} catch (e) {
				if (e instanceof ExitException || e instanceof BreakException || e instanceof ContinueException) {
					// Nothing lol
				} else if (e instanceof ReturnException) {
					result = e.value;
				} else {
					throw e;
				}
			}

			this.vars.loadAll(savedVars);

			if (this.game.shouldEnd) {
				this.game.gameEnd();
			}

			return result;

		} else {
			console.log(preparedCode.message)
			console.log("Some error was found in the GML!");
		}

	}

	executeString(gml, instance) {
		return this.execute(this.prepare(gml), instance);
	}

	executeStringExpression(gml, instance) {
		return this.execute(this.prepare(gml, "Expression"), instance);
	}

	builtInFunction(name, args, instance, relative) {

		var func = BuiltInFunctions[name];

		if (func) {
			this.currentInstance = instance;
			return func.call(this, args, relative);
		} else {
			throw this.game.makeNonFatalError({
					type: 'unknown_function_or_script',
					functionOrScriptName: name,
				},
				'Unknown function or script: '+name
			);
		}
	}

	makeErrorInGMLNode(message, node, isFatal=false) {
		console.log(node);

		var index = node.source.startIdx;
		var lines = node.source.sourceString.split('\n');
		var totalLength = 0;

		for (var i = 0; i < lines.length; ++i) {
			var lineLength = lines[i].length + 1;
			totalLength += lineLength;
			if (totalLength >= index) {

				var lineNumber = i + 1;
				var gmlLine = lines[i];
				var position = (index - (totalLength - lineLength)) + 1;
				var arrowString = " ".repeat(position-1) + "^";

				break;
			}
		}

		return this.game.makeError(isFatal, {
				type: 'error_in_code',
				node: node,
				subType: message,
			},
			`Error in code at line ` + lineNumber + `:\n`
			+ gmlLine + `\n` + arrowString + `\n`
			+ `at position ` + position + `: ` + message + `\n`
		);
	}

}