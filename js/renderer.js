
function _Renderer(_canvas) {
	let Canvas 	= _canvas;
	let ctx 	= Canvas.getContext("2d");

	this.config = {
		minimumAverageFlowForUpdate: 0.001,
		minimumFlowForUpdate: 0.01
	};

	this.materials = {
		water: {
			type: 0,
			top: {
				fillStyle: "rgba(100, 100, 255, .5)",
				strokeStyle: "rgba(100, 100, 255, .5)",// "rgb(100, 100, 255)",
			},
			side: {
				fillStyle: "rgba(80, 80, 155, .5)",
				strokeStyle: "rgba(80, 80, 155, .0)",// "rgb(100, 100, 255)",
			}
		}, 
		brick: {
			type: 1,
			top: {
				fillStyle: "#eee",
				strokeStyle: "#777",
			},
			side: {
				fillStyle: "#888",
				strokeStyle: "#777",
			}
		},
		source: {
			type: 1,
			top: {
				fillStyle: "#e00",
				strokeStyle: "#700",
			},
			side: {
				fillStyle: "#800",
				strokeStyle: "#700",
			}
		},
		drain: {
			type: 1,
			top: {
				fillStyle: "#00e",
				strokeStyle: "#007",
			},
			side: {
				fillStyle: "#008",
				strokeStyle: "#007",
			}
		}
	}

	this.requestRedraw 	= true;
	this.camera 		= new _Renderer_camera();




	let lastFPSUpdate = new Date();
	const framesPerFPSSample = 3;
	let fpsValue = 0;

	this.draw = function(_tileGrid) {
		this.clear();
		ctx.globalAlpha = 1;
		ctx.fillStyle 	= "#666";
		ctx.fillText("Fps: " + fpsValue, 10, 20);
		ctx.fillText("DeltaFlow: " + window.deltaFlow, 10, 35);


		for (let x = 0; x < _tileGrid.length; x++) 
		{
			for (let y = 0; y < _tileGrid[x].length; y++) 
			{
				let xNeighbour 				= false;
				let yNeighbour 				= false;
				if (_tileGrid[x + 1]) 		xNeighbour = _tileGrid[x + 1][y];
				if (_tileGrid[x][y + 1]) 	yNeighbour = _tileGrid[x][y + 1];

				this.drawTile(x, y, _tileGrid[x][y], xNeighbour, yNeighbour);
			}
		}

		if (App.frames % framesPerFPSSample != 0) return;
		let dt 			= new Date() - lastFPSUpdate;
		fpsValue		= Math.round(10000 * framesPerFPSSample / dt) / 10;
		lastFPSUpdate 	= new Date();
	}


	this.drawTile = function(_x, _y, _object, xNeighbour, yNeighbour) {
		let material = Renderer.materials.brick;
		if (_object.isDrain) material = Renderer.materials.drain;
		if (_object.isSource) material = Renderer.materials.source;
		
		drawTileBox(_x, _y, 0, _object.height, material, xNeighbour, yNeighbour, _object);
		if (_object.waterHeight > .001) drawTileBox(_x, _y, _object.height, _object.waterHeight, Renderer.materials.water, xNeighbour, yNeighbour);
	}


	function drawTileBox(_x, _y, _startElevation = 0, _waterHeight = 1, _material, xNeighbour, yNeighbour, _object) {
		let finalElevation = _startElevation + _waterHeight;
		let startElevationLeft 	= _startElevation;
		let startElevationRight = _startElevation;
		
		if (_material.type == 1)
		{
			ctx.globalAlpha = 1;
			if (xNeighbour.height > startElevationRight) 	startElevationRight = xNeighbour.height;
			if (yNeighbour.height > startElevationLeft) 	startElevationLeft 	= yNeighbour.height;
		} else {
			ctx.globalAlpha = _waterHeight * 7;
			if (xNeighbour.totalHeight > startElevationRight) 	startElevationRight = xNeighbour.totalHeight;
			if (yNeighbour.totalHeight > startElevationLeft) 	startElevationLeft 	= yNeighbour.totalHeight;
		}


		let elevatedTopCoord 	= Renderer.camera.worldCoordToCanvCoord(new Vector(_x - finalElevation, 		_y - finalElevation));
		let elevatedRightCoord 	= Renderer.camera.worldCoordToCanvCoord(new Vector(_x - finalElevation + 1, 	_y - finalElevation));
		let elevatedBottomCoord = Renderer.camera.worldCoordToCanvCoord(new Vector(_x - finalElevation + 1, 	_y - finalElevation + 1));
		let elevatedLeftCoord 	= Renderer.camera.worldCoordToCanvCoord(new Vector(_x - finalElevation, 		_y - finalElevation + 1));
		drawTileTop(elevatedTopCoord, elevatedRightCoord, elevatedBottomCoord, elevatedLeftCoord, _material.top);
				
		if (startElevationLeft < finalElevation) 
		{
			let leftGroundCoord 		= Renderer.camera.worldCoordToCanvCoord(new Vector(_x - startElevationLeft, 		_y + 1 - startElevationLeft));
			let bottomLeftGroundCoord 	= Renderer.camera.worldCoordToCanvCoord(new Vector(_x + 1 - startElevationLeft, 	_y + 1 - startElevationLeft));
			drawTileSide(elevatedBottomCoord, elevatedLeftCoord,  bottomLeftGroundCoord, leftGroundCoord,  _material.side);
		}

		if (startElevationRight < finalElevation) 
		{
			let rightGroundCoord 		= Renderer.camera.worldCoordToCanvCoord(new Vector(_x + 1 - startElevationRight, 	_y - startElevationRight));
			let bottomRightGroundCoord 	= Renderer.camera.worldCoordToCanvCoord(new Vector(_x + 1 - startElevationRight, 	_y + 1 - startElevationRight));
			drawTileSide(elevatedBottomCoord, elevatedRightCoord, bottomRightGroundCoord, rightGroundCoord, _material.side);
		}

		if (!_object) return;
		ctx.fillStyle = "#000";
		// ctx.fillText("GS: " + Math.round(_object.grainSize * 100) / 100 + " H: " + Math.round(_object.height * 1000) / 1000, elevatedLeftCoord.value[0], elevatedLeftCoord.value[1]);
	}	

	function drawTileSide(elevatedBottomCoord, elevatedSideCoord, bottomGroundCoord, sideGroundCoord, _color) {
		if (_color.strokeStyle) ctx.strokeStyle = _color.strokeStyle;
		ctx.fillStyle = _color.fillStyle;
		ctx.beginPath();

		ctx.moveTo(elevatedSideCoord.value[0], 		elevatedSideCoord.value[1]);
		ctx.lineTo(elevatedBottomCoord.value[0], 	elevatedBottomCoord.value[1]);
		ctx.lineTo(bottomGroundCoord.value[0], 		bottomGroundCoord.value[1]);
		ctx.lineTo(sideGroundCoord.value[0], 		sideGroundCoord.value[1]);
		ctx.lineTo(elevatedSideCoord.value[0], 		elevatedSideCoord.value[1]);
		
		ctx.closePath();
		if (_color.strokeStyle) ctx.stroke();
		ctx.fill();
	}
	
	function drawTileTop(elevatedTopCoord, elevatedRightCoord, elevatedBottomCoord, elevatedLeftCoord, _color) {
		// Draws the plate
		if (_color.strokeStyle) ctx.strokeStyle = _color.strokeStyle;
		ctx.fillStyle = _color.fillStyle;
		ctx.beginPath();

		ctx.moveTo(elevatedTopCoord.value[0], 		elevatedTopCoord.value[1]);
		ctx.lineTo(elevatedRightCoord.value[0], 	elevatedRightCoord.value[1]);
		ctx.lineTo(elevatedBottomCoord.value[0], 	elevatedBottomCoord.value[1]);
		ctx.lineTo(elevatedLeftCoord.value[0], 		elevatedLeftCoord.value[1]);
		ctx.lineTo(elevatedTopCoord.value[0], 		elevatedTopCoord.value[1]);
		ctx.closePath();
		
		if (_color.strokeStyle)ctx.stroke();
		ctx.fill();
	}

	this.clear = function() {
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
	}


	window.onresize = function() {
		let scalar = Canvas.height / Canvas.offsetHeight;
		Canvas.width = scalar * Canvas.offsetWidth;
	}
	window.onresize();
}







