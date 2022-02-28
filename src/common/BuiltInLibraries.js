// import ActionDefaultIcon  from '../editor/img/action-default-icon.png';
// import Action603Icon from '../editor/img/action-603-icon.png';

let b = {type: 'b'}; // All text bold
let i = {type: 'i'}; // All text italic
let r = {type: 'r'}; // Replaced by 'relative '
let n = {type: 'n'}; // Replaced by 'not '
let w = {type: 'w'}; // Replaced by 'for the other object: ' or 'for object <name of object>: ' if apply to is not self
let a = Array.from(new Array(6).keys()).map(x => ({type: 'a', number: x})); // Replace by argument value

export default class BuiltInLibraries {
	static getList() {
		return [
			{
				name: 'move',
				items: [
					{
						id: 101,
						description: 'Move Fixed',
						listText: ["Start moving in a direction"],
						hintText: [w, "start moving in directions ", a[0], " with speed set ", r, "to ", a[1]],
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
						listText: ["Align to a grid of ", a[0], " by ", a[1]],
						hintText: [w, "align position to a grid with cells of ", a[0], " by ", a[1], " pixels"],
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
						listText: ["Wrap ", a[0], " when outside"],
						hintText: [w, "wrap ", a[0], " when an instance moves outside the room"],
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
						listText: ["Sleep ", a[0], " milliseconds"],
						hintText: ["sleep ", a[0], " milliseconds; redrawing the screen: ", a[1]],
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
						listText: ["Display a message"],
						hintText: ["display message: ", a[0]],
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
						id: 422,
						description: 'Start Block',
						listText: ["Start of a block"],
						hintText: ["start of a block"],
						kind: 'begin',
					},
					{
						id: 421,
						description: 'Else',
						listText: ["Else"],
						hintText: ["else"],
						kind: 'else',
					},
					{
						id: 425,
						description: 'Exit Event',
						listText: ["Exit this event"],
						hintText: ["exit this event"],
						kind: 'exit',
					},
					{
						id: 424,
						description: 'End Block',
						listText: ["End of a block"],
						hintText: ["end of a block"],
						kind: 'end',
					},
					{
						id: 423,
						description: 'Repeat',
						listText: ["Repeat ", a[0], " times"],
						hintText: ["repeat next action (block) ", a[0], " times"],
						kind: 'repeat',
					},
					{
						id: 603,
						description: 'Execute Code',
						// image: Action603Icon,
						listText: ["Execute a piece of code"],
						hintText: [w, "execute code:\n\n", a[0]],
						kind: 'code',
					},
					{
						id: 601,
						description: 'Execute Script',
						listText: ["Execute script: ", a[0]],
						hintText: [w, "execute script ", a[0], " with arguments (", a[1], ",", a[2], ",", a[3], ",", a[4], ",", a[5], ")"],
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
						listText: ["Set variable ", a[0], " to ", a[1]],
						hintText: [w, "set variable ", a[0], " ", r, "to ", a[1]],
						kind: 'variable',
					},
					{
						id: 612,
						description: 'Test Variable',
						listText: ["If ", a[0], " is ", n, a[2], " ", a[1]],
						hintText: [w, "if ", a[0], " is ", n, a[2], " ", a[1]],
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

}