class GML {

	constructor() {

		//ohm is a global variable created by ohm.js.

		this.grammar = ohm.grammar(GMLGrammar.getText());
		this.semantics = this.grammar.createSemantics();

		this.currentInstance = null;

		var built_in_functions = [
			{name: 'show_message', args: [], func: (args) => { alert(args[0]); return 0; }},
			{name: 'action_move_to_position', args: [], func: (args) => {
				this.currentInstance.x += args[0];
				this.currentInstance.y += args[1];
				return 0;
			}},
		];

		this.semantics.addOperation('interpret', {

			Code (a) {
				a.interpret();
			},
			Statement (a) {
				a.interpret();
			},
			Comment (a, b) {
				console.log('Comment: ' + b.sourceString);
			},
			Function (a, b, c, d) {

				var name = a.sourceString;
				var args = c.asIteration().interpret();

				console.log('Function: ', name, args);
				var func = built_in_functions.find((x) => x.name == name);

				if (func) {
					return func.func(args);
				} else {
					console.log('função não existe!!!!1111111 erro!!!!!!11111111111111')
				}
			},
			Name (a, b) {
				//
			},
			Expression(a) {
				return a.interpret();
			},
			Number(integer, dot, decimals) {
				return Number(integer.sourceString+dot.sourceString+decimals.sourceString);
			},
			String(oq, string, cq) {
				return string.sourceString;
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
			console.log("Some error was found in the GML!");
		}
	}

}