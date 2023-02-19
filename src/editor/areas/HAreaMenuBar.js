import {HElement, add, parent, endparent} from "../../common/H.js";
import {Project} from "../../common/Project.js";
import HWindowPreferences from "../windows/HWindowPreferences.js";

class HMenuBarButton extends HElement {
	constructor(editor, text, items) {
		super("div", {class: "h-menu-bar-button"}, text);

		this.editor = editor;
		this.items = items;

		this.html.tabIndex = 0;

		this.setEvent("click", () => {
			this.open();
		});

		this.setEvent("keydown", (e) => {
			if (e.code == "Enter") {
				this.open();
			}
		});
	}

	open() {
		this.editor.menuManager.openMenu(this.items, {fromElement: this});
	}

	updateItems(items) {
		this.items = items;
	}
}

export default class HAreaMenuBar extends HElement {
	constructor(editor) {
		super("div", {class: "h-menu-bar"});

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
				{text: "Find resource", onClick: () => { alert(1); }},
			]},
			{text: "Resources", items: [

				...Project.resourceTypes.map(type => {
					return {text: "Create " + type.getScreenName(), onClick: () => this.editor.project.createResource(type)};
				}),

				{text: "Change Game Information", onClick: () => this.editor.windowsArea.openGameInformation()},
				{text: "Change Global Game Settings", onClick: () => this.editor.windowsArea.openGlobalGameSettings()},

			]},
			{text: "Script", items: [
				{text: "Import Scripts...", onClick: () => { throw new Error("NOT IMPLEMENT"); }, enabled: false},
			]},
			{text: "Run", items: [
				{text: "Run normally", onClick: () => this.editor.runGame()},
			]},
			{text: "Window", items: [
				{text: "Close All", onClick: () => this.editor.windowsArea.clear()},
			]},
			{text: "Help", items: [
				{text: "About webgm...", onClick: () => this.editor.showAbout()},
			]},
		];

		parent(this);

			this.menuButtons = [];
			for (const menu of menus) {
				this.menuButtons.push( add( new HMenuBarButton(editor, menu.text, menu.items) ) );
			}

			endparent();
	}
}