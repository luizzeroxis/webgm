class GML {

	constructor() {

		let _this = this; //fuck javascript

		this.vars = {};
		this.currentInstance = null;
		this.game = null;
		this.gameShouldEnd = false;

		//ohm is a global variable created by ohm.js.

		this.grammar = ohm.grammar(GMLGrammar.getText());
		this.semantics = this.grammar.createSemantics();

		this.semantics.addOperation('interpret', {

			Block(_0, _listOfStatements, _2) {
				return _listOfStatements.interpret();
			},
			Statement (_statementNoSemicolon, _1) {
				return _statementNoSemicolon.interpret();
			},
			If(_0, _conditionExpression, _code, _elseStatement) {
				var condition = _conditionExpression.interpret();
				if (typeof condition !== "number") {
					_this.game.throwFatalError('Expression expected (condition "' + condition.toString() + '" is not a number)');
				}
				if (condition > 0) {
					_code.interpret();
				} else {
					_elseStatement.interpret();
				}
			},
			Else(_0, _code) {
				return _code.interpret();
			},
			While(_0, _conditionExpression, _code) {
				var condition = _conditionExpression.interpret();
				if (typeof condition !== typeof 1) {
					_this.game.throwFatalError('Expression expected (condition "' + condition.toString() + '" is not a number)');
				}
				while (condition) {
					_code.interpret();
					condition = _conditionExpression.interpret();
					if (typeof condition !== typeof 1) {
						_this.game.throwFatalError('Expression expected (condition "' + condition.toString() + '" is not a number)');
						break;
					}
				}
			},
			Exit(_0) {
				// TODO
			},
			Function (_name, _1, _args, _3) {

				var name = _name.sourceString;
				var args = _args.asIteration().interpret();

				var script = _this.game.project.resources['ProjectScript'].find(x => x.name == name);

				if (script) {

					// Store arguments
					var prevGlobalVariables = {};
					prevGlobalVariables.argument = _this.game.globalVariables.argument;
					prevGlobalVariables.argument_relative = _this.game.globalVariables.argument_relative;
					for (var i = 0; i < 16; i++) {
						prevGlobalVariables['argument' + i] = _this.game.globalVariables['argument' + i];
					}

					// Change arguments
					_this.game.globalVariables.argument = args;
					_this.game.globalVariables.argument_relative = 0;
					for (var i = 0; i < 16; i++) {
						_this.game.globalVariables['argument'+i] = (args[i] == null) ? 0 : args[i];
					}

					var r = _this.execute(_this.game.preparedCodes.get(script), _this.currentInstance);

					// Restore arguments
					Object.assign(_this.game.globalVariables, prevGlobalVariables);


					return r;
				} else {
					return _this.builtInFunction(name, args, _this.currentInstance);
				}

			},
			Less(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return (a < b) ? 1 : 0;
			},
			LessOrEqual(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return (a <= b) ? 1 : 0;
			},
			Equal(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return (a === b) ? 1 : 0;
			},
			Different(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return (a !== b) ? 1 : 0;
			},
			Greater(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return (a > b) ? 1 : 0;
			},
			GreaterOrEqual(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return (a >= b) ? 1 : 0;
			},
			// TODO check for type errors
			Add(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return a + b;
			},
			Subtract(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return a - b;
			},
			Multiply(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return a * b;
			},
			Divide(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return a / b;
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
			VariableGet(_variable) {
				var varInfo = _variable.interpret();

				var value = _this.getVariableValue(varInfo);
				if (value == undefined)
					_this.game.throwFatalError("No variable or constant called " + varInfo.name);

				return value;
			},
			Variable(_name) {
				// Currently just return the name, but in the future it will return some sort of reference so it can have a object, array index, etc. That means it will figure out globals and other things here.

				var varInfo = {};
				varInfo.name = _name.sourceString;
				varInfo.object = null;
				varInfo.arrayIndex = null;

				return varInfo;

			},
			Assignment(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();

				_this.setVariableValue(varInfo, value);
				
			},
			AssignmentAdd(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				
				var varOriginal = _this.getVariableValue(varInfo);
				if (varOriginal == undefined)
					_this.game.throwFatalError("No variable or constant called " + varInfo.name);

				var varNew = varOriginal + value;

				_this.setVariableValue(varInfo, varNew);
			},
			AssignmentSubtract(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				
				var varOriginal = _this.getVariableValue(varInfo);
				if (varOriginal == undefined)
					_this.game.throwFatalError("No variable or constant called " + varInfo.name);

				var varNew = varOriginal - value;

				_this.setVariableValue(varInfo, varNew);
			},
			AssignmentMultiply(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				
				var varOriginal = _this.getVariableValue(varInfo);
				if (varOriginal == undefined)
					_this.game.throwFatalError("No variable or constant called " + varInfo.name);

				var varNew = varOriginal * value;

				_this.setVariableValue(varInfo, varNew);
			},
			AssignmentDivide(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				
				var varOriginal = _this.getVariableValue(varInfo);
				if (varOriginal == undefined)
					_this.game.throwFatalError("No variable or constant called " + varInfo.name);

				var varNew = varOriginal * value;

				_this.setVariableValue(varInfo, varNew);
			},
			VarDeclare(_0, _names) {
				_names.asIteration().children.forEach(_name => {
					var name = _name.sourceString;
					if (_this.vars[name] == undefined) {
						_this.vars[name] = null;
					}
				});
			},
			GlobalVarDeclare(_, _names) {
				_names.asIteration().children.forEach(_name => {
					var name = _name.sourceString;
					if (_this.game.globalVariables[name] == undefined) {
						_this.game.globalVariables[name] = 0;
					}
				});
			},
		});

	}

	getVariableValue(varInfo) {
		var value;

		if (varInfo.object == null && varInfo.arrayIndex == null) {
			value = this.vars[varInfo.name];
			if (value == undefined)
				value = this.currentInstance.variables[varInfo.name];
			if (value == undefined)
				value = this.game.globalVariables[varInfo.name];
			if (value == undefined)
				value = this.game.constants[varInfo.name];
		}

		return value;
	}

	// Always check if returned false
	setVariableValue(varInfo, value) {

		if (varInfo.object == null && varInfo.arrayIndex == null) {
			if (this.vars[varInfo.name] !== undefined) {
				this.vars[varInfo.name] = value;
			} else if (this.currentInstance.variables[varInfo.name] !== undefined) {
				this.currentInstance.variables[varInfo.name] = value;
			} else if (this.game.globalVariables[varInfo.name] !== undefined) {
				this.game.globalVariables[varInfo.name] = value;
			} else if (this.game.constants[varInfo.name] !== undefined) {
				return false;
			} else {
				this.currentInstance.variables[varInfo.name] = value;
			}
		}

		return true;

	}

	setVariable(name, funcExpression) {
		if (name in this.vars) {
			this.vars[name] = funcExpression(this.vars[name]);
		} else
		// local vars
		if (name in this.currentInstance.variables) {
			this.currentInstance.variables[name] = funcExpression(this.currentInstance.variables[name]);
		} else
		// global vars
		if (name in this.game.globalVariables) {
			this.game.globalVariables[name] = funcExpression(this.game.globalVariables[name]);
		} else {
			return false;
		}
		return true;
	}

	prepare(code) {
		var trace = this.grammar.trace(code).toString();
		//console.log(trace);

		var match = this.grammar.match(code);
		//console.log(match);

		return match;
	}

	execute(preparedcode, inst) {

		//console.log('Interpreting...');

		if (preparedcode.succeeded()) {
			//console.log('Executing...');
			this.currentInstance = inst;
			var currentVars = this.vars;
			this.vars = {};
			this.semantics(preparedcode).interpret();
			this.vars = currentVars;

			if (this.game.shouldEnd) {
				this.game.gameEnd();
			}

			//console.log('Done.');

		} else {
			console.log(preparedcode.message)
			console.log("Some error was found in the GML!");
		}
	}

	builtInFunction(name, args, inst, relative) {

		var func = BuiltInFunctions[name];

		if (func) {
			this.currentInstance = inst;
			return func.call(this, args, relative);
		} else {
			this.game.throwFatalError('No such function called "'+name+'".');
		}
	}

}