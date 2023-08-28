import HModalWindow from "~/common/components/HWindowManager/HModalWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput} from "~/common/h";

export default class HMessageWindow extends HModalWindow {
	constructor(manager, game, text, options={}) {
		super(manager);
		this.game = game;

		this.setResizable(false);
		this.setMinimizeButton(false);
		this.setMaximizeButton(false);
		this.escCloses = true;

		this.setTitle(game.windows.messageCaption ?? "Message");

		if (game.windows.messageCaption == null) {
			this.setClientOnly(true);
		}

		this.html.style.opacity = `${game.windows.messageAlpha}`;

		parent(this.client);
			this.client.html.classList.add("message-window");

			if (game.windows.messageBackground) {
				this.client.html.style.backgroundImage = `url("${game.windows.messageBackground.image.src}")`;
			}

			const buttonSprite = game.windows.messageButtonSprite;
			if (buttonSprite) {
				if (buttonSprite.images[0]) {
					this.client.html.style.setProperty("--button-image", `url(${buttonSprite.images[0].src})`);
					this.client.html.style.setProperty("--button-width", `${buttonSprite.images[0].width}px`);
					this.client.html.style.setProperty("--button-height", `${buttonSprite.images[0].height}px`);
				}
				if (buttonSprite.images[1]) {
					this.client.html.style.setProperty("--button-hover-image", `url(${buttonSprite.images[1].src})`);
				}
				if (buttonSprite.images[2]) {
					this.client.html.style.setProperty("--button-pressed-image", `url(${buttonSprite.images[2].src})`);
				}
			}

			const buttonFont = game.windows.messageButtonFont;
			if (buttonFont) {
				this.client.html.style.setProperty("--button-font", buttonFont.font);
				this.client.html.style.setProperty("--button-color", buttonFont.color);
			}

			const buttonHoverColor = game.windows.messageButtonHoverColor;
			if (buttonHoverColor) {
				this.client.html.style.setProperty("--button-hover-color", buttonHoverColor);
			}

			const setFont = (elem, font) => {
				if (!font) return;
				elem.html.style.font = font.font;
				elem.html.style.color = font.color;
			};

			this.textDiv = add( new HElement("div", {class: "text"}, text) );
			setFont(this.textDiv, game.windows.messageTextFont);

			if (options.input) {
				this.input = add( new HTextInput(null, options.input.default, "input") );
				this.input.input.html.style.backgroundColor = game.windows.messageInputBackgroundColor;
				setFont(this.input.input, game.windows.messageInputFont);
			}

			this.buttonsDiv = parent( add( new HElement("div", {class: "buttons"}) ) );
				this.buttons = [];
				if (options.buttons) {
					for (const [index, button] of options.buttons.entries()) {
						if (button != "") {
							this.buttons.push(add( new HButton(button, () => {
								this.close(index+1);
							}, "button") ));
						}
					}
				} else {
					this.buttons.push(add( new HButton("OK", () => {
						if (options.input) {
							this.close(this.input.getValue());
						} else {
							this.close();
						}
					}, "button") ));
				}
				endparent();
			endparent();
	}

	onAdd() {
		super.onAdd();
		if (this.input) {
			this.input.input.html.focus();
		} else {
			this.buttons[0]?.html.focus();
		}
	}

	setPositionToDefault() {
		const maxSize = this.getMaxSize();

		let x = this.game.windows.messagePosition.x ?? -1;
		if (x == -1) {
			x = maxSize.w / 2 - this.w / 2;
		}

		let y = this.game.windows.messagePosition.y ?? -1;
		if (y == -1) {
			y = maxSize.h / 2 - this.h / 2;
		}

		this.setPosition(x, y);
	}

	setSizeToDefault() {
		let w = this.game.windows.messageSize.w ?? -1;
		if (w == -1) {
			w = this.game.windows.messageBackground?.image.width ?? 320;
		}

		let h = this.game.windows.messageSize.h ?? -1;
		if (h == -1) {
			h = null;
		}

		this.setSizeAuto(w, h);
	}
}