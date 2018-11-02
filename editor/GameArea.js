//
class GameArea {

	constructor(editor) {
		//TODO get room 0 size?
		parent( add( html('div', {class: 'game'}) ) )
			add( newCanvas("canvas", 640, 480) )
			endparent()
	}
	
}