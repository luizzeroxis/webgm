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
			this.sounds.set(sound, {volume: sound.volume, audioNodes: []});
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

	// Play a sound, on loop or not.
	playSound(soundIndex, loop) {
		const sound = this.getSound(soundIndex);

		const audioNode = this.audioContext.createMediaElementSource(sound.sound.audio);
		audioNode.connect(this.audioContext.destination);
		audioNode.mediaElement.volume = this.sounds.get(sound).volume;
		audioNode.mediaElement.loop = loop;
		audioNode.mediaElement.play();

		this.sounds.get(sound).audioNodes.push(audioNode);
	}

	// Stop all playing sounds from a sound resource.
	stopSound(soundIndex) {
		const sound = this.getSound(soundIndex);

		for (const audioNode of this.sounds.get(sound).audioNodes) {
			audioNode.mediaElement.pause();
			audioNode.disconnect();
		}
		this.sounds.get(sound).audioNodes = [];
	}

	// Stop all sounds being played.
	stopAllSounds() {
		for (const value of this.sounds.values()) {
			for (const audioNode of value.audioNodes) {
				audioNode.mediaElement.pause();
				audioNode.disconnect();
			}
			value.audioNodes = [];
		}
	}

	isSoundPlaying(soundIndex) {
		const sound = this.game.project.getResourceById("ProjectSound", soundIndex);
		if (!sound) return false;

		for (const audioNode of this.sounds.get(sound).audioNodes) {
			if (!audioNode.mediaElement.ended) {
				return true;
			}
		}

		return false;
	}

	setSoundVolume(soundIndex, value) {
		const sound = this.getSound(soundIndex);

		this.sounds.get(sound).volume = value;

		for (const audioNode of this.sounds.get(sound).audioNodes) {
			audioNode.mediaElement.volume = value;
		}

		return 0;
	}
}