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
			Comment (a, b) {
				//console.log('Comment: ' + b.sourceString);
			},
			MultiComment(a, b, c) {
				//
			},
			If(_, condition, code, notcode) {
				//console.log('If: '+condition.sourceString);
				var _condition = condition.interpret();
				if (typeof _condition !== typeof 1) {
					_this.game.throwFatalError('Condition is not a number!');
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
			Function (a, b, c, d) {

				var name = a.sourceString;
				//console.log('Function: ', name);

				var args = c.asIteration().interpret();
				//console.log('Running function '+name+' with arguments', args);

				var script = _this.game.project.resources['ProjectScript'].find(x => x.name == name);
				if (script) {
					var currentVars = _this.vars;
					_this.vars = {
						arguments: args,
						argument_relative: 0,
					};
					for (var i = 0; i < 16; i++) {
						_this.vars['argument'+i] = (args[i] == null) ? 0 : args[i];
					}

					var r = _this.execute(_this.game.preparedCodes.get(script), _this.currentInstance);
					_this.vars = currentVars;

					return r;
				} else {
					return _this.builtInFunction(name, args, _this.currentInstance);
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

			Parentheses(lp, expression, rp) {
				//console.log('Parentheses: ', '('+expression.sourceString+')');
				return expression.interpret();
			},
			Equal(le, op, re) {
				//console.log('Equaling: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);
				var l = le.interpret();
				var r = re.interpret();
				//console.log('Equaling (result): ', l, op.sourceString, r, '=', (l === r) ? 1 : 0);
				return (l === r) ? 1 : 0;
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
				if (v == undefined) {
					v = _this.currentInstance.variables[name.sourceString];
					if (v == undefined) {
						v = _this.game.globalVariables[name.sourceString];
						if (v == undefined) {
							v = _this.game.constants[name.sourceString];
							if (v == undefined) {
								_this.game.throwFatalError("No variable or constant called "+name.sourceString);
							}
						}
					}
				}
				
				return v;
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
					_this.vars[name] = {};
				});
			},
			AssignmentGlobalVar(_, names) {
				names.asIteration().interpret().forEach(name => {
					_this.game.globalVariables[name] = {};
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