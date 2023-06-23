import {HCanvas} from "~/common/h";
import {decimalToHexAlpha, parseNewLineHash} from "~/common/tools.js";

export default class GameRender {
	constructor(game) {
		this.game = game;

		this.canvasHElement = new HCanvas();
		this.canvas = this.canvasHElement.html;
		this.canvas.setAttribute("tabindex", 0);

		this.currentCanvas = this.canvas;
		this.offscreenCanvas = new OffscreenCanvas(0, 0);

		this.canvasCtx = this.canvas.getContext("2d", {alpha: false});
		this.ctx = this.canvasCtx;

		this.setInitialSize();

		// Cursor
		this.cursorSprite = null;
		this.cursorImageIndex = 0;

		// Draw functions
		this.drawColorAlpha = "#000000ff";
		this.drawFont = -1;
		this.drawHAlign = 0;
		this.drawVAlign = 0;

		this.currentView = 0;
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
		if (this.game.room.viewsEnabled) {
			this.ctx.fillStyle = this.game.project.globalGameSettings.colorOutsideRoom;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			this.currentView = 0;

			for (const view of this.game.room.views) {
				if (!view) continue;
				if (view.visible) {
					this.offscreenCanvas.width = view.viewW;
					this.offscreenCanvas.height = view.viewH;

					this.currentCanvas = this.offscreenCanvas;
					this.ctx = this.offscreenCanvas.getContext("2d");
					this.ctx.save();
					this.ctx.translate(view.viewW / 2, view.viewH / 2);
					this.ctx.rotate(-view.angle * Math.PI / 180);
					this.ctx.translate(-view.viewW / 2, -view.viewH / 2);
					this.ctx.translate(-view.viewX, -view.viewY);

					await this.drawRoom();

					this.ctx.restore();
					this.ctx = this.canvasCtx;
					this.currentCanvas = this.canvas;

					this.ctx.drawImage(this.offscreenCanvas, view.portX, view.portY, view.portW, view.portH);
				}

				this.currentView += 1;
			}
		} else {
			this.drawRoom();
		}
	}

