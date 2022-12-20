export default class Serializer {
	static classes = [];

	// Run this in a static block of serializable classes
	static setupClass(_class, name, properties) {
		this.classes.push({name: name, class: _class});

		if (properties == null) return;

		const classProperties = [];

		for (const [name, value] of Object.entries(properties)) {
			const p = {
				name: name,
				...this.parseProperty(value),
			};

			if (value?.constructor == Object) {
				if (value.serialize) p.serialize = value.serialize;
			}

			classProperties.push(p);
		}

		_class._properties = classProperties;

		// console.log(_class.name, _class._properties);
	}

	static parseProperty(value) {
		if (value == null || this.isPrimitive(value)) {
			return {
				type: {kind: "primitive"},
				value: value,
			};
		} else if (value.constructor == Object) {
			if (value.array) {
				return {
					type: {kind: "array", arrayType: this.parseProperty(value.array).type},
					value: value.value ?? (() => []),
				};
			}
			if (value.object) {
				return {
					type: {kind: "object", objectType: value.object},
					value: value.value,
				};
			}
		} else {
			return {
				type: {kind: "object", objectType: value},
				value: () => new value(),
			};
		}
		throw new Error("impossible type");
	}


	// Run this in the contructor of serializable classes
	static initProperties(_this, args) {
		const [object] = args;

		if (!(object instanceof _this.constructor)) {
			_this.constructor._properties.forEach(p => {
				if (typeof p.value == "function") {
					_this[p.name] = p.value(_this);
				} else {
					_this[p.name] = p.value;
				}
			});
		} else {
			_this.constructor._properties.forEach(p => {
				_this[p.name] = this.copyProperty(object[p.name]);
			});
		}
	}

	static copyProperty(value) {
		// TODO maybe should check p.type

		if (typeof value == "undefined" || typeof value == "boolean" || typeof value == "number" || typeof value == "string") {
			return value;
		} else if (Array.isArray(value)) {
			return value.map(x => this.copyProperty(x));
		} else if (typeof value == "object") {
			if (value == null) return null;
			if (typeof value.constructor.copy == "function") {
				return value.constructor.copy(value);
			}
			return new value.constructor(value);
		} else {
			throw new Error("uncopiable property");
		}
	}

	static serializeToJSON(classObj) {
		const jsonObj = this.serializeValue(classObj, {kind: "object", objectType: classObj.constructor});

		return JSON.stringify(jsonObj, null, "\t");
	}

	static serializeValue(value, pType) {
		// TODO compare detected types to types in _properties and see if they match
		if (!pType) {
			pType = this.detectType(value);
		}

		if (pType.kind == "primitive") {
			return value;
		} else if (pType.kind == "array") {
			return value.map(x => this.serializeValue(x, pType.arrayType));
		} else if (pType.kind == "object") {
			if (value == null) return null;
			if (value.toJSON) return value.toJSON();

			if (pType.objectType) {
				return this.serializeObject(value);
			} else {
				const className = this.classes.find(x => x.class == value.constructor)?.name;

				if (className) {
					return this.serializeObject(value, className);
				} else {
					throw new Error("class not registered in serializer");
					// Only use this to allow serializing as plain objects
					// return this.serializePlainObject(value);
				}
			}
		} else {
			throw new Error("error serializing value");
		}
	}

	static serializeObject(value, className) {
		const object = {};

		if (className) {
			object.$class = className;
		}

		this.getProperties(value.constructor).forEach(p => {
			if (p.serialize == false) return;
			if (!p.type) {
				console.warn(`Serializer: property ${p.name} in class ${value.constructor.name} does not have a type`);
			}
			object[p.name] = this.serializeValue(value[p.name], p.type);
		});

		return object;
	}

	static unserializeFromJSON(json, pType) {
		const jsonObj = JSON.parse(json);

		return this.unserializeValue(jsonObj, pType);
	}

	static unserializeValue(value, pType) {
		if (!pType) {
			pType = this.detectType(value);
		} else {
			// TODO be sure them type really are them types
		}

		if (pType.kind == "primitive") {
			return value;
		} else if (pType.kind == "array") {
			return value.map(x => this.unserializeValue(x, pType.arrayType));
		} else if (pType.kind == "object") {
			if (value == null) return null;

			if (pType.objectType) {
				return this.unserializeObject(value, pType.objectType);
			} else {
				if (value.$class) {
					const _class = this.classes.find(x => x.name == value.$class)?.class;

					if (!_class) {
						throw new Error(`class ${value.$class} not registered in serializer`);
					}

					return this.unserializeObject(value, _class);
				} else {
					throw new Error("no $class");
					// Only use this to allow unserializing as plain objects
					// return this.unserializePlainObject(value);
				}
			}
		} else {
			throw new Error("unknown kind");
		}
	}

	static unserializeObject(value, _class) {
		const object = new _class();

		this.getProperties(_class).forEach(p => {
			if (p.serialize == false) return;
			if (!p.type) {
				console.warn(`Serializer: property ${p.name} in class ${_class.name} does not have a type`);
			}
			object[p.name] = this.unserializeValue(value[p.name], p.type);
		});

		return object;
	}

	static unserializePlainObject(value) {
		const object = {};

		for (const property in value) {
			object[property] = this.unserializeValue(value[property]);
		}

		return object;
	}

	static isPrimitive(value) {
		return (typeof value == "undefined" || typeof value == "boolean" || typeof value == "number" || typeof value == "string");
	}

	static detectType(value) {
		if (this.isPrimitive(value)) {
			return {kind: "primitive"};
		} else if (Array.isArray(value)) {
			return {kind: "array"}; // no arrayType, can be detected afterwards
		} else if (typeof value == "object") {
			return {kind: "object"}; // lol what
		} else {
			throw new Error("undetectable type");
		}
	}

	static getProperties(_class) {
		if (_class._properties) return _class._properties;

		console.warn(`Serializer: class ${_class.name} does not have _properties`);

		const properties = [];
		const obj = new _class();

		for (const property in obj) {
			properties.push({name: property});
		}

		return properties;
	}
}