import {parent, endparent, add, removeChildren, HElement, HButton} from "~/common/H.js";
import {openFile} from "~/common/tools.js";
import HWindow from "~/editor/HWindow.js";

export default class HWindowSpriteImages extends HWindow {
	constructor(editor, id) {
		super(editor, id);

		this.title.html.textContent = "Sprite Editor: "+id.spriteWindow.sprite.name;

		this.spriteWindow = id.spriteWindow;
		this.images = [...id.spriteWindow.paramImages];

		this.selected = null;

		parent(this.client);
			parent( add( new HElement("div", {class: "window-sprite-images"}) ) );
				parent( add( new HElement("div") ) );
					add( new HButton("Add", () => {
						this.addImage();
					}) );

					this.buttonMoveLeft = add( new HButton("Move left", () => {
						this.images.splice(this.selected-1, 0, ...this.images.splice(this.selected, 1));
						this.updateList();
						this.setSelected(this.selected-1);
					}) );

					this.buttonMoveRight = add( new HButton("Move right", () => {
						this.images.splice(this.selected+1, 0, ...this.images.splice(this.selected, 1));
						this.updateList();
						this.setSelected(this.selected+1);
					}) );

					this.buttonDelete = add( new HButton("Delete", () => {
						this.images.splice(this.selected, 1);
						this.updateList();

						if (this.images.length == 0) {
							this.setSelected(null);
						} else
						if (this.selected >= this.images.length) {
							this.setSelected(this.images.length - 1);
						}
					}) );

					endparent();

				this.divList = add( new HElement("div", {class: "list"}) );
				this.divList.setEvent("click", e => {
					if (e.target != this.divList.html) return;
					this.setSelected(null);
				});
				this.divItems = [];

				this.updateList();
				endparent();

			this.makeApplyOkButtons(
				() => {
					id.spriteWindow.paramImages = this.images;
					id.spriteWindow.updateImageInfo();
				},
				() => this.close(),
			);

			endparent();
	}

	async addImage(position) {
		const files = await openFile("image/*", true);

		this.spriteWindow.loadImagesFromFiles(files)
		.then(images => {
			if (position != null) {
				this.images.splice(position, 0, ...images);
			} else {
				this.images.push(...images);
			}
			this.updateList();
			this.setSelected(null);
		})
		.catch(() => {
			alert("Error when opening image");
		})
		.finally(() => {
			//
		});
	}

	updateMenu() {
		this.buttonMoveLeft.setDisabled(this.selected == null ? true : (this.selected == 0));
		this.buttonMoveRight.setDisabled(this.selected == null ? true : (this.selected == this.images.length-1));
		this.buttonDelete.setDisabled(this.selected == null ? true : false);
	}

	updateList() {
		removeChildren(this.divList);
		this.divItems = [];

		parent(this.divList);
			for (const [index, image] of this.images.entries()) {
				this.divItems[index] = parent( add( new HElement("div", {class: "item"}) ) );
					this.divItems[index].html.tabIndex = 0;
					this.divItems[index].setEvent("focus", () => {
						this.setSelected(index);
					});
					this.divItems[index].setEvent("click", () => {
						this.setSelected(index);
					});

					add( image.image );
					add( new HElement("div", {}, "image "+index.toString()) );
					endparent();
			}
			endparent();

		this.setSelected(this.selected);
	}

	setSelected(index) {
		this.divItems[this.selected]?.html.classList.remove("selected");
		this.selected = index;
		if (index != null) {
			this.divItems[index]?.html.classList.add("selected");
		}
		this.updateMenu();
	}
}