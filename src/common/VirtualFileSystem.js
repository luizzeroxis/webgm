import {HElement} from "./H.js";

export default class VirtualFileSystem {
	static openDialog(accept, multiple=false) {
		return new Promise((resolve, reject) => {
			const f = new HElement("input");
			f.html.accept = accept;
			f.html.type = "file";
			if (multiple) {
				f.html.multiple = true;
			}
			f.html.onchange = () => {
				if (multiple)
					resolve(f.html.files);
				else
					resolve(f.html.files[0]);
			};
			f.html.click();
		});
	}

	static readEntireFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.readAsText(file);
		});
	}

	static save(blob, name) {
		const a = new HElement("a");
		a.html.href = URL.createObjectURL(blob);
		a.html.download = name;
		a.html.click();
	}
}