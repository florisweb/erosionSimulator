
let Simulation;
let Renderer;
const App = new function() {

	this.setup = function() {
		Simulation 	= new _Simulation();
		Renderer 	= new _Renderer(renderCanvas);

		this.update();
		this.draw();
	}


	let lastFrame = new Date();
	let startTime = new Date();
	this.updates = 0;
	this.update = function() {
		App.updates++;
		let dt = (new Date() - lastFrame) / 1000;
		Simulation.update(dt);
		
		lastFrame = new Date();
		setTimeout(App.update, 0);
	}

	this.frames = 0;
	this.draw = function() {
		App.frames++;
		Renderer.draw(Simulation.tileGrid);

		requestAnimationFrame(App.draw);
		if (App.frames == 500) console.warn("Time: ", (new Date() - startTime) / 1000);
	}
}


App.setup();