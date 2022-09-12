export default class GameAudio {
	constructor(game) {
		this.game = game;
		this.audioContext = null;
	}

	start() {
		if (!this.audioContext) {
			this.audioContext = new AudioContext();
		} else {
			if (this.audioContext.state == "suspended") {
				this.audioContext.resume();
			}
		}
	}

	end() {
		this.stopAllSounds();
	}

	// Play a sound, on loop or not.
	playSound(sound, loop) {
		this.start();
		const audioNode = this.audioContext.createMediaElementSource(new Audio(sound.sound.src));
		audioNode.connect(this.audioContext.destination);
		audioNode.mediaElement.volume = this.game.loadedProject.sounds.get(sound).volume;
		audioNode.mediaElement.loop = loop;
		audioNode.mediaElement.play();

		this.game.loadedProject.sounds.get(sound).audioNodes.push(audioNode);
	}

	// Stop all playing sounds from a sound resource.
	stopSound(sound) {
		for (const audioNode of this.game.loadedProject.sounds.get(sound).audioNodes) {
			audioNode.mediaElement.pause();
			audioNode.disconnect();
		}
		this.game.loadedProject.sounds.get(sound).audioNodes = [];
	}

	// Stop all sounds being played.
	stopAllSounds() {
		for (const value of this.game.loadedProject.sounds.values()) {
			for (const audioNode of value.audioNodes) {
				audioNode.mediaElement.pause();
				audioNode.disconnect();
			}
			value.audioNodes = [];
		}
	}
}