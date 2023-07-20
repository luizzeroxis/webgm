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

		this.areaX = 0;
		this.areaY = 0;
		this.areaW = 0;
		this.arawH = 0;

		parent(this.client);
			parent( add( new HElement("div", {class: "window-path"}) ) );

				parent( add( new HElement("div", {class: "tool-bar"})) );
					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					add( new HButton("←", () => {
						this.areaX -= Math.floor(this.areaW / 4);
						this.updateCanvasPreview();
					}));

					add( new HButton("→", () => {
						this.areaX += Math.floor(this.areaW / 4);
						this.updateCanvasPreview();
					}));

					add( new HButton("↑", () => {
						this.areaY -= Math.floor(this.areaH / 4);
						this.updateCanvasPreview();
					}));

					add( new HButton("↓", () => {
						this.areaY += Math.floor(this.areaH / 4);
						this.updateCanvasPreview();
					}));

					add( new HButton("Center", () => {
						if (this.resource.points.length == 0) {
							this.areaX = 0;
							this.areaY = 0;
						} else {
							let l = Infinity;
							let r = -Infinity;
							let t = Infinity;
							let b = -Infinity;

							for (const point of this.resource.points) {
								if (point.x < l) l = point.x;
								if (point.x > r) r = point.x;
								if (point.y < t) t = point.y;
								if (point.y > b) b = point.y;
							}

							this.areaX = Math.floor(l + ((r-l)/2) - this.areaW/2);
							this.areaY = Math.floor(t + ((b-t)/2) - this.areaH/2);
						}
						this.updateCanvasPreview();
					}));

					this.inputSnapX = add( new HNumberInput("Snap X:", 16, 1, 1) );
					this.inputSnapX.setOnChange(() => this.updateCanvasPreview());

					this.inputSnapY = add( new HNumberInput("Snap Y:", 16, 1, 1) );
					this.inputSnapY.setOnChange(() => this.updateCanvasPreview());

					this.inputShowGrid = add( new HCheckBoxInput("Show grid", true) );
					this.inputShowGrid.setOnChange(() => this.updateCanvasPreview());
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
							this.updateCanvasPreview();
						});

						parent( add( new HElement("div", {class: "columns"})) );
							const inputs = parent( add( new HElement("div")) );
								this.inputX = add( new HNumberInput("X:", 0, 1, null, null, "x") );
								this.inputY = add( new HNumberInput("Y:", 0, 1, null, null, "y") );
								this.inputSp = add( new HNumberInput("sp:", 100, 1, null, null, "sp") );
								endparent();

							setDeepOnUpdateOnElement(inputs, () => this.updatePoint());

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

						// this.inputPrecision = add( new HNumberInput("Precision:", this.resource.precision) );
						endparent();

					parent( add( new HElement("div", {class: "path"}) ) );

						this.divPreview = parent( add( new HElement("div", {class: "preview"}) ) );

							this.canvasPreview = add( new HCanvas(404, 383) );
							this.ctx = this.canvasPreview.html.getContext("2d", {alpha: false});
							this.ctx.imageSmoothingEnabled = false;

							this.canvasPreview.html.onmousedown = e => this.canvasMouseDown(e);

							this.canvasPreview.html.onmousemove = e => this.canvasMouseMove(e);

							this.canvasPreview.html.oncontextmenu = e => e.preventDefault();

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

		setDeepOnUpdateOnElement(this.client, () => {
			this.onUpdate();
			this.updateCanvasPreview();
		});
	}

	onAdd() {
		super.onAdd();

		this.mouseUpHandler = () => this.canvasMouseUp();

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
		// this.resource.precision = this.inputPrecision.getFloatValue();
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

		this.updateCanvasPreview();
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
		this.onUpdate();
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
		this.onUpdate();
	}

	updatePoint() {
		const point = this.getCurrentPoint();
		if (!point) return;

		point.x = this.inputX.getFloatValue();
		point.y = this.inputY.getFloatValue();
		point.sp = this.inputSp.getFloatValue();

		this.updatePointList();
		this.onUpdate();
	}

	deletePoint() {
		const index = this.selectPoints.getSelectedIndex();
		if (index < 0) return;

		this.resource.points.splice(index, 1);

		this.updatePointList();
		this.onUpdate();
	}

	updateCanvasPreview() {
		const rect = this.divPreview.html.getBoundingClientRect();
		if (rect.width == 0 || rect.height == 0) return;

		this.areaW = rect.width;
		this.areaH = rect.height;
		this.canvasPreview.html.width = this.areaW;
		this.canvasPreview.html.height = this.areaH;

		this.divArea.html.textContent = `Area: (${this.areaX},${this.areaY})->(${this.areaW},${this.areaH})`;

		this.ctx.imageSmoothingEnabled = false;

		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(0, 0, this.areaW, this.areaH);

		this.drawGrid();

		this.ctx.save();
		this.ctx.translate(-this.areaX, -this.areaY);
		this.drawPath();
		this.drawPoints();
		this.ctx.restore();
	}

	drawGrid() {
		if (this.inputShowGrid.getChecked()) {
			this.ctx.globalCompositeOperation = "difference";
			this.ctx.fillStyle = "white";
			this.ctx.strokeStyle = "white";

			const snapX = this.inputSnapX.getIntValue();
			const snapY = this.inputSnapY.getIntValue();

			if (snapX > 0) {
				for (let x = -(this.areaX % snapX); x < this.canvasPreview.html.width; x += snapX) {
					this.drawLine(x, 0, x, this.canvasPreview.html.height);
				}
			}

			if (snapY > 0) {
				for (let y = -(this.areaY % snapY); y < this.canvasPreview.html.height; y += snapY) {
					this.drawLine(0, y, this.canvasPreview.html.width, y);
				}
			}

			this.ctx.globalCompositeOperation = "source-over";
		}
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

	drawPath() {
		const points = this.resource.points;

		if (points.length < 2) return;

		this.ctx.beginPath();

		let xs = points[0].x;
		let ys = points[0].y;

		if (this.resource.connectionKind == "curve") {
			if (!this.resource.closed) {
				this.ctx.moveTo(xs, ys);

				for (let i=1; i<points.length-2; i++) {
					const x = (points[i].x + points[i + 1].x) / 2;
					const y = (points[i].y + points[i + 1].y) / 2;
					this.ctx.quadraticCurveTo(points[i].x, points[i].y, x, y);
				}

				const pointA = points[points.length-2];
				const pointB = points[points.length-1];
				this.ctx.quadraticCurveTo(pointA.x, pointA.y, pointB.x, pointB.y);
			} else {
				xs = (points[0].x + points[1].x) / 2;
				ys = (points[0].y + points[1].y) / 2;
				this.ctx.moveTo(xs, ys);

				for (let i=1; i<points.length; i++) {
					let x, y;
					if (i == points.length - 1) {
						x = (points[i].x + points[0].x) / 2;
						y = (points[i].y + points[0].y) / 2;
					} else {
						x = (points[i].x + points[i + 1].x) / 2;
						y = (points[i].y + points[i + 1].y) / 2;
					}
					this.ctx.quadraticCurveTo(points[i].x, points[i].y, x, y);
				}

				this.ctx.quadraticCurveTo(points[0].x, points[0].y, xs, ys);
			}
		} else if (this.resource.connectionKind == "lines") {
			this.ctx.moveTo(xs, ys);

			for (let i=1; i<points.length; ++i) {
				this.ctx.lineTo(points[i].x, points[i].y);
			}

			if (this.resource.closed) {
				this.ctx.lineTo(points[0].x, points[0].y);
			}
		}

		this.ctx.strokeStyle = "#000000";
		this.ctx.lineWidth = 4;
		this.ctx.stroke();

		this.ctx.strokeStyle = "#ffff00";
		this.ctx.lineWidth = 2;
		this.ctx.stroke();

		this.ctx.closePath();
	}

	drawPoints() {
		this.ctx.strokeStyle = "#000000";
		this.ctx.lineWidth = 1;

		// Start point
		let sx = 0;
		let sy = 0;

		if (this.resource.points.length > 0) {
			sx = this.resource.points[0].x;
			sy = this.resource.points[0].y;
			if (this.resource.points.length > 1 && this.resource.closed && this.resource.connectionKind == "curve") {
				sx = (this.resource.points[0].x + this.resource.points[1].x) / 2;
				sy = (this.resource.points[0].y + this.resource.points[1].y) / 2;
			}
		}

		this.ctx.fillStyle = "#008800";

		this.ctx.fillRect(sx-4, sy-4, 8, 8);
		this.ctx.strokeRect(sx-4 + 0.5, sy-4 + 0.5, 8, 8);

		for (const point of this.resource.points) {
			if (point == this.getCurrentPoint()) {
				this.ctx.fillStyle = "#ff0000";
			} else {
				this.ctx.fillStyle = "#0000ff";
			}

			this.ctx.beginPath();
			this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
			this.ctx.fill();
			this.ctx.stroke();
			this.ctx.closePath();
		}
	}

	canvasMouseDown(e) {
		let x = e.offsetX + this.areaX;
		let y = e.offsetY + this.areaY;

		// Check if on top of current point
		const pointIndex = this.resource.points.findIndex(p => p.x >= x-8 && p.x < x+8 && p.y >= y-8 && p.y < y+8);
		const point = this.resource.points[pointIndex];

		if (e.button == 0) {
			if (point) {
				// move point
				this.movingPoint = point;
			} else {
				if (!e.altKey) {
					const snapX = this.inputSnapX.getIntValue();
					const snapY = this.inputSnapY.getIntValue();

					x = Math.floor(x / snapX) * snapX;
					y = Math.floor(y / snapY) * snapY;
				}

				// create new point and move
				const point = new ProjectPathPoint();
				point.x = x;
				point.y = y;
				point.sp = this.resource.points[this.resource.points.length - 1]?.sp ?? 100;

				this.resource.points.push(point);
				this.movingPoint = point;

				this.updatePointList();
				this.onUpdate();
			}
		} else if (e.button == 2) {
			if (point) {
				// delete point
				this.resource.points.splice(pointIndex, 1);
				this.movingPoint = null;

				this.updatePointList();
				this.onUpdate();
			}
		}
	}

	canvasMouseMove(e) {
		let x = e.offsetX + this.areaX;
		let y = e.offsetY + this.areaY;

		if (!e.altKey) {
			const snapX = this.inputSnapX.getIntValue();
			const snapY = this.inputSnapY.getIntValue();

			x = Math.floor(x / snapX) * snapX;
			y = Math.floor(y / snapY) * snapY;
		}

		this.divX.html.textContent = `x: ${x}`;
		this.divY.html.textContent = `y: ${y}`;

		if (this.movingPoint) {
			this.movingPoint.x = x;
			this.movingPoint.y = y;

			this.updatePointList();
			this.onUpdate();
		}
	}

	canvasMouseUp() {
		this.movingPoint = null;
	}

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to ${this.resource.name}?`)) return;
			this.restoreData();
		}
		super.close();
	}
}