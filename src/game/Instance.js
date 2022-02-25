import VariableHolder from '../common/VariableHolder.js';

import BuiltInLocals from './BuiltInLocals.js';

export default class Instance {

	constructor (id, x, y, object_index, game) {

		this.object_index = object_index;
		this.game = game;

		this.exists = true;

		this.vars = new VariableHolder(this, BuiltInLocals);

		// Id
		this.vars.setForce('id', id);

		// Set by constructor
		this.vars.setForce('x', x);
		this.vars.setForce('y', y);
		
		// Caching of data
		this.object = game.getResourceById('ProjectObject', this.object_index);
		this.sprite = game.getResourceById('ProjectSprite', this.object.sprite_index);
		
		// Inherited from object
		this.vars.setForce('object_index', this.object.id);
		this.vars.setForce('sprite_index', this.object.sprite_index);
		this.vars.setForce('visible', this.object.visible ? 1 : 0);
		this.vars.setForce('solid', this.object.solid ? 1 : 0);
		this.vars.setForce('depth', this.object.depth);
		this.vars.setForce('persistent', this.object.persistent ? 1 : 0);
		this.vars.setForce('mask_index', this.object.mask);
		
		// Started up variables
		this.vars.setForce('xprevious', x);
		this.vars.setForce('yprevious', y);
		this.vars.setForce('xstart', x);
		this.vars.setForce('ystart', y);

	}

	getImageIndex() {
		return Math.floor(this.vars.get('image_index') % this.vars.get('image_number'));
	}

}