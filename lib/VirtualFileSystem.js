class VirtualFileSystem {

	constructor() {

	}

	openDialog(accept, callback) {
		var f = newElem(null, 'input');
		f.accept = accept;
		f.type = 'file';
		f.addEventListener('change', () => {
			callback(f.files[0]);
		});
		f.click();
	}

	saveDialog(defaultname, callback) {
		var name = prompt('Filename:', defaultname);
		if (name) {
			callback({name: name});
		}
	}

	readEntireFile(file, callback) {
		var reader = new FileReader();
		reader.addEventListener('load', () => {
			callback(reader.result);
		});
		reader.readAsText(file);
	}

	writeEntireFile(file, data) {
		var a = newElem(null, 'a');
		a.href = URL.createObjectURL(new Blob([data], {type: 'text/json'})); //TODO auto check mimetype
		a.download = file.name;
		a.click();
	}

}