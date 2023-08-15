export default class Room {
	constructor(resource, game) {
		this.game = game;

		this.resource = resource;
		this.width = resource.width;
		this.height = resource.height;
		this.caption = resource.caption;
		this.speed = resource.speed;
		this.persistent = resource.persistent;
		this.backgroundShowColor = resource.drawBackgroundColor;
		this.backgroundColor = resource.backgroundColor;
		this.viewsEnabled = resource.enableViews;

		this.backgrounds = resource.backgrounds.map(roomBackground => {
			if (!roomBackground) return null;

			let xScale = 1;
			let yScale = 1;
			if (roomBackground.stretch) {
				const backgroundImage = this.game.project.getResourceById("ProjectBackground", roomBackground.backgroundIndex)?.image;
				if (backgroundImage) {
					xScale = resource.width / backgroundImage.width;
					yScale = resource.height / backgroundImage.height;
				}
			}
			return {
				visible: roomBackground.visibleAtStart,
				isForeground: roomBackground.isForeground,
				backgroundIndex: roomBackground.backgroundIndex,
				tileHorizontally: roomBackground.tileHorizontally,
				tileVertically: roomBackground.tileVertically,
				x: roomBackground.x,
				y: roomBackground.y,
				horizontalSpeed: roomBackground.horizontalSpeed,
				verticalSpeed: roomBackground.verticalSpeed,

				xScale: xScale,
				yScale: yScale,
				blend: 16777215, // TODO
				alpha: 1,
			};
		});

		// TODO tiles
		this.tiles = [];

		this.views = resource.views.map(view => {
			if (!view) return null;

			return {
				visible: view.visibleAtStart,
				viewX: view.viewX,
				viewY: view.viewY,
				viewW: view.viewW,
				viewH: view.viewH,
				portX: view.portX,
				portY: view.portY,
				portW: view.portW,
				portH: view.portH,
				objectFollowIndex: view.objectFollowIndex, // TODO
				objectFollowHorizontalBorder: view.objectFollowHorizontalBorder,
				objectFollowVerticalBorder: view.objectFollowVerticalBorder,
				objectFollowHorizontalSpeed: view.objectFollowHorizontalSpeed,
				objectFollowVerticalSpeed: view.objectFollowVerticalSpeed,

				angle: 0,
			};
		});
	}

	// Get a room background. If it doesn't exist, create one with default parameters.
	getBackground(index) {
		if (this.backgrounds[index] == null) {
			this.backgrounds[index] = {
				visible: false,
				isForeground: false,
				backgroundIndex: -1,
				tileHorizontally: true,
				tileVertically: true,
				x: 0,
				y: 0,
				horizontalSpeed: 0,
				verticalSpeed: 0,
				xScale: 1,
				yScale: 1,
				blend: 16777215,
				alpha: 1,
			};
		}
		return this.backgrounds[index];
	}

	// Get a room view. If it doesn't exist, create one with default parameters.
	getView(index) {
		if (this.views[index] == null) {
			this.views[index] = {
				visible: false,
				viewX: 0,
				viewY: 0,
				viewW: 640,
				viewH: 480,
				portX: 0,
				portY: 0,
				portW: 640,
				portH: 480,
				objectFollowIndex: -1,
				objectFollowHorizontalBorder: 32,
				objectFollowVerticalBorder: 32,
				objectFollowHorizontalSpeed: -1,
				objectFollowVerticalSpeed: -1,

				angle: 0,
			};
		}
		return this.views[index];
	}
}