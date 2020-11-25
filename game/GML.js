class GML {

	constructor(game) {
		this.game = game;

		let _this = this; //fuck javascript

		this.vars = new VariableHolder();
		this.currentInstance = null;
		this.gameShouldEnd = false;

		//ohm is a global variable created by ohm.js.

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
				throw new ExitException();
			},
			Return(_0, _value) {
				throw new ReturnException(_value.interpret());
			},
			Function (_name, _1, _args, _3) {

				var name = _name.sourceString;
				var args = _args.asIteration().interpret();

				var script = _this.game.project.resources['ProjectScript'].find(x => x.name == name);

				if (script) {

					// Store arguments

					var savedArgument = _this.game.globalVars.save('argument');
					var savedArgumentNumbered = [];
					for (var i=0; i<16; i++) {
						savedArgumentNumbered[i] = _this.game.globalVars.save('argument' + i.toString());
					}
					var savedArgumentRelative = _this.game.globalVars.save('argument_relative');

					// Change arguments

					_this.game.globalVars.clear('argument'); // avoid spillage
					for (var i=0; i<16; i++) {
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
			// TODO check for type errors
			And(_a, _1, _b) {
				var a = _a.interpret() >= 0.5;
				var b = _b.interpret() >= 0.5;
				return (a && b) ? 1 : 0;
			},
			Or(_a, _1, _b) {
				var a = _a.interpret() >= 0.5;
				var b = _b.interpret() >= 0.5;
				return (a || b) ? 1 : 0;
			},
			Xor(_a, _1, _b) {
				var a = _a.interpret() >= 0.5;
				var b = _b.interpret() >= 0.5;
				return (a != b) ? 1 : 0;
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
			BitwiseAnd(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return a & b;
			},
			BitwiseOr(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return a | b;
			},
			BitwiseXor(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return a ^ b;
			},
			BitwiseShiftLeft(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return a << b;
			},
			BitwiseShiftRight(_a, _1, _b) {
				var a = _a.interpret();
				var b = _b.interpret();
				return a >> b;
			},
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
				_this.varSet(varInfo, value);
			},
			AssignmentAdd(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				_this.varModify(varInfo, old => old + value);
			},
			AssignmentSubtract(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				_this.varModify(varInfo, old => old - value);
			},
			AssignmentMultiply(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				_this.varModify(varInfo, old => old * value);
			},
			AssignmentDivide(_variable, _1, _expression) {
				var varInfo = _variable.interpret();
				var value = _expression.interpret();
				_this.varModify(varInfo, old => old / value);
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
		});

	}

	varGet(varInfo, node) {

		if (this.vars.exists(varInfo.name)) {
			var value = this.vars.get(varInfo.name, varInfo.indexes);
			if (value != null)
				return value;
			else
				this.game.throwErrorInGMLNode("Unknown variable " + varInfo.name, node);
		}
		if (this.currentInstance.vars.exists(varInfo.name))
			return this.currentInstance.vars.get(varInfo.name, varInfo.indexes);
		if (this.game.globalVars.exists(varInfo.name))
			return this.game.globalVars.get(varInfo.name, varInfo.indexes);
		if (this.game.constants[varInfo.name] != null)
			return this.game.constants[varInfo.name];

		this.game.throwErrorInGMLNode("Unknown variable " + varInfo.name, node);

	}

	varSet(varInfo, value, node) {

		if (this.vars.exists(varInfo.name))
			return this.vars.set(varInfo.name, value, varInfo.indexes);
		if (this.currentInstance.vars.exists(varInfo.name))
			return this.currentInstance.vars.set(varInfo.name, value, varInfo.indexes);
		if (this.game.globalVars.exists(varInfo.name))
			return this.game.globalVars.set(varInfo.name, value, varInfo.indexes);
		if (this.game.constants[varInfo.name] != null)
			this.game.throwErrorInGMLNode("Cannot assign to the variable (it's a constant!)", node);

		this.currentInstance.vars.set(varInfo.name, value, varInfo.indexes);

	}

	varModify(varInfo, valueFunc, node) {
		var oldValue = this.varGet(varInfo, node);
		var newValue = valueFunc(oldValue);
		this.varSet(varInfo, newValue, node);
	}

	operationAdd(a, b) {
		if (typeof a != typeof b) {
			'Wrong type of arguments to +'
		}
	}

	arrayIndexValidate(index, node) {
		if (typeof index != "number")
			this.game.throwErrorInGMLNode("Wrong type of array index", node);
		if (index < 0)
			this.game.throwErrorInGMLNode("Negative array index", node);
		return index;
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
				if (e instanceof ExitException) {
					console.log('exit called');
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
			this.game.throwErrorInCurrent('No such function called "'+name+'".');
		}
	}

}