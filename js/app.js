
let Simulation;
let Renderer;
// let InputHandler;
const App = new function() {

	this.setup = function() {
		Simulation 		= new _Simulation();
		Renderer 		= new _Renderer();
		// InputHandler 	= new _InputHandler();

		this.update();
		this.draw();
	}


	let lastFrame = new Date();
	let startTime = new Date();

	this.updates = 0;
	this.update = function() {
		App.updates++;
		let dt = (new Date() - lastFrame) / 1000;
		
		// let redrawRequired = Simulation.update(dt);
		// if (redrawRequired || App.updates % 100 == 0) Renderer.requestRedraw = true;
		
		lastFrame = new Date();
		setTimeout(App.update, 0);

		if (App.updates == 1000) console.warn("Time: ", (new Date() - startTime) / 1000);
	}

	this.frames = 0;
	this.draw = function() {
		App.frames++;
		// if (Renderer.requestRedraw) 
		// {
			Renderer.draw(Simulation.tileGrid);
		// 	Renderer.requestRedraw = false;
		// }

		requestAnimationFrame(App.draw);
	}
}


App.setup();