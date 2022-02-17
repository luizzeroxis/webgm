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
		
		// Inherited from object
		var obj = game.getResourceById('ProjectObject', this.object_index);

		this.vars.setForce('object_index', obj.id);
		this.vars.setForce('sprite_index', obj.sprite_index);
		this.vars.setForce('visible', obj.visible);
		this.vars.setForce('solid', obj.solid);
		this.vars.setForce('depth', obj.depth);
		this.vars.setForce('persistent', obj.persistent);
		this.vars.setForce('mask_index', obj.mask);
		
		//
		this.vars.setForce('xprevious', x);
		this.vars.setForce('yprevious', y);
		this.vars.setForce('xstart', x);
		this.vars.setForce('ystart', y);

	}

}