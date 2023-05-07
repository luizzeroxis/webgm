import {parent, endparent, add, remove, moveBefore, moveAdd, classToAttr, classToArray, HElement} from "../common/H.js";

import "./HTree.scss";

export default class HTreeList extends HElement {
	constructor(tree, parentItem, _class) {
		super("div", {class: classToAttr([...classToArray(_class), "h-tree-list"])});

		this.tree = tree;
		this.parentItem = parentItem;
		this.items = [];
	}

	add(item) {
		parent(this);
			this.items.push(item);
			item.tree = this.tree;
			add(item);
			endparent();

		this.parentItem?.updateExpander();
		return item;
	}

	move(item, toIndex) {
		const fromIndex = this.items.indexOf(item);

		if (toIndex != this.items.length-1) {
			const beforeItem = this.items[toIndex > fromIndex ? toIndex + 1 : toIndex];
			moveBefore(beforeItem, item);
		} else {
			parent(this);
				moveAdd(item);
				endparent();
		}

		this.items.splice(toIndex, 0, ...this.items.splice(fromIndex, 1));
	}

	delete(item) {
		this.items.splice(this.items.findIndex(x => x == item), 1);
		remove(item);

		this.parentItem?.updateExpander();

		if (item == this.tree.selected) {
			this.tree.setSelected(null);
		}
	}

	find(fn) {
		return this.items.find(fn);
	}

	clear() {
		this.items.forEach(item => {
			remove(item);
		});
		this.items = [];

		this.parentItem?.updateExpander();
	}

	setAllOpen(value) {
		for (const item of this.items) {
			item.setOpen(value);
			if (item.treeList) {
				item.treeList.setAllOpen(value);
			}
		}
	}
}