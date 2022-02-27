import ohm, {extras as ohmExtras} from 'ohm-js';

import {ExitException, ReturnException, BreakException, ContinueException, VariableException} from '../common/Exceptions.js';
import {toInteger} from '../common/tools.js';
import VariableHolder from '../common/VariableHolder.js';

import BuiltInFunctions from './BuiltInFunctions.js';
import GMLGrammar from './GMLGrammar.js';

export default class GML {

	constructor(game) {
		this.game = game;

		this.vars = new VariableHolder();
		this.currentInstance = null;

		this.grammar = ohm.grammar(GMLGrammar.getText());

		this.mapping = {
			Start: {_code: 0},
			// Block: 1,
			StatementWithSemicolon: 0, // Statement
			If: {_conditionExpression: 1, _code: 2, _elseStatement: 3,
				_conditionExpressionNode: c => c[1]},
			// Else: 1,
			Repeat: {_timesExpression: 1, _code: 2,
				_timesExpressionNode: c => c[1]},
			While: {_conditionExpression: 1, _code: 2,
				_conditionExpressionNode: c => c[1]},
			DoUntil: {_code: 1, _conditionExpression: 4,
				_conditionExpressionNode: c => c[4]},
			For: {_initStatement: 2, _conditionExpression: 3, _iterationStatement: 5, _code: 7,
				_conditionExpressionNode: c => c[3]},
			With: {_objectExpression: 1, _code: 2,
				_objectExpressionNode: c => c[1]},
			// Exit: {},
			Return: {_value: 1},
			// Break: {},
			// Continue: {},
			Function: {_name: 0, _args: 2},
			VarDeclare: {_names: 1},
			GlobalVarDeclare: {_names: 1},
			Assignment: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			AssignmentAdd: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			AssignmentSubtract: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			AssignmentMultiply: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			AssignmentDivide: {_variable: 0, _expression: 2,
				_variableNode: c => c[0]},
			Variable: {_object: 0, _name: 1, _arrayIndexes: 2,
				_objectNode: c => c[0]},
			ArrayIndexes: {_index1: 1, _index2: 2,
				_index1Node: c => c[1], _index2Node: c => c[2]},
			// ArrayIndex2: 1,
			Not: {_a: 1,
				_aNode: c => c[1]},
			Negate: {_a: 1,
				_aNode: c => c[1]},
			NegateBitwise: {_a: 1,
				_aNode: c => c[1]},
			And: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Or: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Xor: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Less: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			LessOrEqual: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			Equal: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			Different: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			Greater: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			GreaterOrEqual: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			BitwiseAnd: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			BitwiseOr: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			BitwiseXor: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			BitwiseShiftLeft: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			BitwiseShiftRight: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Add: {_a: 0, _b: 2,
				_1Node: c => c[1]},
			Subtract: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Multiply: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			Divide: {_a: 0, _b: 2,
				_aNode: c => c[0], _bNode: c => c[2]},
			IntegerDivision: {_a: 0, _b: 3,
				_aNode: c => c[0], _bNode: c => c[3]},
			Modulo: {_a: 0, _b: 3,
				_aNode: c => c[0], _bNode: c => c[3]},
			// Parentheses: 1,
			Number: function(_integer, _dot, _decimals) {return Number(this.sourceString);},
			String: function(_0, _string, _1) {return _string.sourceString;},
			VariableGet: {_variable: 0,
				_variableNode: c => c[0]},
		};

		this.astActions = {
			Start: async ({_code}) => {
				await this.interpretASTNode(_code);
				return 0;
			},
			If: async ({_conditionExpression, _conditionExpressionNode, _code, _elseStatement}) => {
				var condition = await this.interpretASTNode(_conditionExpression);
				this.checkIsNumber(condition, 'Expression expected (condition "' + condition.toString() + '" is not a number)', _conditionExpressionNode);
				
				if (this.toBool(condition)) {
					await this.interpretASTNode(_code);
				} else {
					await this.interpretASTNode(_elseStatement);
				}
			},
			Repeat: async ({_timesExpression, _timesExpressionNode, _code}) => {
				var times = await this.interpretASTNode(_timesExpression);
				this.checkIsNumber(times, 'Repeat count must be a number ("' + times.toString() + '")', _timesExpressionNode);

				times = toInteger(times);

				for (let i=0; i<times; ++i) {
					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					}
				}

			},
			While: async ({_conditionExpression, _conditionExpressionNode, _code}) => {
				while (true) {

					var condition = await this.interpretASTNode(_conditionExpression);
					this.checkIsNumber(condition, 'Expression expected (condition "' + condition.toString() + '" is not a number)', _conditionExpressionNode);

					if (!(this.toBool(condition))) break;

					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					}
				}
			},
			DoUntil: async({_code, _conditionExpression, _conditionExpressionNode}) => {
				while (true) {

					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					}

					var condition = await this.interpretASTNode(_conditionExpression);
					this.checkIsNumber(condition, 'Expression expected (condition "' + condition.toString() + '" is not a number)', _conditionExpressionNode);

					if (this.toBool(condition)) break;
				}
			},
			For: async ({_initStatement, _conditionExpression, _conditionExpressionNode, _iterationStatement, _code}) => {
				await this.interpretASTNode(_initStatement);

				while (true) {
					var condition = await this.interpretASTNode(_conditionExpression);
					this.checkIsNumber(condition, 'Expression expected (condition "' + condition.toString() + '" is not a number)', _conditionExpressionNode);

					if (!this.toBool(condition)) break;

					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					}
					await this.interpretASTNode(_iterationStatement);
				}

			},
			With: async ({_objectExpression, _objectExpressionNode, _code}) => {
				var object = await this.interpretASTNode(_objectExpression);
				this.checkIsNumber(object, 'Object id expected ("' + object.toString() + '" is not a number)', _objectExpressionNode);

				var instances = this.objectReferenceToInstances(object);

				if (instances == null) return;
				if (instances == "global") {
					throw this.makeErrorInGMLNode("Cannot use global in with statement.", _objectExpressionNode);
				}

				var previousInstance = this.currentInstance;
				var previousOther = this.currentOther;

				for (let instance of instances) {
					this.currentInstance = instance;
					this.currentOther = previousInstance;
					
					try {
						await this.interpretASTNode(_code);
					} catch (e) {
						if (e instanceof BreakException) {
							break;
						} if (e instanceof ContinueException) {
							continue;
						} else {
							throw e;
						}
					} finally {
						this.currentInstance = previousInstance;
						this.currentOther = previousOther;
					}
				}

			},
			Exit: async () => {
				throw new ExitException();
			},
			Return: async ({_value}) => {
				throw new ReturnException(await this.interpretASTNode(_value));
			},
			Break: async () => {
				throw new BreakException();
			},
			Continue: async () => {
				throw new ContinueException();
			},
			Function: async ({_name, _args}) => {
				var name = _name; // no need to interpret?
				var args = await this.interpretASTNode(_args);

				var script = this.game.project.resources.ProjectScript.find(x => x.name == name);

				if (script) {
					return this.execute(this.game.gmlCache.get(script), this.currentInstance, this.currentOther, args);
				} else {
					return this.builtInFunction(name, this.currentInstance, this.currentOther, args);
				}
			},
			VarDeclare: async ({_names}) => {
				for (let name of _names) { // is _names always an array of strings?
					if (!this.vars.exists(name)) {
						this.vars.set(name, null);
					} // TODO check what if the variable exists
				}
			},
			GlobalVarDeclare: async ({_names}) => {
				for (let name of _names) {
					if (!this.game.globalVars.exists(name)) {
						this.game.globalVars.set(name, 0);
					}
				}
			},
			Assignment: async ({_variable, _variableNode, _expression}) => {
				var varInfo = await this.interpretASTNode(_variable);
				var value = await this.interpretASTNode(_expression);
				this.varSet(varInfo, value, _variableNode);
			},
			// Note: In GM, assignment operations don't error out when they should, and they have weird behaviour. It's replicated here.
			AssignmentAdd: async ({_variable, _variableNode, _expression}) => {
				var varInfo = await this.interpretASTNode(_variable);
				var value = await this.interpretASTNode(_expression);
				this.varModify(varInfo, old => {
					if (typeof old === typeof value) {
						return old + value; // Works for both numbers (addition) and strings (concatenation).
					}
					return old;
				}, _variableNode);
			},
			AssignmentSubtract: async ({_variable, _variableNode, _expression}) => {
				var varInfo = await this.interpretASTNode(_variable);
				var value = await this.interpretASTNode(_expression);
				this.varModify(varInfo, old => {
					if (typeof old === 'number' && typeof value == 'number') {
						return old - value;
					}
					return old;
				}, _variableNode);
			},
			AssignmentMultiply: async ({_variable, _variableNode, _expression}) => {
				var varInfo = await this.interpretASTNode(_variable);
				var value = await this.interpretASTNode(_expression);
				this.varModify(varInfo, old => {
					if (typeof old === 'number' && typeof value == 'string') {
						// Yeah, wtf. *= repeats the string like in Python, but only if the original value was a real and the new one a string. I have no idea why.
						return value.repeat(old);
					}
					if (typeof old === 'number' && typeof value == 'number') {
						return old * value;
					}
					return old;
				}, _variableNode);
			},
			AssignmentDivide: async ({_variable, _variableNode, _expression}) => {
				var varInfo = await this.interpretASTNode(_variable);
				var value = await this.interpretASTNode(_expression);
				this.varModify(varInfo, old => {
					if (typeof old === 'number' && typeof value == 'number') {
						return old / value;
					}
					return old;
				}, _variableNode);
			},
			Variable: async ({_object, _objectNode, _name, _arrayIndexes}) => {
				var varInfo = {};
				varInfo.name = _name; // no need to interpret?
				varInfo.object = await this.interpretASTNode(_object);
				if (varInfo.object != null) {
					this.checkIsNumber(varInfo.object,
						"Wrong type of variable index ("+varInfo.object.toString()+" is not a number to be an object)", _objectNode);
				}
				varInfo.indexes = await this.interpretASTNode(_arrayIndexes);
				return varInfo;
			},
			ArrayIndexes: async ({_index1, _index1Node, _index2, _index2Node}) => {
				var indexes = [];

				indexes.push(this.arrayIndexValidate(await this.interpretASTNode(_index1), _index1Node));
				if (_index2 != null) {
					indexes.push(this.arrayIndexValidate(await this.interpretASTNode(_index2), _index2Node));
				}

				return indexes;
			},
			Not: async ({_a, _aNode}) => {
				var a = this.toBool(this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments to unary operator.", _aNode));
				return (!a) ? 1 : 0;
			},
			Negate: async ({_a, _aNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments to unary operator.", _aNode);
				return (-a);
			},
			NegateBitwise: async ({_a, _aNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments to unary operator.", _aNode);
				return (~a);
			},
			And: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.toBool(this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments for &&.", _a));
				var b = this.toBool(this.checkIsNumber(await this.interpretASTNode(_b),
					"Wrong type of arguments for &&.", _b));
				return (a && b) ? 1 : 0;
			},
			Or: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.toBool(this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments for ||.", _a));
				var b = this.toBool(this.checkIsNumber(await this.interpretASTNode(_b),
					"Wrong type of arguments for ||.", _b));
				return (a || b) ? 1 : 0;
			},
			Xor: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.toBool(this.checkIsNumber(await this.interpretASTNode(_a),
					"Wrong type of arguments for ^^.", _a));
				var b = this.toBool(this.checkIsNumber(await this.interpretASTNode(_b),
					"Wrong type of arguments for ^^.", _b));
				return (a != b) ? 1 : 0;
			},
			Less: async ({_a, _1Node, _b}) => {
				var b = await this.interpretASTNode(_b);
				var a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a < b) ? 1 : 0;
			},
			LessOrEqual: async ({_a, _1Node, _b}) => {
				var b = await this.interpretASTNode(_b);
				var a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a <= b) ? 1 : 0;
			},
			Equal: async ({_a, _1Node, _b}) => {
				var b = await this.interpretASTNode(_b);
				var a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a === b) ? 1 : 0;
			},
			Different: async ({_a, _1Node, _b}) => {
				var b = await this.interpretASTNode(_b);
				var a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a !== b) ? 1 : 0;
			},
			Greater: async ({_a, _1Node, _b}) => {
				var b = await this.interpretASTNode(_b);
				var a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a > b) ? 1 : 0;
			},
			GreaterOrEqual: async ({_a, _1Node, _b}) => {
				var b = await this.interpretASTNode(_b);
				var a = await this.interpretASTNode(_a);
				this.checkIsSameType(a, b, "Cannot compare arguments.", _1Node);
				return (a >= b) ? 1 : 0;
			},
			BitwiseAnd: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for &.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for &.", _bNode);
				return a & b;
			},
			BitwiseOr: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for |.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for |.", _bNode);
				return a | b;
			},
			BitwiseXor: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for ^.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for ^.", _bNode);
				return a ^ b;
			},
			BitwiseShiftLeft: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for <<.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for <<.", _bNode);
				return a << b;
			},
			BitwiseShiftRight: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments for >>.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments for >>.", _bNode);
				return a >> b;
			},
			Add: async ({_a, _1Node, _b}) => {
				var a = await this.interpretASTNode(_a);
				var b = await this.interpretASTNode(_b);
				this.checkIsSameType(a, b, "Wrong type of arguments to +.", _1Node);
				return a + b;
			},
			Subtract: async({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to -.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to -.", _bNode);
				return a - b;
			},
			Multiply: async({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to *.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to *.", _bNode);
				return a * b;
			},
			Divide: async({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to /.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to /.", _bNode);
				return a / b;
			},
			IntegerDivision: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to div.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to div.", _bNode);
				return Math.floor(a / b);
			},
			Modulo: async ({_a, _aNode, _b, _bNode}) => {
				var a = this.checkIsNumber(await this.interpretASTNode(_a), "Wrong type of arguments to mod.", _aNode);
				var b = this.checkIsNumber(await this.interpretASTNode(_b), "Wrong type of arguments to mod.", _bNode);
				return a % b; // TODO check negative numbers
			},
			VariableGet: async ({_variable, _variableNode}) => {
				var varInfo = await this.interpretASTNode(_variable);
				var value = this.varGet(varInfo, _variableNode);
				return value;
			},
		}

	}

	compile(code, startRule) {
		//var trace = this.grammar.trace(code).toString();
		//console.log(trace);

		var matchResult = this.grammar.match(code, startRule);
		//console.log(match);

		if (matchResult.succeeded()) {
			var ast = ohmExtras.toAST(matchResult, this.mapping);
			// console.log(ast);
			return {succeeded: true, ast: ast};
		}

		return {succeeded: false, matchResult: matchResult}; // TODO maybe not store this idk
	}

	async execute(ast, instance, other, args, argRelative=0) {

		var previousInstance = this.currentInstance;
		var previousOther = this.currentOther;

		this.currentInstance = instance;
		this.currentOther = other;
		
		var savedVars = this.vars.saveAll();
		this.vars.clearAll();

		// Save previous arguments
		var savedArgs = this.game.globalVars.save('argument');
		var savedArgRelative = this.game.globalVars.save('argument_relative');

		// Set new arguments
		for (let i=0; i<16; i++) {
			var value = 0;
			if (Array.isArray(args) && args[i] != null) {value = args[i];}
			this.game.globalVars.setBuiltInArrayCall('argument', [i], value); // This auto sets numbered arguments
		}
		this.game.globalVars.setBuiltIn('argument_relative', argRelative);

		var result = 0;

		try {
			result = await this.interpretASTNode(ast);
		} catch (e) {
			if (e instanceof ExitException || e instanceof BreakException || e instanceof ContinueException) {
				// Nothing lol
			} else if (e instanceof ReturnException) {
				result = e.value;
			} else {
				throw e;
			}
		} finally {

			this.currentInstance = previousInstance;
			this.currentOther = previousOther;

			// Load vars/end game in case of non fatal error
			this.vars.loadAll(savedVars);

			// Load previous arguments
			this.game.globalVars.load('argument', savedArgs);

			// Load numbered arguments from arguments array
			for (let i=0; i<16; i++) {
				this.game.globalVars.setBuiltIn('argument' + i.toString(), this.game.globalVars.getBuiltInArray('argument', [i]));
			}

			this.game.globalVars.load('argument_relative', savedArgRelative);
		}

		return result;

	}
	
	async builtInFunction(name, instance, other, args, relative=false) {

		var func = BuiltInFunctions[name];

		if (func) {
			var previousInstance = this.currentInstance;
			var previousOther = this.currentOther;

			this.currentInstance = instance;
			this.currentOther = other;

			var result = await func.call(this, args, relative);

			this.currentInstance = previousInstance;
			this.currentOther = previousOther;

			return result;

		} else {
			throw this.game.makeNonFatalError({
					type: 'unknown_function_or_script',
					functionOrScriptName: name,
				},
				'Unknown function or script: '+name
			);
		}
	}

	varGet(varInfo, node) {

		try {

			if (varInfo.object == null) {

				if (this.game.constants[varInfo.name] != null)
					return this.game.constants[varInfo.name];
				if (this.vars.exists(varInfo.name))
					return this.vars.get(varInfo.name, varInfo.indexes);
				if (this.game.globalVars.exists(varInfo.name))
					return this.game.globalVars.get(varInfo.name, varInfo.indexes);

				if (this.currentInstance.vars.exists(varInfo.name))
					return this.currentInstance.vars.get(varInfo.name, varInfo.indexes);

				throw this.makeErrorInGMLNode("Unknown variable " + varInfo.name, node);

			} else {

				var instances = this.objectReferenceToInstances(varInfo.object);

				if (instances == null) {
					throw this.makeErrorInGMLNode("Unknown variable " + varInfo.name, node);

				} else if (instances == "global") {
					// TODO: "global." vars should be in this.game.globalVars.
					// There is a list that contains all "global." vars that have been "globalvar"'d.
					// This would be checked when getting/setting vars with a dot and when "globalvar" declarations are called.
					throw this.makeErrorInGMLNode("Unknown variable " + varInfo.name, node);

				} else {
					if (instances.length > 0) {
						if (instances[0].vars.exists(varInfo.name))
							return instances[0].vars.get(varInfo.name, varInfo.indexes);
					}
					throw this.makeErrorInGMLNode("Unknown variable " + varInfo.name, node);
				}
			}

		} catch (e) {
			if (e instanceof VariableException) {
				switch (e.type) {
					case 'index_not_in_bounds':
						throw this.makeErrorInGMLNode("Unknown variable "+varInfo.name+" or array index out of bounds (it's out of bounds.)", node);
				}
			} else {
				throw e;
			}
		}

	}

	varSet(varInfo, value, node) {

		try {

			if (varInfo.object == null) {

				if (this.game.constants[varInfo.name] != null)
					throw this.makeErrorInGMLNode("Variable name expected. (it's a constant)", node);
				if (this.vars.exists(varInfo.name))
					return this.vars.set(varInfo.name, value, varInfo.indexes);
				if (this.game.globalVars.exists(varInfo.name))
					return this.game.globalVars.set(varInfo.name, value, varInfo.indexes);

				this.currentInstance.vars.set(varInfo.name, value, varInfo.indexes);

			} else {

				var instances = this.objectReferenceToInstances(varInfo.object);
				if (instances === null) {
					throw this.makeErrorInGMLNode("Cannot assign to the variable", node);

				} else if (instances == "global") {
					// TODO: "global." vars should be in this.game.globalVars.
					// There is a list that contains all "global." vars that have been "globalvar"'d.
					// This would be checked when getting/setting vars with a dot and when "globalvar" declarations are called.
					throw this.makeErrorInGMLNode("Cannot assign to the variable", node);

				} else {
					for (let instance of instances) {
						instance.vars.set(varInfo.name, value, varInfo.indexes);
					}

				}

			}

		} catch (e) {
			if (e instanceof VariableException) {
				switch (e.type) {
					case 'read_only':
						throw this.makeErrorInGMLNode("Cannot assign to the variable ("+varInfo.name+" is read only)", node);
				}
			} else {
				throw e;
			}
		}

	}

	/*
	Converts an object reference (such as values before a dot in variable names) into a list of instances that corresponds to it. It can return:
	- An array of instances
	- "global"
	- null
	*/
	objectReferenceToInstances(object) {

		if (object >= 0 && object <= 100000) { // object index
			let instances = this.game.instances.filter(instance => instance.exists && instance.object_index == object);
			return instances;

		} else if (object > 100000) { // instance id
			let instance = this.game.instances.find(instance => instance.exists && instance.id == object);
			return instance ? [instance] : [];

		} else if (object == -1 || object == -7) { // self or local
			return [this.currentInstance];

		} else if (object == -2) { // other
			return [this.currentOther];

		} else if (object == -3) { // all
			return this.game.instances.filter(instance => instance.exists);

		} else if (object == -4) { // noone
			return null;

		} else if (object == -5) { // global
			return "global";

		} else {
			return null;
		}
	}

	varModify(varInfo, valueFunc, node) {
		var oldValue = this.varGet(varInfo, node);
		var newValue = valueFunc(oldValue);
		this.varSet(varInfo, newValue, node);
	}

	arrayIndexValidate(index, node) {
		if (typeof index != "number")
			throw this.makeErrorInGMLNode("Wrong type of array index", node);
		if (index < 0)
			throw this.makeErrorInGMLNode("Negative array index", node);
		return index;
	}

	toBool(value) {
		return value>=0.5;
	}

	checkIsNumber(value, message, node) {
		if (typeof value !== "number") {
			throw this.makeErrorInGMLNode(message, node);
		}
		return value;
	}

	checkIsSameType(a, b, message, node) {
		if (typeof a !== typeof b) {
			throw this.makeErrorInGMLNode(message, node);
		}
	}

	async interpretASTNode(node) {

		// _iter
		if (Array.isArray(node)) {
			var results = [];
			for (let child of node) {
				results.push(await this.interpretASTNode(child));
			}
			return results;
		}

		// _terminal
		if (node == null || node.type == null) {
			return node;
		}

		// _nonterminal
		var astAction = this.astActions[node.type];
		if (astAction) {
			return await astAction(node);
		}

		throw new Error("No possible action to interpret this node! ("+node.type+")");
	}

	makeErrorInGMLNode(message, node, isFatal=false) {
		console.log(node);

		var index = node.source.startIdx;
		var lines = node.source.sourceString.split('\n');
		var totalLength = 0;

		for (var i = 0; i < lines.length; ++i) {
			var lineLength = lines[i].length + 1;
			totalLength += lineLength;
			if (totalLength >= index) {

				var lineNumber = i + 1;
				var gmlLine = lines[i];
				var position = (index - (totalLength - lineLength)) + 1;
				var arrowString = " ".repeat(position-1) + "^";

				break;
			}
		}

		return this.game.makeError(isFatal, {
				type: 'error_in_code',
				node: node,
				subType: message,
			},
			`Error in code at line ` + lineNumber + `:\n`
			+ gmlLine + `\n` + arrowString + `\n`
			+ `at position ` + position + `: ` + message + `\n`
		);
	}

}