import JSZip from "jszip";

import ProjectSerializer from "~/common/project/ProjectSerializer.js";
import {saveFile} from "~/common/tools.js";

export default class StandAloneBuilder {
	static async build(project, name) {
		// TODO: Load game.html to find out what files to include (maybe)
		const files = [
			{url: "game.html", name: "index.html"},
			{url: "main-game.bundle.js"},
			{url: "game.bundle.js"},
			{url: "common.bundle.js"},
			{url: "vendors.bundle.js"},
			{url: "runtime.bundle.js"},
			{url: "main.bundle.js.LICENSE.txt", optional: true},
			{url: "vendors.bundle.js.LICENSE.txt", optional: true},
		];

		const zip = new JSZip();

		const promises = [
			...files.map(async file => {
				// Fetch dist files
				const response = await fetch(file.url);
				if (!response.ok) {
					if (file.optional) return null;
					throw new Error("File "+file.url+" not found");
				}

				const blob = await response.blob();

				// Place them in zip file
				zip.file(file.name ?? file.url, blob);

				return null;
			}),

			// Create zip file of project
			ProjectSerializer.serializeZIP(project).then(projectBlob => {
				zip.file("project.zip", projectBlob);
			}),
		];

		await Promise.all(promises);

		saveFile(await zip.generateAsync({type: "blob"}), name + ".zip");

		// Download zip
	}
}