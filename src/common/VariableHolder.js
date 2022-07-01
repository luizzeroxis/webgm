import {VariableException} from "./Exceptions.js";
import {forceString, forceReal, forceInteger, forceBool, forceUnit, forceChar} from "./tools.js";

export default class VariableHolder {
	constructor(caller, builtInClass) {
		this.caller = caller;
		this.builtInClass = builtInClass;
		this.builtInList = {};
		this.customList = {};

		for (const name in this.builtInClass) {
			if (!this.builtInClass[name].direct) {
				if (typeof this.builtInClass[name].default == "function") {
					let value = this.builtInClass[name].default.call(this);
					if (Array.isArray(value)) {
						value = value.map(x => ({value: x}));
					}
					this.builtInList[name] = {value: value};
				} else if (this.builtInClass[name].default != null) {
					this.builtInList[name] = {value: this.builtInClass[name].default};
				} else {
					throw new Error("Non-direct built in variable has no default!");
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
		const varInfo = this.getVariableInfo(name);
		let builtIn;
		let dimensions;

		if (varInfo == null) {
			// This should never happen
			throw new Error("Variable does not exist, did you forget to check beforehand?");
		}

		// Get dimensions of varInfo
		if (varInfo.list == this.builtInList) {
			builtIn = this.builtInClass[name];
			dimensions = (builtIn.dimensions ?? 0);
		} else {
			dimensions = varInfo.reference.dimensions;
		}

		indexes = indexes || [];

		// Get difference between dimensions of variable and amount of indexes
		let difference = dimensions - indexes.length;

		// If there are more dimensions than indexes specify
		if (difference > 0) {
			// Pad left indexes with 0s
			const extra_indexes = new Array(difference).fill(0);
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
				throw new VariableException({type: "index_not_in_bounds"});
			}
		}

		// Check direct built ins, where data isn't stored here, we use a funcion to get that data from elsewhere
		if (builtIn && builtIn.direct) {
			if (indexes.length != dimensions) {
				throw new VariableException({type: "index_not_in_bounds"});
			}

			for (const [i, index] of indexes.entries()) {
				if (index >= builtIn.directLength.call(this.caller, i)) {
					throw new VariableException({type: "index_not_in_bounds"});
				}
			}

			return builtIn.directGet.call(this.caller, ...indexes);
		}

		let variable = varInfo.reference;

		// Find part of array that indexes are referencing
		for (const index of indexes) {
			if (!Array.isArray(variable.value)) {
				// If index is 0, keep same variable reference, even if it's not an array
				if (index != 0) {
					throw new VariableException({type: "index_not_in_bounds"});
				}
			} else {
				// Index should be inside size
				if (index >= variable.value.length) {
					throw new VariableException({type: "index_not_in_bounds"});
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

	// Set variable value. Use when you don't know what kinda variable it is (e.g. from GML).
	async set(name, value, indexes) {
		let varInfo = this.getVariableInfo(name);
		let builtIn;
		let dimensions;

		if (varInfo == null) {
			// Variable doesn't exist, create it
			this.customList[name] = {dimensions: 0, value: 0};

			varInfo = {
				reference: this.customList[name],
				list: this.customList,
			};
		}

		if (varInfo.list == this.builtInList) {
			builtIn = this.builtInClass[name];
			dimensions = (builtIn.dimensions ?? 0);

			if (builtIn.readOnly) {
				throw new VariableException({type: "read_only"});
			}

			if (builtIn.direct) {
				dimensions = (builtIn.dimensions ?? 0);
			}

			if (builtIn.type != null) {
				if (builtIn.type == "string") {
					value = forceString(value);
				} else if (builtIn.type == "real") {
					value = forceReal(value);
				} else if (builtIn.type == "integer") {
					value = forceInteger(value);
				} else if (builtIn.type == "bool") {
					value = forceBool(value);
				} else if (builtIn.type == "unit") {
					value = forceUnit(value);
				} else if (builtIn.type == "char") {
					value = forceChar(value);
				}
			}
		} else {
			dimensions = varInfo.reference.dimensions;
		}

		indexes = indexes || [];

		// Get difference between dimensions of variable and amount of indexes
		let difference = dimensions - indexes.length;

		// If there are more dimensions than indexes specify
		if (difference > 0) {
			// Pad left indexes with 0s
			const extra_indexes = new Array(difference).fill(0);
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

			// If there's still more indexes than dimensions...
			if (difference != 0) {
				if (builtIn) {
					// For built ins, ignore indexes and use first possible value.
					indexes = new Array(dimensions).fill(0);
				} else {
					// Convert to higher dimension until there's no more difference.
					for (let i=0; i<difference; ++i) {
						// Move entire value (array or not) into index 0 of the new first dimension
						varInfo.reference.dimensions++;
						varInfo.reference.value = [ {value: varInfo.reference.value} ];
					}
				}
			}
		}

		// Check direct built ins, where data ins't store here, we use a function to set that data to elsewhere
		if (builtIn && builtIn.direct) {
			// TODO check some lengths and all
			await builtIn.directSet.call(this.caller, value, ...indexes);
			return;
		}

		let variable = varInfo.reference;

		// Find part of array that indexes are referencing
		for (let index of indexes) {
			if (!Array.isArray(variable.value)) {
				if (builtIn) {
					throw new Error("Built in is not an array. Did you forget to set the default properly?");
				}
				// Variable is higher dimension but this particular index has not been changed to array. Do it now.
				variable.value = [ {value: variable.value} ];
			}

			if (builtIn) {
				// If after length, default to using first index. This could get funky with dimensions higher than 1, but luckly we don't have those in built ins.
				if (index >= variable.value.length) {
					index = 0;
				}
			} else {
				// If index doesn't exist, create it (after length or middle)
				if (variable.value[index] == undefined) {
					variable.value[index] = {value: 0};
				}
			}

			// Get reference to object that refers to that index
			variable = variable.value[index];
		}

		// Actually set variable
		variable.value = value;
	}

	// Get a reference to a variable and the list it's on.
	getVariableInfo(name) {
		if (this.builtInClass != undefined && this.builtInClass[name] != undefined) {
			return {
				reference: this.builtInList[name],
				list: this.builtInList,
			};
		} else if (this.customList[name] != undefined) {
			return {
				reference: this.customList[name],
				list: this.customList,
			};
		} else {
			return null;
		}
	}

	// Save all information about a variable.
	save(name) {
		const varInfo = this.getVariableInfo(name);
		if (varInfo == null) {
			throw new Error("wtf?");
		}

		const result = {};
		result.dimensions = varInfo.reference.dimensions;
		result.value = this.saveValue(varInfo.reference.value);
		return result;
	}

	// Load information saved by save().
	load(name, saved) {
		let list = this.customList;
		const varInfo = this.getVariableInfo(name);
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
		const result = {};
		for (const name of Object.keys(list)) {
			result[name] = {};
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