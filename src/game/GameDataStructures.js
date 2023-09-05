/* eslint-disable dot-notation */

import {sortValues, shuffle, shuffle2d} from "~/common/tools.js";

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
		this.checkIfExists("priority", id);
		this.checkIfExists("priority", source);
		this.types["priority"][id] = this.types["priority"][source].map(x => ({val: x.val, prio: x.prio}));
		return 0;
	}

	priorityAdd(id, val, prio) {
		this.checkIfExists("priority", id);
		this.types["priority"][id].push({val, prio});
		sortValues(this.types["priority"][id], true, x => x.prio);
		return 0;
	}

	priorityChangePriority(id, val, prio) {
		this.checkIfExists("priority", id);
		const o = this.types["priority"][id].find(x => x.val == val);
		if (o) {
			o.prio = prio;
			sortValues(this.types["priority"][id], true, x => x.prio);
		}
		return 0;
	}

	priorityFindPriority(id, val) {
		this.checkIfExists("priority", id);
		return this.types["priority"][id].find(x => x.val == val)?.prio ?? 0;
	}

	priorityDeleteValue(id, val) {
		this.checkIfExists("priority", id);
		const i = this.types["priority"][id].findIndex(x => x.val == val);
		if (i != -1) {
			this.types["priority"][id].splice(i, 1);
		}
		return 0;
	}

	priorityDeleteMin(id) {
		this.checkIfExists("priority", id);
		if (this.types["priority"][id].length > 0) {
			return this.types["priority"][id].splice(0, 1)[0].val;
		}
		return 0;
	}

	priorityFindMin(id) {
		this.checkIfExists("priority", id);
		return this.types["priority"][id][0]?.val ?? 0;
	}

	priorityDeleteMax(id) {
		this.checkIfExists("priority", id);
		if (this.types["priority"][id].length > 0) {
			return this.types["priority"][id].splice(this.types["priority"][id].length-1, 1)[0].val;
		}
		return 0;
	}

	priorityFindMax(id) {
		this.checkIfExists("priority", id);
		return this.types["priority"][id][this.types["priority"][id].length-1]?.val ?? 0;
	}

	// grid
	gridCreate(w, h) {
		if (w < 0) w = 0;
		if (h < 0) h = 0;
		this.types["grid"].push({
			w, h,
			grid: Array.from(new Array(w), () => Array.from(new Array(h), () => 0)),
		});
		return this.types["grid"].length-1;
	}

	gridCopy(id, source) {
		this.checkIfExists("grid", id);
		this.checkIfExists("grid", source);
		this.types["grid"][id] = {
			w: this.types["grid"][source].w,
			h: this.types["grid"][source].h,
			grid: this.types["grid"][source].grid.map(col => col.map(x => x)),
		};
		return 0;
	}

	gridResize(id, w, h) {
		this.checkIfExists("grid", id);

		const cw = this.types["grid"][id].w;
		const ch = this.types["grid"][id].h;

		if (w < 0) w = 0;
		if (h < 0) h = 0;

		if (h != ch) {
			this.types["grid"][id].grid.forEach(col => {
				if (h < ch) {
					col.length = h;
				} else
				if (h > ch) {
					col.push(
						...Array.from(new Array(h - ch), () => 0),
					);
				}
			});
		}

		if (w < cw) {
			this.types["grid"][id].grid.length = w;
		} else
		if (w > cw) {
			this.types["grid"][id].grid.push(
				...Array.from(new Array(w - cw), () => Array.from(new Array(h), () => 0)),
			);
		}

		this.types["grid"][id].w = w;
		this.types["grid"][id].h = h;

		return 0;
	}

	gridWidth(id) {
		this.checkIfExists("grid", id);
		return this.types["grid"][id].w;
	}

	gridHeight(id) {
		this.checkIfExists("grid", id);
		return this.types["grid"][id].h;
	}

	gridClear(id, val) {
		this.checkIfExists("grid", id);
		this.types["grid"][id].grid = this.types["grid"][id].grid.map(col => col.map(() => val));
		return 0;
	}

	gridSet(id, x, y, val) {
		this.checkIfExists("grid", id);
		if (x >= 0 && x < this.types["grid"][id].w && y >= 0 && this.types["grid"][id].h) {
			this.types["grid"][id].grid[x][y] = val;
		}
		return 0;
	}

	gridAdd(id, x, y, val) {
		this.checkIfExists("grid", id);
		if (x >= 0 && x < this.types["grid"][id].w && y >= 0 && this.types["grid"][id].h) {
			if (typeof this.types["grid"][id].grid[x][y] == typeof val) {
				this.types["grid"][id].grid[x][y] += val;
			} else {
				this.types["grid"][id].grid[x][y] = val;
			}
		}
		return 0;
	}

	gridMultiply(id, x, y, val) {
		this.checkIfExists("grid", id);
		if (x >= 0 && x < this.types["grid"][id].w && y >= 0 && this.types["grid"][id].h) {
			if (typeof this.types["grid"][id].grid[x][y] =="number" && typeof val == "number") {
				this.types["grid"][id].grid[x][y] *= val;
			}
		}
		return 0;
	}

	gridSetRegion(id, x1, y1, x2, y2, val) {
		return this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => this.gridFunctionSet(grid, x, y, val));
	}

	gridAddRegion(id, x1, y1, x2, y2, val) {
		return this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => this.gridFunctionAdd(grid, x, y, val));
	}

	gridMultiplyRegion(id, x1, y1, x2, y2, val) {
		return this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => this.gridFunctionMultiply(grid, x, y, val));
	}

	gridSetDisk(id, xm, ym, r, val) {
		return this.gridOnDisk(id, xm, ym, r, (grid, x, y) => this.gridFunctionSet(grid, x, y, val));
	}

	gridAddDisk(id, xm, ym, r, val) {
		return this.gridOnDisk(id, xm, ym, r, (grid, x, y) => this.gridFunctionAdd(grid, x, y, val));
	}

	gridMultiplyDisk(id, xm, ym, r, val) {
		return this.gridOnDisk(id, xm, ym, r, (grid, x, y) => this.gridFunctionMultiply(grid, x, y, val));
	}

	gridSetGridRegion(id, source, x1, y1, x2, y2, xpos, ypos) {
		return this.gridOnGridRegion(id, source, x1, y1, x2, y2, xpos, ypos, (grid, x, y, val) => this.gridFunctionSet(grid, x, y, val));
	}

	gridAddGridRegion(id, source, x1, y1, x2, y2, xpos, ypos) {
		return this.gridOnGridRegion(id, source, x1, y1, x2, y2, xpos, ypos, (grid, x, y, val) => this.gridFunctionAdd(grid, x, y, val));
	}

	gridMultiplyGridRegion(id, source, x1, y1, x2, y2, xpos, ypos) {
		return this.gridOnGridRegion(id, source, x1, y1, x2, y2, xpos, ypos, (grid, x, y, val) => this.gridFunctionMultiply(grid, x, y, val));
	}

	gridGet(id, x, y) {
		this.checkIfExists("grid", id);
		if (x >= 0 && x < this.types["grid"][id].w && y >= 0 && this.types["grid"][id].h) {
			return this.types["grid"][id].grid[x][y];
		}
		return 0;
	}

	gridGetSum(id, x1, y1, x2, y2) {
		let sum = 0;
		this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => {
			if (typeof grid[x][y] == "number") {
				sum += grid[x][y];
			}
		});
		return sum;
	}

	gridGetMin(id, x1, y1, x2, y2) {
		let min = Infinity;
		this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => {
			if (typeof grid[x][y] == "number") {
				if (grid[x][y] < min) {
					min = grid[x][y];
				}
			}
		});
		return (min == Infinity) ? 0 : min;
	}

	gridGetMax(id, x1, y1, x2, y2) {
		let max = -Infinity;
		this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => {
			if (typeof grid[x][y] == "number") {
				if (grid[x][y] > max) {
					max = grid[x][y];
				}
			}
		});
		return (max == -Infinity) ? 0 : max;
	}

	gridGetMean(id, x1, y1, x2, y2) {
		let sum = 0;
		let quant = 0;
		this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => {
			if (typeof grid[x][y] == "number") {
				sum += grid[x][y];
				++quant;
			}
		});
		return (quant == 0) ? 0 : (sum / quant);
	}

	gridGetDiskSum(id, xm, ym, r) {
		let sum = 0;
		this.gridOnDisk(id, xm, ym, r, (grid, x, y) => {
			if (typeof grid[x][y] == "number") {
				sum += grid[x][y];
			}
		});
		return sum;
	}

	gridGetDiskMin(id, xm, ym, r) {
		let min = Infinity;
		this.gridOnDisk(id, xm, ym, r, (grid, x, y) => {
			if (typeof grid[x][y] == "number") {
				if (grid[x][y] < min) {
					min = grid[x][y];
				}
			}
		});
		return (min == Infinity) ? 0 : min;
	}

	gridGetDiskMax(id, xm, ym, r) {
		let max = -Infinity;
		this.gridOnDisk(id, xm, ym, r, (grid, x, y) => {
			if (typeof grid[x][y] == "number") {
				if (grid[x][y] > max) {
					max = grid[x][y];
				}
			}
		});
		return (max == -Infinity) ? 0 : max;
	}

	gridGetDiskMean(id, xm, ym, r) {
		let sum = 0;
		let quant = 0;
		this.gridOnDisk(id, xm, ym, r, (grid, x, y) => {
			if (typeof grid[x][y] == "number") {
				sum += grid[x][y];
				++quant;
			}
		});
		return (quant == 0) ? 0 : (sum / quant);
	}

	gridValueExists(id, x1, y1, x2, y2, val) {
		return this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => {
			if (grid[x][y] == val) return 1;
			return null;
		});
	}

	gridValueX(id, x1, y1, x2, y2, val) {
		return this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => {
			if (grid[x][y] == val) return x;
			return null;
		});
	}

	gridValueY(id, x1, y1, x2, y2, val) {
		return this.gridOnRegion(id, x1, y1, x2, y2, (grid, x, y) => {
			if (grid[x][y] == val) return y;
			return null;
		});
	}

	gridValueDiskExists(id, xm, ym, r, val) {
		return this.gridOnDisk(id, xm, ym, r, (grid, x, y) => {
			if (grid[x][y] == val) return 1;
			return null;
		});
	}

	gridValueDiskX(id, xm, ym, r, val) {
		return this.gridOnDisk(id, xm, ym, r, (grid, x, y) => {
			if (grid[x][y] == val) return x;
			return null;
		});
	}

	gridValueDiskY(id, xm, ym, r, val) {
		return this.gridOnDisk(id, xm, ym, r, (grid, x, y) => {
			if (grid[x][y] == val) return y;
			return null;
		});
	}

	gridShuffle(id) {
		this.checkIfExists("grid", id);
		shuffle2d(this.types["grid"][id].grid);
		return 0;
	}

	gridBoundRect(grid, x1, y1, x2, y2) {
		x1 = Math.min(Math.max(0, x1), grid.w-1);
		y1 = Math.min(Math.max(0, y1), grid.h-1);
		x2 = Math.min(Math.max(0, x2), grid.w-1);
		y2 = Math.min(Math.max(0, y2), grid.h-1);

		x1 = Math.min(x1, x2);
		y1 = Math.min(y1, y2);
		x2 = Math.max(x1, x2);
		y2 = Math.max(y1, y2);

		return [x1, y1, x2, y2];
	}

	gridOnRegion(id, x1, y1, x2, y2, func) {
		this.checkIfExists("grid", id);

		const grid = this.types["grid"][id];
		[x1, y1, x2, y2] = this.gridBoundRect(grid, x1, y1, x2, y2);

		for (let x=x1; x<=x2; ++x)
		for (let y=y1; y<=y2; ++y) {
			const res = func(grid.grid, x, y);
			if (res != null) return res;
		}

		return 0;
	}

	gridOnDisk(id, xm, ym, r, func) {
		this.checkIfExists("grid", id);

		const grid = this.types["grid"][id];

		let x1 = Math.floor(xm - r);
		let y1 = Math.floor(ym - r);
		let x2 = Math.ceil(xm + r);
		let y2 = Math.ceil(ym + r);

		x1 = Math.min(Math.max(0, x1), grid.w-1);
		y1 = Math.min(Math.max(0, y1), grid.h-1);
		x2 = Math.min(Math.max(0, x2), grid.w-1);
		y2 = Math.min(Math.max(0, y2), grid.h-1);

		for (let x=x1; x<=x2; ++x)
		for (let y=y1; y<=y2; ++y) {
			if (Math.sqrt((x - xm)**2 + (y - ym)**2) <= r) {
				const res = func(grid.grid, x, y);
				if (res != null) return res;
			}
		}

		return 0;
	}

	gridOnGridRegion(id, source, x1, y1, x2, y2, xpos, ypos, func) {
		this.checkIfExists("grid", id);
		this.checkIfExists("grid", source);

		const grid = this.types["grid"][id];
		const gridSource = this.types["grid"][source];

		[x1, y1, x2, y2] = this.gridBoundRect(gridSource, x1, y1, x2, y2);

		for (let x=x1; x<=x2; ++x)
		for (let y=y1; y<=y2; ++y) {
			const dx = xpos + (x-x1);
			const dy = ypos + (y-y1);

			if (dx >= 0 && dx < grid.w && dx >= 0 && dx < grid.h) {
				func(grid.grid, dx, dy, gridSource.grid[x][y]);
			}
		}

		return 0;
	}

	gridFunctionSet(grid, x, y, val) {
		grid[x][y] = val;
	}

	gridFunctionAdd(grid, x, y, val) {
		if (typeof grid[x][y] == typeof val) {
			grid[x][y] += val;
		} else {
			grid[x][y] = val;
		}
	}

	gridFunctionMultiply(grid, x, y, val) {
		if (typeof grid[x][y] == "number" && typeof val == "number") {
			grid[x][y] *= val;
		}
	}
}