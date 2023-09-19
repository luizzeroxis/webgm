export default class GameAudio {
	constructor(game) {
		this.game = game;
		this.audioContext = null;

		this.sounds = new Map();
	}

	start() {
		if (!this.audioContext) {
			this.audioContext = new AudioContext();
		} else {
			if (this.audioContext.state == "suspended") {
				this.audioContext.resume();
			}
		}

		this.game.project.resources.ProjectSound.forEach(sound => {
			const soundInfo = {
				volume: sound.volume,
				pan: sound.pan,
			};

			if (sound.kind == "media") {
				soundInfo.nextAudio = null;
				soundInfo.mediaElementSourceNodeList = [];

				soundInfo.stereoPannerNode = this.audioContext.createStereoPanner();
				soundInfo.stereoPannerNode.pan.value = sound.pan;
				soundInfo.stereoPannerNode.connect(this.audioContext.destination);
			} else {
				// soundInfo.arrayBuffer = null;

				// soundInfo.gainNode = this.audioContext.createGain();
				// soundInfo.gainNode.gain.value = sound.volume;
				// soundInfo.gainNode.connect(this.audioContext.destination);

				// soundInfo.bufferSourceNodes = [];
			}

			this.sounds.set(sound, soundInfo);
		});
	}

	end() {
		this.stopAllSounds();
	}

	getSound(soundIndex) {
		const sound = this.game.project.getResourceById("ProjectSound", soundIndex);
		if (!sound) {
			throw this.game.makeError({text: `Sound does not exist. ${soundIndex})`});
		}
		return sound;
	}

	loadSound(sound) {
		// const soundInfo = this.sounds.get(sound);

		if (sound.kind == "media") {
			// soundInfo.nextAudio = new Audio(sound.sound.src);

			// new Promise((resolve, reject) => {
			// 	soundInfo.nextAudio.addEventListener("canplay", () => {
			// 		resolve();
			// 	})
			// 	soundInfo.nextAudio.addEventListener("error", () => {
			// 		reject();
			// 	})
			// });
		} else {
			//
		}
	}

	// Play a sound, on loop or not.
	playSound(soundIndex, loop) {
		const sound = this.getSound(soundIndex);
		this.loadSound(sound);

		const soundInfo = this.sounds.get(sound);

		if (sound.kind == "media") {
			const audio = new Audio(sound.sound.src);
			audio.volume = soundInfo.volume;
			audio.loop = loop;

			const mediaElementSourceNode = this.audioContext.createMediaElementSource(audio);
			mediaElementSourceNode.connect(soundInfo.stereoPannerNode);

			soundInfo.mediaElementSourceNodeList.push(mediaElementSourceNode);
			audio.addEventListener("ended", () => {
				const index = soundInfo.mediaElementSourceNodeList.indexOf(mediaElementSourceNode);
				if (index >= 0) soundInfo.mediaElementSourceNodeList.splice(index, 1);
			});

			audio.play();
		} else {
			// const bufferSourceNode = this.audioContext.createBufferSource(soundInfo.arrayBuffer);
			// bufferSourceNode.loop = loop;
			// bufferSourceNode.addEventListener("ended", () => {
			// 	// disconnect and remove from list
			// });
			// bufferSourceNode.connect(soundInfo.gainNode);
			// bufferSourceNode.start();

			// obj.bufferSourceNodes.push(bufferSourceNode);
		}
	}

	// Stop all playing sounds from a sound resource.
	stopSound(soundIndex) {
		const sound = this.getSound(soundIndex);
		const soundInfo = this.sounds.get(sound);

		if (sound.kind == "media") {
			for (const mediaElementSourceNode of soundInfo.mediaElementSourceNodeList) {
				mediaElementSourceNode.mediaElement.pause();
			}
			soundInfo.mediaElementSourceNodeList = [];
			// soundInfo.stereoPannerNode.disconnect();
		} else {
			//
		}
	}

	// Stop all sounds being played.
	stopAllSounds() {
		for (const sound of this.sounds.keys()) {
			this.stopSound(sound.id);
		}
	}

	isSoundPlaying(soundIndex) {
		const sound = this.game.project.getResourceById("ProjectSound", soundIndex);
		if (!sound) return false;
		const soundInfo = this.sounds.get(sound);

		for (const mediaElementSourceNode of soundInfo.mediaElementSourceNodeList) {
			if (!mediaElementSourceNode.mediaElement.ended) {
				return true;
			}
		}

		return false;
	}

	setSoundVolume(soundIndex, value) {
		const sound = this.getSound(soundIndex);
		const soundInfo = this.sounds.get(sound);

		soundInfo.volume = value;

		for (const mediaElementSourceNode of soundInfo.mediaElementSourceNodeList) {
			mediaElementSourceNode.mediaElement.volume = value;
		}
	}

	setSoundPan(soundIndex, value) {
		const sound = this.getSound(soundIndex);
		const soundInfo = this.sounds.get(sound);

		soundInfo.pan = value;

		soundInfo.stereoPannerNode.pan.value = value;
	}
}