function _Renderer_camera() {
	this.position 	= new Vector(9, 1);
	this.zoom 		= 1;

	let tileConstantX = Simulation.world.tileSize / Math.sqrt(2) / this.zoom;
	let tileConstantY = Simulation.world.tileSize / Math.sqrt(2) * Simulation.world.cameraHeightConstant / this.zoom;

	this.updateZoom = function(_newZoom) {
		if (_newZoom < .1) 		_newZoom = .1;
		this.zoom 				= _newZoom;
		tileConstantX 			= Simulation.world.tileSize / Math.sqrt(2) / this.zoom;
		tileConstantY 			= Simulation.world.tileSize / Math.sqrt(2) * Simulation.world.cameraHeightConstant / this.zoom;
		Renderer.requestRedraw 	= true;
	}

	this.worldCoordToCanvCoord = function(_coord) {
		let newCoord = _coord.copy().add(this.position);
		let x = (newCoord.value[0] - newCoord.value[1]) * tileConstantX;
		let y = (newCoord.value[0] + newCoord.value[1]) * tileConstantY;

		return new Vector(x, y);
	}

	this.canvCoordToWorldCoord = function(_coord) {
		let newCoord = new Vector(0, 0);
		newCoord.value[1] = (_coord.value[1] / tileConstantY - _coord.value[0] / tileConstantX) * .5;
		newCoord.value[0] = _coord.value[0] / tileConstantX + newCoord.value[1];

		return newCoord.add(this.position.copy().scale(-1));
	}
}



