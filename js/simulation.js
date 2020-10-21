




function _Simulation() {
	this.world = {
		size: 						new Vector(500, 200),
		tileSize: 					10,
		offset: 					new Vector(300, 0),
		cameraHeightConstant: 		.7,
		waterFlowConstant: 			5,
		materialFlowConstant: 		.5,
	}

	this.world.offset.scale(1 / this.world.tileSize);

	this.tileGrid = new _Simulation_tileGrid(this.world, 
		function (x, y) {
			let obj = {
				height: 		x * (5 - y) * .01 + 10 + Math.random() * 5,
				// height: 5,
				waterHeight: 	0,
				isDrain: 		x == 500 / 10 - 1,
				isSource: 		x == 0 && y == 0
			};
			if (obj.isDrain) obj.height = 0;
			if (obj.isSource) obj.height = 50;
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
		let maxFlow = 0;
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

					let sandFlow = waterFlow * Simulation.world.materialFlowConstant;
					if (sandFlow < 0 && this.tileGrid[x][y].height < neighbours[n].height) sandFlow = 0;
					if (sandFlow > 0 && this.tileGrid[x][y].height > neighbours[n].height) sandFlow = 0;
					deltaGrid[x][y].height += sandFlow;

					
					if (waterFlow > maxFlow) maxFlow = waterFlow;
					if (this.tileGrid[x][y].isSource) this.tileGrid[x][y].waterHeight = 1;
					if (this.tileGrid[x][y].isDrain) 
					{
						deltaGrid[x][y].waterHeight -= this.tileGrid[x][y].waterHeight * .005;
						deltaGrid[x][y].height 		-= this.tileGrid[x][y].height * .005;
					}
				}
			}
		}

		this.tileGrid.addGrid(deltaGrid);
		window.deltaFlow = deltaFlow;
		window.maxFlow = maxFlow;
		return deltaFlow > Renderer.config.minimumAverageFlowForUpdate * tileCount || maxFlow > Renderer.config.minimumFlowForUpdate;
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










