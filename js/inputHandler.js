document.onmousedown = function() { 
  InputHandler.mouseDown = true;
}
document.onmouseup = function() {
  InputHandler.mouseDown = false;
}


function _InputHandler() {
	let HTML = {
		canvas: renderCanvas,
	}
	this.mouseDown = false;
	this.draging = false;

	this.settings = new function() {
		this.dragSpeed = 1;
		this.scrollSpeed = .003
	}
	// assignMouseDrager();
	// assignMouseMoveHandler();




	// HTML.canvas.addEventListener("click", function(_e) {
		// let mousePosition = new Vector([
		// 	_e.offsetX / HTML.canvas.offsetWidth * HTML.canvas.width, 
		// 	_e.offsetY / HTML.canvas.offsetHeight * HTML.canvas.height
		// ]);

		// let worldPosition = RenderEngine.camera.canvasPosToWorldPos(mousePosition);
		
		// if (Builder.buildBody) return Builder.handleClick(worldPosition);
	// });





	HTML.canvas.addEventListener('wheel', function(event) {
		let mousePosition = new Vector(
			event.offsetX / HTML.canvas.offsetWidth * HTML.canvas.width, 
			event.offsetY / HTML.canvas.offsetHeight * HTML.canvas.height
		);

		
		let startWorldPosition = Renderer.camera.canvCoordToWorldCoord(mousePosition);
	    Renderer.camera.updateZoom(Renderer.camera.zoom + event.deltaY * InputHandler.settings.scrollSpeed);

	    let endWorldPosition = Renderer.camera.canvCoordToWorldCoord(mousePosition);
	    console.log(endWorldPosition.difference(startWorldPosition).value);
	    Renderer.camera.position.add(endWorldPosition.difference(startWorldPosition));
	    
	    return false; 
	}, false);





	// function assignMouseMoveHandler() {
	// 	HTML.canvas.addEventListener("mousemove", 
	// 	    function (_event) {
	// 	    	let mousePosition = new Vector([
	// 				_event.offsetX / HTML.canvas.offsetWidth * HTML.canvas.width, 
	// 				_event.offsetY / HTML.canvas.offsetHeight * HTML.canvas.height
	// 			]);
	//     		let worldPosition = RenderEngine.camera.canvasPosToWorldPos(mousePosition);

	//     		Builder.handleMouseMove(worldPosition);
	// 	    	Server.sendPacket(0, worldPosition.value);
	// 	    }
	// 	);
	// }








	// function assignMouseDrager() {
	// 	HTML.canvas.addEventListener("mousedown", 
	//     	function (_event) {
	//       		InputHandler.draging = true;
	//     	}
	//   	);

	//   	HTML.canvas.addEventListener("mouseup", stopDraging);

	//   	let prevDragVector = false;
	// 	HTML.canvas.addEventListener("mousemove", 
	// 	    function (_event) {
	// 	    	if (!InputHandler.draging) return;
	// 	    	if (!InputHandler.mouseDown) return stopDraging();
	// 	    	RenderEngine.camera.follow(false);

	// 	    	if (prevDragVector)
	// 	    	{
	// 	    		let deltaPos = new Vector([_event.screenX, _event.screenY]).difference(prevDragVector);
	// 	    		let moveVector = deltaPos.scale(InputHandler.settings.dragSpeed * RenderEngine.camera.zoom);
	// 	    		RenderEngine.camera.position.add(moveVector);
	// 	    	}

	// 	    	prevDragVector = new Vector([_event.screenX, _event.screenY]);
	// 	    }
	// 	);
		
	// 	function stopDraging() {
	// 		InputHandler.draging = false;
	//       	prevDragVector = false;
	// 	}
	// }

}
















// document.body.addEventListener("keydown", function(_e) {
// 	KeyHandler.keys[_e.key] = true;
// 	KeyHandler.handleKeys(_e);
// });

// document.body.addEventListener("keyup", function(_e) {
// 	KeyHandler.keys[_e.key] = false;
// });

// const KeyHandler = new _KeyHandler();
// function _KeyHandler() {
// 	this.keys = [];
// 	let shortCuts = [
// 		{
// 			keys: ["Escape"], 
// 			event: function () {
// 				Builder.cancelBuild();
// 			},
// 			ignoreIfInInputField: false
// 		},
// 	];


//   	this.handleKeys = function(_event) {
// 		let inInputField = _event.target.type == "text" || _event.target.type == "textarea" ? true : false;

// 		for (let i = 0; i < shortCuts.length; i++)
// 		{
// 			let curShortcut = shortCuts[i]; 
// 			if (curShortcut.ignoreIfInInputField && inInputField) continue;

// 			let succes = true;
// 			for (let i = 0; i < curShortcut.keys.length; i++)
// 			{
// 				let curKey = curShortcut.keys[i];
// 				if (this.keys[curKey]) continue;
// 				succes = false;
// 				break;
// 			}

// 			if (!succes) continue;

// 			_event.target.blur();

// 			let status = false;
// 			try {status = curShortcut.event(_event);}
// 			catch (e) {console.warn(e)};
// 			KEYS = {};
// 			return true;
// 		}
//   	}

// }







