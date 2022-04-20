import {HElement} from './H.js';

export default class VirtualFileSystem {

	constructor() {}

	static openDialog(accept, multiple=false) {

		return new Promise((resolve, reject) => {
			var f = new HElement('input');
			f.accept = accept;
			f.type = 'file';
			if (multiple) {
				f.multiple = true;
			}
			f.onchange = () => {
				if (multiple)
					resolve(f.files);
				else
					resolve(f.files[0]);
			}
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
		var a = new HElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = name;
		a.click();
	}

}