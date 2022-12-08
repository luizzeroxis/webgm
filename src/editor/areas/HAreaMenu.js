import {parent, endparent, add, HElement, HButton, HImage} from "../../common/H.js";
import {Project} from "../../common/Project.js";
import BackgroundIcon from "../img/background-icon.png";
import FontIcon from "../img/font-icon.png";
import ObjectIcon from "../img/object-icon.png";
import PathIcon from "../img/path-icon.png";
import RoomIcon from "../img/room-icon.png";
import ScriptIcon from "../img/script-icon.png";
import SoundIcon from "../img/sound-icon.png";
import SpriteIcon from "../img/sprite-icon.png";
import TimelineIcon from "../img/timeline-icon.png";
import HWindowPreferences from "../windows/HWindowPreferences.js";

export default class HAreaMenu extends HElement {
	static resourceTypeIcons = {
		"ProjectSprite": SpriteIcon,
		"ProjectSound": SoundIcon,
		"ProjectBackground": BackgroundIcon,
		"ProjectPath": PathIcon,
		"ProjectScript": ScriptIcon,
		"ProjectFont": FontIcon,
		"ProjectTimeline": TimelineIcon,
		"ProjectObject": ObjectIcon,
		"ProjectRoom": RoomIcon,
	};

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

			Project.resourceTypes.forEach(type => {
				const button = add( new HButton(null, () => {
					this.editor.createResource(type);
				}) );

				parent(button);
					add( new HImage(HAreaMenu.resourceTypeIcons[type.getClassName()]) );
					endparent();

				button.html.title = "Create " + type.getScreenName();
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