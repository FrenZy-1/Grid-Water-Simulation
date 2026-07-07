// Canvas setup
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;

canvas.width = Math.floor(window.innerWidth * dpr);
canvas.height = Math.floor(window.innerHeight * dpr);

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

// Drawing functions
function drawDiamond(x, y, w, h, fillColor) {
	// Set the style
	ctx.fillStyle = fillColor;

	// Start drawing the diamond
	ctx.beginPath();
	ctx.moveTo(x, y);

	// Move to the remaining points
	ctx.lineTo(x + w, y + h);
	ctx.lineTo(x, y + h * 2);
	ctx.lineTo(x - w, y + h);

	// Close the path
	ctx.closePath();

	// Fill the shape
	ctx.fill();
}

function drawGrid(
	gridX,
	gridY,
	gapX,
	gapY,
	fillColor = "#1E2F3E",
	squareWidth = 4,
	squareHeight = 4,
) {
	for (var i = gridY; i < canvas.clientHeight - gapY; i += gapY) {
		for (var j = gridX; j < canvas.clientWidth - gapX; j += gapX) {
			drawDiamond(j, i, squareWidth, squareHeight, fillColor);
		}
	}
}

drawGrid(39, 39, 35, 30);

// Enums
const state = Object.freeze({
	NORMAL: 0,
	HOVER: 1,
	CLICK: 2,
});

const animationType = Object.freeze({
	LINEAR: 0,
	EASE_IN: 1,
	EASE_OUT: 2,
	EASE_IN_OUT: 3,
	GRAVITY: 4,
	SPRING: 5,
	PULSE: 6,
});

// For the diamonds and their params.
// Also the update, draw methods.
// Will update and render itself
class Cell {
	x;
	y;

	size; // Default size of the diamond. width = height = 4;
	targetSize; // For required size during animation.

	color; // Default color. Based on light/dark mode.
	targetColor; // For end point of color change.

	state; // For determining if re-rendering is required.

	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.size = 4;
		this.targetSize = this.size * 2;

		this.color = Theme.shapeClr;
		this.targetColor = undefined;
	}

	setState() {} // For updating state after animation finishes.
	update() {} // Update class vars
	render() {} // Render every state change
	checkDelay() {} // Remaining time before animation needs to start
}

// For initiating update sequence and animation changes.
// Will hold the list of cells.
class Grid {
	static gridX;
	static gridY;

	static gapX;
	static gapY;

	static row;
	static column;

	static cells = [];

	// Constructs the grid. Theming will be pulled from the theme class.
	constructor(gX, gY, gaX, gaY) {}

	update() {} // Will get called from mouse
	render() {} // Initiate render for each cell, will call calcNextTarget and calcDelay.
	getCell() {} // For use in mouse setstate. Helper.

	triggerWave() {} // Will start animation.
}

// For tracking the theme from 'data-theme' attr.
// Will be used when user clicks dark/light mode button.
class Theme {
	static canvasClr;
	static shapeClr;
	static hoverClr;
	static clickClr;
	static rippleClr; // For the ripple generated after clicking. Will prolly use a shade of accent color.

	loadVariables() {}
	update() {} // Update class variables.
}

// Will fetch the position of the mouse from 'mousemove'
// Also calculates the row and column.
class Mouse {
	static x;
	static y;

	static isDown;

	// Get the pos of the mouse from 'mousemove'
	static update() {
		this.on(["mousemove", "mousedown", "mouseup"], (e) => {
			this.x = e.x;
			this.y = e.y;

			if (e.type === "mousedown") {
				this.isDown = true;
			} else if (e.type === "mouseup") {
				this.isDown = false;
			}
		});
	}

	// Helpers
	static on(events, callback) {
		events.forEach((e) => {
			window.addEventListener(e, callback);
		});
	}
}

// Will hold animation primitives (linear, ease-in, ease-out etc)
// Should work with other elements apart from the grid cells.
class Animation {
	linear() {}
	easeIn() {}
	easeOut() {}
	easeInOut() {}
	gravity() {}
	spring() {}
	pulse() {}
}

// Resp for orchestration
class App {
	constructor() {}

	// Main event loop
	run() {}

	// Aux functions
	render() {}
	update() {}
}

function tempRun() {
	Mouse.update();
	requestAnimationFrame(tempRun);
}
requestAnimationFrame(tempRun);
