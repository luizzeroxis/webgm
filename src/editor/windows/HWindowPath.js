import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HNumberInput, HCheckBoxInput, HRadioInput, HSelect, HOption, HCanvas, uniqueID} from "~/common/h";
import {ProjectPath, ProjectPathPoint} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";

export default class HWindowPath extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-path"}) ) );

				parent( add( new HElement("div", {class: "tool-bar"})) );
					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );
					endparent();

				parent( add( new HElement("div", {class: "panel-container"})) );

					parent( add( new HElement("div", {class: "properties"}) ) );

						this.inputName = add( new HTextInput("Name:", this.resource.name) );

						this.selectPoints = add( new HSelect(null, "points") );
						this.selectPoints.select.html.size = 2;

						this.selectPointsOptions = [];

						parent(this.selectPoints.select);
							for (const point of this.resource.points) {
								this.selectPointsOptions.push(add( new HOption(`(${point.x},${point.y}) sp: ${point.sp}`) ));
							}
							endparent();

						this.selectPoints.setOnChange(() => {
							this.updatePointProperties();
						});

						parent( add( new HElement("div", {class: "columns"})) );
							parent( add( new HElement("div")) );
								this.inputX = add( new HNumberInput("X:", 0, 1, null, null, "x") );
								this.inputY = add( new HNumberInput("Y:", 0, 1, null, null, "y") );
								this.inputSp = add( new HNumberInput("sp:", 100, 1, null, null, "sp") );
								endparent();

							parent( add( new HElement("div", {class: "buttons"})) );
								add( new HButton("Add", () => this.addPoint()) );
								add( new HButton("Insert", () => this.insertPoint()) );
								add( new HButton("Delete", () => this.deletePoint()) );
								endparent();
							endparent();

						parent( add( new HElement("div", {class: "columns"})) );
							parent( add( new HElement("fieldset") ) );
								add( new HElement("legend", {}, "connection kind") );

								const connectionKindGroup = "_radio_"+uniqueID();
								this.radioLines = add( new HRadioInput(connectionKindGroup, "Straight lines", this.resource.connectionKind == "lines") );
								this.radioCurve = add( new HRadioInput(connectionKindGroup, "Smooth curve", this.resource.connectionKind == "curve") );
								endparent();

							parent( add( new HElement("div")) );
								this.inputClosed = add( new HCheckBoxInput("Closed", this.resource.closed));
								endparent();
							endparent();

						this.inputPrecision = add( new HNumberInput("Precision:", this.resource.precision) );
						endparent();

					parent( add( new HElement("div", {class: "path"}) ) );

						this.divPreview = parent( add( new HElement("div", {class: "preview"}) ) );

							this.canvasPreview = add( new HCanvas(200, 200) );
							this.ctx = this.canvasPreview.html.getContext("2d", {alpha: false});
							this.ctx.imageSmoothingEnabled = false;

							this.canvasPreview.html.onmousedown = (e) => {

							};

							this.canvasPreview.html.onmousemove = (e) => {

							};

							endparent();

						parent( add( new HElement("div", {class: "status-bar"}) ) );
							this.divX = add( new HElement("div", {class: "x"}, "x: 0") );
							this.divY = add( new HElement("div", {class: "y"}, "y: 0") );
							this.divArea = add( new HElement("div", {class: "area"}, "Area: (0,0)->(200,200)") );
							endparent();

						endparent();

					endparent();
				endparent();
			endparent();

		this.updatePointList();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());
	}

	onAdd() {
		super.onAdd();

		this.mouseUpHandler = () => {

		};
		document.addEventListener("mouseup", this.mouseUpHandler);
	}

	onRemove() {
		super.onRemove();

		document.removeEventListener("mouseup", this.mouseUpHandler);
	}

	copyData() {
		this.resourceCopy = new ProjectPath(this.resource);
	}

	saveData() {
		this.editor.project.changeResourceName(this.resource, this.inputName.getValue());
		this.updateTitle();

		this.resource.connectionKind = (
			this.radioLines.getChecked() ? "lines"
			: this.radioCurve.getChecked() ? "curve"
			: null
		);

		this.resource.closed = this.inputClosed.getChecked();
		this.resource.precision = this.inputPrecision.getFloatValue();
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);

		this.editor.project.changeResourceName(this.resource, this.resourceCopy.name);
		this.updateTitle();
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	updateTitle() {
		this.setTitle("Path Properties: "+this.resource.name);
	}

	setSize(...args) {
		super.setSize(...args);

		this.updateCanvasPreview();
	}

	getCurrentPoint() {
		return this.resource.points[this.selectPoints.getSelectedIndex()];
	}

	updatePointList() {
		this.selectPointsOptions = [];

		const prevIndex = this.selectPoints.getSelectedIndex();
		this.selectPoints.removeOptions();

		parent(this.selectPoints.select);
			for (const point of this.resource.points) {
				this.selectPointsOptions.push(add( new HOption(`(${point.x},${point.y}) sp: ${point.sp}`) ));
			}
			endparent();

		this.selectPoints.setSelectedIndex(prevIndex);
		this.updatePointProperties();
	}

	updatePointProperties() {
		const point = this.getCurrentPoint();
		if (point) {
			this.inputX.setValue(point.x);
			this.inputY.setValue(point.y);
			this.inputSp.setValue(point.sp);
		}
	}

	addPoint() {
		const point = new ProjectPathPoint();
		point.x = this.inputX.getFloatValue();
		point.y = this.inputY.getFloatValue();
		point.sp = this.inputSp.getFloatValue();
		this.resource.points.push(point);

		this.updatePointList();
	}

	insertPoint() {
		const index = this.selectPoints.getSelectedIndex();
		if (index < 0) return;

		const point = new ProjectPathPoint();
		point.x = this.inputX.getFloatValue();
		point.y = this.inputY.getFloatValue();
		point.sp = this.inputSp.getFloatValue();

		this.resource.points.splice(index, 0, point);

		this.updatePointList();
	}

	deletePoint() {
		const index = this.selectPoints.getSelectedIndex();
		if (index < 0) return;

		this.resource.points.splice(index, 1);

		this.updatePointList();
	}

	updateCanvasPreview() {
		const rect = this.divPreview.html.getBoundingClientRect();
		this.canvasPreview.html.width = rect.width;
		this.canvasPreview.html.height = rect.height;

		this.ctx.imageSmoothingEnabled = false;

		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(0, 0, this.canvasPreview.html.width, this.canvasPreview.html.height);

		for (const point of this.resource.points) {
			//
		}

		this.drawGrid();
	}

	drawGrid() {
		// if (this.inputShowGrid.getChecked()) {
			this.ctx.globalCompositeOperation = "difference";
			this.ctx.fillStyle = "white";
			this.ctx.strokeStyle = "white";

			// const snapx = parseInt(this.inputSnapX.getValue());
			// const snapy = parseInt(this.inputSnapY.getValue());
			const snapx = 16;
			const snapy = 16;

			if (snapx > 0) {
				for (let x = 0; x < this.canvasPreview.html.width; x += snapx) {
					this.drawLine(x, 0, x, this.canvasPreview.html.height);
				}
			}

			if (snapy > 0) {
				for (let y = 0; y < this.canvasPreview.html.height; y += snapy) {
					this.drawLine(0, y, this.canvasPreview.html.width, y);
				}
			}

			this.ctx.globalCompositeOperation = "source-over";
		// }
	}

	drawLine(x1, y1, x2, y2) {
		this.ctx.save();
		this.ctx.translate(0.5, 0.5);

		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		//this.ctx.closePath();
		this.ctx.stroke();

		this.ctx.restore();
	}

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to ${this.resource.name}?`)) return;
			this.restoreData();
		}
		super.close();
	}
}