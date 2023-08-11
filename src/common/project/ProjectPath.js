import Serializer from "~/common/Serializer.js";

export class ProjectPathPoint {
	static {
		Serializer.setupClass(this, "ProjectPathPoint", {
			x: 0,
			y: 0,
			sp: 100,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectPath {
	static {
		Serializer.setupClass(this, "ProjectPath", {
			id: null,
			name: null,
			points: {array: ProjectPathPoint},
			backgroundRoomIndex: -1,
			connectionKind: "lines", // lines, curve
			closed: true,
			precision: 4,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	makePoint(p) {
		return {x: p.x, y: p.y, sp: p.sp};
	}

	makeAveragePoint(p1, p2) {
		return {
			x: (p1.x + p2.x) / 2,
			y: (p1.y + p2.y) / 2,
			sp: (p1.sp + p2.sp) / 2,
		};
	}

	getStartPosition() {
		if (this.points.length > 0) {
			if (this.points.length > 1 && this.closed && this.connectionKind == "curve") {
				return this.makeAveragePoint(this.points[0], this.points[1]);
			}
			return this.makePoint(this.points[0]);
		}
		return {x: 0, y: 0};
	}

	getEndPosition() {
		if (this.points.length > 0) {
			if (this.points.length > 1 && this.closed && this.connectionKind == "curve") {
				return this.makeAveragePoint(this.points[0], this.points[1]);
			}
			if (!this.closed) {
				return this.makePoint(this.points[this.points.length-1]);
			}
			return this.makePoint(this.points[0]);
		}
		return {x: 0, y: 0};
	}

	getLength() {
		const linePoints = this.getLinePoints();

		let length = 0;
		let p1 = linePoints[0];

		for (let i=1; i<linePoints.length; ++i) {
			const p2 = linePoints[i];

			length += Math.hypot(p2.x - p1.x, p2.y - p1.y);
			p1 = p2;
		}

		return length;
	}

	// Get list points of a line that is the path at precision.
	getLinePoints() {
		if (this.connectionKind == "lines") {
			return this.getLinesPath();
		} else if (this.connectionKind == "curve") {
			return this.getCurveAsLinesPath();
		}
		return null;
	}

	getLinesPath() {
		if (this.points.length < 2) return [];

		const linePoints = this.points.map(point => this.makePoint(point));

		if (this.closed) {
			linePoints.push(this.makePoint(this.points[0]));
		}

		return linePoints;
	}

	getCurvePath() {
		const points = this.points;

		if (points.length < 2) return [];

		const curvePoints = [];

		if (!this.closed) {
			curvePoints.push(this.makePoint(points[0]));
		} else {
			curvePoints.push(this.makeAveragePoint(points[0], points[1]));
		}

		for (let i=0; i<points.length; ++i) {
			let control, end;

			if (!this.closed) {
				if (i == 0) {
					end = this.makeAveragePoint(points[i], points[i + 1]);
					control = this.makeAveragePoint(points[i], end);
				} else if (i == points.length-1) {
					end = this.makePoint(points[i]);
					control = this.makeAveragePoint(this.makeAveragePoint(points[i - 1], points[i]), end);
				} else {
					control = this.makePoint(points[i]);
					end = this.makeAveragePoint(points[i], points[i + 1]);
				}
			} else {
				control = this.makePoint(points[(i + 1) % points.length]);
				end = this.makeAveragePoint(points[(i + 1) % points.length], points[(i + 2) % points.length]);
			}

			curvePoints.push(control);
			curvePoints.push(end);
		}

		return curvePoints;
	}

	getCurveAsLinesPath() {
		// TODO Probably wrong
		const curve = this.getCurvePath();

		const steps = (2 ** this.precision);

		const linePoints = [];

		for (let i=0; i<curve.length-2; i+=2) {
			const start = curve[i];
			const control = curve[i+1];
			const end = curve[i+2];

			for (let j=0; j<steps; ++j) {
				const t = j / (steps-1);

				linePoints.push(this.getQuadraticCurvePointAt([start, control, end], t));
			}
		}

		return linePoints;
	}

	getQuadraticCurvePointAt(points, t) {
		if (t == 0) return {...points[0]};
		if (t == 1) return {...points[2]};

		// t = 0.5
		const mt = 1 - t;
		const a = mt * mt; // 0.25
		const b = mt * t * 2; // 0.5
		const c = t * t; // 0.25

		// (100 * 0,25) + (200 * 0,5) + (100 * 0,25)

		return {
			x: a * points[0].x + b * points[1].x + c * points[2].x,
			y: a * points[0].y + b * points[1].y + c * points[2].y,
			sp: a * points[0].sp + b * points[1].sp + c * points[2].sp, // TODO Probably wrong
		};
	}

	getPosLocation(pos) {
		const totalLength = this.getLength();
		const posLength = totalLength * pos;
		let currentLength = 0;

		const linePoints = this.getLinePoints();

		for (let i=0; i<linePoints.length-1; ++i) {
			const p1 = linePoints[i];
			const p2 = linePoints[i+1];

			const segmentLength = Math.hypot(p2.x - p1.x, p2.y - p1.y);
			currentLength += segmentLength;

			if (currentLength >= posLength) {
				const perc = (posLength - (currentLength - segmentLength)) / segmentLength;

				return {p1, p2, perc};
			}
		}

		return null;
	}

	getPosInfo(pos) {
		const location = this.getPosLocation(pos);
		if (location) {
			const {p1, p2, perc} = location;
			const start = this.getStartPosition();

			return {
				x: (p1.x + ((p2.x - p1.x) * perc)) - start.x,
				y: (p1.y + ((p2.y - p1.y) * perc)) - start.y,
				sp: p1.sp + ((p2.sp - p1.sp) * perc),
				direction: Math.atan2(-(p2.y - p1.y), p2.x - p1.x) * (180 / Math.PI),
			};
		}
		return {x: 0, y: 0, sp: 0, direction: 0};
	}

	getPosSp(pos) {
		const location = this.getPosLocation(pos);
		if (location) {
			const {p1, p2, perc} = location;
			return p1.sp + ((p2.sp - p1.sp) * perc);
		}
		return 0;
	}

	static getName() { return "path"; }
	static getScreenName() { return "Path"; }
	static getScreenGroupName() { return "Paths"; }
	static getClassName() { return "ProjectPath"; }
}