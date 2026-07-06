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
	DEFAULT: 0,
	HOVER: 1,
	CLICKED: 2,
});

const animationType = Object.freeze({
	LINEAR: 0,
	EASE_IN: 1,
	EASE_OUT: 2,
	EASE_IN_OUT: 3,
	GRAVITY: 4,
	SPRING: 5,
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

	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.size = 4;
		this.targetSize = size * 2;

		this.color = "white";
		this.targetColor = "black";
	}
}

// For initiating update sequence and animation changes.
// Will hold the list of cells.
class Grid {
	Cells;
}

// For tracking the theme from 'data-theme' attr.
// Will be used when user clicks dark/light mode button.
class Theme {
	canvasClr;
	shapeClr;
	hoverClr;
	clickClr;
}

// Will fetch the position of the mouse from 'mousemove'
// Also calculates the row and column.
class Mouse {
	x;
	y;

	row;
	col;
}

// Will hold animation primitives (linear, ease-in, ease-out etc)
// Should work with other elements apart from the grid cells.
class Animation {}

// Resp for orchestration
class App {}
