




function _Simulation() {
	this.world = {
		size: 						new Vector(400, 400),
		tileSize: 					50,
		offset: 					new Vector(6, -2.5),
		cameraHeightConstant: 		.7,
		diffusionConstant: 			5
	}

	this.tileGrid = new _Simulation_tileGrid(this.world, 
		function (x, y) {
			return {
				height: (14 - x - y) * .2,
				waterHeight: .3,
				x: x,
			}
		}
	);

	this.update = function(_dt) {
		let deltaGrid = new _Simulation_tileGrid(this.world, 
			function () {
				return {
					waterHeight: 0
				}
			}
		);

		for (let x = 0; x < this.tileGrid.width; x++) 
		{
			for (let y = 0; y < this.tileGrid.height; y++) 
			{
				let neighbours = this.tileGrid.getNeighboursByCoord(x, y);

				for (let n = 0; n < neighbours.length; n++)
				{
					deltaGrid[x][y].waterHeight += deltaWaterFormula(this.tileGrid[x][y], neighbours[n], _dt);
				}
			}
		}

		this.tileGrid.addGrid(deltaGrid);
	}



	function deltaWaterFormula(_self, _other, _dt) {
		let totalWater = _self.waterHeight + _other.waterHeight;
		let equalibriumWaterSelf = 0;
		// let equalibriumWaterOther = 0;

		
		let dHeight = _other.height - _self.height;
		if (Math.abs(dHeight) > totalWater)
		{
			if (dHeight > 0)
			{
				equalibriumWaterSelf 	= totalWater;
				// equalibriumWaterOther 	= 0; 
			} else {
				equalibriumWaterSelf 	= 0;
				// equalibriumWaterOther	= totalWater; 
			}
		} else {
			let waterLeft = (totalWater - Math.abs(dHeight)) / 2;
			if (dHeight > 0)
			{
				equalibriumWaterSelf 	= dHeight + waterLeft;
				// equalibriumWaterOther 	= waterLeft;
			} else {
				equalibriumWaterSelf 	= waterLeft;
				// equalibriumWaterOther 	= -dHeight + waterLeft; 
			}
		}


		return (equalibriumWaterSelf - _self.waterHeight) * Simulation.world.diffusionConstant * _dt;
	}
}












function _Simulation_tileGrid(_world, _valueFunction) {
	let tileGrid = [];
	tileGrid.width = Math.ceil(_world.size.value[0] / _world.tileSize);
	tileGrid.height = Math.ceil(_world.size.value[1] / _world.tileSize);

	for (let x = 0; x < tileGrid.width; x++) 
	{
		tileGrid[x] = []; 
		for (let y = 0; y < tileGrid.height; y++) 
		{
			tileGrid[x][y] = _valueFunction(x, y);
		}
	}


	tileGrid.getNeighboursByCoord = function(x, y) {
		let neighbours = [];

		if (x - 1 >= 0) neighbours.push(this[x - 1][y]);
		if (x + 1 < this.width) neighbours.push(this[x + 1][y]);
		if (y - 1 >= 0) neighbours.push(this[x][y - 1]);
		if (y + 1 < this.height) neighbours.push(this[x][y + 1]);

		return neighbours;
	}

	tileGrid.addGrid = function(_grid) {
		for (let x = 0; x < this.width; x++) 
		{
			for (let y = 0; y < this.height; y++) this[x][y].waterHeight += _grid[x][y].waterHeight;
		}
	}

	return tileGrid;
} 










