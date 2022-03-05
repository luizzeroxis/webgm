import {VariableException} from './Exceptions.js';
import {forceString, forceReal, forceInteger, forceBool, forceUnit, forceChar} from './tools.js';

export default class VariableHolder {

	constructor(caller, builtInClass) {
		this.caller = caller;
		this.builtInClass = builtInClass;
		this.builtInList = {};
		this.customList = {};

		for (var name in this.builtInClass) {
			if (typeof this.builtInClass[name].default == "function") {
				var value = this.builtInClass[name].default.call(this);
				if (Array.isArray(value)) {
					value = value.map(x => ({value: x}));
				}
				this.builtInList[name] = {value: value};
			} else {
				if (this.builtInClass[name].default != null) {
					this.builtInList[name] = {value: this.builtInClass[name].default};
				} else {
					this.builtInList[name] = {};
				}
			}
			this.builtInList[name].dimensions = this.builtInClass[name].dimensions;
			if (this.builtInList[name].dimensions == undefined) {
				// TODO 1d only
				this.builtInList[name].dimensions = 0;
				if (Array.isArray(this.builtInList[name].value)) {
					this.builtInList[name].dimensions = 1;
				}
			}
		}
	}

	// Check if variable exists in this holder.
	exists(name) {
		return (this.getVariableInfo(name) != null);
	}

	// Get variable value. Use when you don't know what kinda variable it is (e.g. from GML).
	get(name, indexes) {

		var variable;
		var varInfo = this.getVariableInfo(name);

		if (varInfo == null) {
			// This should never happen
			throw new Error('Variable does not exist, did you forget to check beforehand?');
		}

		variable = varInfo.reference;

		indexes = indexes || [];

		// TODO get dimensions from built in when direct
		// Get difference between dimensions of variable and amount of indexes
		var difference = variable.dimensions - indexes.length;

		// If there are more dimensions than indexes specify
		if (difference > 0) {
			// Pad left indexes with 0s
			var extra_indexes = new Array(difference).fill(0);
			indexes.unshift(...extra_indexes);
		}

		// If specifies more indexes than there are dimensions
		if (difference < 0) {
			// Make difference positive
			difference = Math.abs(difference);

			// Remove leading 0s in extra indexes, they don't matter
			while (indexes[0] == 0 && difference != 0) {
				indexes.shift();
				difference--;
			}

			// If there are still indexes left, then it's just wrong.
			if (difference != 0) {
				throw new VariableException({type: 'index_not_in_bounds'});
			}
		}

		// Check direct built ins, where data isn't stored here, we use a funcion to get that data from elsewhere
		if (varInfo.list == this.builtInList) {
			var builtIn = this.builtInClass[name];
			if (builtIn.direct) {
				if (indexes.length != variable.dimensions) {
					throw new VariableException({type: 'index_not_in_bounds'});
				}

				for (let [i, index] of indexes.entries()) {
					if (index >= builtIn.directLength.call(this.caller, i)) {
						throw new VariableException({type: 'index_not_in_bounds'});
					}
				}

				return builtIn.directGet.call(this.caller, ...indexes);
			}
		}

		// Find part of array that indexes are referencing
		for (let index of indexes) {
			if (!Array.isArray(variable.value)) {
				// If index is 0, keep same variable reference, even if it's not an array
				if (index != 0) {
					throw new VariableException({type: 'index_not_in_bounds'});
				}
			} else {
				// Index should be inside size
				if (index >= variable.value.length) {
					throw new VariableException({type: 'index_not_in_bounds'});
				}
				// Sometimes the variable is undefined because indexes have been jumped.
				if (variable.value[index] == undefined) {
					variable.value[index] = {value: 0};
				}
				// Get reference to object that refers to that index
				variable = variable.value[index];
			}
		}

		return variable.value;

	}

	// Get built in variable that isn't an array. Meant to be used by the code, doesn't do any checks.
	getBuiltIn(name) {
		return this.builtInList[name].value;
	}

	// Get built in variable that is an array. Meant to be used by the code, doesn't do any checks.
	getBuiltInArray(name, indexes) {
		var variable = this.builtInList[name];
		for (var index of indexes) {
			variable = variable.value[index];
		}
		return variable.value;
	}

