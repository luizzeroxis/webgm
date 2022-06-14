export default class ActionsParser {

	parse(actions) {
		this.actions = actions;
		this.actionNumber = 0;

		const tree = [];

		while (this.actionNumber < this.actions.length) {
			const treeAction = this.parseAction();
			if (treeAction != null)
				tree.push(treeAction);
		}

		return tree;
	}

	parseAction() {
		const action = this.actions[this.actionNumber];
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

						const treeIfTrue = this.parseAction();
						let treeIfFalse = null;

						const hasElse = this.parseElseIfExists();
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
					const actions = this.parseBlock();
					if (actions.length > 0) {
						const treeAction = {type: 'block', actions: actions};
						return treeAction;
					}
					return null;
				}

			case 'end':
			case 'else':
				return null;

			case 'exit':
				{
					const treeAction = {type: 'exit'};
					return treeAction;
				}

			case 'repeat':
				{
					const treeAction = {type: 'repeat', times: action.args[0], treeAction: this.parseAction()};
					return treeAction;
				}

			case 'variable':
				{
					const treeAction = {type: 'variable', name: action.args[0], value: action.args[1],
						appliesTo: action.appliesTo, relative: action.relative,
						action: action, actionNumber: this.actionNumber-1};
					return treeAction;
				}

			case 'code':
				{
					const treeAction = {type: 'code', code: action.args[0],
						appliesTo: action.appliesTo,
						action: action, actionNumber: this.actionNumber-1};
					return treeAction;
				}

		}

		throw new Error("Unknown action.typeKind "+action.typeKind.toString());
	}

	// This parses a block but not the begin action
	parseBlock() {
		const tree = [];

		while (this.actionNumber < this.actions.length) {
			// Peek at next action to see if it is end
			const action = this.actions[this.actionNumber];
			if (action.typeKind == 'end') {
				this.actionNumber++;
				break;
			}

			const treeAction = this.parseAction();
			if (treeAction != null)
				tree.push(treeAction);
		}

		return tree;
	}

	parseElseIfExists() {
		const action = this.actions[this.actionNumber];
		if (action == null) return false;
		if (action.typeKind == 'else') {
			this.actionNumber++;
			return true;
		}
		return false;
	}

}