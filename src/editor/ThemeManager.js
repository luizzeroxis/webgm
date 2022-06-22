export default class ThemeManager {
	constructor(editor) {
		this.editor = editor;
		this.autoTheme = "light";

		// Update theme if on auto to match system
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		media.addEventListener("change", e => this.updateAutoTheme(e));
		this.updateAutoTheme(media);

		this.editor.preferences.dispatcher.listen({
			"change": () => {
				this.applyTheme();
			},
		});
	}

	updateAutoTheme(mediaQueryList) {
		this.autoTheme = mediaQueryList.matches ? "dark" : "light";
		this.applyTheme();
	}

	applyTheme() {
		let theme = this.editor.preferences.get("theme");
		if (theme == "auto") {
			theme = this.autoTheme;
		}

		if (theme == "dark") {
			document.documentElement.classList.remove("light");
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.add("light");
		}
	}
}