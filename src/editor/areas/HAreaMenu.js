import {parent, endparent, add, HElement, HButton} from "../../common/H.js";
import VirtualFileSystem from "../../common/VirtualFileSystem.js";
import HWindowPreferences from "../windows/HWindowPreferences.js";

export default class HAreaMenu extends HElement {
	constructor(editor) {
		super("div", {class: "menu-area"});

		this.editor = editor;

		parent(this);

			add( new HButton("New", () => {
				if (!confirm("Clear current project and start anew?")) return;
				this.editor.newProject();
			}) );

			add( new HButton("Open", () => {
				VirtualFileSystem.openDialog("application/zip,application/json")
				.then(file => {
					this.editor.openProjectFromFile(file);
				});
			}) );

			add( new HButton("Save", () => {
				this.editor.saveProject();
			}) );

			add( new HButton("Preferences", () => {
				this.editor.windowsArea.open(HWindowPreferences, "preferences");
			}) );

			add( new HElement("div", {class: "separator"}) );

			this.runButton = add( new HButton("Run", () => {
				this.editor.runGame();
			}) );

			this.stopButton = add( new HButton("Stop", () => {
				this.editor.stopGame();
			}) );
			this.stopButton.setDisabled(true);

			endparent();
	}
}