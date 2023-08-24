import Serializer from "~/common/Serializer.js";

export class ProjectActionArg {
	static {
		Serializer.setupClass(this, "ProjectActionArg", {
			kind: null, // expression, string, both, boolean, menu, color, sprite, sound, background, path, script, object, room, font, timeline
			value: null,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}
}

export class ProjectAction {
	static {
		Serializer.setupClass(this, "ProjectAction", {
			typeLibrary: null,
			typeId: null,
			typeKind: null, // normal, begin group, end group, else, exit, repeat, variable, code
			typeExecution: null, // nothing, function, code
			typeExecutionFunction: null,
			typeExecutionCode: null,
			typeIsQuestion: null,

			args: {array: ProjectActionArg}, // ProjectActionArg

			appliesTo: -1, // -1 = self, -2 = other, 0>= = object index
			relative: false,
			not: false,
		});
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	static typeInfo = [
		{kind: "normal", interfaceKind: "none", args: []},
		{kind: "normal", interfaceKind: "normal"},
		{kind: "normal", interfaceKind: "arrows", args: [
			{name: "Directions:", kind: "string", default: "000000000"},
			{name: "Speed:", kind: "expression", default: "0"},
		]},
		{kind: "normal", interfaceKind: "code", args: [
			{kind: "string", default: ""},
		]},
		{kind: "normal", interfaceKind: "text", args: [
			{kind: "string", default: ""},
		]},
		{kind: "repeat", hasApplyTo: false, args: [
			{name: "times:", kind: "expression", default: "1"},
		]},
		{kind: "variable", hasApplyTo: true, hasRelative: true, args: [
			{name: "variable:", kind: "string", default: ""},
			{name: "value:", kind: "expression", default: "0"},
		]},
		{kind: "code", hasApplyTo: true, args: [
			{kind: "string", default: ""},
		]},
		{kind: "begin", args: []},
		{kind: "end", args: []},
		{kind: "else", args: []},
		{kind: "exit", args: []},
	];

	setType(libraryName, actionType) {
		this.typeLibrary = libraryName;
		this.typeId = actionType.id;
		this.typeKind = actionType.kind;
		this.typeExecution = actionType.execution;
		this.typeExecutionFunction = actionType.executionFunction;
		this.typeExecutionCode = actionType.executionCode;
		this.typeIsQuestion = actionType.isQuestion;

		let typeArgs;

		if (actionType.kind == "normal" && actionType.interfaceKind == "normal") {
			// If kind and interface are normal, arguments come from the action type itself
			typeArgs = actionType.args;
		} else {
			// Otherwise, the arguments come from a predefined list
			typeArgs = ProjectAction.typeInfo
				.find(x => x.kind == actionType.kind && x.interfaceKind == actionType.interfaceKind)
				.args;
		}

		this.args = typeArgs.map(typeArg => {
			const actionArg = new ProjectActionArg();
			actionArg.kind = typeArg.kind;
			actionArg.value = typeArg.default;
			return actionArg;
		});
	}
}