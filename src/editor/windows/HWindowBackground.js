import {parent, endparent, add, HElement, HButton, HTextInput, HImage} from "~/common/H.js";
import ImageWrapper from "~/common/ImageWrapper.js";
import {openFile, setOnFileDrop} from "~/common/tools.js";
import HWindow from "~/editor/HWindow.js";

export default class HWindowBackground extends HWindow {
	constructor(editor, id, background) {
		super(editor, id);

		this.background = background;

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "panel-container window-background"}) ) );
				parent( add( new HElement("div", {class: "properties"}) ) );

					this.paramImage = background.image;

					const inputName = add( new HTextInput("Name:", background.name) );

					this.buttonLoadBackground = add( new HButton("Load Background", async () => {
						const file = await openFile("image/*");
						this.loadBackgroundFromFile(file);
					}) );

					parent( add( new HElement("div", {}, "Width: ")) );
						this.divWidth = add( new HElement("span", {}, "0") );
						endparent();

					parent( add( new HElement("div", {}, "Height: ")) );
						this.divHeight = add( new HElement("span", {}, "0") );
						endparent();

					endparent();

				parent( add( new HElement("div", {class: "preview"}) ) );
					this.imgBackground = add( new HImage() );
					endparent();

				this.updateImageInfo();

				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.project.changeResourceName(background, inputName.getValue());
					this.editor.project.changeBackgroundImage(background, this.paramImage);

					this.updateTitle();
				},
				() => this.close(),
			);
			endparent();

		// Open file if dropped in the window body
		setOnFileDrop(this.html, file => this.loadBackgroundFromFile(file));
	}

	updateTitle() {
		this.title.html.textContent = "Edit Background "+this.background.name;
	}

	loadBackgroundFromFile(file) {
		this.buttonLoadBackground.setDisabled(true);

		const image = new ImageWrapper(file);

		image.promise
		.then(() => {
			this.paramImage = image;
			this.updateImageInfo();
		})
		.catch(() => {
			// this.updateImageInfo();
			alert("Error when opening image");
		})
		.finally(() => {
			this.buttonLoadBackground.setDisabled(false);
		});
	}

	updateImageInfo() {
		if (this.paramImage != null) {
			this.imgBackground.setSrc(this.paramImage.src);
			this.paramImage.promise.then(() => {
				this.divWidth.html.textContent = this.paramImage.width;
				this.divHeight.html.textContent = this.paramImage.height;
			});
		} else {
			this.imgBackground.setSrc(null);
			this.divWidth.html.textContent = "0";
			this.divHeight.html.textContent = "0";
		}
	}
}