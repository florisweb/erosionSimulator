
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
	this.update = function() {
		let dt = (new Date() - lastFrame) / 1000;
		Simulation.update(dt);

		
		lastFrame = new Date();
		setTimeout(App.update, 0);
	}

	this.draw = function() {
		Renderer.draw(Simulation.tileGrid);


		requestAnimationFrame(App.draw);
		// setTimeout(App.update, 1);
	}
}


App.setup();