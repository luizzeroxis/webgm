import {HElement, add} from "~/common/h";
import Project from "~/common/project/Project.js";
import HMenuBar from "~/editor/components/HMenuBar/HMenuBar.js";

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
				{text: "Create executable...", onClick: () => this.editor.createStandAlone()},
				{text: "Preferences...", onClick: () => this.editor.windowsArea.openPreferences()},
				{text: "Exit", onClick: () => window.close()},
			]},
			{text: "Edit", items: [
				{text: "Find resource", onClick: () => this.editor.findResource()},
				{text: "Expand resource tree", onClick: () => this.editor.resourcesArea.tree.setAllOpen(true)},
				{text: "Collapse resource tree", onClick: () => this.editor.resourcesArea.tree.setAllOpen(false)},
			]},
			{text: "Resources", items: [

				...Project.resourceTypes.map(type => {
					return {text: "Create " + type.getScreenName(), onClick: () => this.editor.project.createResource(type)};
				}),

				{text: "Change Game Information", onClick: () => this.editor.windowsArea.openGameInformation()},
				{text: "Change Global Game Settings", onClick: () => this.editor.windowsArea.openGlobalGameSettings()},
				{text: "Define Constants...", onClick: () => this.editor.windowsArea.openConstants()},

			]},
			{text: "Script", items: [
				{text: "Import Scripts...", onClick: () => {}, enabled: false},
			]},
			{text: "Run", items: [
				{text: "Run normally", onClick: () => this.editor.runGame()},
			]},
			{text: "Window", items: [
				{text: "Cascade", onClick: () => this.editor.windowsArea.manager.cascade()},
				{text: "Close All", onClick: () => this.editor.windowsArea.manager.clear()},
			]},
			{text: "Help", items: [
				{text: "About webgm...", onClick: () => this.editor.showAbout()},
			]},
		];

		this.menuBar = add( new HMenuBar(this.editor.menuManager, menus) );
	}
}