	// Draw the room elements on the current view.
	async drawRoom() {
		// Draw background color

		if (this.game.room.backgroundShowColor) {
			this.ctx.save();
			this.ctx.resetTransform();
			this.ctx.fillStyle = this.game.room.backgroundColor;
			this.ctx.fillRect(0, 0, this.currentCanvas.width, this.currentCanvas.height);
			this.ctx.restore();
		}

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
				const drawEvent = this.game.events.getEventOfObject(instance.object, "draw");

				if (drawEvent) {
					await this.game.events.runEvent(drawEvent, instance);
				} else {
					// No draw event, draw sprite if it has one.
					if (instance.sprite) {
						this.drawSpriteExt(instance.sprite.id, instance.getImageIndex(), instance.x, instance.y, {
							scale: {x: instance.imageXScale, y: instance.imageYScale},
							angle: instance.imageAngle,
							blend: instance.imageBlend,
							alpha: instance.imageAlpha,
						});
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
					this.game.input.mouseXInCurrentView - this.cursorSprite.originx,
					this.game.input.mouseYInCurrentView - this.cursorSprite.originy);
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
		return background;
	}

	drawImageExt(image, x, y, options) {
		/* options {
			origin: {x, y},
			scale: {x, y},
			angle,
			blend,
			alpha,
			size: {width, height},
			part: {left, top, width, height},
		} */
		// TODO blend

		this.ctx.save();
		this.ctx.translate(x, y);

		if (options?.angle != null) {
			this.ctx.rotate(-options.angle * Math.PI/180);
		}
		if (options?.scale) {
			this.ctx.scale(options.scale.x, options.scale.y);
		}
		if (options?.alpha != null) {
			this.ctx.globalAlpha = options.alpha;
		}

		if (options?.size) {
			this.ctx.drawImage(image,
				0, 0, options.size.width, options.size.height);
		} else if (options?.part) {
			this.ctx.drawImage(image,
				options.part.left, options.part.top, options.part.width, options.part.height,
				0, 0, options.part.width, options.part.height);
		} else if (options?.tiled) {
			// nope
		} else {
			this.ctx.drawImage(image, -(options?.origin?.x ?? 0), -(options?.origin?.y ?? 0));
		}

		if (options?.alpha != null) {
			this.ctx.globalAlpha = 1;
		}

		this.ctx.restore();
	}

	drawImageTiled(image, x, y, options) {
		/* options {
			scale: {x, y},
			blend,
			alpha,
		} */
		// TODO blend

		const w = image.width * (options?.scale?.x ?? 1);
		const h = image.height * (options?.scale?.y ?? 1);

		let xStart = x % w;
		let yStart = y % h;
		if (xStart > 0) xStart -= w;
		if (yStart > 0) yStart -= h;

		if (options?.alpha != null) {
			this.ctx.globalAlpha = options.alpha;
		}

		for (let xx = xStart; xx < this.game.room.width; xx += w) {
			for (let yy = yStart; yy < this.game.room.height; yy += h) {
				this.ctx.drawImage(image, xx - (options?.origin?.x ?? 0), yy - (options?.origin?.y ?? 0), w, h);
			}
		}

		if (options?.alpha != null) {
			this.ctx.globalAlpha = 1;
		}
	}

	// Draw a sprite with the image index at x and y.
	drawSprite(spriteIndex, imageIndex, x, y) {
		const sprite = this.getSprite(spriteIndex);
		const image = sprite?.images[Math.floor(Math.floor(imageIndex) % sprite.images.length)]?.image;
		if (!image) return;

		this.ctx.drawImage(image, x - sprite.originx, y - sprite.originy);
	}

	// Draw a sprite with extra options.
	drawSpriteExt(spriteIndex, imageIndex, x, y, options) {
		const sprite = this.getSprite(spriteIndex);
		const image = sprite?.images[Math.floor(Math.floor(imageIndex) % sprite.images.length)]?.image;
		if (!image) return;

		this.drawImageExt(image, x, y, {origin: {x: sprite.originx, y: sprite.originy}, ...options});
	}

	drawSpriteTiled(spriteIndex, imageIndex, x, y, options) {
		const sprite = this.getSprite(spriteIndex);
		const image = sprite?.images[Math.floor(Math.floor(imageIndex) % sprite.images.length)]?.image;
		if (!image) return;

		this.drawImageTiled(image, x, y, {origin: {x: sprite.originx, y: sprite.originy}, ...options});
	}

	drawBackground(backgroundIndex, x, y) {
		this.ctx.drawImage(this.getBackground(backgroundIndex).image.image, x, y);
	}

	drawBackgroundExt(backgroundIndex, x, y, options) {
		this.drawImageExt(this.getBackground(backgroundIndex).image.image, x, y, options);
	}

	drawBackgroundTiled(backgroundIndex, x, y, options) {
		this.drawImageTiled(this.getBackground(backgroundIndex).image.image, x, y, options);
	}

	drawClear(col, alpha=1) {
		this.ctx.save();
		this.ctx.resetTransform();

		if (alpha != 1) {
			this.ctx.clearRect(0, 0, this.currentCanvas.width, this.currentCanvas.height);
		}

		this.ctx.fillStyle = decimalToHexAlpha(col, alpha);
		this.ctx.fillRect(0, 0, this.currentCanvas.width, this.currentCanvas.height);

		this.restore();
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

	drawArrow(x1, y1, x2, y2, size) {
		this.ctx.strokeStyle = this.drawColorAlpha;
		this.ctx.fillStyle = this.drawColorAlpha;

		this.ctx.save();
		this.ctx.translate(0.5, 0.5);

		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.closePath();
		this.ctx.stroke();

		const lineSize = Math.hypot(x2 - x1, y2 - y1);
		size = Math.min(size, lineSize);

		const angle = Math.atan2(y2 - y1, x2 - x1);
		const mx = x2 + Math.cos(angle) * -size;
		const my = y2 + Math.sin(angle) * -size;

		const tx = mx + Math.cos(angle + Math.PI/2) * (size/3);
		const ty = my + Math.sin(angle + Math.PI/2) * (size/3);

		const bx = mx + Math.cos(angle - Math.PI/2) * (size/3);
		const by = my + Math.sin(angle - Math.PI/2) * (size/3);

		this.ctx.beginPath();
		this.ctx.moveTo(x2, y2);
		this.ctx.lineTo(tx, ty);
		this.ctx.lineTo(bx, by);
		this.ctx.closePath();
		this.ctx.fill();

		this.ctx.restore();
	}

	drawText(x, y, string, sep, w) {
		this.ctx.fillStyle = this.drawColorAlpha;

		const geometry = this.getTextGeometry(string, sep, w);

		let cy;
		if (this.drawVAlign == 0) { cy = y; }
		if (this.drawVAlign == 1) { cy = y - geometry.height/2; }
		if (this.drawVAlign == 2) { cy = y - geometry.height; }

		for (const line of geometry.lines) {
			let cx;
			if (this.drawHAlign == 0) { cx = x; }
			if (this.drawHAlign == 1) { cx = x - line.width/2; }
			if (this.drawHAlign == 2) { cx = x - line.width; }

			this.ctx.fillText(line.text, cx, cy + line.y);
		}
	}

	getTextGeometry(string, sep, w) {
		// This does not render exactly like GM. Maybe changing to a bitmap based text renderer will help with that.

		// Needed to do before measureText
		this.ctx.font = this.game.loadedProject.cssFontsCache[this.drawFont];
		this.ctx.textAlign = "left";
		this.ctx.textBaseline = "top";

		let lineHeight = sep;
		if (sep == null || sep < 0) {
			const font = this.game.project.getResourceById("ProjectFont", this.drawFont);
			lineHeight = (font?.size ?? 12) / (0.75);
			// const metrics = this.ctx.measureText("");
			// lineHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
		}

		let totalWidth = 0;
		let totalHeight = 0;

		const drawLines = [];
		let currentYInText = 0;

		let lines = [];
		if (string != "") {
			lines = parseNewLineHash(string).split("\n");
		}

		for (const line of lines) {
			let lineText = "";
			let currentXInLine = 0;

			let words;
			if (w != null) {
				words = line.split(/(?<=[ -])/);
			} else {
				words = [line];
			}

			for (const word of words) {
				const metrics = this.ctx.measureText(word);
				const width = metrics.width;

				// check
				if (w != null && w >= 0 && ((currentXInLine + width) > w) && currentXInLine != 0) {
					// Break the line.
					drawLines.push({y: currentYInText, width: currentXInLine, text: lineText});
					currentYInText += lineHeight;
					totalWidth = Math.max(totalWidth, currentXInLine);

					lineText = "";
					currentXInLine = 0;
				}

				lineText += word;
				currentXInLine += width;
			}

			drawLines.push({y: currentYInText, width: currentXInLine, text: lineText});
			currentYInText += lineHeight;
			totalWidth = Math.max(totalWidth, currentXInLine);
		}

		totalHeight = currentYInText;

		return {
			width: totalWidth,
			height: totalHeight,
			lines: drawLines,
		};
	}
}