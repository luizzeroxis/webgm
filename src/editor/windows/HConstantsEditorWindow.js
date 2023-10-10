import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput} from "~/common/h";
import {ProjectConstant} from "~/common/project/ProjectConstant.js";
import Serializer from "~/common/Serializer.js";

export default class HConstantsEditorWindow extends HWindow {
	constructor(manager, editor, array) {
		super(manager);
		this.editor = editor;
		this.array = array;

		this.modified = false;
		this.copyData();

		this.setTitle("User-Defined Constants");

		this.selectedIndex = null;

		parent(this.client);
			parent( add( new HElement("div", {class: "constants-editor-window"}) ) );

				this.divTable = add( new HElement("div", {class: "table"}) );
				this.updateTable();

				parent( add( new HElement("div") ) );
					add( new HButton("Insert", () => {
						const constant = new ProjectConstant();
						this.array.splice(this.selectedIndex ?? 0, 0, constant);

						this.updateTable();
						this.onUpdate();
					}) );

					add( new HButton("Add", () => {
						const constant = new ProjectConstant();
						this.array.push(constant);

						this.updateTable();
						this.onUpdate();
					}) );

					add( new HButton("Delete", () => {
						if (this.selectedIndex != null) {
							this.array.splice(this.selectedIndex, 1);
							this.updateTable();
							this.onUpdate();
						}
					}) );

					add( new HButton("Clear", () => {
						this.array.splice(0, this.array.length);

						this.updateTable();
						this.onUpdate();
					}) );

					add( new HButton("Up", () => {
						if (this.selectedIndex != null && this.selectedIndex != 0) {
							this.array.splice(this.selectedIndex-1, 0, ...this.array.splice(this.selectedIndex, 1));
							this.selectedIndex -= 1;
							this.updateTable();
							this.onUpdate();
						}
					}) );

					add( new HButton("Down", () => {
						if (this.selectedIndex != null && this.selectedIndex != this.array.length-1) {
							this.array.splice(this.selectedIndex+1, 0, ...this.array.splice(this.selectedIndex, 1));
							this.selectedIndex += 1;
							this.updateTable();
							this.onUpdate();
						}
					}) );

					// add( new HButton("Sort", () => {
					// 	// TODO

					// 	this.updateTable();
					// 	this.onUpdate();
					// }) );

					// add( new HButton("Load", () => {
					// 	// TODO

					// 	this.updateTable();
					// 	this.onUpdate();
					// }) );

					// add( new HButton("Save", () => {
					// 	// TODO

					// 	this.updateTable();
					// 	this.onUpdate();
					// }) );

					endparent();

				parent( add( new HElement("div") ) );
					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );
					endparent();

				endparent();
			endparent();
	}

	copyData() {
		this.arrayCopy = Serializer.copyProperty(this.array);
	}

	saveData() {
		//
	}

	restoreData() {
		this.array.splice(0, this.array.length, ...this.arrayCopy);
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	close() {
		if (this.modified) {
			if (!confirm("Close without saving the changes to the constants?")) return;
			this.restoreData();
		}
		super.close();
	}

	updateTable() {
		this.divTable.removeChildren();
		parent(this.divTable);
			add( new HElement("div", {class: "header"}, "Name") );
			add( new HElement("div", {class: "header"}, "Value") );

			for (const [index, constant] of this.array.entries()) {
				parent( add( new HElement("div", {class: "cell"}) ) );
					const nameInput = add( new HTextInput(null, constant.name) );

					nameInput.input.setEvent("input", () => {
						constant.name = nameInput.getValue();
						this.onUpdate();
					});

					nameInput.input.setEvent("focus", () => {
						this.selectedIndex = index;
						console.log(this.selectedIndex);
					});
					endparent();

				parent( add( new HElement("div", {class: "cell"}) ) );
					const valueInput = add( new HTextInput(null, constant.value) );
					valueInput.input.setEvent("input", () => {
						constant.value = valueInput.getValue();
						this.onUpdate();
					});

					valueInput.input.setEvent("focus", () => {
						this.selectedIndex = index;
						console.log(this.selectedIndex);
					});
					endparent();
			}
			endparent();

		if (this.selectedIndex > this.array.length-1) {
			this.selectedIndex = this.array.length-1;
		}
		if (this.array.length == 0) {
			this.selectedIndex = 0;
		}
	}
}