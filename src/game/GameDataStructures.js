/* eslint-disable dot-notation */

import {sortValues, shuffle} from "~/common/tools.js";

export default class GameDataStructures {
	constructor(game) {
		this.game = game;

		this.types = {
			stack: [],
			queue: [],
			list: [],
			map: [],
			priority: [],
			grid: [],
		};
	}

	checkIfExists(type, id) {
		if (!this.types[type][id]) {
			throw this.game.makeError({text: `Data structure with index does not exist. (${type}, ${id})`});
		}
	}

	// all
	destroy(type, id) {
		this.checkIfExists(type, id);
		delete this.types[type][id];
		return 0;
	}

	// stack/queue/list/map/priority
	create(type) {
		this.types[type].push([]);
		return this.types[type].length-1;
	}

	clear(type, id) {
		this.checkIfExists(type, id);
		this.types[type][id] = [];
		return 0;
	}

	size(type, id) {
		this.checkIfExists(type, id);
		return this.types[type][id].length;
	}

	empty(type, id) {
		this.checkIfExists(type, id);
		return (this.types[type][id].length == 0) ? 1 : 0;
	}

	// stack/queue/list
	copy(type, id, source) {
		this.checkIfExists(type, id);
		this.checkIfExists(type, source);
		this.types[type][id] = [...this.types[type][source]];
		return 0;
	}

	// stack
	stackPush(id, val) {
		this.checkIfExists("stack", id);
		this.types["stack"][id].push(val);
		return 0;
	}

	stackPop(id) {
		this.checkIfExists("stack", id);
		return this.types["stack"][id].pop() ?? 0;
	}

	stackTop(id) {
		this.checkIfExists("stack", id);
		return this.types["stack"][id][this.types["stack"][id].length-1] ?? 0;
	}

	// queue
	queueEnqueue(id, val) {
		this.checkIfExists("queue", id);
		this.types["queue"][id].push(val);
		return 0;
	}

	queueDequeue(id) {
		this.checkIfExists("queue", id);
		return this.types["queue"][id].shift() ?? 0;
	}

	queueHead(id) {
		this.checkIfExists("queue", id);
		return this.types["queue"][id][0] ?? 0;
	}

	queueTail(id) {
		this.checkIfExists("queue", id);
		return this.types["queue"][id][this.types["queue"][id].length-1] ?? 0;
	}

	// list
	listAdd(id, val) {
		this.checkIfExists("list", id);
		this.types["list"][id].push(val);
		return 0;
	}

	listInsert(id, pos, val) {
		this.checkIfExists("list", id);
		if (pos >= 0 && pos <= this.types["list"][id].length) {
			this.types["list"][id].splice(pos, 0, val);
		}
		return 0;
	}

	listReplace(id, pos, val) {
		this.checkIfExists("list", id);
		if (pos >= 0 && pos < this.types["list"][id].length) {
			this.types["list"][id][pos] = val;
		}
		return 0;
	}

	listDelete(id, pos) {
		this.checkIfExists("list", id);
		if (pos >= 0 && pos < this.types["list"][id].length) {
			this.types["list"][id].splice(pos, 1);
		}
		return 0;
	}

	listFindIndex(id, val) {
		this.checkIfExists("list", id);
		return this.types["list"][id].indexOf(val);
	}

	listFindValue(id, pos) {
		this.checkIfExists("list", id);
		return this.types["list"][id][pos] ?? 0;
	}

	listSort(id, ascend) {
		this.checkIfExists("list", id);
		sortValues(this.types["list"][id], ascend);
		return 0;
	}

	listShuffle(id) {
		this.checkIfExists("list", id);
		shuffle(this.types["list"][id]);
		return 0;
	}

	// map
	mapCopy(id, source) {
		this.checkIfExists("map", id);
		this.checkIfExists("map", source);
		this.types["map"][id] = this.types["map"][source].map(x => ({key: x.key, val: x.val}));
		return 0;
	}

	mapAdd(id, key, val) {
		this.checkIfExists("map", id);
		this.types["map"][id].push({key, val});
		sortValues(this.types["map"][id], true, x => x.key);
		return 0;
	}

	mapReplace(id, key, val) {
		this.checkIfExists("map", id);
		const o = this.types["map"][id].find(x => x.key == key);
		if (o) {
			o.val = val;
		}
		return 0;
	}

	mapDelete(id, key) {
		this.checkIfExists("map", id);
		const i = this.types["map"][id].findIndex(x => x.key == key);
		if (i != -1) {
			this.types["map"][id].splice(i, 1);
		}
		return 0;
	}

	mapExists(id, key) {
		this.checkIfExists("map", id);
		return (this.types["map"][id].find(x => x.key == key) != null) ? 1 : 0;
	}

	mapFindValue(id, key) {
		this.checkIfExists("map", id);
		return this.types["map"][id].find(x => x.key == key)?.val ?? 0;
	}

	mapFindPrevious(id, key) {
		this.checkIfExists("map", id);
		const i = this.types["map"][id].findIndex(x => x.key == key);
		if (i == -1) return 0;
		return this.types["map"][id][i-1]?.key ?? 0;
	}

	mapFindNext(id, key) {
		this.checkIfExists("map", id);
		const i = this.types["map"][id].findIndex(x => x.key == key);
		if (i == -1) return 0;
		return this.types["map"][id][i+1]?.key ?? 0;
	}

	mapFindFirst(id) {
		this.checkIfExists("map", id);
		return this.types["map"][id][0]?.key ?? 0;
	}

	mapFindLast(id) {
		this.checkIfExists("map", id);
		return this.types["map"][id][this.types["map"][id].length-1]?.key ?? 0;
	}

	// priority
	priorityCopy(id, source) {
		this.types["priority"][id] = this.types["priority"][source].map(x => ({val: x.val, prio: x.prio}));
		return 0;
	}

	priorityAdd(id, val, prio) {
		this.types["priority"][id].push({val, prio});
		sortValues(this.types["priority"][id], true, x => x.prio);
		return 0;
	}

	priorityChangePriority(id, val, prio) {
		const o = this.types["priority"][id].find(x => x.val == val);
		if (o) {
			o.prio = prio;
			sortValues(this.types["priority"][id], true, x => x.prio);
		}
		return 0;
	}

	priorityFindPriority(id, val) {
		return this.types["priority"][id].find(x => x.val == val)?.prio ?? 0;
	}

	priorityDeleteValue(id, val) {
		const i = this.types["priority"][id].findIndex(x => x.val == val);
		if (i != -1) {
			this.types["priority"][id].splice(i, 1);
		}
		return 0;
	}

	priorityDeleteMin(id) {
		if (this.types["priority"][id].length > 0) {
			return this.types["priority"][id].splice(0, 1)[0].val;
		}
		return 0;
	}

	priorityFindMin(id) {
		return this.types["priority"][id][0]?.val ?? 0;
	}

	priorityDeleteMax(id) {
		if (this.types["priority"][id].length > 0) {
			return this.types["priority"][id].splice(this.types["priority"][id].length-1, 1)[0].val;
		}
		return 0;
	}

	priorityFindMax(id) {
		return this.types["priority"][id][this.types["priority"][id].length-1]?.val ?? 0;
	}
}