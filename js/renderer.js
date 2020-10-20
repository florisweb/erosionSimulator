
function _Renderer(_canvas) {
	let Canvas 	= _canvas;
	let ctx 	= Canvas.getContext("2d");


	this.clear = function() {
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
	}

	this.draw = function(_tileGrid) {
		this.clear();

		for (let x = 0; x < _tileGrid.length; x++) 
		{
			for (let y = 0; y < _tileGrid[x].length; y++) 
			{
				this.drawTile(x, y, _tileGrid[x][y]);
			}
		}


		// ctx.fillStyle = "#aaa";
		// ctx.fillText(
		// 	"Velocity: " + Math.round(Simulation.object.velocity * 10) / 10 + " m/s",
		// 	10, 20
		// );
		// ctx.fillText(
		// 	"Air resistance: " + Math.round(Simulation.object.curAirResistance * 100) / 100 + " N?",
		// 	10, 35
		// );
	}


	this.drawTile = function(_x, _y, _object) {


		let elevatedTopCoord 	= worldCoordToCanvCoord(new Vector(_x - _object.height, 		_y - _object.height));
		let elevatedRightCoord 	= worldCoordToCanvCoord(new Vector(_x + 1 - _object.height, 	_y - _object.height));
		let elevatedBottomCoord = worldCoordToCanvCoord(new Vector(_x + 1 - _object.height, 	_y + 1 - _object.height));
		let elevatedLeftCoord 	= worldCoordToCanvCoord(new Vector(_x - _object.height, 		_y + 1 - _object.height));

		let rightGroundCoord 	= worldCoordToCanvCoord(new Vector(_x + 1, 	_y));
		let bottomGroundCoord 	= worldCoordToCanvCoord(new Vector(_x + 1, 	_y + 1));
		let leftGroundCoord 	= worldCoordToCanvCoord(new Vector(_x, 		_y + 1));

		ctx.strokeStyle = "#333";
		ctx.fillStyle 	= "#aaa";
		ctx.beginPath();

		ctx.moveTo(elevatedLeftCoord.value[0], 		elevatedLeftCoord.value[1]);
		
		ctx.lineTo(elevatedBottomCoord.value[0], 	elevatedBottomCoord.value[1]);
		ctx.lineTo(elevatedRightCoord.value[0], 	elevatedRightCoord.value[1]);
		ctx.lineTo(rightGroundCoord.value[0], 		rightGroundCoord.value[1]);
		ctx.lineTo(bottomGroundCoord.value[0], 		bottomGroundCoord.value[1]);
		ctx.lineTo(leftGroundCoord.value[0], 		leftGroundCoord.value[1]);
		ctx.lineTo(elevatedLeftCoord.value[0], 		elevatedLeftCoord.value[1]);
		ctx.closePath();
		
		ctx.stroke();
		ctx.fill();

		

		// Draws the plate
		ctx.strokeStyle = "#777";
		ctx.fillStyle 	= "#eee";
		ctx.beginPath();

		ctx.moveTo(elevatedTopCoord.value[0], 		elevatedTopCoord.value[1]);
		ctx.lineTo(elevatedRightCoord.value[0], 	elevatedRightCoord.value[1]);
		ctx.lineTo(elevatedBottomCoord.value[0], 	elevatedBottomCoord.value[1]);
		ctx.lineTo(elevatedLeftCoord.value[0], 		elevatedLeftCoord.value[1]);
		ctx.lineTo(elevatedTopCoord.value[0], 		elevatedTopCoord.value[1]);
		ctx.closePath();
		
		ctx.stroke();
		ctx.fill();


		// ctx.fillStyle = "#aaa";
		// ctx.fillText(
		// 	Math.round(_object.value * 100) / 100, 
		// 	canvasX + Simulation.world.tileSize / 2 - 10, 
		// 	canvasY + Simulation.world.tileSize / 2 + 3
		// );
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