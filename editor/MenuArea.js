//The menu area class
class MenuArea {

	constructor(editor) {
		parent( add( newElem('menu', 'div') ) )

			add( newButton(null, 'New', () => {
				editor.newProject();
			}) )

			add( newButton(null, 'Open', () => {
				editor.openProject();
			}) )

			add( newButton(null, 'Save', () => {
				editor.saveProject();
			}) )

			add( newButton(null, 'Run', () => {
				editor.runGame();
			}) )

			add( newButton(null, 'Stop', () => {
				editor.stopGame();
			}) )

			endparent()
	}

}