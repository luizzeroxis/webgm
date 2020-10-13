class BuiltInLibraries {
	static getList() {
		return [
			{
				name: 'main2',
				items: [
					{
						id: 321,
						name: 'Display Message',
						kind: 'gmfunction',
						getListText: action => "Display a message",
						getHintText: action => "display message: " + action.args[0].toString(),
						gmfunction: 'show_message',
						args: [
							{
								name: 'message:',
								type: 'string',
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
						id: 603,
						name: 'Execute Code',
						kind: 'code',
						getListText: action => "Execute a piece of code",
					},
					
				]
			},
		];
	}
}