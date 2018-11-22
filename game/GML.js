class GML {

	constructor() {

		let _this = this;

		//ohm is a global variable created by ohm.js.

		this.grammar = ohm.grammar(GMLGrammar.getText());
		this.semantics = this.grammar.createSemantics();

		this.currentInstance = null;

		var built_in_functions = [
			{name: 'string', args: [], func: (args) => {
				return args[0].toString();
			}},
			{name: 'show_message', args: [], func: (args) => { alert(args[0]); return 0; }},
			{name: 'action_move_to_position', args: [], func: (args) => {
				this.currentInstance.variables.x += args[0];
				this.currentInstance.variables.y += args[1];
				return 0;
			}},
		];

		this.semantics.addOperation('interpret', {

			Code (a) {
				a.interpret();
			},
			Statement (a) {
				console.log('Statement: '+a.sourceString);
				return a.interpret();
			},
			Comment (a, b) {
				console.log('Comment: ' + b.sourceString);
			},
			Function (a, b, c, d) {

				var name = a.sourceString;
				console.log('Function: ', name);

				var args = c.asIteration().interpret();
				console.log('Running function '+name+' with arguments', args);

				var func = built_in_functions.find((x) => x.name == name);

				if (func) {
					return func.func(args);
				} else {
					throw 'função não existe!!!!1111111 erro!!!!!!11111111111111';
				}
			},
			Name (a, b) {
				//
			},
			Expression(a) {
				console.log('Expression: ', a.sourceString);
				return a.interpret();
			},
			Parentheses(lp, expression, rp) {
				console.log('Parentheses: ', '('+expression.sourceString+')');
				return expression.interpret();
			},
			Add(le, op, re) {

				console.log('Adding: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);

				var l = le.interpret();
				var r = re.interpret();

				console.log('Adding (result): ', l, op.sourceString, r, '=', l+r);
				return l + r;

			},
			Subtract(le, op, re) {

				console.log('Subtracting: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);

				var l = le.interpret();
				var r = re.interpret();

				console.log('Subtracting (result): ', l, op.sourceString, r, '=', l-r);
				return l - r;

			},
			Multiply(le, op, re) {

				console.log('Multiplying: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);

				var l = le.interpret();
				var r = re.interpret();

				console.log('Multiplying (result): ', l, '*', r, '=', l*r);
				return l * r;

			},
			Divide(le, op, re) {

				console.log('Dividing: ', le.sourceString, '>', op.sourceString, '<', re.sourceString);

				var l = le.interpret();
				var r = re.interpret();

				console.log('Dividing (result): ', l, '/', r, '=', l/r);
				return l / r;

			},

			Number(integer, dot, decimals) {
				return Number(integer.sourceString+dot.sourceString+decimals.sourceString);
			},
			String(oq, string, cq) {
				return string.sourceString;
			},
			Variable(name) {
				return _this.currentInstance.variables[name.sourceString];
			},
			Assignment(name, equal, expression) {
				_this.currentInstance.variables[name.sourceString] = expression.interpret();
			},

			Semicolon(a) {
				//
			}

		});

	}

	execute(code, inst) {

		console.log('Interpreting...');

		var trace = this.grammar.trace(code).toString();
		console.log(trace);

		var match = this.grammar.match(code);
		console.log(match);

		if (match.succeeded()) {
			console.log('Executing...');
			this.currentInstance = inst;
			this.semantics(match).interpret();
			console.log('Done.');

		} else {
			console.log(match.message)
			console.log("Some error was found in the GML!");
		}
	}

}