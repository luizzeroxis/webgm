import {parent, endparent, add, HElement, HButton, HImage} from "~/common/H.js";
import Project from "~/common/Project.js";
import BackgroundIcon from "~/editor/img/background-icon.png";
import FontIcon from "~/editor/img/font-icon.png";
import ObjectIcon from "~/editor/img/object-icon.png";
import PathIcon from "~/editor/img/path-icon.png";
import RoomIcon from "~/editor/img/room-icon.png";
import ScriptIcon from "~/editor/img/script-icon.png";
import SoundIcon from "~/editor/img/sound-icon.png";
import SpriteIcon from "~/editor/img/sprite-icon.png";
import TimelineIcon from "~/editor/img/timeline-icon.png";

export default class HAreaToolBar extends HElement {
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
		super("div", {class: "tool-bar-area"});

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
					this.editor.project.createResource(type);
				}) );

				parent(button);
					add( new HImage(HAreaToolBar.resourceTypeIcons[type.getClassName()]) );
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