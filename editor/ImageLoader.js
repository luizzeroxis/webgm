class ImageLoader {
	constructor(editor) {

		this.editor = editor;

		//this.images = [];

		// this.editor.dispNewProject.addListener(() => this.onNewProject());
		// this.editor.dispOpenProject.addListener(() => this.onOpenProject());
		// this.editor.dispNewResource.addListener((...a) => this.onNewResource(...a));
		// this.editor.dispChangeResource.addListener((...a) => this.onChangeResource(...a));
		// this.editor.dispDeleteResource.addListener((...a) => this.onDeleteResource(...a));

		this.loadDefaultSprite();

	}

	loadDefaultSprite() {
		//this.images["-1"] = {};
		// var img = new Image();
		// img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAFfKj/FAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAAAAewAA/wAAAP8AAG0J5z8AAAABdFJOUwBA5thmAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAYklEQVQYV2WOUQ7AMAhCpXj/Mw+wW5rVD4UXpS3XSlNf0xBa7EEsDmJM2KhMGBWZ8dW76522MmgoUaIBBUpoOjnzipE+rO9Xt/tsWqlMcrtB/AHksYEI/Lif27lkHH6/T1U9xzIBZkTuVAMAAAAASUVORK5CYII=';
		//this.images["-1"].image = img;
	}

	getPromiseAllLoaded() {
		//return Promise.all(this.images.map((i) => i.promise));
	}

	addImage(resource) {

		// this.images[resource.id] = {};
		// this.images[resource.id].promise = new Promise((resolve, reject) => {

		// 	if (resource.sprite == null) {
		// 		resolve();
		// 	} else {
		// 		this.images[resource.id].image = new Image();
		// 		this.images[resource.id].image.addEventListener('load', () => {
		// 			resolve();
		// 		})
		// 		this.images[resource.id].image.src = URL.createObjectURL(resource.sprite);
		// 	}

		// })
	}
}