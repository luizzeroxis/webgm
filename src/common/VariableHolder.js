import {VariableException} from "./Exceptions.js";
import {forceString, forceReal, forceInteger, forceBool, forceUnit, forceChar} from "./tools.js";

export default class VariableHolder {
	constructor(caller, builtInClass) {
		this.caller = caller;
		this.builtInClass = builtInClass;
		this.customList = {};
	}

	// Check if variable exists in this holder.
	exists(name) {
		return (this.getVariableInfo(name) != null);
	}

	// Normalize the indexes given by the user to try and fit within the amount of dimensions the variable actually has.
	// 'indexes' are the normalized indexes.
	// 'difference' contains the excess of indexes more than dimensions, that couldn't be removed.
	normalizeIndexes(indexes, dimensions) {
		// Get difference between dimensions of variable and amount of indexes
		let difference = dimensions - indexes.length;

		// If there are more dimensions than indexes specify
		if (difference > 0) {
			// Pad left indexes with 0s
			const extra_indexes = new Array(difference).fill(0);
			indexes.unshift(...extra_indexes);
			difference = 0;

		// If specifies more indexes than there are dimensions
		} else if (difference < 0) {
			// Make difference positive
			difference = Math.abs(difference);

			// Remove leading 0s in extra indexes, they don't matter
			while (indexes[0] == 0 && difference != 0) {
				indexes.shift();
				difference--;
			}
		}

		return {
			indexes: indexes,
			difference: difference,
		};
	}

	// Get variable value. Use when you don't know what kinda variable it is (e.g. from GML).
	get(name, indexes) {
		const varInfo = this.getVariableInfo(name);
		let dimensions;
		let difference;

		if (varInfo == null) {
			// This should never happen
			throw new Error("Variable does not exist, did you forget to check beforehand?");
		}

		// Get dimensions of varInfo
		if (varInfo.builtIn) {
			dimensions = (varInfo.builtIn.dimensions ?? 0);
		} else {
			dimensions = varInfo.reference.dimensions;
		}

		({indexes, difference} = this.normalizeIndexes(indexes ?? [], dimensions));

		// If there are still indexes left, then it's just wrong.
		if (difference != 0) {
			throw new VariableException({type: "index_not_in_bounds"});
		}

		// If built in, check lengths and call get function directly
		if (varInfo.builtIn) {
			for (const [i, index] of indexes.entries()) {
				if (index >= varInfo.builtIn.length.call(this.caller, i)) {
					throw new VariableException({type: "index_not_in_bounds"});
				}
			}

			return varInfo.builtIn.get.call(this.caller, ...indexes);
		} else {
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
	}

	// Set variable value. Use when you don't know what kinda variable it is (e.g. from GML).
	async set(name, value, indexes) {
		let varInfo = this.getVariableInfo(name);
		let dimensions;
		let difference;

		if (varInfo == null) {
			// Variable doesn't exist, create it
			this.customList[name] = {dimensions: 0, value: 0};

			varInfo = {
				reference: this.customList[name],
			};
		}

		if (varInfo.builtIn) {
			if (varInfo.builtIn.readOnly) {
				throw new VariableException({type: "read_only"});
			}

			if (varInfo.builtIn.type != null) {
				if (varInfo.builtIn.type == "string") {
					value = forceString(value);
				} else if (varInfo.builtIn.type == "real") {
					value = forceReal(value);
				} else if (varInfo.builtIn.type == "integer") {
					value = forceInteger(value);
				} else if (varInfo.builtIn.type == "bool") {
					value = forceBool(value);
				} else if (varInfo.builtIn.type == "unit") {
					value = forceUnit(value);
				} else if (varInfo.builtIn.type == "char") {
					value = forceChar(value);
				}
			}

			dimensions = (varInfo.builtIn.dimensions ?? 0);
		} else {
			dimensions = varInfo.reference.dimensions;
		}

		({indexes, difference} = this.normalizeIndexes(indexes ?? [], dimensions));

		// If there's still more indexes than dimensions...
		if (difference != 0) {
			if (varInfo.builtIn) {
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

		// If built in, check lengths and call get function directly
		if (varInfo.builtIn) {
			for (const [i, index] of indexes.entries()) {
				if (index >= varInfo.builtIn.length.call(this.caller, i)) {
					// If outside length, ignore indexes and use first possible value.
					indexes = new Array(dimensions).fill(0);
					break;
				}
			}

			await varInfo.builtIn.set.call(this.caller, value, ...indexes);
		} else {
			let variable = varInfo.reference;

			// Find part of array that indexes are referencing
			for (const index of indexes) {
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
	}

	// Get a reference to a variable and the list it's on.
	getVariableInfo(name) {
		if (this.builtInClass != undefined && this.builtInClass[name] != undefined) {
			return {
				builtIn: this.builtInClass[name],
			};
		} else if (this.customList[name] != undefined) {
			return {
				reference: this.customList[name],
			};
		} else {
			return null;
		}
	}

	// Save all information about a variable.
	save(name) {
		const varInfo = this.getVariableInfo(name);
		if (varInfo?.reference == null) {
			throw new Error("Cannot save variable "+name+", it's not defined!");
		}

		return {
			dimensions: varInfo.reference.dimensions,
			value: this.saveValue(varInfo.reference.value),
		};
	}

	// Load information saved by save().
	load(name, saved) {
		this.customList[name] = saved;
	}

	// Save all information about this holder.
	saveAll() {
		return {
			builtInClass: this.builtInClass,
			customList: this.saveList(this.customList),
		};
	}

	// Load information saved by saveAll().
	loadAll(saved) {
		this.builtInClass = saved.builtInClass;
		this.customList = saved.customList;
	}

	// Save a list.
	saveList(list) {
		const result = {};
		for (const name of Object.keys(list)) {
			result[name] = {
				dimensions: list[name].dimensions,
				value: this.saveValue(list[name].value),
			};
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
		this.customList = {};
	}
}