class ImageLoader {

	constructor(editor) {

		this.editor = editor;

		this.images = [];

		this.loadedImages = 0;

		this.funcsWhenLoaded = [];

		this.editor.dispNewProject.addListener(() => this.onNewProject());
		this.editor.dispOpenProject.addListener(() => this.onOpenProject());
		this.editor.dispNewResource.addListener((...a) => this.onNewResource(...a));
		this.editor.dispChangeResource.addListener((...a) => this.onChangeResource(...a));
		this.editor.dispDeleteResource.addListener((...a) => this.onDeleteResource(...a));

		var img = new Image();
		img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAFfKj/FAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAAAAewAA/wAAAP8AAG0J5z8AAAABdFJOUwBA5thmAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAYklEQVQYV2WOUQ7AMAhCpXj/Mw+wW5rVD4UXpS3XSlNf0xBa7EEsDmJM2KhMGBWZ8dW76522MmgoUaIBBUpoOjnzipE+rO9Xt/tsWqlMcrtB/AHksYEI/Lif27lkHH6/T1U9xzIBZkTuVAMAAAAASUVORK5CYII=';
		this.images["-1"] = img;

	}

	onNewProject() {
		for (var i = 0; i < this.images.length; i++) {
			this.images[i] = null;
		}
	}
	onOpenProject() {
		for (var i = 0; i < this.editor.project.sprites.length; i++) {
			this.addImage(this.editor.project.sprites[i]);
		}
	}
	onNewResource(type, resource) {
		if (type == 'sprite') {
			this.addImage(resource);
		}
	}
	onChangeResource(type, resource, changes) {
		if (type == 'sprite') {
			console.log(changes);
			if (changes.sprite) {

				if (this.images[resource.id] && this.images[resource.id].complete) {
					this.loadedImages--;
				}
				this.addImage(resource);
			}
		}
	}
	onDeleteResource(type, resource) {
		this.images[resource.id] = null;
	}

	addImage(resource) {
		if (resource.sprite !== null) {
			console.log('image load will happen')
			var img = new Image();
			img.addEventListener('load', () => {
				console.log('image loaded');
				this.imageLoaded(resource);
			})
			img.src = URL.createObjectURL(resource.sprite);
			this.images[resource.id] = img;
		}		
	}

	imageLoaded(resource) {
		console.log('imageLoaded')
		//if (this.images[resource.id]) {
			this.loadedImages += 1;
			if (this.images.length == this.loadedImages) {
				for (var i = 0; i < this.funcsWhenLoaded.length; i++) {
					this.funcsWhenLoaded[i]();
				}
				this.funcsWhenLoaded = [];
			}
		//}
	}

	runWhenAllLoaded(func) {
		if (this.images.length == this.loadedImages) {
			console.log(this.images, this.loadedImages);
			func();
		} else {
			this.funcsWhenLoaded.push(func);
		}
	}

}