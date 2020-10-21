
function _Renderer(_canvas) {
	let Canvas 	= _canvas;
	let ctx 	= Canvas.getContext("2d");

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
		}
	}

	this.clear = function() {
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
	}

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
		drawTileBox(_x, _y, 0, _object.height, Renderer.materials.brick, xNeighbour, yNeighbour);
		if (_object.waterHeight > .001) drawTileBox(_x, _y, _object.height, _object.waterHeight, Renderer.materials.water, xNeighbour, yNeighbour);
	}


	function drawTileBox(_x, _y, _startElevation = 0, _waterHeight = 1, _material, xNeighbour, yNeighbour) {
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


		let elevatedTopCoord 	= worldCoordToCanvCoord(new Vector(_x - finalElevation, 		_y - finalElevation));
		let elevatedRightCoord 	= worldCoordToCanvCoord(new Vector(_x - finalElevation + 1, 	_y - finalElevation));
		let elevatedBottomCoord = worldCoordToCanvCoord(new Vector(_x - finalElevation + 1, 	_y - finalElevation + 1));
		let elevatedLeftCoord 	= worldCoordToCanvCoord(new Vector(_x - finalElevation, 		_y - finalElevation + 1));
		drawTileTop(elevatedTopCoord, elevatedRightCoord, elevatedBottomCoord, elevatedLeftCoord, _material.top);
				
		if (startElevationLeft < finalElevation) 
		{
			let leftGroundCoord 		= worldCoordToCanvCoord(new Vector(_x - startElevationLeft, 		_y + 1 - startElevationLeft));
			let bottomLeftGroundCoord 	= worldCoordToCanvCoord(new Vector(_x + 1 - startElevationLeft, 	_y + 1 - startElevationLeft));
			drawTileSide(elevatedBottomCoord, elevatedLeftCoord,  bottomLeftGroundCoord, leftGroundCoord,  _material.side);
		}

		if (startElevationRight < finalElevation) 
		{
			let rightGroundCoord 		= worldCoordToCanvCoord(new Vector(_x + 1 - startElevationRight, 	_y - startElevationRight));
			let bottomRightGroundCoord 	= worldCoordToCanvCoord(new Vector(_x + 1 - startElevationRight, 	_y + 1 - startElevationRight));
			drawTileSide(elevatedBottomCoord, elevatedRightCoord, bottomRightGroundCoord, rightGroundCoord, _material.side);
		}
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


	function valueToColor(_value) {
		return "rgb(" + _value * 51 + ", 0, 0)";
	}


	const tileConstantX = Simulation.world.tileSize / Math.sqrt(2);
	
	function worldCoordToCanvCoord(_coord) {
		const tileConstantY = Simulation.world.tileSize / Math.sqrt(2) * Simulation.world.cameraHeightConstant;
		let newCoord = _coord.copy().add(Simulation.world.offset);
		let x = (newCoord.value[0] - newCoord.value[1]) * tileConstantX;
		let y = (newCoord.value[0] + newCoord.value[1]) * tileConstantY;

		return new Vector(x, y);
	}

	this.worldCoordToCanvCoord = worldCoordToCanvCoord;


}