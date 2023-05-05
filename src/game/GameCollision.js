export default class GameCollision {
	constructor(game) {
		this.game = game;
	}

	static pointOnRectangle(point, rect) {
		return (
			point.x >= rect.x1
			&& point.x < rect.x2
			&& point.y >= rect.y1
			&& point.y < rect.y2
		);
	}

	static rectangleOnRectangle(a, b) {
		return (
			a.x1 <= b.x2
			&& b.x1 <= a.x2
			&& a.y1 <= b.y2
			&& b.y1 <= a.y2
		);
	}

	static rectangleOnRectangleIntersection(a, b) {
		return {
			x1: Math.max(a.x1, b.x1),
			y1: Math.max(a.y1, b.y1),
			x2: Math.min(a.x2, b.x2),
			y2: Math.min(a.y2, b.y2),
		};
	}

	static normalizeRectangle(rect) {
		if (rect.x1 > rect.x2) {
			[rect.x1, rect.x2] = [rect.x2, rect.x1];
		}
		if (rect.y1 > rect.y2) {
			[rect.y1, rect.y2] = [rect.y2, rect.y1];
		}
		return rect;
	}

	static closestDistanceBetweenRectangles(rectA, rectB) {
		// Which sides the rectB are on, relative to rectA, only if COMPLETELY on that side.
		const l = (rectB.x2 < rectA.x1);
		const r = (rectB.x1 > rectA.x2);
		const t = (rectB.y2 < rectA.y1);
		const b = (rectB.y1 > rectA.y2);

		// If one those sides, distances between rects the direction and axis of that side.
		const lDist = rectA.x1 - rectB.x2;
		const rDist = rectB.x1 - rectA.x2;
		const tDist = rectA.y1 - rectB.y2;
		const bDist = rectB.y1 - rectA.y2;

		// If in corner quadrants.
		if (t && l) return Math.hypot(lDist, tDist);
		if (t && r) return Math.hypot(rDist, tDist);
		if (b && l) return Math.hypot(lDist, bDist);
		if (b && r) return Math.hypot(rDist, bDist);

		// If in side quadrants. (only works after checking corners)
		if (l) return lDist;
		if (r) return rDist;
		if (t) return tDist;
		if (b) return bDist;

		// If overlapping.
		return 0;
	}

	// Check if two instances are colliding.
	instanceOnInstance(aInstance, bInstance, aX, aY, bX, bY) {
		// Don't allow collision with self
		if (aInstance == bInstance) return false;

		if (aInstance.getMaskImage() == null || bInstance.getMaskImage() == null) return false;

		// TODO collision masks
		// spriteA.boundingBox == 'fullimage';
		// spriteA.shape = 'rectangle' || 'precise';

		const aRect = aInstance.getBoundingBox(aX, aY);
		const bRect = bInstance.getBoundingBox(bX, bY);

		if (!GameCollision.rectangleOnRectangle(aRect, bRect)) {
			return false;
		}

		const iRect = GameCollision.rectangleOnRectangleIntersection(aRect, bRect);

		const aImage = aInstance.getMaskImage();
		const aImageRect = {x1: 0, x2: aImage.width, y1: 0, y2: aImage.height};
		const aCol = this.game.loadedProject.collisionMasks.get(aImage);

		const bImage = bInstance.getMaskImage();
		const bImageRect = {x1: 0, x2: bImage.width, y1: 0, y2: bImage.height};
		const bCol = this.game.loadedProject.collisionMasks.get(bImage);

		// TODO possibly optimize this?
		for (let x = Math.floor(iRect.x1); x < iRect.x2; ++x)
		for (let y = Math.floor(iRect.y1); y < iRect.y2; ++y) {
			const aPoint = aInstance.roomPointToInstanceImagePoint({x, y}, aX, aY);

			if (!GameCollision.pointOnRectangle(aPoint, aImageRect)) {
				continue;
			}
			if (!(aCol[aPoint.x][aPoint.y] === true)) {
				continue;
			}

			const bPoint = bInstance.roomPointToInstanceImagePoint({x, y}, bX, bY);

			if (!GameCollision.pointOnRectangle(bPoint, bImageRect)) {
				continue;
			}
			if (!(bCol[bPoint.x][bPoint.y] === true)) {
				continue;
			}

			return true;
		}

		return false;
	}

	// Check if an instance is colliding with any of otherInstances.
	instanceOnInstances(instance, otherInstances, x, y, solidOnly=false) {
		// place_free / place_empty / place_meeting
		for (const otherInstance of otherInstances) {
			if (!otherInstance.exists) continue;
			if (solidOnly && !otherInstance.solid) continue;
			const c = this.instanceOnInstance(instance, otherInstance, x, y);
			if (c) return true;
		}
		return false;
	}

	// Check if instance is colliding with point.
	instanceOnPoint(instance, point, precise=true) {
		const instanceImage = instance.getMaskImage();

		if (instanceImage == null) return false;

		if (!precise) {
			return GameCollision.pointOnRectangle(point, instance.getBoundingBox());
		}

		const imagePoint = instance.roomPointToInstanceImagePoint(point);

		if (!GameCollision.pointOnRectangle(imagePoint, {x1: 0, x2: instanceImage.width, y1: 0, y2: instanceImage.height})) {
			return false;
		}

		const col = this.game.loadedProject.collisionMasks.get(instanceImage);
		return col[imagePoint.x][imagePoint.y] === true;
	}

	// Check if any of instances is colliding with point.
	instancesOnPoint(instances, point) {
		return (this.getFirstInstanceOnPoint(instances, point) != null);
	}

	// Return the first instance that is colliding with point.
	getFirstInstanceOnPoint(instances, point, precise=true) {
		for (const instance of instances) {
			if (!instance.exists) continue;
			if (this.instanceOnPoint(instance, point, precise)) {
				return instance;
			}
		}
		return null;
	}

	// Return all the instances that are colliding with point.
	getAllInstancesOnPoint(instances, point) {
		return instances.filter(instance => {
			if (!instance.exists) return false;
			return this.instanceOnPoint(instance, point);
		});
	}

	// Check if instance is colliding with rectangle
	instanceOnRectangle(instance, rectangle, precise=true) {
		if (instance.getMaskImage() == null) return false;

		const aRect = instance.getBoundingBox();

		const impreciseCol = GameCollision.rectangleOnRectangle(aRect, rectangle);

		// If imprecise check fails, then collision will never happen.
		if (!impreciseCol) {
			return false;
		}
		// If imprecise check succeeds, and we don't want to check precisely, then collision happened.
		if (!precise) {
			return true;
		}

		const iRect = GameCollision.rectangleOnRectangleIntersection(aRect, rectangle);

		const aImage = instance.getMaskImage();
		const aImageRect = {x1: 0, x2: aImage.width, y1: 0, y2: aImage.height};
		const aCol = this.game.loadedProject.collisionMasks.get(aImage);

		// TODO possibly optimize this?
		for (let x = Math.floor(iRect.x1); x < iRect.x2; ++x)
		for (let y = Math.floor(iRect.y1); y < iRect.y2; ++y) {
			const aPoint = instance.roomPointToInstanceImagePoint({x, y});

			if (!GameCollision.pointOnRectangle(aPoint, aImageRect)) {
				continue;
			}
			if (!(aCol[aPoint.x][aPoint.y] === true)) {
				continue;
			}

			return true;
		}

		return false;
	}

	// Return the first instance that is colliding with rectangle.
	getFirstInstanceOnRectangle(instances, rectangle, precise=true) {
		for (const instance of instances) {
			if (!instance.exists) continue;
			if (this.instanceOnRectangle(instance, rectangle, precise)) {
				return instance;
			}
		}
		return null;
	}
}