import {parent, endparent, add, HElement, HButton} from "../../common/H.js";
import HWindowPreferences from "../windows/HWindowPreferences.js";

export default class HAreaMenu extends HElement {
	constructor(editor) {
		super("div", {class: "menu-area"});

		this.editor = editor;

		parent(this);

			add( new HButton("New", () => {
				this.editor.newProject();
			}) );

			add( new HButton("Open", () => {
				this.editor.openProject();
			}) );

			add( new HButton("Save", () => {
				this.editor.saveProject();
			}) );

			// Only show when File System Access API is avaliable
			if ("showOpenFilePicker" in window) {
				add( new HButton("Save as", () => {
					this.editor.saveProjectAs();
				}) );
			}

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