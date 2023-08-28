import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton} from "~/common/h";
import {openFile} from "~/common/tools.js";
import HImageList from "~/editor/components/HImageList/HImageList.js";

export default class HSpriteImagesEditorWindow extends HWindow {
	constructor(manager, spriteWindow) {
		super(manager);
		this.spriteWindow = spriteWindow;
		this.images = spriteWindow.resource.images;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-sprite-images"}) ) );
				parent( add( new HElement("div") ) );

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					add( new HButton("Add", () => {
						this.addImage();
					}) );

					this.buttonMoveLeft = add( new HButton("Move left", () => {
						this.images.splice(this.imageList.selected-1, 0, ...this.images.splice(this.imageList.selected, 1));
						this.updateImageListItems();
						this.imageList.setSelected(this.imageList.selected-1);
						this.onUpdate();
					}) );

					this.buttonMoveRight = add( new HButton("Move right", () => {
						this.images.splice(this.imageList.selected+1, 0, ...this.images.splice(this.imageList.selected, 1));
						this.updateImageListItems();
						this.imageList.setSelected(this.imageList.selected+1);
						this.onUpdate();
					}) );

					this.buttonDelete = add( new HButton("Delete", () => {
						this.images.splice(this.imageList.selected, 1);
						this.updateImageListItems();

						if (this.images.length == 0) {
							this.imageList.setSelected(null);
						} else
						if (this.imageList.selected >= this.images.length) {
							this.imageList.setSelected(this.images.length - 1);
						}
						this.onUpdate();
					}) );

					endparent();

				this.imageList = add(new HImageList());
				this.imageList.onSelectedChange = () => this.updateMenu();
				this.updateImageListItems();

				endparent();
			endparent();
	}

	copyData() {
		this.imagesCopy = [...this.spriteWindow.resource.images];
	}

	saveData() {
		this.spriteWindow.updateImageInfo();
		this.spriteWindow.onUpdate();
	}

	restoreData() {
		this.spriteWindow.resource.images = this.imagesCopy;

		this.spriteWindow.updateImageInfo();
		this.spriteWindow.onUpdate();
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	updateTitle() {
		this.setTitle("Sprite Editor: "+this.spriteWindow.resource.name);
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
			this.updateImageListItems();
			this.imageList.setSelected(null);
			this.onUpdate();
		})
		.catch(e => {
			if (e.message == "Could not load image") {
				alert("Error when opening image");
			}
			throw e;
		});
	}

	updateImageListItems() {
		this.imageList.setItems(this.images.map((image, index) => ({
			image: image.image,
			text: "image " + index.toString(),
		})));
	}

	updateMenu() {
		this.buttonMoveLeft.setDisabled(this.imageList.selected == null ? true : (this.imageList.selected == 0));
		this.buttonMoveRight.setDisabled(this.imageList.selected == null ? true : (this.imageList.selected == this.images.length-1));
		this.buttonDelete.setDisabled(this.imageList.selected == null);
	}

	close() {
		if (this.modified) {
			if (!confirm("Close without saving the changes to the sprite?")) return;
			this.restoreData();
		}
		super.close();
	}
}