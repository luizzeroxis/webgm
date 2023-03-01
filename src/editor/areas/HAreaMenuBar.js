import {HElement, add} from "../../common/H.js";
import {Project} from "../../common/Project.js";
import HMenuBar from "../HMenuBar.js";
import HWindowPreferences from "../windows/HWindowPreferences.js";

export default class HAreaMenuBar extends HElement {
	constructor(editor) {
		super("div", {class: "menu-bar-area"});

		this.editor = editor;

		const menus = [
			{text: "File", items: [
				{text: "New", onClick: () => this.editor.newProject()},
				{text: "Open...", onClick: () => this.editor.openProject()},
				{text: "Save", onClick: () => this.editor.saveProject()},
				{text: "Save as...", onClick: () => this.editor.saveProjectAs(), enabled: ("showOpenFilePicker" in window)},
				{text: "Preferences...", onClick: () => this.editor.windowsArea.open(HWindowPreferences, "preferences")},
				{text: "Exit", onClick: () => window.close()},
			]},
			{text: "Edit", items: [
				{text: "Find resource", onClick: () => this.editor.findResource()},
			]},
			{text: "Resources", items: [

				...Project.resourceTypes.map(type => {
					return {text: "Create " + type.getScreenName(), onClick: () => this.editor.project.createResource(type)};
				}),

				{text: "Change Game Information", onClick: () => this.editor.windowsArea.openGameInformation()},
				{text: "Change Global Game Settings", onClick: () => this.editor.windowsArea.openGlobalGameSettings()},

			]},
			{text: "Script", items: [
				{text: "Import Scripts...", onClick: () => {}, enabled: false},
			]},
			{text: "Run", items: [
				{text: "Run normally", onClick: () => this.editor.runGame()},
			]},
			{text: "Window", items: [
				{text: "Cascade", onClick: () => this.editor.windowsArea.cascade()},
				{text: "Close All", onClick: () => this.editor.windowsArea.clear()},
			]},
			{text: "Help", items: [
				{text: "About webgm...", onClick: () => this.editor.showAbout()},
			]},
		];

		this.menuBar = add( new HMenuBar(this.editor.menuManager, menus) );
	}
}