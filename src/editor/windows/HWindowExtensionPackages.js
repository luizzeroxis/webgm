import {parent, endparent} from '../../common/H.js'
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowExtensionPackages extends HPropertiesWindow {

	constructor(manager, id, editor) {
		super(manager, id, editor);

		this.title.html.textContent = 'Extension Packages';

		parent(this.client)

			this.makeApplyOkButtons(
				() => {
					// changes here
				},
				() => this.close()
			);
			endparent();
	}
}