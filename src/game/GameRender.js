import {HCanvas} from "~/common/h";
import {decimalToHexAlpha, parseNewLineHash} from "~/common/tools.js";

export default class GameRender {
	constructor(game) {
		this.game = game;

		this.canvasHElement = new HCanvas();
		this.canvas = this.canvasHElement.html;
		this.canvas.setAttribute("tabindex", 0);
		this.ctx = this.canvas.getContext("2d", {alpha: false});

		this.setInitialSize();

		// Cursor
		this.cursorSprite = null;
		this.cursorImageIndex = 0;

		// Draw functions
		this.drawColorAlpha = "#000000ff";
		this.drawFont = -1;
		this.drawHAlign = 0;
		this.drawVAlign = 0;
	}

	start() {
		if (this.game.project.globalGameSettings.startInFullScreen) {
			this.setFullscreen(true);
		}

		if (!this.game.project.globalGameSettings.displayCursor) {
			this.canvas.classList.add("no-cursor");
		}
	}

	end() {
		this.setFullscreen(false);
		this.canvas.classList.remove("no-cursor");
	}

	// Resizes the canvas to the size of the first room
	setInitialSize() {
		const room = this.game.project.resources.ProjectRoom[0];
		this.setSize(room.width, room.height);
	}

	setSize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx.imageSmoothingEnabled = false;
	}

	// Set the fullscreen status.
	async setFullscreen(fullscreen) {
		if (fullscreen) {
			try {
				await this.canvas.requestFullscreen();
			} catch (e) {
				console.warn("window_set_fullscreen failed");
			}
		} else {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			}
		}
	}

	// Get the fullscreen status.
	getFullscreen() {
		return (document.fullscreenElement != null);
	}

	// Draw all the views of the current room.
	async drawViews() {
		// Currently there are no views. But the following should happen for every view.

		// Draw background color
		if (this.game.room.backgroundShowColor) {
			this.ctx.fillStyle = this.game.room.backgroundColor;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
		// this.ctx.fillStyle = "black";

		// Draw background backgrounds

		for (const roomBackground of this.game.room.backgrounds) {
			if (!roomBackground) continue;
			if (roomBackground.isForeground == true) continue;
			this.drawRoomBackground(roomBackground);
		}

		// TODO Draw tiles

		// Draw instances

		const instances_by_depth = this.game.instances
			.filter(x => x.exists)
			.sort((a, b) => b.depth - a.depth);

		for (const instance of instances_by_depth) {
			if (!instance.exists) continue;

			// Only draw if visible
			if (instance.visible) {
				const drawEvent = this.game.getEventOfInstance(instance, "draw");

				if (drawEvent) {
					await this.game.doEvent(drawEvent, instance);
				} else {
					// No draw event, draw sprite if it has one.
					if (instance.sprite) {
						this.drawSpriteExt(instance.sprite.id, instance.getImageIndex(), instance.x, instance.y, instance.imageXScale, instance.imageYScale, instance.imageAngle, instance.imageBlend, instance.imageAlpha);
					}
				}
			}
		}

		// Draw foreground backgrounds

		for (const roomBackground of this.game.room.backgrounds) {
			if (!roomBackground) continue;
			if (roomBackground.isForeground == false) continue;
			this.drawRoomBackground(roomBackground);
		}

		// Draw mouse cursor

		if (this.cursorSprite) {
			const image = this.cursorSprite.images[Math.floor(Math.floor(this.cursorImageIndex) % this.cursorSprite.images.length)]?.image;
			if (image) {
				this.ctx.drawImage(image,
					this.game.input.mouseX - this.cursorSprite.originx,
					this.game.input.mouseY - this.cursorSprite.originy);
			}
			this.cursorImageIndex = ((++this.cursorImageIndex) % this.cursorSprite.images.length);
		}
	}

	drawRoomBackground(roomBackground) {
		if (!roomBackground.visible) return false;

		const background = this.game.project.getResourceById("ProjectBackground", roomBackground.backgroundIndex);
		if (!background) return false;

		const image = background.image;
		if (!image) return false;

		// TODO blend

		let xStart = roomBackground.x;
		let yStart = roomBackground.y;

		const width = background.image.width * roomBackground.xScale;
		const height = background.image.height * roomBackground.yScale;

		if (roomBackground.tileHorizontally) {
			xStart = (roomBackground.x % width) - width;
		}
		if (roomBackground.tileVertically) {
			yStart = (roomBackground.y % height) - height;
		}

		for (let x = xStart; x < this.game.room.width; x += width) {
			for (let y = yStart; y < this.game.room.height; y += height) {
				this.ctx.globalAlpha = roomBackground.alpha;
				this.ctx.drawImage(image.image, x, y, width, height);
				this.ctx.globalAlpha = 1;

				if (!roomBackground.tileVertically) {
					break;
				}
			}
			if (!roomBackground.tileHorizontally) {
				break;
			}
		}

		return true;
	}

	getSprite(spriteIndex) {
		const sprite = this.game.project.getResourceById("ProjectSprite", spriteIndex);
		if (!sprite) {
			throw this.game.makeNonFatalError({
				type: "trying_to_draw_non_existing_sprite",
				sprite: spriteIndex,
			}, "Trying to draw non-existing sprite. (" + spriteIndex.toString() +")");
		}
		return sprite;
	}

	getBackground(backgroundIndex) {
		const background = this.game.project.getResourceById("ProjectBackground", backgroundIndex);
		if (!background) {
			throw this.game.makeNonFatalError({
				type: "trying_to_draw_non_existing_background",
				background: backgroundIndex,
			}, "Trying to draw non-existing background. (" + backgroundIndex.toString() +")");
		}
		return 0;
	}

	// Draw a sprite with the image index at x and y.
	drawSprite(spriteIndex, imageIndex, x, y) {
		const sprite = this.getSprite(spriteIndex);
		const image = sprite?.images[Math.floor(Math.floor(imageIndex) % sprite.images.length)]?.image;
		if (!image) return;

		this.ctx.drawImage(image, x - sprite.originx, y - sprite.originy);
	}

	// Draw a sprite with extra options.
	drawSpriteExt(spriteIndex, imageIndex, x, y, xScale, yScale, angle, blend, alpha) {
		// TODO blend

		const sprite = this.getSprite(spriteIndex);
		const image = sprite?.images[Math.floor(Math.floor(imageIndex) % sprite.images.length)]?.image;
		if (!image) return;

		this.ctx.save();

		this.ctx.translate(x, y);
		this.ctx.rotate(-angle * Math.PI/180);
		this.ctx.scale(xScale, yScale);

		this.ctx.globalAlpha = alpha;
		this.ctx.drawImage(image, -sprite.originx, -sprite.originy);
		this.ctx.globalAlpha = 1;

		this.ctx.restore();
	}

	drawSpriteTiledExt(spriteIndex, imageIndex, x, y, xScale=1, yScale=1, blend="#ffffff", alpha=1) {
		// TODO blend

		const sprite = this.getSprite(spriteIndex);
		const image = sprite?.images[Math.floor(Math.floor(imageIndex) % sprite.images.length)]?.image;
		if (!image) return;

		const w = image.width * xScale;
		const h = image.height * yScale;

		let xStart = x % w;
		let yStart = y % h;
		if (xStart > 0) xStart -= w;
		if (yStart > 0) yStart -= h;

		this.ctx.globalAlpha = alpha;

		for (let xx = xStart; xx < this.game.room.width; xx += w) {
			for (let yy = yStart; yy < this.game.room.height; yy += h) {
				this.ctx.drawImage(image, xx, yy, w, h);
			}
		}

		this.ctx.globalAlpha = 1;
	}

/*	drawImageGeneral(image, x, y, options) {
		// options = {size = {w, h}, tiled, part: {l, t, w, h}, rot, scale: {x, y}, color, alpha, vertColor: {c1, c2, c3, c4}}

		if (options.size) {
			this.ctx.drawImage(image, x, y, options.size.w, options.size.h);
			return;
		}

		if (options.tiled) {
			let w = image.w;
			let h = image.h;

			if (options.scale) {
				w *= scale.x;
				h *= scale.y;
			}

			xStart = x % w;
			yStart = y % h;
			if (xStart > 0) xStart -= w;
			if (yStart > 0) yStart -= h;

			for (let xx = xStart; xx < this.room.width; xx += w) {
				for (let yy = yStart; yy < this.room.height; yy += h) {
					if (options.scale) {
						this.ctx.drawImage(image, xx, yy, w, h);
					} else {
						this.ctx.drawImage(image, xx, yy);
					}
				}
			}
			return;
		}

		if (options.part) {
			this.ctx.drawImage(image,
				options.part.l, options.part.t, options.part.w, options.part.h,
				x, y, options.part.w, options.part.h);
			return;
		}

		// rot, scale: {x, y}, color, alpha
		if (options.rot != null || options.scale) {
			this.ctx.save();

			if (options.rot) {
				this.ctx.rotate(-rot * Math.PI/180);
			}
			if (options.scale) {

			}

			this.ctx.drawImage(image, x, y);

			this.ctx.restore();
		}

		this.ctx.drawImage(image, x, y);

	}*/

	drawBackground(backgroundIndex, x, y) {
		this.game.ctx.drawImage(this.getBackground(backgroundIndex), x, y);
	}

	drawClear(col, alpha=1) {
		if (alpha != 1) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		this.ctx.fillStyle = decimalToHexAlpha(col, alpha);
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawPoint(x, y) {
		this.ctx.fillStyle = this.drawColorAlpha;
		this.ctx.fillRect(x, y, 1, 1);
	}

	drawLine(x1, y1, x2, y2, w=1) {
		this.ctx.strokeStyle = this.drawColorAlpha;
		this.ctx.lineWidth = w;

		this.ctx.save();
		this.ctx.translate(0.5, 0.5);

		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.closePath();
		this.ctx.stroke();

		this.ctx.restore();

		this.ctx.lineWidth = 1;
	}

	drawRectangle(x1, y1, x2, y2, outline) {
		if (outline) {
			this.ctx.strokeStyle = this.drawColorAlpha;
			this.ctx.save();
			this.ctx.translate(0.5, 0.5);
			this.ctx.strokeRect(x1, y1, x2-x1, y2-y1);
			this.ctx.restore();
		} else {
			this.ctx.fillStyle = this.drawColorAlpha;
			this.ctx.fillRect(x1, y1, x2-x1, y2-y1);
		}
	}

	drawRoundRect(x1, y1, x2, y2, outline) {
		// TODO remove antialiasing
		if (outline) {
			this.ctx.save();
			this.ctx.translate(0.5, 0.5);

			this.ctx.strokeStyle = this.drawColorAlpha;
		} else {
			this.ctx.fillStyle = this.drawColorAlpha;
		}

		this.ctx.beginPath();
		this.ctx.roundRect(x1, y1, x2-x1, y2-y1, 4);
		this.ctx.closePath();

		if (outline) {
			this.ctx.stroke();

			this.ctx.restore();
		} else {
			this.ctx.fill();
		}
	}

	drawTriangle(x1, y1, x2, y2, x3, y3, outline) {
		if (outline) {
			this.ctx.strokeStyle = this.drawColorAlpha;
			// this.ctx.save();
			// this.ctx.translate(0.5, 0.5);
		} else {
			this.ctx.fillStyle = this.drawColorAlpha;
		}

		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.lineTo(x3, y3);
		this.ctx.closePath();

		if (outline) {
			this.ctx.stroke();
			// this.ctx.restore();
		} else {
			this.ctx.fill();
		}
	}

	drawCircle(x, y, r, outline) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, Math.abs(r), 0, Math.PI*2);
		if (outline) {
			this.ctx.strokeStyle = this.drawColorAlpha;
			this.ctx.stroke();
		} else {
			this.ctx.fillStyle = this.drawColorAlpha;
			this.ctx.fill();
		}
		this.ctx.closePath();
	}

	drawEllipse(x1, y1, x2, y2, outline) {
		const x = (x2 - x1) / 2 + x1;
		const y = (y2 - y1) / 2 + y1;

		this.ctx.beginPath();
		this.ctx.ellipse(x, y, Math.abs(x2 - x), Math.abs(y2 - y), 0, 0, Math.PI*2);
		if (outline) {
			this.ctx.strokeStyle = this.drawColorAlpha;
			this.ctx.stroke();
		} else {
			this.ctx.fillStyle = this.drawColorAlpha;
			this.ctx.fill();
		}
		this.ctx.closePath();
	}

	drawText(x, y, string) {
		this.ctx.fillStyle = this.drawColorAlpha;
		this.ctx.font = this.game.loadedProject.cssFontsCache[this.drawFont];

		// holy shit now this is epic
		this.ctx.textAlign = (["left", "center", "right"])[this.drawHAlign];
		this.ctx.textBaseline = (["top", "middle", "bottom"])[this.drawVAlign];

		// Look, I tried making this be like GM but it just doesn't add up. Hopefully will be fixed if and when we change to a custom font renderer

		const lines = parseNewLineHash(string).split("\n");
		let height = 0;

		// Calculate heights, only if more than 1 line
		if (lines.length > 1) {
			const textMetrics = this.ctx.measureText("");
			height = Math.abs(textMetrics.fontBoundingBoxDescent) + Math.abs(textMetrics.fontBoundingBoxAscent);
		}

		// Calculate initial y
		let currentY;
		if (this.drawVAlign == 0) { // top
			currentY = y;
		} else if (this.drawVAlign == 1) { // middle
			currentY = y - (height * (lines.length - 1)) / 2;
		} else if (this.drawVAlign == 2) { // bottom
			currentY = y - (height * (lines.length - 1));
		}

		for (const line of lines) {
			this.ctx.fillText(line, x, currentY);
			currentY += height;
		}
	}
}