import {newElem} from './H.js';

export default class VirtualFileSystem {

	constructor() {

	}

	static openDialog(accept) {

		return new Promise((resolve, reject) => {
			var f = newElem(null, 'input');
			f.accept = accept;
			f.type = 'file';
			f.onchange = () => resolve(f.files[0]);
			f.click();
		})
		
	}

	static readEntireFile(file) {

		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.readAsText(file);
		})
		
	}

	static save(blob, name) {
		var a = newElem(null, 'a');
		a.href = URL.createObjectURL(blob);
		a.download = name;
		a.click();
	}

}