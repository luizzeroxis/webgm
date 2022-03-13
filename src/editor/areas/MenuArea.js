import {parent, endparent, add, newElem, newButton} from '../../common/H.js'
import VirtualFileSystem from '../../common/VirtualFileSystem.js';
import HWindowPreferences from '../windows/HWindowPreferences.js';

export default class MenuArea {

	constructor(editor) {
		this.editor = editor;

		parent( add( newElem('menu', 'div') ) )

			add( newButton(null, 'New', () => {
				if (!confirm("Clear current project and start anew?")) return;
				this.editor.newProject();
			}) )

			add ( newButton(null, 'Open', () => {
				VirtualFileSystem.openDialog('application/zip,application/json')
				.then(file => {
					this.editor.openProjectFromFile(file);
				})
			}) )

			add( newButton(null, 'Save', () => {
				this.editor.saveProject();
			}) )

			add( newButton(null, 'Preferences', () => {
				this.editor.windowsArea.open(HWindowPreferences, 'preferences');
			}) )

			this.runButton = add( newButton(null, 'Run', () => {
				this.editor.runGame();
			}) )

			this.stopButton = add( newButton(null, 'Stop', () => {
				this.editor.stopGame();
			}) )
			this.stopButton.disabled = true;

			endparent()
	}

}