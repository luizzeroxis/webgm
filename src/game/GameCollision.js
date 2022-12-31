export default class GameCollision {
	constructor(game) {
		this.game = game;
	}

	// Check if two instances are colliding.
	instanceOnInstance(instanceA, instanceB, x, y) {
		// Don't allow collision with self
		if (instanceA == instanceB) return false;

		// TODO masks
		// TODO solid

		if (instanceA.sprite == null || instanceA.sprite.images.length == 0) return false;
		if (instanceB.sprite == null || instanceB.sprite.images.length == 0) return false;

		// TODO collision masks, will assume rectangle now
		// spriteA.boundingBox == 'fullimage';
		// spriteA.shape = 'rectangle';

		const collisions = [
			{shape1: "precise", shape2: "precise", func: this.instancePreciseOnInstancePrecise},
			{shape1: "precise", shape2: "rectangle", func: this.instancePreciseOnInstanceRectangle},
			// {shape1: "precise", shape2: "disk", func: this.instanceRectangleOnInstanceRectangle},
			// {shape1: "precise", shape2: "diamond", func: this.instanceRectangleOnInstanceRectangle},
			{shape1: "rectangle", shape2: "rectangle", func: this.instanceRectangleOnInstanceRectangle},
			// {shape1: "rectangle", shape2: "disk", func: this.instanceRectangleOnInstanceRectangle},
			// {shape1: "rectangle", shape2: "diamond", func: this.instanceRectangleOnInstanceRectangle},
			// {shape1: "disk", shape2: "disk", func: this.instanceRectangleOnInstanceRectangle},
			// {shape1: "disk", shape2: "diamond", func: this.instanceRectangleOnInstanceRectangle},
			// {shape1: "diamond", shape2: "diamond", func: this.instanceRectangleOnInstanceRectangle},
		];

		for (const collision of collisions) {
			if (instanceA.sprite.shape == collision.shape1 && instanceB.sprite.shape == collision.shape2) {
				return collision.func.call(this, instanceA, instanceB, x, y);
			} else
			if (instanceA.sprite.shape == collision.shape2 && instanceB.sprite.shape == collision.shape1) {
				return collision.func.call(this, instanceB, instanceA, x, y);
			}
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

	getInstanceCollisionInfo(instance, x, y) {
		x = x ?? Math.floor(instance.x);
		y = y ?? Math.floor(instance.y);
		const image = instance.sprite.images[instance.getImageIndex()];
		const x1 = x - instance.sprite.originx;
		const y1 = y - instance.sprite.originy;
		const x2 = x1 + image.image.width;
		const y2 = y1 + image.image.height;
		return {x, y, image, x1, y1, x2, y2};
	}

	rectangleOnRectangle(a, b) {
		return (
			a.x1 <= b.x2
			&& b.x1 <= a.x2
			&& a.y1 <= b.y2
			&& b.y1 <= a.y2
		);
	}


	// Check if two instances, with precise shape, are colliding.
	instancePreciseOnInstancePrecise(aInstance, bInstance, aX, aY, bX, bY) {
		const a = this.getInstanceCollisionInfo(aInstance, aX, aY);
		const b = this.getInstanceCollisionInfo(bInstance, bX, bY);

		if (!this.rectangleOnRectangle(a, b)) return false;

		const aCol = this.game.loadedProject.collisionMasks.get(a.image);
		const bCol = this.game.loadedProject.collisionMasks.get(b.image);

		// Get the 'global' (in relation to room) rect in the intersection between the two rects.
		const gX1 = Math.max(a.x1, b.x1);
		const gY1 = Math.max(a.y1, b.y1);
		const gX2 = Math.min(a.x2, b.x2);
		const gY2 = Math.min(a.y2, b.y2);

		// Loop through all pixels in that rect.
		for (let gX = gX1; gX < gX2; ++gX)
		for (let gY = gY1; gY < gY2; ++gY) {
			// Here we undo all transformations made to the sprite.
			// It's rounded down to the nearest pixel.
			const aDataX = Math.floor(gX - a.x1);
			const aDataY = Math.floor(gY - a.y1);

			// TODO this may be out of bounds.
			if (!aCol[aDataX][aDataY]) continue;

			const bDataX = Math.floor(gX - b.x1);
			const bDataY = Math.floor(gY - b.y1);

			if (bCol[bDataX][bDataY]) return true;
		}

		return false;
	}


	// Check if two instances, one with precise shape, another with rectangular shape, are colliding.
	instancePreciseOnInstanceRectangle(precInstance, rectInstance, aX, aY, bX, bY) {
		const prec = this.getInstanceCollisionInfo(precInstance, aX, aY);
		const rect = this.getInstanceCollisionInfo(rectInstance, bX, bY);

		if (!this.rectangleOnRectangle(prec, rect)) return false;

		const precCol = this.game.loadedProject.collisionMasks.get(prec.image);

		// Get the 'global' (in relation to room) rect in the intersection between the two rects.
		const gX1 = Math.max(prec.x1, rect.x1);
		const gY1 = Math.max(prec.y1, rect.y1);
		const gX2 = Math.min(prec.x2, rect.x2);
		const gY2 = Math.min(prec.y2, rect.y2);

		// Loop through all pixels in that rect.
		for (let gX = gX1; gX < gX2; ++gX)
		for (let gY = gY1; gY < gY2; ++gY) {
			// Here we undo all transformations made to the sprite.
			// It's rounded down to the nearest pixel.
			const precDataX = Math.floor(gX - prec.x1);
			const precDataY = Math.floor(gY - prec.y1);

			// TODO this may be out of bounds.
			if (!precCol[precDataX][precDataY]) continue;

			// Rect always collides there.
			return true;
		}

		return false;
	}

	// Check if two instances, with rectangular shape, are colliding.
	instanceRectangleOnInstanceRectangle(aInstance, bInstance, aX, aY, bX, bY) {
		const a = this.getInstanceCollisionInfo(aInstance, aX, aY);
		const b = this.getInstanceCollisionInfo(bInstance, bX, bY);

		return this.rectangleOnRectangle(a, b);
	}


	// Check if an instance, with rectangular shape, and a point are colliding.
	instanceRectangleOnPoint(instance, point) {
		const instanceX = instance.x - instance.sprite.originx;
		const instanceY = instance.y - instance.sprite.originy;
		const instanceImage = instance.sprite.images[instance.getImageIndex()];

		return (
			point.x >= instanceX
			&& point.x < instanceX + instanceImage.image.width
			&& point.y >= instanceY
			&& point.y < instanceY + instanceImage.image.height
		);
	}

	// Check if instance is colliding with point.
	instanceOnPoint(instance, point) {
		if (instance.sprite == null || instance.sprite.images.length == 0) return false;

		const collisions = [
			{shape: "precise", func: this.instanceRectangleOnPoint},
			{shape: "rectangle", func: this.instanceRectangleOnPoint},
			// {shape: 'disk', func: this.instanceRectangleOnPoint},
			// {shape: 'diamond', func: this.instanceRectangleOnPoint},
		];

		for (const collision of collisions) {
			if (instance.sprite.shape == collision.shape) {
				return collision.func(instance, point);
			}
		}

		return false;
	}

	// Check if any of instances is colliding with point.
	instancesOnPoint(instances, point) {
		for (const instance of instances) {
			if (!instance.exists) continue;
			const c = this.instanceOnPoint(instance, point);
			if (c) return true;
		}
		return false;
	}
}