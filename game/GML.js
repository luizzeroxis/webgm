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
			Variable(_name, _arrayIndex) {

				var varInfo = {};
				varInfo.name = _name.sourceString;
				varInfo.object = null;
				varInfo.arrayIndex = _arrayIndex.interpret()[0];
				return varInfo;

			},
			ArrayIndex(_0, _index, _2) {
				var index = _index.interpret();
				if (typeof index != "number")
					_this.game.throwFatalError("Wrong type of array index");
				if (index < 0)
					_this.game.throwFatalError("Negative array index");
				return index;
					
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

		if (varInfo.object == null) {
			value = this.vars[varInfo.name];
			if (value == undefined)
				value = this.currentInstance.variables[varInfo.name];
			if (value == undefined)
				value = this.game.globalVariables[varInfo.name];
			if (value == undefined)
				value = this.game.constants[varInfo.name];
		}

		if (value == undefined)
			return value;

		if (Array.isArray(value)) {
			// If has index, must be within array limits
			if (varInfo.arrayIndex != null) {
				if (varInfo.arrayIndex >= value.length)
					this.game.throwFatalError("Array index out of bounds");
				value = value[varInfo.arrayIndex];

			// If has no index, select first element
			} else {
				value = value[0];
			}
		} else {
			// Trying to access non array as array with index more than 0
			if (varInfo.arrayIndex > 0) {
				this.game.throwFatalError("Array index out of bounds");
			}
		}

		return value;
	}

	// Always check if returned false
	setVariableValue(varInfo, value) {

		if (varInfo.object == null) {
			if (this.vars[varInfo.name] !== undefined) {

				if (varInfo.arrayIndex == null)
					this.vars[varInfo.name] = value;
				else {
					this.vars[varInfo.name] = this.arraySet(
						this.vars[varInfo.name], varInfo.arrayIndex, value);
				}

			} else if (this.currentInstance.variables[varInfo.name] !== undefined) {

				if (varInfo.arrayIndex == null)
					this.currentInstance.variables[varInfo.name] = value;
				else {
					this.currentInstance.variables[varInfo.name] = this.arraySet(
						this.currentInstance.variables[varInfo.name], varInfo.arrayIndex, value);
				}

			} else if (this.game.globalVariables[varInfo.name] !== undefined) {

				if (varInfo.arrayIndex == null)
					this.game.globalVariables[varInfo.name] = value;
				else {
					this.game.globalVariables[varInfo.name] = this.arraySet(
						this.game.globalVariables[varInfo.name], varInfo.arrayIndex, value);
				}

			} else if (this.game.constants[varInfo.name] !== undefined) {
				return false;
			} else {
				
				if (varInfo.arrayIndex == null)
					this.currentInstance.variables[varInfo.name] = value;
				else {
					this.currentInstance.variables[varInfo.name] = this.arraySet(
						this.currentInstance.variables[varInfo.name], varInfo.arrayIndex, value);
				}

			}
		}

		return true;

	}

	arraySet(array, index, value) {
		if (!Array.isArray(array)) {
			array = [array];
		}
		array[index] = value;
		for (var i = 0; i < array.length; i++) {
			if (array[i] == undefined)
				array[i] = 0;
		}
		return array;
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