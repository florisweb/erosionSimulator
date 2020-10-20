


function _Simulation() {
	this.world = {
		size: 		new Vector(300, 300),
		tileSize: 	40,
		offset: 	new Vector(7, -3),
		cameraHeightConstant: 	.7

	}

	this.tileGrid = new _Simulation_tileGrid(this.world, 1);

	this.update = function(_dt) {


	}
}












function _Simulation_tileGrid(_world, _defaultValue) {
	let tileGrid = [];
	tileGrid.width = Math.ceil(_world.size.value[0] / _world.tileSize);
	tileGrid.height = Math.ceil(_world.size.value[1] / _world.tileSize);

	for (let x = 0; x < tileGrid.width; x++) 
	{
		tileGrid[x] = []; 
		for (let y = 0; y < tileGrid.height; y++) 
		{
			tileGrid[x][y] = {
				height: Math.random() * 3
			};
		}
	}


	return tileGrid;
} 