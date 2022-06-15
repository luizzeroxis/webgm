import {parent, endparent, add, remove, HElement, HButton, HImage} from '../../common/H.js'
import {Project} from '../../common/Project.js';
import HResourceListItem from '../HResourceListItem.js';
import FolderIcon from '../img/folder-icon.png';
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
			parent( add ( new HElement('ul') ) )

				Project.getTypes().forEach(type => {

					parent( add( new HElement('li') ) )

						parent( add( new HElement('div', {class: 'item'}) ) )
							add( new HImage(FolderIcon, 'icon') );
							add( new HElement('div', {class: 'name'}, type.getScreenGroupName()) )
							add( new HButton('Create', () => {
								this.editor.createResource(type);
							}))
							endparent()

						this.resourceTypes[type.name] = add ( new HElement('ul', {class: "resource"}) )
						endparent()

				})

				parent( add( new HElement('li') ) );

					parent( add( new HElement('div', {class: 'item'}) ) )
						add( new HImage(GameInformationIcon, 'icon') );
						add( new HElement('div', {class: 'name'}, 'Game Information') )
						add( new HButton('Edit', () => this.editor.windowsArea.open(HWindowGameInformation,
							'game-information', this.editor.project.gameInformation)) )
						endparent();

					endparent();

				parent( add( new HElement('li') ) );
					parent( add( new HElement('div', {class: 'item'}) ) )
						add( new HImage(GameSettingsIcon, 'icon') );
						add( new HElement('div', {class: 'name'}, 'Global Game Settings') )
						add( new HButton('Edit', () => this.editor.windowsArea.open(HWindowGlobalGameSettings,
							'global-game-settings', this.editor.project.globalGameSettings )) )
						endparent()

					endparent();

				// parent( add( new HElement('li') ) );
				// 	parent( add( new HElement('div', {class: 'item'}) ) )
				// 		add( new HImage(ExtensionPackagesIcon, 'icon') );
				// 		add( new HElement('div', {class: 'name'}, 'Extension packages') )
				// 		add( new HButton('Edit', () => this.editor.openWindow(HWindowExtensionPackages,
				// 			'extension-packages', this.editor.project.extensionPackages)) )
				// 		endparent();

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
			const r = add( new HResourceListItem(resource, this.editor) )
			this.resources.push(r);
			endparent();
	}

	// Delete resource from resources tree.
	delete(resource) {
		const index = this.resources.findIndex(x => x.id == resource);
		if (index>=0) {
			remove(this.resources[index])
			this.resources.splice(index, 1);
		}
	}

	refresh() {
		for (const resource of this.resources) {
			remove(resource)
		}
		Project.getTypes().forEach(type => {
			this.editor.project.resources[type.getClassName()].forEach(resource => {
				this.add(resource);
			})
		})
	}

}