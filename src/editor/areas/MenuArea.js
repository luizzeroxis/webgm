import {parent, endparent, add, html, newElem, newButton} from '../../common/H.js'

import HTMLWindowPreferences from '../HTMLWindowPreferences.js';
import VirtualFileSystem from '../../common/VirtualFileSystem.js';

export default class MenuArea {

	constructor(editor) {
		this.editor = editor;

		parent( add( newElem('menu', 'div') ) )

			add( newButton(null, 'New', () => {
				if (!confirm("Clear current project and start anew?")) return;
				this.editor.newProject();
			}) )

			add ( this.newButtonOpenFile(null, 'Open', file => {
				this.editor.openProjectFromFile(file);
			}, 'application/zip,application/json') )

			add( newButton(null, 'Save', () => {
				this.editor.saveProject();
			}) )

			add( newButton(null, 'Preferences', () => {
				this.editor.windowsArea.open(HTMLWindowPreferences, 'preferences');
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

	// TODO move to separate file
	newButtonOpenFile(classes, content, onSelectFile, accept, multiple=false) {
		var e = html('button', {class: classes}, {
			click: e => {
				VirtualFileSystem.openDialog(accept)
				.then(file => {
					return onSelectFile(file);
				})
			},
			dragover: e => {
				e.preventDefault();
			},
			drop: e => {
				e.preventDefault();

				if (multiple) {
					onSelectFile(e.dataTransfer.files);
				} else {
					var file = e.dataTransfer.files[0];
					if (file != undefined)
						onSelectFile(file);
				}

			},
		}, content);
		return e;
	}

}