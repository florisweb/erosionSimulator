
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
		window.dt = dt;
		
		lastFrame = new Date();
		setTimeout(App.update, 0);
		if (App.updates == 1000) console.warn("Time: ", (new Date() - startTime) / 1000);
	}

	this.draw = function() {
		Renderer.draw(Simulation.tileGrid);


		requestAnimationFrame(App.draw);
		// setTimeout(App.update, 1);
	}
}


App.setup();