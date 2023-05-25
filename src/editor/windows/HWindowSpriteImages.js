import {parent, endparent, add, HElement, HButton} from "~/common/h";
import {openFile} from "~/common/tools.js";
import HImageList from "~/editor/components/HImageList/HImageList.js";
import HWindow from "~/editor/HWindow.js";

export default class HWindowSpriteImages extends HWindow {
	constructor(editor, id) {
		super(editor, id);

		this.title.html.textContent = "Sprite Editor: "+id.spriteWindow.sprite.name;

		this.spriteWindow = id.spriteWindow;
		this.images = [...id.spriteWindow.paramImages];

		parent(this.client);
			parent( add( new HElement("div", {class: "window-sprite-images"}) ) );
				parent( add( new HElement("div") ) );
					add( new HButton("Add", () => {
						this.addImage();
					}) );

					this.buttonMoveLeft = add( new HButton("Move left", () => {
						this.images.splice(this.imageList.selected-1, 0, ...this.images.splice(this.imageList.selected, 1));
						this.updateImageListItems();
						this.imageList.setSelected(this.imageList.selected-1);
					}) );

					this.buttonMoveRight = add( new HButton("Move right", () => {
						this.images.splice(this.imageList.selected+1, 0, ...this.images.splice(this.imageList.selected, 1));
						this.updateImageListItems();
						this.imageList.setSelected(this.imageList.selected+1);
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
					}) );

					endparent();

				this.imageList = add(new HImageList());
				this.imageList.onSelectedChange = () => this.updateMenu();
				this.updateImageListItems();

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
			this.updateImageListItems();
			this.imageList.setSelected(null);
		})
		.catch(() => {
			alert("Error when opening image");
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
}