import {parent, endparent, add, HElement, HButton} from "../../common/H.js";
import {Project} from "../../common/Project.js";
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

			add( new HElement("div", {class: "separator"}) );

			Project.getTypes().forEach(type => {
				add( new HButton("Create " + type.getScreenName(), () => {
					this.editor.createResource(type);
				}) );
			});

			add( new HElement("div", {class: "separator"}) );

			add( new HButton("Change Game Information", () => {
				this.editor.windowsArea.openGameInformation();
			}) );

			add( new HButton("Change Global Game Settings", () => {
				this.editor.windowsArea.openGlobalGameSettings();
			}) );

			endparent();
	}
}