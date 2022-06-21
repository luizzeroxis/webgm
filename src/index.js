import Editor from './editor/Editor.js'

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('service-worker.js');
	});
}

window.editor = new Editor();