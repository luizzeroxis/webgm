export default class ActionsParser {

	parse(actions) {
		this.actions = actions;
		this.actionNumber = 0;

		var tree = [];

		while (this.actionNumber < this.actions.length) {
			var treeAction = this.parseAction();
			if (treeAction != null)
				tree.push(treeAction);
		}

		return tree;
	}

	parseAction() {
		var action = this.actions[this.actionNumber];
		if (action == null) return null;
		this.actionNumber++;

		// normal, begin group, end group, else, exit, repeat, variable, code
		switch (action.typeKind) {
			case 'normal':
				{
					let treeAction = {args: action.args,
						appliesTo: action.appliesTo, relative: action.relative,
						action: action, actionNumber: this.actionNumber-1};

					if (action.typeExecution == 'function') {
						treeAction.type = 'executeFunction';
						treeAction.function = action.typeExecutionFunction;
					} else if (action.typeExecution == 'code') {
						treeAction.type = 'executeCode';
						treeAction.code = action.typeExecutionCode;
					} else {
						return null;
					}

					if (action.typeIsQuestion) {
						treeAction = {type: 'if', condition: treeAction};

						var treeIfTrue = this.parseAction();
						var treeIfFalse = null;

						var hasElse = this.parseElseIfExists();
						if (hasElse) {
							treeIfFalse = this.parseAction();
						}

						if (!action.not) {
							treeAction.ifTrue = treeIfTrue;
							treeAction.ifFalse = treeIfFalse;
						} else {
							treeAction.ifTrue = treeIfFalse;
							treeAction.ifFalse = treeIfTrue;
						}
					}

					return treeAction;
				}

			case 'begin':
				{
					var actions = this.parseBlock();
					if (actions.length > 0) {
						let treeAction = {type: 'block', actions: actions};
						return treeAction;
					}
					return null;
				}

			case 'end':
			case 'else':
				return null;

			case 'exit':
				{
					let treeAction = {type: 'exit'};
					return treeAction;
				}

			case 'repeat':
				{
					let treeAction = {type: 'repeat', times: action.args[0], treeAction: this.parseAction()};
					return treeAction;
				}

			case 'variable':
				{
					let treeAction = {type: 'variable', name: action.args[0], value: action.args[1],
						appliesTo: action.appliesTo, relative: action.relative,
						action: action, actionNumber: this.actionNumber-1};
					return treeAction;
				}

			case 'code':
				{
					let treeAction = {type: 'code', code: action.args[0],
						appliesTo: action.appliesTo,
						action: action, actionNumber: this.actionNumber-1};
					return treeAction;
				}

		}
	}

	// This parses a block but not the begin action
	parseBlock() {
		var tree = [];

		while (this.actionNumber < this.actions.length) {
			// Peek at next action to see if it is end
			var action = this.actions[this.actionNumber];
			if (action.typeKind == 'end') {
				this.actionNumber++;
				break;
			}

			var treeAction = this.parseAction();
			if (treeAction != null)
				tree.push(treeAction);
		}

		return tree;
	}

	parseElseIfExists() {
		var action = this.actions[this.actionNumber];
		if (action == null) return false;
		if (action.typeKind == 'else') {
			this.actionNumber++;
			return true;
		}
		return false;
	}

}