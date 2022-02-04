// import ActionDefaultIcon  from '../editor/img/action-default-icon.png';
// import Action603Icon from '../editor/img/action-603-icon.png';

export default class BuiltInLibraries {
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
						id: 117,
						description: 'Align to Grid',
						getListText: action => "Align to a grid of " + BIL.textArg(action, 0) + " by " + BIL.textArg(action, 1),
						// @walign position to a grid with cells of @0 by @1 pixels
						getHintText: action => (
							BIL.textApplyTo(action)
							+ "align position to a grid with cells of " + BIL.textArg(action, 0) + " by " + BIL.textArg(action, 1) + " pixels"
						),
						kind: 'normal',
						execution: 'function',
						executionFunction: 'action_snap',

						interfaceKind: 'normal',
						isQuestion: false,
						hasApplyTo: true,
						hasRelative: false,

						args: [
							{
								name: 'snap hor:',
								kind: 'expression',
								default: 16,
							},
							{
								name: 'snap vert:',
								kind: 'expression',
								default: 16,
							},
						],
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
						id: 302,
						description: 'Sleep',
						getListText: action => "Sleep "+BIL.textArg(action, 0)+" milliseconds",
						getHintText: action => "sleep "+BIL.textArg(action, 0)+" milliseconds; redrawing the screen: "+BIL.textArg(action, 1),
						kind: 'normal',
						execution: 'function',
						executionFunction: 'action_sleep',

						interfaceKind: 'normal',
						isQuestion: false,
						hasApplyTo: false,
						hasRelative: false,

						args: [
							{
								name: 'milliseconds:',
								kind: 'both',
								default: '1000',
							},
							{
								name: 'redraw:',
								kind: 'boolean',
								default: true,
							}
						]
					},
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
						// image: Action603Icon,
						getListText: action => "Execute a piece of code",
						getHintText: action => BIL.textApplyTo(action) + "execute code:\n\n" + BIL.textArg(action, 0),
						kind: 'code',
					},
					{
						id: 601,
						description: 'Execute Script',
						getListText: action => "Execute script: " + BIL.textArg(action, 0),
						getHintText: action => (
							BIL.textApplyTo(action)
							+ "execute script " + BIL.textArg(action, 0)
							+ " with arguments ("
							+ BIL.textArg(action, 1) + ","
							+ BIL.textArg(action, 2) + ","
							+ BIL.textArg(action, 3) + ","
							+ BIL.textArg(action, 4) + ","
							+ BIL.textArg(action, 5) + ")"
						),
						kind: 'normal',
						execution: 'function',
						executionFunction: 'action_execute_script',

						interfaceKind: 'normal',
						isQuestion: false,
						hasApplyTo: true,
						hasRelative: false,

						args: [
							{
								name: 'script:',
								kind: 'script',
								default: -1,
							},
							{
								name: 'argument0:',
								kind: 'expression',
								default: '0',
							},
							{
								name: 'argument1:',
								kind: 'expression',
								default: '0',
							},
							{
								name: 'argument2:',
								kind: 'expression',
								default: '0',
							},
							{
								name: 'argument3:',
								kind: 'expression',
								default: '0',
							},
							{
								name: 'argument4:',
								kind: 'expression',
								default: '0',
							},
						]
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

	// TODO add textMenu or something
	// TODO add textResource or something

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