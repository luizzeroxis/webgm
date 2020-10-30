class GML {

	constructor(game) {
		this.game = game;

		let _this = this; //fuck javascript

		this.vars = {};
		this.currentInstance = null;
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
					_this.game.throwErrorInGMLNode('Expression expected (condition "' + condition.toString() + '" is not a number)', _conditionExpression);
				}
				if (condition >= 0.5) {
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
				if (typeof condition !== "number") {
					_this.game.throwErrorInGMLNode('Expression expected (condition "' + condition.toString() + '" is not a number)', _conditionExpression);
				}
				while (condition >= 0.5) {
					_code.interpret();
					condition = _conditionExpression.interpret();
					if (typeof condition !== "number") {
						_this.game.throwErrorInGMLNode('Expression expected (condition "' + condition.toString() + '" is not a number)', _conditionExpression);
						break;
					}
				}
			},
			Exit(_0) {
				throw "exit";
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
					_this.game.throwErrorInGMLNode("No variable or constant called " + varInfo.name, _variable);

				return value;
			},
			Variable(_name, _arrayIndexes) {

				var varInfo = {};
				varInfo.name = _name.sourceString;
				varInfo.object = null;
				varInfo.arrayIndex = _arrayIndexes.interpret()[0];

				return varInfo;

			},
			ArrayIndexes(_0, _index1, _index2, _3) {
				var indexes = [];
				var index1 = _index1.interpret();
				indexes.push(_this.arrayIndexValidate(index1));

				var index2 = _index2.interpret();
				if (index2.length==1) {
					indexes.push(index2[0]);
				}

				return indexes;
			},
			ArrayIndex2(_0, _index) {
				return _this.arrayIndexValidate(_index.interpret());
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
					_this.game.throwErrorInGMLNode("No variable or constant called " + varInfo.name, _variable);

				var varNew = varOriginal + value;

				_this.setVariableValue(varInfo, varNew);
			},
			AssignmentSubtract(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				
				var varOriginal = _this.getVariableValue(varInfo);
				if (varOriginal == undefined)
					_this.game.throwErrorInGMLNode("No variable or constant called " + varInfo.name, _variable);

				var varNew = varOriginal - value;

				_this.setVariableValue(varInfo, varNew);
			},
			AssignmentMultiply(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				
				var varOriginal = _this.getVariableValue(varInfo);
				if (varOriginal == undefined)
					_this.game.throwErrorInGMLNode("No variable or constant called " + varInfo.name, _variable);

				var varNew = varOriginal * value;

				_this.setVariableValue(varInfo, varNew);
			},
			AssignmentDivide(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				
				var varOriginal = _this.getVariableValue(varInfo);
				if (varOriginal == undefined)
					_this.game.throwErrorInGMLNode("No variable or constant called " + varInfo.name, _variable);

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

		var type = this.variableGetType(value);

		if (varInfo.arrayIndex == null) { // no array index

			switch (type) {
				case 'array1d': // Get value on [0]
					value = value[0];
					break;
				case 'array2d': // Get value on [0,0]
					value = (value[0] || [0])[0];
					break;
			}

		} else if (varInfo.arrayIndex.length==1) { // 1d array index

			var index = varInfo.arrayIndex[0];

			switch (type) {
				case 'normal': // If index is not 0 it's out of bounds
					if (index > 0)
						this.game.throwErrorInCurrent("Array index out of bounds");
					break;
				case 'array1d': // Get value on [i]
					if (index > value.length)
						this.game.throwErrorInCurrent("Array index out of bounds");
					value = value[index];
					break;
				case 'array2d': // Get value on [0,i]
					if (index > (value[0] || [0]).length)
						this.game.throwErrorInCurrent("Array index out of bounds");
					value = (value[0] || [0])[index];
					break;
			}

		} else if (varInfo.arrayIndex.length==2) { // 2d array index

			var index1 = varInfo.arrayIndex[0];
			var index2 = varInfo.arrayIndex[1];

			switch (type) {
				case 'normal': // If both indexes are not 0 it's out of bounds
					if (index1 > 0 || index2 > 0)
						this.game.throwErrorInCurrent("Array index out of bounds");
					break;
				case 'array1d': // Get value on [i2], if index1 is not 0 it's out of bounds
					if (index1 > 0 || index2 > value.length)
						this.game.throwErrorInCurrent("Array index out of bounds");
					value = value[index2];
					break;
				case 'array2d': // Get value on [i1,i2]
					if (index1 > value.length || index2 > (value[index1] || [0]).length)
						this.game.throwErrorInCurrent("Array index out of bounds");
					value = (value[index1] || [0])[index2];
					break;
			}

		}

		if (value == undefined)
			value = 0;

		return value;
	}

	// Always check if returned false
	setVariableValue(varInfo, value) {

		var where = this.currentInstance.variables;

		if (varInfo.object == null) {
			if (this.vars[varInfo.name] !== undefined) {
				where = this.vars;
			} else if (this.currentInstance.variables[varInfo.name] !== undefined) {
				where = this.currentInstance.variables;
			} else if (this.game.globalVariables[varInfo.name] !== undefined) {
				where = this.game.globalVariables;
			} else if (this.game.constants[varInfo.name] !== undefined) {
				return false;
			}

			var type = this.variableGetType(where[varInfo.name]);

			if (varInfo.arrayIndex == null) { // no array index

				switch (type) {
					case 'normal': // Just set value
						where[varInfo.name] = value;
						break;
					case 'array1d': // Set value on [0]
						where[varInfo.name][0] = value;
						break;
					case 'array2d': // Set value on [0,0]
						where[varInfo.name][0][0] = value;
						break;
				}

			} else if (varInfo.arrayIndex.length==1) { // 1d array index

				var index = varInfo.arrayIndex[0];

				switch (type) {
					case 'normal': // Upgrade from normal to 1d array
						where[varInfo.name] = [ where[varInfo.name] ];
						where[varInfo.name][index] = value;
						break;
					case 'array1d': // Just set value
						where[varInfo.name][index] = value;
						break;
					case 'array2d': // Set value on [0,i]
						where[varInfo.name][0][index] = value;
						break;
				}

			} else if (varInfo.arrayIndex.length==2) { // 2d array index

				var index1 = varInfo.arrayIndex[0];
				var index2 = varInfo.arrayIndex[1];

				switch (type) {
					case 'normal': // Upgrade from normal to 2d array
						where[varInfo.name] = [ [ where[varInfo.name] ] ]; // [0,0]
						break;
					case 'array1d': // Upgrade from 1d array to 2d array
						where[varInfo.name] = [ where[varInfo.name] ]; // [0,i]
						break;
				}

				// Fix index1 if undefined, then set value
				if (where[varInfo.name][index1] == undefined)
					where[varInfo.name][index1] = [];
				where[varInfo.name][index1][index2] = value;

			}

		}

		return true;

	}

	arrayIndexValidate(index) {
		if (typeof index != "number")
			this.game.throwErrorInCurrent("Wrong type of array index");
		if (index < 0)
			this.game.throwErrorInCurrent("Negative array index");
		return index;
	}

	variableGetType(variable) {
		var type = 'normal';
		if (Array.isArray(variable)) {
			type = 'array1d';
			if (Array.isArray(variable[0]))
				type = 'array2d';
		}
		return type;
	}

	prepare(code) {
		//var trace = this.grammar.trace(code).toString();
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
			var currentVars = this.vars; // TODO copy arrays (ProjectSerializer?)
			this.vars = {};
			var result = this.semantics(preparedcode).interpret();
			this.vars = currentVars;

			if (this.game.shouldEnd) {
				this.game.gameEnd();
			}

			//console.log('Done.');

			return 0; // TODO return return

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
			this.game.throwErrorInCurrent('No such function called "'+name+'".');
		}
	}

}