//
class WindowsArea {

	openWindow(resource) {

		// if window is already open, bring to front
		if (this.windowListItems[resource]) {

		} else {
			parent(this.windowList)
				switch(resource.constructor) {
					case ProjectSprite:
						this.windowListItems[resource] = new SpriteWindow(this.editor, resource);
						break;
					case ProjectSound:
						this.windowListItems[resource] = new SoundWindow(this.editor, resource);
						break;
					case ProjectScript:
						this.windowListItems[resource] = new ScriptWindow(this.editor, resource);
						break;
					case ProjectFont:
						this.windowListItems[resource] = new FontWindow(this.editor, resource);
						break;
					case ProjectObject:
						this.windowListItems[resource] = new ObjectWindow(this.editor, resource);
						break;
					case ProjectRoom:
						this.windowListItems[resource] = new RoomWindow(this.editor, resource);
						break;
				}
				
				endparent()
			}

	}

	closeWindow(resource) {

		if (this.windowListItems[resource]) {
			remove(this.windowListItems[resource]);
			this.windowListItems[resource] = null;
		}

	}

	onDeleteResource(resource) {
		this.closeWindow(resource);
	}
	

	moveWindowToTop(win) {
		// Change all window orders
		var wins = document.querySelectorAll('.window');

		for (var i = 0; i < wins.length; i++) {
			//In case this item is above the item to move up, make it lower
			//console.log(wins[i].style.order, win.style.order);
			if (parseInt(wins[i].style.order) < parseInt(win.style.order)) {
				wins[i].style.order++;
			}
		}
		
		//Make it first
		win.style.order = 1;
	}

}