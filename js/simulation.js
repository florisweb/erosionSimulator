
function _Simulation() {
	this.world = {
		size: 						new Vector(400, 300),
		tileSize: 					20,
		offset: 					new Vector(0, 0),
		cameraHeightConstant: 		.7,
		waterFlowConstant: 			1,
		materialFlowConstant: 		.5,
	}

	this.tileGrid = new _Simulation_tileGrid(this.world, 
		function (x, y) {
			let obj = {
				height: Math.abs((x) / 3 - y / 5) + (x == 0 && y == 0) * .6 + 2 * Math.random(),
				waterHeight: 	0,
				grainSize: 		Math.random() * .9 + .05, //(1200 - x - y) / 1300,// Math.abs((x) / 3 - y / 5),
				isSource: 		x == 0,
				isDrain: 		x == 39,
			};
			if (obj.isDrain) obj.height = 0;
			if (obj.isSource) obj.waterHeight = 3;
			// if (obj.isSource) obj.height = 50;
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
					grainSize: 0,
				}
			}
		);
		let deltaFlow = 0;
		let maxFlow = 0;
		for (let y = 0; y < this.tileGrid.height; y++) 
		{
			for (let x = y % 2; x < this.tileGrid.width; x += 2) 
			{
				let neighbours = this.tileGrid.getNeighboursByCoord(x, y);

				for (let n = 0; n < neighbours.length; n++)
				{
					let curN = neighbours[n];
					let waterFlow 							= deltaWaterFormula(this.tileGrid[x][y], curN.tile, _dt);
					deltaFlow 								+= Math.abs(waterFlow);
					deltaGrid[x][y].waterHeight 			+= waterFlow;
					deltaGrid[curN.x][curN.y].waterHeight 	-= waterFlow;

					let sandFlow							= deltaSandFormula(waterFlow, this.tileGrid[x][y], curN.tile);
					deltaGrid[x][y].height 					+= sandFlow;
					deltaGrid[curN.x][curN.y].height 		-= sandFlow;

					if (sandFlow > 0) //grainsize only changes when sand is added
					{
						let totalGrains 			= this.tileGrid[x][y].height * this.tileGrid[x][y].grainSize + sandFlow * curN.tile.grainSize;
					 	let newGrainSize 			= totalGrains / (this.tileGrid[x][y].height + sandFlow);
					 	deltaGrid[x][y].grainSize 	= newGrainSize - this.tileGrid[x][y].grainSize;
					}
					
	
					if (waterFlow > maxFlow) maxFlow = waterFlow;
					
				}
			}
		}

		// ON OWN LOOP
		// if (this.tileGrid[x][y].isDrain) 
		// 			{
		// 				deltaGrid[x][y].waterHeight -= this.tileGrid[x][y].waterHeight * .01;
		// 				deltaGrid[x][y].height 		-= this.tileGrid[x][y].height * .01;
		// 			}

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

	function deltaSandFormula(_waterFlow, _self, _other) {
		let sandFlow = _waterFlow * Simulation.world.materialFlowConstant * Math.pow(1 - _self.grainSize, 4);
		if (sandFlow < 0 && _self.height < _other.height) sandFlow = 0;
		if (sandFlow > 0 && _self.height > _other.height) sandFlow = 0;
		return sandFlow;
	}

	this.rain = function(_height) {
		let rainGrid = new _Simulation_tileGrid(this.world, function () {
			return {
				waterHeight: _height, 
				height: 0, 
				grainSize: 0
			}
		});
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

		if (x - 1 >= 0) 			neighbours.push({tile: this[x - 1][y], x: x - 1, y: y});
		if (x + 1 < this.width) 	neighbours.push({tile: this[x + 1][y], x: x + 1, y: y});
		if (y - 1 >= 0) 			neighbours.push({tile: this[x][y - 1], x: x, y: y - 1});
		if (y + 1 < this.height) 	neighbours.push({tile: this[x][y + 1], x: x, y: y + 1});

		return neighbours;
	}


	tileGrid.addGrid = function(_grid) {
		for (let x = 0; x < this.width; x++) 
		{
			for (let y = 0; y < this.height; y++) 
			{
				if (this[x][y].isSource) _grid[x][y].waterHeight = 0;
				this[x][y].waterHeight 	+= _grid[x][y].waterHeight;
				this[x][y].height 		+= _grid[x][y].height;
				this[x][y].grainSize 	+= _grid[x][y].grainSize;
				this[x][y].totalHeight 	= this[x][y].height + this[x][y].waterHeight;
			}
		}
	}

	return tileGrid;
} 










