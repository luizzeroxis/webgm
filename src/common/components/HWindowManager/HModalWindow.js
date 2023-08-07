import HWindow from "~/common/components/HWindowManager/HWindow.js";

export default class HModalWindow extends HWindow {
	constructor(manager) {
		super(manager);

		this.promise = new Promise(resolve => {
			this.resolveFunction = resolve;
		});
	}

	close(result) {
		super.close();
		this.resolveFunction(result);
	}

	forceClose(result) {
		super.forceClose();
		this.resolveFunction(result);
	}
}