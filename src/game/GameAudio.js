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

		this.globalGainNode = this.audioContext.createGain();
		this.globalGainNode.connect(this.audioContext.destination);

		this.game.project.resources.ProjectSound.forEach(sound => {
			const soundInfo = {
				volume: sound.volume,
				pan: sound.pan,
			};

			soundInfo.gainNode = this.audioContext.createGain();
			soundInfo.gainNode.gain.value = sound.volume;
			soundInfo.gainNode.connect(this.globalGainNode);

			soundInfo.stereoPannerNode = this.audioContext.createStereoPanner();
			soundInfo.stereoPannerNode.pan.value = sound.pan;
			soundInfo.stereoPannerNode.connect(soundInfo.gainNode);

			if (sound.kind == "media") {
				soundInfo.mediaElementSourceNodeList = [];
			} else {
				soundInfo.arrayBuffer = null;
				soundInfo.bufferSourceNodeList = [];
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
		const soundInfo = this.sounds.get(sound);

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
			if (soundInfo.arrayBuffer) return null;

			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.addEventListener("load", () => {
					this.audioContext.decodeAudioData(reader.result)
						.then(arrayBuffer => {
							soundInfo.arrayBuffer = arrayBuffer;
							resolve();
						});
				});
				reader.readAsArrayBuffer(sound.sound.blob);
			});
		}

		return null;
	}

	unloadSound(sound) {
		const soundInfo = this.sounds.get(sound);

		if (sound.kind == "media") {
			//
		} else {
			soundInfo.arrayBuffer = null;
		}
	}

	// Play a sound, on loop or not.
	async playSound(soundIndex, loop) {
		const sound = this.getSound(soundIndex);
		await this.loadSound(sound);

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
			const bufferSourceNode = this.audioContext.createBufferSource();
			bufferSourceNode.buffer = soundInfo.arrayBuffer;
			bufferSourceNode.loop = loop;
			bufferSourceNode.connect(soundInfo.stereoPannerNode);

			soundInfo.bufferSourceNodeList.push(bufferSourceNode);
			bufferSourceNode.addEventListener("ended", () => {
				const index = soundInfo.bufferSourceNodeList.indexOf(bufferSourceNode);
				if (index >= 0) soundInfo.bufferSourceNodeList.splice(index, 1);
				console.log(bufferSourceNode, "ended");
			});

			bufferSourceNode.start();
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
		} else {
			for (const bufferSourceNode of soundInfo.bufferSourceNodeList) {
				bufferSourceNode.stop();
			}
			soundInfo.bufferSourceNodeList = [];
		}
		// soundInfo.stereoPannerNode.disconnect();
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

		if (sound.kind == "media") {
			return soundInfo.mediaElementSourceNodeList.length != 0;
		} else {
			return soundInfo.bufferSourceNodeList.length != 0;
		}
	}

	setSoundVolume(soundIndex, value) {
		const sound = this.getSound(soundIndex);
		const soundInfo = this.sounds.get(sound);

		soundInfo.volume = value;
		soundInfo.gainNode.gain.value = value;
	}

	setGlobalVolume(value) {
		this.globalGainNode.gain.value = value;
	}

	setSoundFade(soundIndex, value, time) {
		const sound = this.getSound(soundIndex);
		const soundInfo = this.sounds.get(sound);

		soundInfo.volume = value;
		soundInfo.gainNode.gain.linearRampToValueAtTime(value, this.audioContext.currentTime + time/1000);
	}

	setSoundPan(soundIndex, value) {
		const sound = this.getSound(soundIndex);
		const soundInfo = this.sounds.get(sound);

		soundInfo.pan = value;
		soundInfo.stereoPannerNode.pan.value = value;
	}
}