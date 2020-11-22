class BuiltInLibraries {
	static getList() {
		return [
			{
				name: 'move',
				items: [
					{
						id: 101,
						description: 'Move Fixed',
						getListText: action => "Start moving in a direction",
						getHintText: action => (
							BIL.textApplyTo(action)
							+ "start moving in directions " + BIL.textArg(action, 0) + " with speed set "
							+ BIL.textRelative(action)
							+ "to " + BIL.textArg(action, 1)
						),
						kind: 'normal',
						execution: 'function',
						executionFunction: 'action_move',

						interfaceKind: 'arrows',
						isQuestion: false,
						hasApplyTo: true,
						hasRelative: true,

					},
					{
						id: 112,
						description: 'Wrap Screen',
						getListText: action => "Wrap @0 when outside",
						getHintText: action => "@wwrap @0 when an instance moves outside the room",
						kind: 'normal',
						execution: 'function',
						executionFunction: 'action_wrap',

						interfaceKind: 'normal',
						isQuestion: false,
						hasApplyTo: true,
						hasRelative: false,

						args: [
							{
								name: 'direction:',
								kind: 'menu',
								menu: ['horizontal', 'vertical', 'in both directions'],
								default: 0,
							}
						],
					},
				],
			},
			{
				name: 'main2',
				items: [
					{
						id: 321,
						description: 'Display Message',
						getListText: action => "Display a message",
						getHintText: action => "display message: " + BIL.textArg(action, 0),
						kind: 'normal',
						execution: 'function',
						executionFunction: 'action_message',

						interfaceKind: 'normal',
						isQuestion: false,
						hasApplyTo: false,
						hasRelative: false,

						args: [
							{
								name: 'message:',
								kind: 'both',
								default: '',
							}
						]
					}
				],
			},
			{
				name: 'control',
				items: [
					{
						id: 421,
						description: 'Else',
						getListText: action => "Else",
						getHintText: action => "else",
						kind: 'else',
					},
					{
						id: 422,
						description: 'Start Block',
						getListText: action => "Start of a block",
						getHintText: action => "start of a block",
						kind: 'begin',
					},
					{
						id: 423,
						description: 'Repeat',
						getListText: action => "Repeat " + BIL.textArg(action, 0) + " times",
						getHintText: action => "repeat next action (block) " + BIL.textArg(action, 0) + " times",
						kind: 'repeat',
					},
					{
						id: 424,
						description: 'End Block',
						getListText: action => "End of a block",
						getHintText: action => "end of a block",
						kind: 'end',
					},
					{
						id: 425,
						description: 'Exit Event',
						getListText: action => "Exit this event",
						getHintText: action => "exit this event",
						kind: 'exit',
					},
					{
						id: 603,
						description: 'Execute Code',
						getListText: action => "Execute a piece of code",
						getHintText: action => BIL.textApplyTo(action) + "execute code:\n\n" + BIL.textArg(action, 0),
						kind: 'code',
					},
					{
						id: 611,
						description: 'Set Variable',
						getListText: action => "Set variable " + BIL.textArg(action, 0) + " to " + BIL.textArg(action, 1),
						getHintText: action => (
							BIL.textApplyTo(action)
							+ "set variable " + BIL.textArg(action, 0) + " "
							+ BIL.textRelative(action)
							+ "to " + BIL.textArg(action, 1)
						),
						kind: 'variable',
					},
					{
						id: 612,
						description: 'Test Variable',
						getListText: action => (
							"If " + BIL.textArg(action, 0)
							+ " is " + BIL.textNot(action) + BIL.textArg(action, 2)
							+ " " + BIL.textArg(action, 1)
						),
						getHintText: action => (
							BIL.textApplyTo(action)
							+ "if " + BIL.textArg(action, 0)
							+ " is " + BIL.textNot(action) + BIL.textArg(action, 2)
							+ " " + BIL.textArg(action, 1)
						),
						kind: 'normal',
						execution: 'function',
						executionFunction: 'action_if_variable',

						interfaceKind: 'normal',
						isQuestion: true,
						hasApplyTo: true,
						hasRelative: false,

						args: [
							{
								name: 'variable:',
								kind: 'expression',
								default: '',
							},
							{
								name: 'value:',
								kind: 'expression',
								default: '0',
							},
							{
								name: 'operation:',
								kind: 'menu',
								menu: ['equal to', 'smaller than', 'larger than'],
								default: '0',
							},
						]
					},
					
				]
			},
		];
	}

	static textArg(action, i) {
		return action.args[i].value.toString();
	}

	static textApplyTo(action) {
		if (action.appliesTo == -1)
			return '';
		else
			return 'for the object '+action.appliesTo.toString+': ';
	}

	static textRelative(action) {
		if (action.relative) {
			return 'relative ';
		}
		return '';
	}

	static textNot(action) {
		if (action.not) {
			return 'not ';
		}
		return '';
	}
}

var BIL = BuiltInLibraries; // lol