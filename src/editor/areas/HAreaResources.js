import {parent, endparent, add, remove, HElement, newElem, newButton, newImage} from '../../common/H.js'
import {Project} from '../../common/Project.js';
import HResourceListItem from '../HResourceListItem.js';
import GameInformationIcon from '../img/game-information-icon.png';
import GameSettingsIcon from '../img/global-game-settings-icon.png';
import HWindowGameInformation from '../windows/HWindowGameInformation.js';
import HWindowGlobalGameSettings from '../windows/HWindowGlobalGameSettings.js';
// import ExtensionPackagesIcon from './img/extension-packages-icon.png';

export default class HAreaResources extends HElement {

	constructor(editor) {
		super('div', {class: 'resources'})

		this.editor = editor;
		this.resourceTypes = {};
		this.resources = [];

		parent(this)
			parent( add ( newElem(null, 'ul') ) )

				Project.getTypes().forEach(type => {

					parent( add( newElem(null, 'li') ) )
						// add( newImage('icon', FolderIcon) );
						add( newElem(null, 'span', type.getScreenGroupName()) )
						add( newButton('right', 'Create', () => {
							this.editor.createResource(type);
						}) )
						this.resourceTypes[type.name] = add ( newElem("resource", 'ul') )
						endparent()

				})

				parent( add( newElem(null, 'li') ) );
					add( newImage('icon', GameInformationIcon) );
					add( newElem('name', 'span', 'Game Information') )

					parent( add( newElem('right', 'div') ) )
						add( newButton(null, 'Edit', () => this.editor.windowsArea.open(HWindowGameInformation,
							'game-information', this.editor.project.gameInformation)) )
						endparent();

					endparent();

				parent( add( newElem(null, 'li') ) );
					add( newImage('icon', GameSettingsIcon) );
					add( newElem('name', 'span', 'Global Game Settings') )

					parent( add( newElem('right', 'div') ) )
						add( newButton(null, 'Edit', () => this.editor.windowsArea.open(HWindowGlobalGameSettings,
							'global-game-settings', this.editor.project.globalGameSettings )) )
						endparent();

					endparent();

				// parent( add( newElem(null, 'li') ) );
				// 	add( newImage('icon', ExtensionPackagesIcon) );
				// 	add( newElem('name', 'span', 'Extension packages') )

				// 	parent( add( newElem('right', 'div') ) )
				// 		add( newButton(null, 'Edit', () => this.editor.openWindow(HWindowExtensionPackages,
				// 			'extension-packages', this.editor.project.extensionPackages)) )
				// 		endparent();

				// 	endparent();

				endparent()

			endparent()

	}

	onAdd() {
		this.listeners = this.editor.dispatcher.listen({
			createResource: i => {
				this.add(i);
			},
			deleteResource: i => {
				this.delete(i);
			},
		});
	}

	// onRemove() {
	// 	this.editor.dispatcher.stopListening(this.listeners);
	// }

	// Add resource to resources tree in the proper type.
	add(resource) {
		parent(this.resourceTypes[resource.constructor.name]);
			var r = add( new HResourceListItem(resource, this.editor) )

			r.htmlEditButton.onclick = () => this.editor.windowsArea.openResource(resource)
			r.htmlDeleteButton.onclick = () => this.editor.deleteResource(resource)

			this.resources.push(r);
			endparent();
	}

	// Delete resource from resources tree.
	delete(resource) {
		var index = this.resources.findIndex(x => x.id == resource);
		if (index>=0) {
			remove(this.resources[index])
			this.resources.splice(index, 1);
		}
	}

	refresh() {
		for (let resource of this.resources) {
			remove(resource)
		}
		Project.getTypes().forEach(type => {
			this.editor.project.resources[type.getClassName()].forEach(resource => {
				this.add(resource);
			})
		})
	}

}