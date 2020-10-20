




function _Simulation() {
	this.world = {
		size: 		new Vector(200, 100),
		tileSize: 	100,
		offset: 	new Vector(4, 0),
		cameraHeightConstant: 	.7,
		diffusionConstant: 1
	}

	this.tileGrid = new _Simulation_tileGrid(this.world, 
		function (x, y) {
			return {
				height: (4 - x - y) * .4,
				waterHeight: .1,
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
		let totalHeightSelf = _self.height + _self.waterHeight;
		let totalHeightOther = _other.height + _other.waterHeight;

		let dTotalheight = totalHeightOther - totalHeightSelf;
		let dWaterPlateauDifference = totalHeightOther - _self.height;

		if (dWaterPlateauDifference > 0) return 0;//-deltaWaterFormula(_other, _self, _dt);



		// let dWater = _other.waterHeight - _self.waterHeight;
		// console.log(_self.x, dWaterPlateauDifference);
		let waterChange = _self.waterHeight * dWaterPlateauDifference * Simulation.world.diffusionConstant * _dt;
		// if (waterChange > 0 && waterChange > _other.waterHeight) waterChange = _other.waterHeight; 
		// if (waterChange < 0 && waterChange > _self.waterHeight) waterChange = _self.waterHeight; 
		
		return waterChange;
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










