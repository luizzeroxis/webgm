// Entry point for the standalone game build

import ProjectSerializer from "./common/ProjectSerializer.js";
import Game from "./game/Game.js";

async function main() {
	if (window.location.protocol == "file:") {
		document.body.innerHTML += "<p>Opening the game from your local system is not supported. Please create a local server instead.</p>";
	}

	let response;
	let projectZip;

	try {
		response = await fetch("project.zip");
		projectZip = await response.blob();
	} catch (e) {
		console.error(e);
	}

	if (!response?.ok) {
		document.body.innerHTML += "<p>Error: Cannot load project.zip!</p>";
		return;
	}

	const project = await ProjectSerializer.unserializeZIP(projectZip);

	const canvas = document.createElement("canvas");
	canvas.width = 640;
	canvas.height = 480;
	canvas.tabIndex = 0;
	document.body.append(canvas);

	canvas.focus({preventScroll: true});

	const game = new Game({
		project: project,
		canvas: canvas,
		input: canvas,
		menuManager: null,
	});

	game.start();

	window.game = game;
}

main();