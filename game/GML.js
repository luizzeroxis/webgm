class GML {

	constructor() {

		let _this = this; //fuck javascript

		this.currentInstance = null;
		this.game = null;

		//ohm is a global variable created by ohm.js.

		this.grammar = ohm.grammar(GMLGrammar.getText());
		this.semantics = this.grammar.createSemantics();

		this.built_in_functions = [
			{name: 'action_move_to', args: [], func: (args, relative) => {
				this.currentInstance.variables.x = (relative ? this.currentInstance.variables.x : 0) + args[0];
				this.currentInstance.variables.y = (relative ? this.currentInstance.variables.y : 0) + args[1];
				return 0;
			}},
			{name: 'draw_rectangle', args: [], func: (args) => {
				this.game.ctx.fillRect(args[0], args[1], args[2] - args[0], args[3] - args[1]);
			}},
			{name: 'draw_set_color', args: [], func: (args) => {
				this.ctx.fillStyle = args[0];
			}},
			{name: 'draw_sprite', args: [], func: (args) => {
				this.game.drawSprite(args[0], args[1], args[2], args[3]);
			}},
			{name: 'draw_text', args: [], func: (args) => {
				this.ctx.fillText(act.arg[2], act.arg[0], act.arg[1]);
			}},
			{name: 'instance_create', args: [], func: (args) => {
				return this.game.instanceCreate(args[0], args[1], args[2]);
			}},
			{name: 'keyboard_check', args: [], func: (args) => {
				return this.game.key[args[0]] ? 1 : 0;
			}},
			{name: 'string', args: [], func: (args) => {
				return args[0].toString();
			}},
			{name: 'show_message', args: [], func: (args) => {
				alert(args[0]); return 0;
			}},
		];

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
					throw 'Condition is not a number!';
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
					throw 'Condition is not a number!';
				}
				while (_condition) {
					code.interpret();
					_condition = condition.interpret();
					if (typeof _condition !== typeof 1) {
						throw 'Condition is not a number!';
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

				var script = _this.game.project.scripts.find(x => x.name == name);
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
				//
			},
			Expression(a) {
				//console.log('Expression: ', a.sourceString);
				return a.interpret();
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
								throw "No variable or constant called "+name.sourceString;
							}
						}
					}
				}
				
				return v;
			},
			Assignment(name, equal, expression) {
				if (!(_this.game.constants[name.sourceString] == undefined)) {
					throw name.sourceString+" is a constant, can't change the value to "+expression.sourceString;
				} else
				if (!(_this.game.globalVariables[name.sourceString] == undefined)) {
					_this.game.globalVariables[name.sourceString] = expression.interpret();
				} else {
					_this.currentInstance.variables[name.sourceString] = expression.interpret();
				}
			},

			Semicolon(a) {
				//
			}

		});

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
			this.vars = {};
			this.semantics(preparedcode).interpret();
			//console.log('Done.');

		} else {
			console.log(preparedcode.message)
			console.log("Some error was found in the GML!");
		}
	}

	builtInFunction(name, args, inst, relative) {
		var func = this.built_in_functions.find(x => x.name == name);
		if (func) {
			this.currentInstance = inst;
			return func.func(args, relative);
		} else {
			throw 'No such function called "'+name+'".';
		}
	}

}