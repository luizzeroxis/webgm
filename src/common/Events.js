export default class Events {

	static listEventTypes = [
		{id:  0, value: 'create',     name: 'Create',      getFullName: () => 'Create'},
		{id:  1, value: 'destroy',    name: 'Destroy',     getFullName: () => 'Destroy'},
		{id:  3, value: 'step',       name: 'Step',        getFullName: (subtype) => Events.listStepSubtypes.find(x=>x.value==subtype).name},
		{id:  2, value: 'alarm',      name: 'Alarm',       getFullName: (subtype) => 'Alarm '+subtype},
		{id:  5, value: 'keyboard',   name: 'Keyboard',    getFullName: (subtype) => 'Keyboard '+subtype},
		{id:  6, value: 'mouse',      name: 'Mouse',       getFullName: (subtype) => Events.listMouseSubtypes.find(x=>x.value==subtype).name},
		{id:  4, value: 'collision',  name: 'Collision',   getFullName: (subtype, project) => 'Collision with '+ (project.resources.ProjectObject.find(x => x.id == subtype).name)},
		{id:  7, value: 'other',      name: 'Other',       getFullName: (subtype) => Events.listOtherSubtypes.find(x=>x.value==subtype).name},
		{id:  8, value: 'draw',       name: 'Draw',        getFullName: () => 'Draw'},
		{id:  9, value: 'keypress',   name: 'Key press',   getFullName: (subtype) => 'Key press'+subtype},
		{id: 10, value: 'keyrelease', name: 'Key release', getFullName: (subtype) => 'Key release'+subtype},
	];

	static listStepSubtypes = [
		{value: 'normal', name: 'Step'},
		{value: 'begin', name: 'Begin step'},
		{value: 'end', name: 'End step'},
	];

	static listMouseSubtypes = [
		{value: 0, name: 'Left Button'},
		{value: 1, name: 'Right Button'},
		{value: 2, name: 'Middle Button'},

		{value: 3, name: 'No Button'},

		{value: 4, name: 'Left Press'},
		{value: 5, name: 'Right Press'},
		{value: 6, name: 'Middle Press'},

		{value: 7, name: 'Left Release'},
		{value: 8, name: 'Right Release'},
		{value: 9, name: 'Middle Release'},

		{value: 10, name: 'Mouse Enter'},
		{value: 11, name: 'Mouse Leave'},

		// {value: 12, name: 'Global Press'},
		// {value: 13, name: 'Global Release'},

		{value: 60, name: 'Mouse Wheel Up'},
		{value: 61, name: 'Mouse Wheel Down'},

		{value: 50, name: 'Global Left Button'},
		{value: 51, name: 'Global Right Button'},
		{value: 52, name: 'Global Middle Button'},
		{value: 53, name: 'Global Left Press'},
		{value: 54, name: 'Global Right Press'},
		{value: 55, name: 'Global Middle Press'},
		{value: 56, name: 'Global Left Release'},
		{value: 57, name: 'Global Right Release'},
		{value: 58, name: 'Global Middle Release'},

		{value: 16, name: 'Joystick1 Left'},
		{value: 17, name: 'Joystick1 Right'},
		{value: 18, name: 'Joystick1 Up'},
		{value: 19, name: 'Joystick1 Down'},
		{value: 21, name: 'Joystick1 Button1'},
		{value: 22, name: 'Joystick1 Button2'},
		{value: 23, name: 'Joystick1 Button3'},
		{value: 24, name: 'Joystick1 Button4'},
		{value: 25, name: 'Joystick1 Button5'},
		{value: 26, name: 'Joystick1 Button6'},
		{value: 27, name: 'Joystick1 Button7'},
		{value: 28, name: 'Joystick1 Button8'},

		{value: 31, name: 'Joystick2 Left'},
		{value: 32, name: 'Joystick2 Right'},
		{value: 33, name: 'Joystick2 Up'},
		{value: 34, name: 'Joystick2 Down'},
		{value: 36, name: 'Joystick2 Button1'},
		{value: 37, name: 'Joystick2 Button2'},
		{value: 38, name: 'Joystick2 Button3'},
		{value: 39, name: 'Joystick2 Button4'},
		{value: 40, name: 'Joystick2 Button5'},
		{value: 41, name: 'Joystick2 Button6'},
		{value: 42, name: 'Joystick2 Button7'},
		{value: 43, name: 'Joystick2 Button8'},
	];

	static listOtherSubtypes = [
		{value: 0, name: 'Outside'},
		{value: 1, name: 'Boundary'},
		{value: 2, name: 'Game start'},
		{value: 3, name: 'Game end'},
		{value: 4, name: 'Room start'},
		{value: 5, name: 'Room end'},
		{value: 6, name: 'No more lives'},
		{value: 7, name: 'Animation end'},
		{value: 8, name: 'End of path'},
		{value: 9, name: 'No more health'},
		{value: 10, name: 'User 0'},
		{value: 11, name: 'User 1'},
		{value: 12, name: 'User 2'},
		{value: 13, name: 'User 3'},
		{value: 14, name: 'User 4'},
		{value: 15, name: 'User 5'},
		{value: 16, name: 'User 6'},
		{value: 17, name: 'User 7'},
		{value: 18, name: 'User 8'},
		{value: 19, name: 'User 9'},
		{value: 20, name: 'User 10'},
		{value: 21, name: 'User 11'},
		{value: 22, name: 'User 12'},
		{value: 23, name: 'User 13'},
		{value: 24, name: 'User 14'},
		{value: 25, name: 'User 15'},
		{value: 30, name: 'Close button'},
	]

	static getEventName(event, project) {
		return Events.listEventTypes.find(x => x.value == event.type).getFullName(event.subtype, project);
	}
}