export default class GameCollision {
	constructor(game) {
		this.game = game;
	}

	pointOnRectangle(point, rect) {
		return (
			point.x >= rect.x1
			&& point.x < rect.x2
			&& point.y >= rect.y1
			&& point.y < rect.y2
		);
	}

	rectangleOnRectangle(a, b) {
		return (
			a.x1 <= b.x2
			&& b.x1 <= a.x2
			&& a.y1 <= b.y2
			&& b.y1 <= a.y2
		);
	}

	rectangleOnRectangleIntersection(a, b) {
		return {
			x1: Math.max(a.x1, b.x1),
			y1: Math.max(a.y1, b.y1),
			x2: Math.min(a.x2, b.x2),
			y2: Math.min(a.y2, b.y2),
		};
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

		if (!this.rectangleOnRectangle(aRect, bRect)) {
			return false;
		}

		const iRect = this.rectangleOnRectangleIntersection(aRect, bRect);

		const aImage = aInstance.getMaskImage();
		const bImage = bInstance.getMaskImage();

		const aImageRect = {x1: 0, x2: aImage.width, y1: 0, y2: aImage.height};
		const bImageRect = {x1: 0, x2: bImage.width, y1: 0, y2: bImage.height};

		const aCol = this.game.loadedProject.collisionMasks.get(aImage);
		const bCol = this.game.loadedProject.collisionMasks.get(bImage);

		// TODO possibly optimize this?
		for (let x = Math.floor(iRect.x1); x < iRect.x2; ++x)
		for (let y = Math.floor(iRect.y1); y < iRect.y2; ++y) {
			const aPoint = aInstance.roomPointToInstanceImagePoint({x, y}, aX, aY);

			if (!this.pointOnRectangle(aPoint, aImageRect)) {
				continue;
			}
			if (!(aCol[aPoint.x][aPoint.y] === true)) {
				continue;
			}

			const bPoint = bInstance.roomPointToInstanceImagePoint({x, y}, bX, bY);

			if (!this.pointOnRectangle(bPoint, bImageRect)) {
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
		if (instance.getMaskImage() == null) return false;

		if (!precise) {
			return this.pointOnRectangle(point, instance.getBoundingBox());
		}

		const imagePoint = instance.roomPointToInstanceImagePoint(point);
		const instanceImage = instance.getMaskImage();

		if (!this.pointOnRectangle(imagePoint, {x1: 0, x2: instanceImage.width, y1: 0, y2: instanceImage.height})) {
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

	// TODO Check if instance is colliding with rectangle
	instanceOnRectangle(instance, rectangle, precise=true) {
		if (instance.getMaskImage() == null) return false;

		if (!precise) {
			return this.rectangleOnRectangle(rectangle, instance.getBoundingBox());
		}

		// code

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