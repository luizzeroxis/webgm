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
							BuiltInLibraries.textApplyTo(action)
							+ "start moving in directions " + BuiltInLibraries.textArg(action, 0) + " with speed set "
							+ BuiltInLibraries.textRelative(action)
							+ "to " + BuiltInLibraries.textArg(action, 1)
						),
						kind: 'normal',
						execution: 'function',
						executionFunction: 'action_move',

						interfaceKind: 'arrows',
						isQuestion: false,
						hasApplyTo: true,
						hasRelative: true,

					}
				],
			},
			{
				name: 'main2',
				items: [
					{
						id: 321,
						description: 'Display Message',
						getListText: action => "Display a message",
						getHintText: action => "display message: " + BuiltInLibraries.textArg(action, 0),
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
						getHintText: action => BuiltInLibraries.textApplyTo(action) + "execute code:\n\n" + BuiltInLibraries.textArg(action, 0),
						kind: 'code',
					},
					
				]
			},
		];
	}

	static textArg(action, i) {
		return action.args[i].toString();
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
}