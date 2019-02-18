class AbstractImage {

	constructor(res) {
		this.image = new Image();

		if (res instanceof Blob) {
			this.blob = res;
			this.image.src = URL.createObjectURL(res);
		} else {
			this.image.src = res;
		}
		
		this.promise = new Promise((resolve, reject) => {
			this.image.onload = (e) => this.imageLoaded(resolve, reject, e);
			this.image.onerror = (e) => this.imageError(resolve, reject, e);
		});
	}

	imageLoaded(resolve, reject, e) {
		resolve();
	}

	imageError(resolve, reject, e) {
		reject();
	}

}