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

			Code (a) {
				return a.interpret();
			},
			CurlyBrackets(lb, code, rb) {
				//console.log('Curly bracket');
				return code.interpret();
			},
			Statement (a) {
				//console.log('Statement: '+(a.sourceString).replace(/(\r\n|\n|\r)/gm, "↵"));
				a.interpret();
			},
			If(_, condition, code, notcode) {
				//console.log('If: '+condition.sourceString);
				var _condition = condition.interpret();
				if (typeof _condition !== "number") {
					_this.game.throwFatalError('Expression expected (condition "' + _condition.toString() + '" is not a number)');
				}
				if (_condition > 0) {
					code.interpret();
				} else {
					notcode.interpret();
				}
			},
			Else(_, code) {
				//console.log('Else');
				return code.interpret();
			},
			While(_, condition, code) {
				var _condition = condition.interpret();
				if (typeof _condition !== typeof 1) {
					_this.game.throwFatalError('Condition is not a number!');
				}
				while (_condition) {
					code.interpret();
					_condition = condition.interpret();
					if (typeof _condition !== typeof 1) {
						_this.game.throwFatalError('Condition is not a number!');
						break;
					}
				}
			},
			Exit(_) {

			},
			Function (name, _1, args, _3) {

				var nameString = name.sourceString;
				//console.log('Function: ', nameString);

				var argsArray = args.asIteration().interpret();

				var script = _this.game.project.resources['ProjectScript'].find(x => x.name == nameString);
				if (script) {

					// Store arguments
					var prevGlobalVariables = {};
					prevGlobalVariables.argument = _this.game.globalVariables.argument;
					prevGlobalVariables.argument_relative = _this.game.globalVariables.argument_relative;
					for (var i = 0; i < 16; i++) {
						prevGlobalVariables['argument' + i] = _this.game.globalVariables['argument' + i];
					}

					// Change arguments
					_this.game.globalVariables.argument = argsArray;
					_this.game.globalVariables.argument_relative = 0;
					for (var i = 0; i < 16; i++) {
						_this.game.globalVariables['argument'+i] = (argsArray[i] == null) ? 0 : argsArray[i];
					}

					var r = _this.execute(_this.game.preparedCodes.get(script), _this.currentInstance);

					// Restore arguments
					Object.assign(_this.game.globalVariables, prevGlobalVariables);


					return r;
				} else {
					return _this.builtInFunction(nameString, argsArray, _this.currentInstance);
				}

			},
			Name (a, b) {
				return this.sourceString;
			},
			Expression(a) {
				//console.log('Expression: ', a.sourceString);
				return a.interpret();
			},

			Less(a, _, b) {
				var ia = a.interpret();
				var ib = b.interpret();

				return (ia < ib) ? 1 : 0;
			},
			LessOrEqual(a, _, b) {
				var ia = a.interpret();
				var ib = b.interpret();

				return (ia <= ib) ? 1 : 0;
			},
			Equal(le, op, re) {
				//console.log('Equaling: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);
				var l = le.interpret();
				var r = re.interpret();
				//console.log('Equaling (result): ', l, op.sourceString, r, '=', (l === r) ? 1 : 0);
				return (l === r) ? 1 : 0;
			},
			Different(a, _, b) {
				var ia = a.interpret();
				var ib = b.interpret();

				return (ia !== ib) ? 1 : 0;
			},
			Greater(a, _, b) {
				var ia = a.interpret();
				var ib = b.interpret();

				return (ia > ib) ? 1 : 0;
			},
			GreaterOrEqual(a, _, b) {
				var ia = a.interpret();
				var ib = b.interpret();

				return (ia >= ib) ? 1 : 0;
			},

			Parentheses(lp, expression, rp) {
				//console.log('Parentheses: ', '('+expression.sourceString+')');
				return expression.interpret();
			},
			
			Add(le, op, re) {
				//console.log('Adding: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);
				var l = le.interpret();
				var r = re.interpret();
				//console.log('Adding (result): ', l, op.sourceString, r, '=', l+r);
				return l + r;
			},
			Subtract(le, op, re) {
				//console.log('Subtracting: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);
				var l = le.interpret();
				var r = re.interpret();
				//console.log('Subtracting (result): ', l, op.sourceString, r, '=', l-r);
				return l - r;
			},
			Multiply(le, op, re) {
				//console.log('Multiplying: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);
				var l = le.interpret();
				var r = re.interpret();
				//console.log('Multiplying (result): ', l, '*', r, '=', l*r);
				return l * r;
			},
			Divide(le, op, re) {
				//console.log('Dividing: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);
				var l = le.interpret();
				var r = re.interpret();
				//console.log('Dividing (result): ', l, '/', r, '=', l/r);
				return l / r;
			},

			Number(integer, dot, decimals) {
				return Number(integer.sourceString+dot.sourceString+decimals.sourceString);
			},
			String(oq, string, cq) {
				return string.sourceString;
			},
			Variable(name) {
				var v;
				
				v = _this.vars[name.sourceString];
				if (v != undefined)
					return v;
				
				v = _this.currentInstance.variables[name.sourceString];
				if (v != undefined)
					return v;
				
				v = _this.game.globalVariables[name.sourceString];
				if (v != undefined)
					return v;
				
				v = _this.game.constants[name.sourceString];
				if (v != undefined)
					return v;
				
				_this.game.throwFatalError("No variable or constant called "+name.sourceString);
				
			},
			Assignment(name, equal, expression) {
				var success = _this.setVariable(name.sourceString, value => expression.interpret());
				if (!success) {
					// new variable
					_this.currentInstance.variables[name.sourceString] = expression.interpret();
				}
				
			},
			AssignmentAdd(name, equal, expression) {
				var success = _this.setVariable(name.sourceString, value => value + expression.interpret());
				if (!success) {
					_this.game.throwFatalError("No variable called "+name.sourceString);
				}
			},
			AssignmentSubtract(name, equal, expression) {
				var success = _this.setVariable(name.sourceString, value => value - expression.interpret());
				if (!success) {
					_this.game.throwFatalError("No variable called "+name.sourceString);
				}
			},
			AssignmentMultiply(name, equal, expression) {
				var success = _this.setVariable(name.sourceString, value => value * expression.interpret());
				if (!success) {
					_this.game.throwFatalError("No variable called "+name.sourceString);
				}
			},
			AssignmentDivide(name, equal, expression) {
				var success = _this.setVariable(name.sourceString, value => value / expression.interpret());
				if (!success) {
					_this.game.throwFatalError("No variable called "+name.sourceString);
				}
			},

			AssignmentVar(_, names) {
				names.asIteration().interpret().forEach(name => {
					if (_this.vars[name] == undefined) {
						_this.vars[name] = null;
					}

				});
			},
			AssignmentGlobalVar(_, names) {
				names.asIteration().interpret().forEach(name => {
					if (_this.game.globalVariables[name] == undefined) {
						_this.game.globalVariables[name] = 0;
					}
				});
			},

			Semicolon(a) {
				//
			}

		});

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
