




function _Simulation() {
	this.world = {
		size: 						new Vector(500, 100),
		tileSize: 					10,
		offset: 					new Vector(300, 60),
		cameraHeightConstant: 		.7,
		waterFlowConstant: 			2,
		materialFlowConstant: 		.5,
	}

	this.world.offset.scale(1 / this.world.tileSize);

	this.tileGrid = new _Simulation_tileGrid(this.world, 
		function (x, y) {
			let obj = {
				height: Math.pow(x - 50, 2) * .005 * (Math.random() * .3 + .7) + 3,
				waterHeight: 0,
			};
			if (x == 1000 / 20 - 1) obj.height = 0;

			obj.totalHeight = obj.height + obj.waterHeight;
			return obj;
		}
	);
	const tileCount = this.tileGrid.width * this.tileGrid.height;

	this.update = function(_dt) {
		let deltaGrid = new _Simulation_tileGrid(this.world, 
			function () {
				return {
					waterHeight: 0,
					height: 0,
				}
			}
		);
		let deltaFlow = 0;
		for (let x = 0; x < this.tileGrid.width; x++) 
		{
			for (let y = 0; y < this.tileGrid.height; y++) 
			{
				let neighbours = this.tileGrid.getNeighboursByCoord(x, y);

				for (let n = 0; n < neighbours.length; n++)
				{
					let waterFlow 				= deltaWaterFormula(this.tileGrid[x][y], neighbours[n], _dt);
					deltaFlow 					+= Math.abs(waterFlow);
					deltaGrid[x][y].waterHeight += waterFlow;
					deltaGrid[x][y].height 		+= waterFlow * Simulation.world.materialFlowConstant;
					if (x != this.tileGrid.width - 1) continue;

					deltaGrid[x][y].waterHeight += this.tileGrid[x][y].waterHeight * -.1;
					deltaGrid[x][y].height 		= 0;
				}
			}
		}

		this.tileGrid.addGrid(deltaGrid);
		window.deltaFlow = deltaFlow;
		return deltaFlow > 0.001 * tileCount;
	}



	function deltaWaterFormula(_self, _other, _dt) {
		let totalWater = _self.waterHeight + _other.waterHeight;
		let equalibriumWaterSelf = 0;

		
		let dHeight = _other.height - _self.height;
		if (Math.abs(dHeight) > totalWater)
		{
			if (dHeight > 0)
			{
				equalibriumWaterSelf 	= totalWater;
			} else {
				equalibriumWaterSelf 	= 0;
			}
		} else {
			let waterLeft = (totalWater - Math.abs(dHeight)) / 2;
			equalibriumWaterSelf = waterLeft;
			if (dHeight > 0) equalibriumWaterSelf += dHeight;
		}


		return (equalibriumWaterSelf - _self.waterHeight) * Simulation.world.waterFlowConstant * _dt;
	}


	this.rain = function(_height) {
		let rainGrid = new _Simulation_tileGrid(this.world, function () {return {waterHeight: _height, height: 0}});
		this.tileGrid.addGrid(rainGrid);
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
			for (let y = 0; y < this.height; y++) 
			{
				this[x][y].waterHeight 	+= _grid[x][y].waterHeight;
				this[x][y].height 		+= _grid[x][y].height;
				this[x][y].totalHeight 	= this[x][y].height + this[x][y].waterHeight;
			}
		}
	}

	return tileGrid;
} 










