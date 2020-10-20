




function _Simulation() {
	this.world = {
		size: 		new Vector(300, 300),
		tileSize: 	40,
		offset: 	new Vector(7, -3),
		cameraHeightConstant: 	.7,
		diffusionConstant: 1
	}

	this.tileGrid = new _Simulation_tileGrid(this.world, function () {return Math.random()});

	this.update = function(_dt) {
		let deltaGrid = new _Simulation_tileGrid(this.world, function () {return 0});

		for (let x = 0; x < this.tileGrid.width; x++) 
		{
			for (let y = 0; y < this.tileGrid.height; y++) 
			{
				let neighbours = this.tileGrid.getNeighboursByCoord(x, y);

				for (let n = 0; n < neighbours.length; n++)
				{
					deltaGrid[x][y].waterHeight += diffusionFormula(this.tileGrid[x][y], neighbours[n], _dt);
				}
			}
		}

		this.tileGrid.addGrid(deltaGrid);
	}



	function diffusionFormula(_self, _other, _dt) {
		let dT = _other.waterHeight - _self.waterHeight;
		return Simulation.world.diffusionConstant * dT * _dt;
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
			tileGrid[x][y] = {
				height: .3, //Math.random() * 3,
				waterHeight: _valueFunction(),
			};
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










