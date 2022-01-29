export default class Collision {

	constructor(game) {
		this.game = game;
	}

	static rectOnRect(a, b) {
		return (
			a.x1 <= b.x2 &&
			b.x1 <= a.x2 &&
			a.y1 <= b.y2 &&
			b.y1 <= a.y2
		);
	}

	static instanceOnPoint(instance, point) {

	}

	static instanceOnInstance(a, b) {
		
	}

}