	// Set variable value. Use when you don't know what kinda variable it is (e.g. from GML).
	async set(name, value, indexes, overrideReadOnly, callSet=true) {

		var variable;
		var varInfo = this.getVariableInfo(name);
		var builtIn;

		if (varInfo == null) {
			// Variable doesn't exist, create it
			this.customList[name] = {dimensions: 0, value: 0};
			variable = this.customList[name];

		} else {
			variable = varInfo.reference;

			if (varInfo.list == this.builtInList) {
				builtIn = this.builtInClass[name];

				if (builtIn.readOnly && !overrideReadOnly) {
					throw new VariableException({type: 'read_only'});
				}

				if (builtIn.type != null) {
					if (builtIn.type == 'string') {
						value = forceString(value);
					} else if (builtIn.type == 'real') {
						value = forceReal(value);
					} else if (builtIn.type == 'integer') {
						value = forceInteger(value);
					} else if (builtIn.type == 'bool') {
						value = forceBool(value);
					} else if (builtIn.type == 'unit') {
						value = forceUnit(value);
					} else if (builtIn.type == 'char') {
						value = forceChar(value);
					}
				}
			}

		}

		indexes = indexes || [];

		// Get difference between dimensions of variable and amount of indexes
		var difference = variable.dimensions - indexes.length;

		// If there are more dimensions than indexes specify
		if (difference > 0) {
			// Pad left indexes with 0s
			var extra_indexes = new Array(difference).fill(0);
			indexes.unshift(...extra_indexes);
		}

		// If specifies more indexes than there are dimensions
		if (difference < 0) {
			// Make difference positive
			difference = Math.abs(difference);

			// Remove leading 0 indexes, they don't matter
			while (indexes[0] == 0 && difference != 0) {
				indexes.shift();
				difference--;
			}

			// For the other extra indexes
			for (var i=0; i<difference; ++i) {
				// Convert to higher dimension, move entire value (array or not) into index 0 of the new first dimension
				variable.dimensions++;
				variable.value = [ {value: variable.value} ];
			}
		}

		// Find part of array that indexes are referencing
		for (var index of indexes) {
			if (!Array.isArray(variable.value)) {
				// Variable is higher dimension but this particular index has not been changed to array. Do it now.
				variable.value = [ {value: variable.value} ];
			}
			// If index doesn't exist, create it (after length or middle)
			if (variable.value[index] == undefined) {
				variable.value[index] = {value: 0};
			}
			// Get reference to object that refers to that index
			variable = variable.value[index];
		}

		var previous = variable.value;

		// Actually set variable
		variable.value = value;

		// Call built in set function
		if (builtIn && callSet && this.caller != null && builtIn.set) {
			await builtIn.set.call(this.caller, value, previous, indexes | []);
		}

	}

	// Set built in variable that ins't an array. Meant to be used by the code, doesn't do any checks or calls.
	setBuiltIn(name, value) {
		this.builtInList[name].value = value;
	}

	// Get built in variable that is an array. Meant to be used by the code, doesn't do any checks or calls.
	setBuiltInArray(name, indexes, value) {
		var variable = this.builtInList[name];
		for (var index of indexes) {
			variable = variable.value[index];
		}
		variable.value = value;
	}

	// Same as setBuiltIn, but calls the set function.
	setBuiltInCall(name, value) {
		var variable = this.builtInList[name];
		var previous = variable.value;

		// Call built in set function
		this.builtInClass[name].set.call(this.caller, value, previous);

		variable.value = value;
	}

	// Same as setBuiltInArray, but calls the set function.
	setBuiltInArrayCall(name, indexes, value) {
		var variable = this.builtInList[name];
		for (var index of indexes) {
			variable = variable.value[index];
		}

		var previous = variable.value;
		variable.value = value;

		// Call built in set function
		this.builtInClass[name].set.call(this.caller, value, previous, indexes);
	}

	// Get a reference to a variable and the list it's on.
	getVariableInfo(name) {
		if (this.builtInClass != undefined && this.builtInClass[name] != undefined) {
			return {
				reference: this.builtInList[name],
				list: this.builtInList,
			}
		} else if (this.customList[name] != undefined) {
			return {
				reference: this.customList[name],
				list: this.customList,
			}
		} else {
			return null;
		}
	}

	// Save all information about a variable.
	save(name) {
		var varInfo = this.getVariableInfo(name);
		if (varInfo == null) {
			throw new Error('wtf?');
		}

		var result = {};
		result.dimensions = varInfo.reference.dimensions;
		result.value = this.saveValue(varInfo.reference.value);
		return result;
	}

	// Load information saved by save().
	load(name, saved) {
		var list = this.customList;
		var varInfo = this.getVariableInfo(name);
		if (varInfo != null) {
			list = varInfo.list;
		}

		list[name] = saved;
	}

	// Save all information about this holder.
	saveAll() {
		return {
			builtInClass: this.builtInClass,
			builtInList: this.saveList(this.builtInList),
			customList: this.saveList(this.customList),
		};
	}

	// Load information saved by saveAll().
	loadAll(saved) {
		this.builtInClass = saved.builtInClass;
		this.builtInList = saved.builtInList;
		this.customList = saved.customList;
	}

	// Save a list.
	saveList(list) {
		var result = {};
		for (var name of Object.keys(list)) {
			result[name] = {}
			result[name].dimensions = list[name].dimensions;
			result[name].value = this.saveValue(list[name].value);
		}
		return result;
	}

	// Save a variable value.
	saveValue(value) {
		if (Array.isArray(value)) {
			return value.map(x => {
				return {value: this.saveValue(x.value)};
			});
		}
		return value;
	}

	// Clear all information stored in this holder.
	clearAll() {
		this.builtInClass = null;
		this.builtInList = {};
		this.customList = {};
	}

}