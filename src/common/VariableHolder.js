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
			if (this.builtInClass[name].dimensions == undefined) {
				// TODO 1d only
				this.builtInClass[name].dimensions = 0;
				if (Array.isArray(this.builtInList[name].value)) {
					this.builtInClass[name].dimensions = 1;
				}
			}
		}
	}

	exists(name) {
		return (this.getVariableInfo(name) != null);
	}

	// Get variable value. Use when you don't know what kinda variable it is (e.g. from GML).
	get(name, indexes) {

		if (indexes == null) {
			indexes = [];
		}

		var variable;
		var varInfo = this.getVariableInfo(name);

		if (varInfo != null) {
			variable = varInfo.reference;
			if (varInfo.list == this.builtInList) {
				var builtIn = this.builtInClass[name];
				if (this.caller != null && builtIn.get) {
					return builtIn.get.call(this.caller, indexes);
				}
			}
		} else {
			// This should never happen
			throw new Error('Variable does not exist, did you forget to check beforehand?');
		}

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

		// Find part of array that indexes are referencing

		for (var index of indexes) {
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

	// Get built in variable that isn't an array. Meant to be used by the code, doesn't do any checks. Also doesn't call .get.
	getBuiltIn(name) {
		return this.builtInList[name].value;
	}

	// Get built in variable that is an array. Meant to be used by the code, doesn't do any checks. Also doesn't call .get.
	getBuiltInArray(name, indexes) {
		var variable = this.builtInList[name];
		for (var index of indexes) {
			variable = variable.value[index];
		}
		return variable.value;
	}

	set(name, value, indexes, overrideReadOnly, callSet=true) {

		if (indexes == null) {
			indexes = [];
		}

		var variable;
		var varInfo = this.getVariableInfo(name);

		if (varInfo != null) {
			variable = varInfo.reference;

			if (varInfo.list == this.builtInList) {
				if (this.builtInClass[name].readOnly && !overrideReadOnly) {
					throw new VariableException({type: 'read_only'});
				}

				if (this.builtInClass[name].type != null) {
					if (this.builtInClass[name].type == 'string') {
						value = forceString(value);
					} else if (this.builtInClass[name].type == 'real') {
						value = forceReal(value);
					} else if (this.builtInClass[name].type == 'integer') {
						value = forceInteger(value);
					} else if (this.builtInClass[name].type == 'bool') {
						value = forceBool(value);
					} else if (this.builtInClass[name].type == 'unit') {
						value = forceUnit(value);
					} else if (this.builtInClass[name].type == 'char') {
						value = forceChar(value);
					}
				}

				// Value returned by function replaces the value to be set
				if (callSet && this.caller != null && this.builtInClass[name].set) {
					var newValue = this.builtInClass[name].set.call(this.caller, value, indexes);
					if (newValue != null) value = newValue;
				}
			}

		} else {
			// Variable doesn't exist, create it
			this.customList[name] = {dimensions: 0, value: 0};
			variable = this.customList[name];
		}

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
			while (indexes[0] == 0) {
				indexes.shift();
				difference--;
			}

			// For the other extra indexes
			indexes.slice(0, difference).forEach(index => {
				// Convert to higher dimension, move entire value (array or not) into index 0 of the new first dimension
				variable.dimensions++;
				variable.value = [ {value: variable.value} ];
			})
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

		// Actually set variable
		variable.value = value;

	}

	setBuiltIn(name, value) {
		this.builtInList[name].value = value;
	}

	setBuiltInArray(name, indexes, value) {
		var variable = this.builtInList[name];
		for (var index of indexes) {
			variable = variable.value[index];
		}
		variable.value = value;
	}

	setBuiltInCall(name, value) {
		// Value returned by function replaces the value to be set
		var newValue = this.builtInClass[name].set.call(this.caller, value);
		if (newValue != null) value = newValue;

		this.builtInList[name].value = value;
	}

	setBuiltInArrayCall(name, indexes, value) {
		// Value returned by function replaces the value to be set
		var newValue = this.builtInClass[name].set.call(this.caller, value, indexes);
		if (newValue != null) value = newValue;

		var variable = this.builtInList[name];
		for (var index of indexes) {
			variable = variable.value[index];
		}
		variable.value = value;
	}

	clear(name) {
		var varInfo = this.getVariableInfo(name);
		if (varInfo != null) {
			varInfo.reference.value = 0;
		}
	}

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

	load(name, saved) {
		var list = this.customList;
		var varInfo = this.getVariableInfo(name);
		if (varInfo != null) {
			list = varInfo.list;
		}

		list[name] = saved;
	}

	saveAll() {
		return {
			builtInClass: this.builtInClass,
			builtInList: this.saveList(this.builtInList),
			customList: this.saveList(this.customList),
		};
	}

	loadAll(saved) {
		this.builtInClass = saved.builtInClass;
		this.builtInList = saved.builtInList;
		this.customList = saved.customList;
	}

	saveList(list) {
		var result = {};
		for (var name of Object.keys(list)) {
			result[name] = {}
			result[name].dimensions = list[name].dimensions;
			result[name].value = this.saveValue(list[name].value);
		}
		return result;
	}

	saveValue(value) {
		if (Array.isArray(value)) {
			return value.map(x => {
				return {value: this.saveValue(x.value)};
			});
		}
		return value;
	}

	clearAll() {
		this.builtInClass = null;
		this.builtInList = {};
		this.customList = {};
	}

}