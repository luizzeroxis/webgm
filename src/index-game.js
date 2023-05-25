// Entry point for the standalone game build

import {add} from "./common/h";
import ProjectSerializer from "./common/project/ProjectSerializer.js";
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

	const game = new Game({
		project: project,
	});

	add(game.div);

	game.canvas.focus({preventScroll: true});

	game.start();

	window.game = game;
}

main();